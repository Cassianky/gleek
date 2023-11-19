import express from "express";
import {
  getAllBookings,
  getBookingById,
  deleteBooking,
  getAllBookingsByActivityId,
  updateBookingStatus,
  updateCompletedBookingsStatusFromConfirmedToPendingPayment,
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
router.post(
  "/updateCompletedBookings",
  adminAuth,
  updateCompletedBookingsStatusFromConfirmedToPendingPayment,
);

router.post(
  "/downloadBookingSummaryUrl/:id",
  adminAuth,
  getBookingSummaryPdfUrl,
);

router.get("/downloadBookingSummaryPdf/:path", adminAuth, getBookingSummaryPdf);

export default router;
