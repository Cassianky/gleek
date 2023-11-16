import mongoose from "mongoose";

const featuredActivitySchema = new mongoose.Schema({
  activity: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Activity",
    unique: true,
  },
  isFeatured: {
    type: Boolean,
  },
  showOnSpecificDates: { type: Boolean, default: false }, // if false, shown at all times
  showOnDates: [{ type: Date }],
});

const FeaturedActivity = mongoose.model(
  "FeaturedActivity",
  featuredActivitySchema,
);

export default FeaturedActivity;
