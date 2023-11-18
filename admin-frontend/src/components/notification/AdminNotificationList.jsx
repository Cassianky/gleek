import { useEffect, useState } from "react";
import AdminNotificationContent from "./AdminNotificationContent";
import { useNotificationStore } from "../../zustand/GlobalStore";

const AdminNotificationList = () => {
  const { notifications } = useNotificationStore();

  return (
    <div style={{ maxWidth: "100%", margin: "0 auto" }}>
      {notifications.map((notification, index) => (
        <AdminNotificationContent key={index} notification={notification} />
      ))}
    </div>
  );
};

export default AdminNotificationList;
