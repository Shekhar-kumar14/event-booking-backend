const Event = require("../models/Event");

// @route   POST /api/events
// @access  Private/Admin
const createEvent = async (req, res) => {
  try {
    const { name, date, location, details } = req.body;

    if (!name || !date || !location) {
      return res.status(400).json({ message: "Name, date and location are required" });
    }

    const event = await Event.create({
      name,
      date,
      location,
      details,
      createdBy: req.user._id,
    });

    return res.status(201).json(event);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @route   GET /api/events
// @access  Private (any logged-in user)
const getEvents = async (req, res) => {
  try {
    // Basic list view — no need to expose registeredUsers here
    const events = await Event.find().select("-registeredUsers").sort({ date: 1 });
    return res.status(200).json(events);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @route   POST /api/events/:id/book
// @access  Private/User
const bookEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    if (event.registeredUsers.some((u) => u.toString() === req.user._id.toString())) {
      return res.status(400).json({ message: "Already booked for this event" });
    }

    event.registeredUsers.push(req.user._id);
    await event.save();

    return res.status(200).json({ message: "Event booked successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @route   GET /api/events/:id/users
// @access  Private/Admin
const getEventUsers = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id).populate(
      "registeredUsers",
      "name email"
    );

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    return res.status(200).json({
      eventName: event.name,
      users: event.registeredUsers,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = { createEvent, getEvents, bookEvent, getEventUsers };
