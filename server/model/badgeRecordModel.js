import mongoose from "mongoose";

const badgeRecordSchema = new mongoose.Schema({
  badge: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Badge",
    default: null,
  },
  client: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Client",
    default: null,
    required: true,
  },
  isCompleted: {
    type: Boolean,
    default: false,
  },
  sdgCount: {
    type: Number,
    required: false,
  },
  bookingCount: {
    type: Number,
    required: false,
  },
  created: {
    type: Date,
    default: Date.now,
  },
  updated: {
    type: Date,
    default: Date.now,
  },
});
const BadgeRecordModel = mongoose.model(
  "BadgeRecord",
  badgeRecordSchema,
  "badgeRecords",
);
export default BadgeRecordModel;
