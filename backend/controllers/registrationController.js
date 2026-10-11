const Registration = require('../models/Registration');
const Event = require('../models/Event');

// Register a user for an event
const registerForEvent = async (req, res) => {
  try {
    const eventId = req.params.id;
    const userId = req.user._id;

    // Check if event exists
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    // Check capacity
    const currentRegistrations = await Registration.countDocuments({ event: eventId });
    if (currentRegistrations >= event.capacity) {
      return res.status(400).json({ message: 'Event is fully booked' });
    }

    // Attempt to register (MongoDB compound index prevents duplicates)
    try {
      const registration = await Registration.create({
        user: userId,
        event: eventId
      });
      res.status(201).json(registration);
    } catch (err) {
      // E11000 duplicate key error code from MongoDB
      if (err.code === 11000) {
        return res.status(409).json({ message: 'You are already registered for this event' });
      }
      throw err;
    }
  } catch (error) {
    res.status(500).json({ message: 'Error registering for event' });
  }
};

// Unregister a user from an event
const unregisterFromEvent = async (req, res) => {
  try {
    const eventId = req.params.id;
    const userId = req.user._id;

    // Find and delete the registration
    const registration = await Registration.findOneAndDelete({ user: userId, event: eventId });

    if (!registration) {
      return res.status(404).json({ message: 'Registration not found' });
    }

    res.json({ message: 'Successfully unregistered from event' });
  } catch (error) {
    res.status(500).json({ message: 'Error unregistering from event' });
  }
};

// Get all events the logged-in user is registered for
const getMyRegistrations = async (req, res) => {
  try {
    // Find all registrations for this user and populate the 'event' details
    const registrations = await Registration.find({ user: req.user._id }).populate('event');
    res.json(registrations);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching your registrations' });
  }
};

module.exports = { registerForEvent, unregisterFromEvent, getMyRegistrations };
