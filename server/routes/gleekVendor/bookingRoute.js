import express from "express";
import vendorVerifyToken from "../../middleware/vendorAuth.js";
import {
  confirmBooking,
  getAllBookingsByVendorId,
  rejectBooking,
} from "../../controller/bookingController.js";

const router = express.Router();
router.get("/getAllBookings", vendorVerifyToken, getAllBookingsByVendorId);
router.patch("/confirmBooking/:id", vendorVerifyToken, confirmBooking);
router.patch("/rejectBooking/:id", vendorVerifyToken, rejectBooking);
export default router;
