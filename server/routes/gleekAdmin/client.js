import {
  getAllClients,
  updateClient,
  getClientDetails,
  deleteAllRejectedClientAfterThirtyDays,
} from "../../controller/manageClientController.js";
import express from "express";
import adminAuth from "../../middleware/adminAuth.js";
import {
  hasActiveBookings,
  toggleClientIsDisabled,
} from "../../controller/clientController.js";

const router = express.Router();
router.get("/getAllClients", adminAuth, getAllClients);
router.patch("/update/:id", adminAuth, updateClient);
router.get("/getClientDetails/:clientId", adminAuth, getClientDetails);
router.get("/hasActiveBookings/:id", adminAuth, hasActiveBookings);
router.patch("/toggleClientIsDisabled/:id", adminAuth, toggleClientIsDisabled);
router.post(
  "/deleteRejectedClientAfterThirtyDays",
  adminAuth,
  deleteAllRejectedClientAfterThirtyDays,
);

export default router;
