import mongoose from "mongoose";
import { BadgeSdgTypeEnum } from "../util/badgeEnum";
import { SustainableDevelopmentGoalsEnum } from "../util/sdgEnum";
const badgeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  // GOLD, SLIVER, BRONZE for SDG related badges
  sgdBadgeType: {
    type: String,
    enum: BadgeSdgTypeEnum,
    required: false,
  },
  // For user to define own badge type if any
  nonSdgBadgeType: {
    type: String,
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
    required: true,
  },
  badgePreSignedImage: {
    type: String,
    required: true,
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
  sgd: {
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
});
const BadgeModel = mongoose.model("Badge", badgeSchema, "badges");
export default BadgeModel;
