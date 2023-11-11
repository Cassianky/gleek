import mongoose from "mongoose";

const scheduledEmailSchema = new mongoose.Schema({
  subject: {
    type: String,
    required: true,
  },
  messageBody: {
    type: String,
    required: true,
  },
  photo: {
    type: String,
    required: false,
  },
  scheduledTime: {
    type: Date,
    required: true,
  },
  status: {
    type: String,
    required: true,
    enum: ["SCHEDULED", "CANCELLED", "SENT", "FAILED"],
    default: "SCHEDULED",
  },
});

const ScheduledEmailModel = mongoose.model(
  "ScheduledEmail",
  scheduledEmailSchema,
  "scheduledemails"
);
export default ScheduledEmailModel;
