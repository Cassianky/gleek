import express from "express";
import {
  allMessages,
  sendMessage,
} from "../controller/chatMessageController.js";
import { verifyToken as clientVerifyToken } from "./../middleware/clientAuth.js";
import { verifyToken as vendorVerifyToken } from "./../middleware/vendorAuth.js";

const router = express.Router();

router
  .route("/client/allMessages/:chatroomId")
  .get(clientVerifyToken, allMessages);
router
  .route("/vendor/allMessages/:chatroomId")
  .get(vendorVerifyToken, allMessages);
router.route("/admin/allMessages/:chatroomId").get(allMessages);
router.route("/client/sendMessage").post(clientVerifyToken, sendMessage);
router.route("/vendor/sendMessage").post(vendorVerifyToken, sendMessage);

router.route("/admin/sendMessage").post(sendMessage);

export default router;
