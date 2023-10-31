import BookingModel from "../model/bookingModel.js";
import { s3GetImages } from "./s3ImageServices.js";

export const getAllBookingsForVendor = async (vendorId) => {
  return await BookingModel.find({
    vendorId: vendorId,
  })
    .select(
      "-weekendAddOnCost -onlineAddOnCost -offlineAddOnCost -basePricePerPax -totalCost",
    )
    .populate({
      path: "clientId",
      select: "-password",
    })
    .populate({
      path: "activityPricingRule",
      select: "-clientPrice",
    })
    .populate({
      path: "activityId",
      select: "weekendPricing onlinePricing offlinePricing",
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

export const getAllBookingsForClientService = async (clientId) => {
  const bookings = await BookingModel.find({
    clientId: clientId,
  })
    .select("-rejectionReason")
    .populate({
      path: "activityId",
      select: "images preSignedImages",
    })
    .populate({
      path: "clientId",
      select: "companyName",
    });

  for (const booking of bookings) {
    booking.activityId.preSignedImages = await s3GetImages(
      booking.activityId.images,
    );
  }

  return bookings;
};
