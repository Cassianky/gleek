import express from "express";
import {
  getAvailableBookingTimeslots,
  createBookings,
  getAllBookingsForClient,
  getBookingById,
  updateBookingStatus,
} from "../../controller/bookingController.js";
import { verifyToken } from "../../middleware/clientAuth.js";

const router = express.Router();

// Booking
router.get(
  "/getAvailableBookingTimeslots/:activityId/:selectedDate",
  verifyToken,
  getAvailableBookingTimeslots,
);

// /gleek/booking/createBookings
router.post("/createBookings", verifyToken, createBookings);

// /gleek/booking/getAllBookingsForClient
router.get("/getAllBookingsForClient", verifyToken, getAllBookingsForClient);
// /gleek/booking/viewBooking/:id
router.get("/viewBooking/:id", verifyToken, getBookingById);
// /gleek/booking/updateBookingStatus/:id
router.patch("/updateBookingStatus/:id", verifyToken, updateBookingStatus);
export default router;
