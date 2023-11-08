import express from "express";
import {
  addVendor,
  deleteAllVendors,
  updateVendor,
  getAllVendors,
  getVendor,
  toggleVendorIsDisabled,
  hasActiveBookings,
} from "../../controller/vendorController.js";
const router = express.Router();
import adminAuth from "../../middleware/adminAuth.js";

router.post("/addVendor", adminAuth, addVendor);
router.get("/viewAllVendors", adminAuth, getAllVendors);
router.get("/viewVendor/:id", adminAuth, getVendor);
router.post("/deleteAllVendors", adminAuth, deleteAllVendors);
router.patch("/updateVendor/:id", adminAuth, updateVendor);
router.get("/hasActiveBookings/:id", adminAuth, hasActiveBookings);
router.patch("/toggleVendorIsDisabled/:id", adminAuth, toggleVendorIsDisabled);

export default router;
