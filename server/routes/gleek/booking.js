import express from "express";
import {
  getAvailableBookingTimeslots,
  createBookings,
  getAllBookingsForClient,
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

// /gleek/booking/getAllBookingsForClient
router.get("/getAllBookingsForClient", verifyToken, getAllBookingsForClient);
export default router;
