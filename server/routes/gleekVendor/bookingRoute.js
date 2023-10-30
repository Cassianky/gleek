import express from "express";
import {
  cancelBooking,
  confirmBooking,
  getAllBookingsByVendorId,
  rejectBooking,
} from "../../controller/bookingController.js";
import vendorVerifyToken from "../../middleware/vendorAuth.js";

const router = express.Router();

router.get("/getAllBookings", vendorVerifyToken, getAllBookingsByVendorId);
router.patch("/confirmBooking/:id", vendorVerifyToken, confirmBooking);
router.patch("/rejectBooking/:id", vendorVerifyToken, rejectBooking);
router.patch("/cancelBooking/:id", vendorVerifyToken, cancelBooking);

export default router;
