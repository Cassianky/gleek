import mongoose from "mongoose";
import { BadgeSdgTypeEnum } from "../util/badgeEnum.js";
import { SustainableDevelopmentGoalsEnum } from "../util/sdgEnum.js";
const badgeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  caption: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  // GOLD, SLIVER, BRONZE for SDG related badges
  // OTHER for non SDG related badges
  sdgBadgeType: {
    type: String,
    enum: BadgeSdgTypeEnum,
    required: false,
  },
  // Mainly part of information supplied for SDG badges
  reason: {
    type: String,
    required: false,
  },
  // Mainly part of information supplied for SDG badges
  importance: {
    type: String,
    required: false,
  },
  // Mainly part of information supplied for SDG badges
  whatCanIDo: {
    type: String,
    required: false,
  },
  // Mainly part of information supplied for SDG badges
  factsAndFigures: {
    type: Array,
    required: false,
  },
  // badge image made on canva
  badgeImage: {
    type: String,
    required: false,
  },
  badgePreSignedImage: {
    type: String,
    required: false,
  },
  // Descriptive images for badge description if any
  images: {
    type: Array,
    required: false,
  },
  preSignedImages: {
    type: Array,
    required: false,
  },
  // One of sdg, sdgThreshold, bookingThreshold must be filled

  // SDG goal for badge if any
  sdg: {
    type: String,
    enum: SustainableDevelopmentGoalsEnum,
    required: false,
  },
  // threshold to obtain GOLD or SLIVER badges
  sdgThreshold: {
    type: Number,
    required: false,
  },
  // threshold to obtain OTHER badges
  bookingThreshold: {
    type: Number,
    required: false,
  },
  creationDate: {
    type: Date,
    default: Date.now,
  },
});
const BadgeModel = mongoose.model("Badge", badgeSchema, "badges");
export default BadgeModel;
