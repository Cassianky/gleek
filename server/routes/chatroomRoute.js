import express from "express";
import {
  userFetchChats,
  adminFetchChats,
  userAccessChat,
  adminAccessChat,
  markSelectedChatAsRead,
} from "../controller/chatRoomController.js";
import { verifyToken as clientVerifyToken } from "./../middleware/clientAuth.js";
import { verifyToken as vendorVerifyToken } from "./../middleware/vendorAuth.js";
import adminAuth from "./../middleware/adminAuth.js";

const router = express.Router();

router.route("/client/accessChat").post(clientVerifyToken, userAccessChat);
router.route("/vendor/accessChat").post(vendorVerifyToken, userAccessChat);
router.route("/admin/accessChat").post(adminAuth, adminAccessChat);
router.route("/client/fetchChats").get(clientVerifyToken, userFetchChats);
router.route("/vendor/fetchChats").get(vendorVerifyToken, userFetchChats);
router.route("/admin/fetchChats").get(adminAuth, adminFetchChats);

router
  .route("/client/markChatroomAsRead/:id")
  .get(clientVerifyToken, markSelectedChatAsRead);
router
  .route("/vendor/markChatroomAsRead/:id")
  .get(vendorVerifyToken, markSelectedChatAsRead);
router
  .route("/admin/markChatroomAsRead/:id")
  .get(adminAuth, markSelectedChatAsRead);

export default router;
