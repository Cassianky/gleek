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

export const getAllPendingAndConfirmedBookingsForClientService = async (
  clientId
) => {
  return await BookingModel.find({
    clientId: clientId,
    status: { $in: ["CONFIRMED", "PENDING_CONFIRMATION"] },
  }).select("-rejectionReason");
};
