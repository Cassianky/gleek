import express from "express";
import {
  userFetchChats,
  adminFetchChats,
  userAccessChat,
  adminAccessChat,
} from "../controller/chatRoomController.js";
import { verifyToken as clientVerifyToken } from "./../middleware/clientAuth.js";
import { verifyToken as vendorVerifyToken } from "./../middleware/vendorAuth.js";

const router = express.Router();

router.route("/client/accessChat").post(clientVerifyToken, userAccessChat);
router.route("/vendor/accessChat").post(vendorVerifyToken, userAccessChat);
router.route("/admin/accessChat").post(adminAccessChat);
router.route("/client/fetchChats").get(clientVerifyToken, userFetchChats);
router.route("/vendor/fetchChats").get(vendorVerifyToken, userFetchChats);
router.route("/admin/fetchChats").get(adminFetchChats);

export default router;
