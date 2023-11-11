import mongoose from "mongoose";

const clientSchema = new mongoose.Schema({
  email: {
    type: String,
    unique: true,
    required: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
  },
  name: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  jobTitle: { type: String, required: false },
  team: { type: String, required: false },
  companyName: { type: String, required: true },
  officeAddress: { type: String, required: true },
  officePostalCode: { type: Number, required: true },
  billingPartyName: { type: String, required: false },
  billingAddress: { type: String, required: false },
  billingOfficePostalCode: { type: Number, required: false },
  billingEmail: { type: String, required: false },
  signupDate: { type: Date, required: false },
  approvedDate: { type: Date, required: false },
  emergencyContactName: { type: String, required: false },
  emergencyContactNumber: { type: String, required: false },
  photo: { type: String, required: false },
  preSignedPhoto: { type: String, required: false },
  status: {
    type: String,
    enum: ["PENDING", "APPROVED", "REJECTED"],
    required: false,
  },
  verified: {
    type: Boolean,
    default: false,
    required: true,
  },
  isDisabled: {
    type: Boolean,
    default: false,
  },
});

const ClientModel = mongoose.model("Client", clientSchema, "clients");
export default ClientModel;
