import express from "express";
import {
  getAllBookings,
  getBookingById,
  deleteBooking,
  getAllBookingsByActivityId,
  // adminConfirmBooking,
  updateBookingStatus,
  adminRejectBooking,
  adminCancelBooking,
  updateToPaid,
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
// router.patch("/confirmBooking/:id", adminAuth, adminConfirmBooking);
router.patch("/updateBookingStatus/:id", adminAuth, updateBookingStatus);
router.patch("/rejectBooking/:id", adminAuth, adminRejectBooking);
router.patch("/cancelBooking/:id", adminAuth, adminCancelBooking);
router.patch("/updateToPaid/:id", adminAuth, updateToPaid);
export default router;
