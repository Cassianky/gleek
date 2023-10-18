import mongoose from "mongoose";

const adminSurveyResponseSchema = new mongoose.Schema({
  created: { type: Date, required: true, default: Date.now },
  updated: { type: Date, required: true, default: Date.now },
  booking: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Booking",
  },
  activity: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Activity",
  },
  feedbackRating: { type: Number, required: false },
  recommendationScore: { type: Number, required: false },
  potentialNextActivityDate: { type: Date, required: false },
  repeatActivityScore: { type: Number, required: false },
  repeatActivityDifferentVendorScore: { type: Number, required: false },
  differentActivityScore: { type: Number, required: false },
  generalFeedback: { type: String, required: false },
  activityLiked: { type: String, required: false },
  activityImprovements: { type: String, required: false },
  testimonial: { type: String, required: false },
  displayName: { type: String, required: false },
  potentialReferrals: { type: String, required: false },
  status: {
    type: String,
    enum: ["UNAVAILABLE", "AVAILABLE", "SUBMITTED"],
  },
});

const AdminSurveyResponseModel = mongoose.model(
  "AdminSurveyResponse",
  adminSurveyResponseSchema,
);

export default AdminSurveyResponseModel;
