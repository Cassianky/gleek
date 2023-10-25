import express from "express";
import {
  getAvailableBookingTimeslots,
  createBookings,
  getAllPendingAndConfirmedBookingsForClient,
} from "../../controller/bookingController.js";
import { verifyToken } from "../../middleware/clientAuth.js";

const router = express.Router();

// Booking
router.get(
  "/getAvailableBookingTimeslots/:activityId/:selectedDate",
  verifyToken,
  getAvailableBookingTimeslots
);

// /gleek/booking/createBookings
router.post("/createBookings", verifyToken, createBookings);

// /gleek/booking/getAllPendingAndConfirmedBookingsForClient
router.get(
  "/getAllPendingAndConfirmedBookingsForClient",
  verifyToken,
  getAllPendingAndConfirmedBookingsForClient
);

export default router;
