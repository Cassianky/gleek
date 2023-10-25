import express from "express";
import {
  getAvailableBookingTimeslots,
  createBookings,
  getBookingsWithPendingSurvey
} from "../../controller/bookingController.js";
import { verifyToken } from "../../middleware/clientAuth.js";

const router = express.Router();

// Get bookings with pending survey
router.get(
  "/pendingSurvey",
  verifyToken,
  getBookingsWithPendingSurvey,
);


// Booking
router.get(
  "/getAvailableBookingTimeslots/:activityId/:selectedDate",
  verifyToken,
  getAvailableBookingTimeslots,
);

// /gleek/booking/createBookings
router.post("/createBookings", verifyToken, createBookings);

export default router;
