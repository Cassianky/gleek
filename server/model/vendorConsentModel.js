import mongoose from "mongoose";

const vendorConsentSchema = new mongoose.Schema({
  vendor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Vendor",
  },
  acceptTermsAndConditions: {
    type: Boolean,
    required: true,
    default: true,
  },
  lastUpdated: {
    type: Date,
    default: Date.now,
  },
});

const VendorConsentModel = mongoose.model("VendorConsent", vendorConsentSchema);

export default VendorConsentModel;
