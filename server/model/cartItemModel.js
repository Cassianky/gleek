import mongoose from "mongoose";
import { LOCATION } from "../util/activityTagEnum.js";

const cartItemSchema = new mongoose.Schema({
  activityId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Activity",
  },
  clientId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Client",
  },
  vendorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Vendor",
  },
  // CART ITEM INFORMATION
  startDateTime: {
    type: Date,
    required: true,
  },
  endDateTime: {
    type: Date,
    required: true,
  },
  totalCost: {
    type: Number,
    required: true,
  },
  totalVendorAmount: {
    type: Number,
    required: true,
  },
  totalPax: {
    type: Number,
    required: true,
  },
  basePricePerPax: {
    type: Number,
    required: true,
  },
  weekendAddOnCost: {
    type: Number,
    required: true,
  },
  onlineAddOnCost: {
    type: Number,
    required: true,
  },
  offlineAddOnCost: {
    type: Number,
    required: true,
  },
  vendorWeekendAddOnCost: {
    type: Number,
  },
  vendorOnlineAddOnCost: {
    type: Number,
  },
  vendorOfflineAddOnCost: {
    type: Number,
  },
  activityTitle: {
    type: String,
    required: true,
  },
  vendorName: {
    type: String,
    required: true,
  },
  eventLocationType: {
    type: String,
    required: true,
    enum: LOCATION,
  },
  additionalComments: {
    type: String,
  },
  preSignedImages: {
    type: Array,
  },
  activityPricingRule: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "ActivityPricingRules",
  },
});

const cartItemModel = mongoose.model("CartItem", cartItemSchema, "cartitems");
export default cartItemModel;
