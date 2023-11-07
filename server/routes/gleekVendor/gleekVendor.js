import express from "express";
import timeslotRoutes from "./timeslot.js";
import activityRoutes from "./activity.js";
import bookingRoutes from "./bookingRoute.js";
import analyticsRoutes from "./analyticsRoute.js";

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

router.use("/dashboard", analyticsRoutes);
export default router;
