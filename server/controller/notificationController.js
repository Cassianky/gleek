import NotificationModel from "../model/notificationModel.js";
import {
  NotificationAction,
  NotificationEvent,
} from "../util/notificationRelatedEnum.js";
import { Role } from "../util/roleEnum.js";
import ActivityModel from "../model/activityModel.js";
import ClientModel from "../model/clientModel.js";
import VendorModel from "../model/vendorModel.js";
import AdminModel from "../model/adminModel.js";
import BookingModel from "../model/bookingModel.js";
import notificationModel from "../model/notificationModel.js";

export const getAdminNotifications = async (req, res) => {
  try {
    const allNotifications = await NotificationModel.find({
      recipientRole: Role.ADMIN,
    }).sort({ createdDate: -1 });

    res.status(200).json({
      data: allNotifications,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getNonAdminNotifications = async (req, res) => {
  try {
    const role =
      req.cookies.userRole.toUpperCase() === Role.VENDOR
        ? Role.VENDOR
        : Role.CLIENT;
    const recipientId = req.user._id;
    console.log("receipient role, ", role);

    const allNotifications = await NotificationModel.find({
      recipient: recipientId,
      $and: [{ recipientRole: role }],
    }).sort({ createdDate: -1 });

    res.status(200).json({
      data: allNotifications,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const createNotification = async (req, session) => {
  try {
    console.log("req in notification creation controller:", req);

    const newNotification = new NotificationModel({
      senderRole: req.senderRole,
      sender: req.sender ? req.sender : undefined,
      recipientRole: req.recipientRole,
      recipient: req.recipient ? req.recipient : undefined,
      notificationEvent: req.notificationEvent,
      notificationAction: req.notificationAction,
      eventId: req.eventId ? req.eventId : undefined,
      eventObj: req.eventObj ? req.eventObj : undefined,
      createdDate: Date.now(),
    });

    switch (req.notificationEvent) {
      case NotificationEvent.REGISTER:
        newNotification.title = "Registration Notification";
        newNotification.text = `
        There is a new ${req.senderRole.toLowerCase()} 
        account registration for 
        ${
          req.senderRole === Role.CLIENT
            ? req.sender.name.toUpperCase()
            : req.sender.companyName.toUpperCase()
        }
        (${
          req.senderRole === Role.CLIENT
            ? req.sender.email
            : req.sender.companyEmail
        }) 
        awaiting your review`;
        break;

      case NotificationEvent.ACTIVITY:
        console.log("activity requesting approval::", req.eventObj);
        const activityVendor = await VendorModel.findById(req.sender).exec();
        newNotification.title = "Activity Notification";
        if (req.notificationAction === NotificationAction.CREATE) {
          newNotification.text = `
          Vendor ${activityVendor.companyName.toUpperCase()} 
          is requesting approval to publish ${req.eventObj.title.toUpperCase()}
          `;
        } else if (req.notificationAction === NotificationAction.APPROVE) {
          newNotification.text = `
            Admin has approved your request to publish 
            the activity ${req.eventObj.title.toUpperCase()}.
            `;
        } else {
          newNotification.text = `
            Admin has rejected your request to publish 
            the activity ${req.eventObj.title.toUpperCase()}. Please check activity log for reason.
            `;
        }
        break;

      // case NotificationEvent.BOOKING:
      //     const bookingEvent = BookingModel.findById(req.eventId).populate("client").populate("activity");
      //     newNotification.title = "Booking Notification";
      //     newNotification.text =
      //         `A booking for activity ${bookingEvent.activity.title} is ${req.notificationAction.toLowerCase()}ed by
      //         ${req.senderRole}.`;
      //     break;
    }

    console.log("new notification after save:", newNotification);

    await newNotification.save({ session });
  } catch (error) {
    console.log("notification error", error);
  }
};

export const updateNotificationAsRead = async (req, res) => {
  try {
    console.log("_id", req.params.id);

    const updatedNotification = await notificationModel.findByIdAndUpdate(
      { _id: req.params.id },
      { read: true },
    );

    console.log(updatedNotification);

    res.status(200).json({
      message: "Notification successfully marked as read",
    });
  } catch (error) {
    console.log("notification error", error);
    res.status(500).json({ error: error.message });
  }
};

export const deleteNotification = async (req, res) => {
  try {
    console.log("_id", req.params.id);

    await notificationModel.findByIdAndDelete(req.params.id);

    res.status(200).json({
      message: "Notification successfully deleted",
    });
  } catch (error) {
    console.log("notification error", error);
    res.status(500).json({ error: error.message });
  }
};

export const updateAllNotificationsAsRead = async (req, res) => {};
