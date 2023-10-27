import mongoose from "mongoose";
const themeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  parent: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Theme",
    default: null,
  },
  status: {
    type: String,
    enum: { ACTIVE: "Active", INACTIVE: "Inactive" },
    default: "Active",
  },
});
const ThemeModel = mongoose.model("Theme", themeSchema);
export default ThemeModel;
