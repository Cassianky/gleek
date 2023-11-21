import express from "express";
import {
  getAdminNotifications,
  getNonAdminNotifications,
  updateNotificationAsRead,
  deleteNotification,
  adminUpdateNotificationAsRead,
  adminDeleteNotification,
} from "../controller/notificationController.js";

import { verifyToken as clientVerifyToken } from "./../middleware/clientAuth.js";
import { verifyToken as vendorVerifyToken } from "./../middleware/vendorAuth.js";
import adminAuth from "./../middleware/adminAuth.js";

/*
Note: This file contains the /client router
*/

const router = express.Router();

router.get("/adminAllNotifications", adminAuth, getAdminNotifications);
router.patch("/deleteNotification/:id", adminAuth, adminDeleteNotification);
router.patch(
  "/updateNotificationAsRead/:id",
  adminAuth,
  adminUpdateNotificationAsRead,
);

router.get(
  "/client/nonAdminAllNotifications",
  clientVerifyToken,
  getNonAdminNotifications,
);
router.get(
  "/vendor/nonAdminAllNotifications",
  vendorVerifyToken,
  getNonAdminNotifications,
);

router.patch(
  "/client/updateNotificationAsRead/:id",
  clientVerifyToken,
  updateNotificationAsRead,
);
router.patch(
  "/vendor/updateNotificationAsRead/:id",
  vendorVerifyToken,
  updateNotificationAsRead,
);

router.patch(
  "/client/deleteNotification/:id",
  clientVerifyToken,
  deleteNotification,
);
router.patch(
  "/vendor/deleteNotification/:id",
  vendorVerifyToken,
  deleteNotification,
);

export default router;
