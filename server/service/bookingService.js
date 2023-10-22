import BookingModel from "../model/bookingModel.js";

export const getAllPendingAndConfirmedBookingsForVendor = async (vendorId) => {
  return await BookingModel.find({
    vendorId: vendorId,
    status: { $in: ["CONFIRMED", "PENDING_CONFIRMATION"] },
  })
    .select("-rejectionReason")
    .populate({
      path: "clientId",
      select: "-password",
    });
};
