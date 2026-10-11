const Event = require('../models/Event');
const Registration = require('../models/Registration');
const User = require('../models/User');
const { Resend } = require('resend');

const resend = new Resend(process.env.RESEND_API_KEY || 're_123456789');

// Get simple analytics for admin dashboard
const getAnalytics = async (req, res) => {
  try {
    const totalEvents = await Event.countDocuments();
    const totalRegistrations = await Registration.countDocuments();
    const totalUsers = await User.countDocuments();

    res.json({
      totalEvents,
      totalRegistrations,
      totalUsers
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching analytics' });
  }
};

// Get all pending and past admin access requests
const getAdminRequests = async (req, res) => {
  try {
    const pendingRequests = await User.find({ adminRequestStatus: 'pending' })
      .select('-password')
      .sort({ adminRequestDate: -1 });

    const allUsers = await User.find()
      .select('-password')
      .sort({ createdAt: -1 });

    res.json({
      pendingRequests,
      allUsers
    });
  } catch (error) {
    console.error('Error fetching admin requests:', error);
    res.status(500).json({ message: 'Failed to load user access requests' });
  }
};

// Approve an admin request
const approveAdminRequest = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.role = 'admin';
    user.adminRequestStatus = 'approved';
    await user.save();

    // Send email notification to the approved user
    try {
      if (process.env.RESEND_API_KEY) {
        const portalUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/login`;
        await resend.emails.send({
          from: 'EventHub <onboarding@resend.dev>',
          to: [user.email],
          subject: '🎉 Congratulations! Your EventHub Admin Access is Approved',
          html: `
            <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #E2E8F0; border-radius: 12px;">
              <h2 style="color: #4F46E5; margin-top: 0;">Admin Access Approved!</h2>
              <p>Hi ${user.name},</p>
              <p>Great news! The administrator has approved your request to become an <strong>Event Organizer / Admin</strong> on EventHub.</p>
              <p>You can now sign in using the <strong>Admin Portal</strong> tab on our login page to publish, manage, and monitor events.</p>
              <div style="margin: 24px 0;">
                <a href="${portalUrl}" style="background-color: #4F46E5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">
                  Go to Admin Portal
                </a>
              </div>
              <p style="color: #64748B; font-size: 13px;">Welcome to the EventHub organizer team!</p>
            </div>
          `
        });
      }
    } catch (mailErr) {
      console.warn('Resend approval email skipped:', mailErr.message);
    }

    res.json({ message: `Successfully approved ${user.name} (${user.email}) as an Administrator!` });
  } catch (error) {
    console.error('Error approving request:', error);
    res.status(500).json({ message: 'Failed to approve request' });
  }
};

// Reject an admin request
const rejectAdminRequest = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.adminRequestStatus = 'rejected';
    await user.save();

    res.json({ message: `Declined admin access for ${user.email}` });
  } catch (error) {
    console.error('Error rejecting request:', error);
    res.status(500).json({ message: 'Failed to decline request' });
  }
};

module.exports = { 
  getAnalytics, 
  getAdminRequests, 
  approveAdminRequest, 
  rejectAdminRequest 
};
