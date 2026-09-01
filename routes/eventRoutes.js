const express = require("express");
const router = express.Router();
const {
  createEvent,
  getEvents,
  bookEvent,
  getEventUsers,
} = require("../controllers/eventController");
const { protect, adminOnly } = require("../middleware/authMiddleware");

router.get("/", protect, getEvents);
router.post("/", protect, adminOnly, createEvent);
router.post("/:id/book", protect, bookEvent);
router.get("/:id/users", protect, adminOnly, getEventUsers);

module.exports = router;
