const express = require('express');
const router = express.Router();
const rateLimit = require('express-rate-limit');
const { registerUser, loginUser, forgotPassword, resetPassword, requestAdminAccess } = require('../controllers/authController');

// Define rate limiter: maximum 10 requests per 15 minutes
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { message: 'Too many requests from this IP, please try again after 15 minutes' }
});

// Define routes and map them to controller functions
router.post('/register', authLimiter, registerUser);
router.post('/login', authLimiter, loginUser);
router.post('/request-admin', authLimiter, requestAdminAccess);
router.post('/forgot-password', authLimiter, forgotPassword);
router.post('/reset-password/:token', authLimiter, resetPassword);

module.exports = router;
