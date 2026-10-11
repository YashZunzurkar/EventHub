const express = require('express');
const router = express.Router();
const { registerForEvent, unregisterFromEvent, getMyRegistrations } = require('../controllers/registrationController');
const { protect } = require('../middleware/authMiddleware');

// Note: Registration routes related to a specific event are handled here
// But the endpoints in requirements are /api/events/:id/register 
// Let's create an alias in eventRoutes.js or handle it here.
// To match the plan exactly, we can just mount this under /api/events (for /:id/register)
// and another router for /api/registrations.

// Get logged-in user's registrations
router.get('/me', protect, getMyRegistrations);

module.exports = router;
