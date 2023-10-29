import mongoose from "mongoose";
// import { BookingStatusEnum } from "../util/bookingStatusEnum.js";
import { LOCATION } from "../util/activityTagEnum.js";

const bookingSchema = new mongoose.Schema({
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
    required: true,
    ref: "Vendor",
  },
  // BOOKING INFORMATION (can be used for invoice generation)
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
  // BILLING INFORMATION
  billingEmail: {
    type: String,
    required: true,
  },
  billingOfficePostalCode: {
    type: String,
    required: true,
  },
  billingPartyName: {
    type: String,
    required: true,
  },
  billingAddress: {
    type: String,
    required: true,
  },
  // STATUS AND META INFORMATION
  status: {
    type: String,
    required: true,
    enum: [
      "PENDING_CONFIRMATION",
      "CONFIRMED",
      "REJECTED",
      "CANCELLED",
      "PENDING_PAYMENT",
      "PAID",
    ],
    default: "PENDING_CONFIRMATION",
  },
  isSurveySubmitted: {
    type: Boolean,
    default: false,
  },
  adminSurveyResponse: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "AdminSurveyResponse",
  },
  rejectionReason: { type: String },
  creationDateTime: {
    type: Date,
    required: true,
    default: Date.now(),
  },
  actionHistory: [
    {
      newStatus: {
        type: String,
        enum: ["CONFIRMED", "REJECTED", "CANCELLED", "PAID", "PENDING_PAYMENT"], // Enum for action types
        required: true,
      },
      actionByUserType: {
        type: String, // Store user type (admin or vendor or client)
        enum: ["ADMIN", "VENDOR", "CLIENT"],
        required: true,
      },
      actionByUserName: {
        type: String,
        required: true,
      },
      actionTimestamp: {
        type: Date,
        required: true,
        default: Date.now,
      },
      actionRemarks: {
        type: String, // Store cancellation or rejection reasons if action type is REJECT or CANCEL
      },
    },
  ],
  activityPricingRule: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "ActivityPricingRules",
  },
});

const BookingModel = mongoose.model("Booking", bookingSchema, "bookings");
export default BookingModel;
