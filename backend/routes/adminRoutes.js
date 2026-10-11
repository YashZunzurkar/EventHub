const express = require('express');
const router = express.Router();
const { 
  getAnalytics, 
  getAdminRequests, 
  approveAdminRequest, 
  rejectAdminRequest 
} = require('../controllers/adminController');
const { protect, admin } = require('../middleware/authMiddleware');

// Get analytics (Admin only)
router.get('/analytics', protect, admin, getAnalytics);

// Admin Access Requests endpoints (Admin only)
router.get('/requests', protect, admin, getAdminRequests);
router.post('/requests/:id/approve', protect, admin, approveAdminRequest);
router.post('/requests/:id/reject', protect, admin, rejectAdminRequest);

module.exports = router;
