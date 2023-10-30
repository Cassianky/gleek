import BookingModel from "../model/bookingModel.js";

export const getAllBookingsForVendor = async (vendorId) => {
  return await BookingModel.find({
    vendorId: vendorId,
  }).populate({
    path: "clientId",
    select: "-password",
  });
};
export const updateBookingStatusActionHistory = async (
  bookingId,
  newStatus,
  actionByUserType,
  userName,
  actionRemarks,
) => {
  const updatedBooking = await BookingModel.findByIdAndUpdate(
    bookingId,
    {
      status: newStatus,
      $push: {
        actionHistory: {
          newStatus: newStatus,
          actionByUserType: actionByUserType,
          actionByUserName: userName,
          actionRemarks: actionRemarks,
        },
      },
    },
    { new: true },
  );
  return updatedBooking;
};
