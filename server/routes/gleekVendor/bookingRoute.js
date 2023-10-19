import express from "express";
import vendorVerifyToken from "../../middleware/vendorAuth.js";
import { getAllBookingsByVendorId } from "../../controller/bookingController.js";

const router = express.Router();
router.get("/getAllBookings", vendorVerifyToken, getAllBookingsByVendorId);

export default router;
