import { useEffect, useState } from "react";
import NotificationContent from "./NotificationContent";
import { useNotificationStore } from "../../zustand/NotficationStore";

const NotificationList = () => {
  const { notifications, loading, retrieveAndSetAllNotifications } =
    useNotificationStore();

  return (
    <div style={{ maxWidth: "100%", margin: "0 auto", padding: 10 }}>
      {notifications.length === 0
        ? "No new notifications!"
        : notifications.map((notification, index) => (
            <NotificationContent key={index} notification={notification} />
          ))}
    </div>
  );
};

export default NotificationList;
