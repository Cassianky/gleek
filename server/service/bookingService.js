import BookingModel from "../model/bookingModel.js";
import { s3GetImages } from "./s3ImageServices.js";

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
      booking.activityId.images
    );
  }

  return bookings;
};
