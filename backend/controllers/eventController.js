const Event = require('../models/Event');
const Registration = require('../models/Registration');

// Get all events with optional search and category filter
const getEvents = async (req, res) => {
  try {
    const { search, category } = req.query;
    
    // Build the query object dynamically based on filters
    let query = {};
    if (search) {
      query.title = { $regex: search, $options: 'i' }; // Case-insensitive search
    }
    if (category) {
      query.category = category;
    }

    const events = await Event.find(query).sort({ date: 1 });
    res.json(events);
  } catch (error) {
    res.status(500).json({ message: 'Server error while fetching events' });
  }
};

// Get single event details
const getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (event) {
      res.json(event);
    } else {
      res.status(404).json({ message: 'Event not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Create a new event (Admin only)
const createEvent = async (req, res) => {
  try {
    const { title, description, date, venue, capacity, category, imageUrl } = req.body;
    
    const event = await Event.create({
      title,
      description,
      date,
      venue,
      capacity,
      category,
      imageUrl: imageUrl || undefined,
    });
    
    res.status(201).json(event);
  } catch (error) {
    res.status(500).json({ message: 'Error creating event' });
  }
};

// Update an event (Admin only)
const updateEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    // Update the event with new data
    const updatedEvent = await Event.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true } // Returns the updated document
    );
    
    res.json(updatedEvent);
  } catch (error) {
    res.status(500).json({ message: 'Error updating event' });
  }
};

// Delete an event (Admin only)
const deleteEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    // First delete all registrations for this event
    await Registration.deleteMany({ event: req.params.id });

    // Then delete the event itself
    await event.deleteOne();
    
    res.json({ message: 'Event and associated registrations removed' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting event' });
  }
};

module.exports = { getEvents, getEventById, createEvent, updateEvent, deleteEvent };
