import NotificationModel from "../model/notificationModel.js";
import {
  NotificationAction,
  NotificationEvent,
} from "../util/notificationRelatedEnum.js";
import { Role } from "../util/roleEnum.js";
import VendorModel from "../model/vendorModel.js";
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
    console.log("req in notification creation controller:");

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

      case NotificationEvent.BOOKING:
        newNotification.title = "Booking Notification";
        if (req.notificationAction === NotificationAction.REQUEST) {
          const booking = req.eventObj;
          newNotification.text = `${
            booking.clientId.name
          } is requesting to book ${booking.activityId.title.toUpperCase()} 
              by ${booking.vendorId.companyName.toUpperCase()}.`;
        } else if (req.notificationAction === NotificationAction.APPROVE) {
          const booking = req.eventObj;
          newNotification.text = `Your booking for activity ${booking.activityId.title.toUpperCase()} 
              has been approved.`;
        } else if (req.notificationAction === NotificationAction.REJECT) {
          const booking = req.eventObj;
          newNotification.text = `Your booking for activity ${booking.activityId.title.toUpperCase()} 
              has been rejected.`;
        } else if (req.notificationAction === NotificationAction.CANCEL) {
          const booking = req.eventObj;
          newNotification.text = `Booking for activity ${booking.activityId.title.toUpperCase()} 
              has been cancelled.`;
        } else if (
          req.notificationAction === NotificationAction.APPROVEUPDATEADMIN
        ) {
          const booking = req.eventObj;
          newNotification.text = `Client ${booking.clientId.name.toUpperCase()} booking for activity 
              ${booking.activityId.title.toUpperCase()} has been accepted by 
              vendor ${booking.vendorName.toUpperCase()}.`;
        } else if (
          req.notificationAction === NotificationAction.REJECTUPDATEADMIN
        ) {
          const booking = req.eventObj;
          newNotification.text = `Client ${booking.clientId.name.toUpperCase()} booking for activity 
              ${booking.activityId.title.toUpperCase()} has been rejected by 
              vendor ${booking.vendorName.toUpperCase()}.`;
        } else if (
          req.notificationAction === NotificationAction.CANCELUPDATEADMIN
        ) {
          const booking = req.eventObj;
          if (req.senderRole === "VENDOR") {
            newNotification.text = `Client ${booking.clientId.name.toUpperCase()} booking for activity 
              ${booking.activityId.title.toUpperCase()} has been cancelled by 
              vendor ${booking.vendorName.toUpperCase()}.`;
          } else {
            newNotification.text = `Client ${booking.clientId.name.toUpperCase()} booking for activity 
              ${booking.activityId.title.toUpperCase()} has been cancelled by 
              client.`;
          }
        }
        break;
      case NotificationEvent.NEWBADGE:
        newNotification.title = "Badge Notification";
        newNotification.text = `You have earned a new badge: ${req.eventObj.badge.name.toUpperCase()}`;
    }

    console.log("new notification after save:", newNotification);

    await newNotification.save({ session });
  } catch (error) {
    console.log("notification error", error);
  }
};

export const updateNotificationAsRead = async (req, res) => {
  try {
    const updatedNotification = await notificationModel.findByIdAndUpdate(
      { _id: req.params.id },
      { read: true },
    );

    console.log(updatedNotification);

    const role =
      req.cookies.userRole.toUpperCase() === Role.VENDOR
        ? Role.VENDOR
        : Role.CLIENT;

    const recipientId = req.user._id;
    console.log("In update notification read:");
    console.log(role);
    console.log(req.user._id);

    const allNotifications = await NotificationModel.find({
      recipient: recipientId,
      $and: [{ recipientRole: role }],
    }).sort({ createdDate: -1 });

    res.status(200).json({
      data: allNotifications,
    });
  } catch (error) {
    console.log("notification error", error);
    res.status(500).json({ error: error.message });
  }
};

export const deleteNotification = async (req, res) => {
  try {
    await notificationModel.findByIdAndDelete(req.params.id);

    const role =
      req.cookies.userRole.toUpperCase() === Role.VENDOR
        ? Role.VENDOR
        : Role.CLIENT;

    const recipientId = req.user._id;
    console.log("In delete notification read:");
    console.log(role);
    console.log(req.user._id);

    const allNotifications = await NotificationModel.find({
      recipient: recipientId,
      $and: [{ recipientRole: role }],
    }).sort({ createdDate: -1 });

    res.status(200).json({
      data: allNotifications,
    });
  } catch (error) {
    console.log("notification error", error);
    res.status(500).json({ error: error.message });
  }
};

export const adminUpdateNotificationAsRead = async (req, res) => {
  try {
    const updatedNotification = await notificationModel.findByIdAndUpdate(
      { _id: req.params.id },
      { read: true },
    );

    const allNotifications = await NotificationModel.find({
      recipientRole: Role.ADMIN,
    }).sort({ createdDate: -1 });

    res.status(200).json({
      data: allNotifications,
    });
  } catch (error) {
    console.log("notification error", error);
    res.status(500).json({ error: error.message });
  }
};

export const adminDeleteNotification = async (req, res) => {
  try {
    await notificationModel.findByIdAndDelete(req.params.id);

    const allNotifications = await NotificationModel.find({
      recipientRole: Role.ADMIN,
    }).sort({ createdDate: -1 });

    res.status(200).json({
      data: allNotifications,
    });
  } catch (error) {
    console.log("notification error", error);
    res.status(500).json({ error: error.message });
  }
};

export const updateAllNotificationsAsRead = async (req, res) => {};
