const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Helper function to generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

// Register a new user (Always regular attendee by default for security)
const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists with this email' });
    }

    // Create the new user (Role is strictly 'user' by default)
    const user = await User.create({ 
      name, 
      email, 
      password, 
      role: 'user',
      adminRequestStatus: 'none'
    });

    // Respond with user data and token
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      adminRequestStatus: user.adminRequestStatus,
      token: generateToken(user._id),
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Login user
const loginUser = async (req, res) => {
  try {
    const { email, password, expectedRole } = req.body;

    // Find user by email
    const user = await User.findOne({ email });

    // Check if user exists and password matches
    if (user && (await user.matchPassword(password))) {
      // If user specifically wanted to login via Admin Portal, check role
      if (expectedRole === 'admin' && user.role !== 'admin') {
        let msg = 'Access denied: This account does not have Admin privileges yet.';
        if (user.adminRequestStatus === 'pending') {
          msg = '⏳ Your Admin request is currently pending approval by the master administrator.';
        } else if (user.adminRequestStatus === 'rejected') {
          msg = 'Your Admin request was reviewed and declined by the administrator.';
        }

        return res.status(403).json({ 
          message: msg,
          requestStatus: user.adminRequestStatus || 'none',
          email: user.email
        });
      }

      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        adminRequestStatus: user.adminRequestStatus || 'none',
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Request Admin Access (User submits request to be approved by master admin)
const requestAdminAccess = async (req, res) => {
  try {
    const { email, reason } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'No registered account found with this email.' });
    }

    if (user.role === 'admin') {
      return res.status(400).json({ message: 'This account already has Administrator privileges!' });
    }

    user.adminRequestStatus = 'pending';
    user.adminRequestDate = new Date();
    user.adminRequestReason = reason || 'Requested access to organize and manage events';
    await user.save();

    // Send confirmation email to user via Resend (failsafe if key missing)
    try {
      if (process.env.RESEND_API_KEY) {
        await resend.emails.send({
          from: 'EventHub <onboarding@resend.dev>',
          to: [user.email],
          subject: 'EventHub Admin Access Request Received',
          html: `
            <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
              <h2 style="color: #4F46E5;">Admin Request Received</h2>
              <p>Hi ${user.name},</p>
              <p>We received your request to become an Event Organizer / Administrator on EventHub.</p>
              <p>The master administrator has been notified and will review your request shortly. You will receive an approval email as soon as it's processed.</p>
              <br/>
              <p style="color: #64748B; font-size: 12px;">Team EventHub</p>
            </div>
          `
        });
      }
    } catch (mailErr) {
      console.warn('Resend notification skipped:', mailErr.message);
    }

    res.json({ 
      message: 'Your request for Admin access has been submitted! The master administrator will review and approve it shortly.' 
    });
  } catch (error) {
    console.error('Request admin error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const crypto = require('crypto');
const { Resend } = require('resend');

// Initialize Resend with a dummy key if env is missing to prevent server crash
const resend = new Resend(process.env.RESEND_API_KEY || 're_123456789');

// Forgot Password
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: 'There is no user with that email address.' });
    }

    // Generate token
    const resetToken = crypto.randomBytes(20).toString('hex');
    
    // Set token and expiry (1 hour)
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = Date.now() + 3600000;
    await user.save();

    // Create reset URL using FRONTEND_URL or the exact origin the request came from
    const frontendHost = process.env.FRONTEND_URL || req.headers.origin || 'http://localhost:5173';
    const resetUrl = `${frontendHost}/reset-password/${resetToken}`;
    console.log('👉 GENERATED RESET URL:', resetUrl);

    // Send email using Resend
    const { data, error } = await resend.emails.send({
      from: 'EventHub <onboarding@resend.dev>',
      to: [user.email],
      subject: 'Password Reset Request',
      html: `
        <div style="font-family: Arial, sans-serif; max-w: 600px; margin: 0 auto;">
          <h2>Reset Your Password</h2>
          <p>You requested a password reset for your EventHub account.</p>
          <p>Please click the button below to set a new password. This link is valid for 1 hour.</p>
          <a href="${resetUrl}" style="display: inline-block; background-color: #0264FE; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; margin: 20px 0;">Reset Password</a>
          <p>If you didn't request this, please ignore this email.</p>
        </div>
      `,
    });

    if (error) {
      console.error('Resend Error:', error);
      user.resetPasswordToken = undefined;
      user.resetPasswordExpires = undefined;
      await user.save();
      return res.status(500).json({ message: 'Email could not be sent' });
    }

    res.status(200).json({ message: 'Password reset link sent to your email.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Reset Password
const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ message: 'Password reset token is invalid or has expired.' });
    }

    // Set new password (the pre-save hook in User model will hash it)
    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.status(200).json({ message: 'Password has been successfully reset.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { registerUser, loginUser, forgotPassword, resetPassword, requestAdminAccess };
