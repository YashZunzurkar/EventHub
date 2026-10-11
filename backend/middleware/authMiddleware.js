const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Middleware to protect routes (verify JWT token)
const protect = async (req, res, next) => {
  let token;

  // Check if the token is passed in the authorization header
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Extract token from 'Bearer <token>'
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Find user by ID and attach it to the request object (excluding password)
      req.user = await User.findById(decoded.id).select('-password');
      
      next(); // Proceed to the next middleware or route handler
    } catch (error) {
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    res.status(401).json({ message: 'Not authorized, no token' });
  }
};

// Middleware to restrict access to admins only
const admin = (req, res, next) => {
  // Check if the attached user exists and has the 'admin' role
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ message: 'Not authorized as an admin' });
  }
};

module.exports = { protect, admin };
