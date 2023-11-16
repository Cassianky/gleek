import express from "express";
import {
  getAllBookings,
  getBookingById,
  deleteBooking,
  getAllBookingsByActivityId,
  updateBookingStatus,
  updateCompletedBookings,
  getBookingSummaryPdf,
  getBookingSummaryPdfUrl,
} from "../../controller/bookingController.js";
import adminAuth from "../../middleware/adminAuth.js";

// /booking

const router = express.Router();
router.get("/getAllBookings", adminAuth, getAllBookings);
router.get("/getBookingById/:id", adminAuth, getBookingById);
router.get(
  "/getAllBookingsByActivityId/:activityId",
  getAllBookingsByActivityId,
);
router.delete("/deleteBooking/:id", adminAuth, deleteBooking);
router.patch("/updateBookingStatus/:id", adminAuth, updateBookingStatus);
router.post("/updateCompletedBookings", adminAuth, updateCompletedBookings);

router.post(
  "/downloadBookingSummaryUrl/:id",
  adminAuth,
  getBookingSummaryPdfUrl,
);

router.get("/downloadBookingSummaryPdf/:path", adminAuth, getBookingSummaryPdf);

export default router;
