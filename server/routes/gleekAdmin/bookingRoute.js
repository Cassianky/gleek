import express from "express";
import {
  getAllBookings,
  getBookingById,
  deleteBooking,
  getAllBookingsByActivityId,
  updateBookingStatus,
} from "../../controller/bookingController.js";
import adminAuth from "../../middleware/adminAuth.js";

// /booking

const router = express.Router();
router.get("/getAllBookings", adminAuth, getAllBookings);
router.get("/getBookingById/:id", adminAuth, getBookingById);
router.get(
  "/getAllBookingsByActivityId/:activityId",
  getAllBookingsByActivityId
);
router.delete("/deleteBooking/:id", adminAuth, deleteBooking);
router.patch("/updateBookingStatus/:id", adminAuth, updateBookingStatus);
export default router;
