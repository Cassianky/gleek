import express from "express";
import timeslotRoutes from "./timeslot.js";
import activityRoutes from "./activity.js";
import bookingRoutes from "./bookingRoute.js";

const router = express.Router();

// /gleekVendor/auth
// TODO: Migrate all /gleek/vendor auth routes to here
// router.use("/auth", authRoutes);

// /gleekVendor/timeslot
router.use("/timeslot", timeslotRoutes);

// /gleekVendor/activity
router.use("/activity", activityRoutes);

// /gleekVendor/bookingRoute
router.use("/booking", bookingRoutes);
export default router;
