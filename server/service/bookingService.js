import BookingModel from "../model/bookingModel.js";

export const getAllBookingsForVendor = async (vendorId) => {
  return await BookingModel.find({
    vendorId: vendorId,
    status: { $in: ["CONFIRMED", "PENDING_CONFIRMATION"] },
  }).populate({
    path: "clientId",
    select: "-password",
  });
};
