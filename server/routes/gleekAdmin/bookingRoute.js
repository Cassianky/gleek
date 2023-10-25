import express from "express";
import {
  getAllBookings,
  getBookingById,
  deleteBooking,
  getAllBookingsByActivityId,
  updateCompletedBookings,
} from "../../controller/bookingController.js";
import adminAuth from "../../middleware/adminAuth.js";

const router = express.Router();
router.get("/getAllBookings", adminAuth, getAllBookings);
router.get("/getBookingById/:id", adminAuth, getBookingById);
router.get(
  "/getAllBookingsByActivityId/:activityId",
  getAllBookingsByActivityId,
);
router.delete("/deleteBooking/:id", adminAuth, deleteBooking);
router.post("/updateCompletedBookings", adminAuth, updateCompletedBookings);

export default router;
