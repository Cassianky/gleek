import mongoose from "mongoose";

const scheduledNewsletterSchema = new mongoose.Schema({
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
    enum: ["SCHEDULED", "SENT", "FAILED"],
    default: "SCHEDULED",
  },
  errorLog: {
    type: String,
    required: false,
  },
});

const ScheduledNewsletterModel = mongoose.model(
  "ScheduledNewsletter",
  scheduledNewsletterSchema,
  "scheduledNewsletter"
);
export default ScheduledNewsletterModel;
