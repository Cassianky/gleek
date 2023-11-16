import { create } from "zustand";
import AxiosConnect from "../utils/AxiosConnect.js";
export const useNotificationStore = create((set) => ({
  notifications: [],
  unreadNotificationsCount: 0,
  loading: true,
  retrieveAndSetAllNotifications: (role) => {
    set({ loading: true });
    const specifiedRole = role === "Client" ? "client" : "vendor";
    AxiosConnect.getWithParams(
      `/notification/${specifiedRole}/nonAdminAllNotifications`,
      {
        userRole: role,
      },
    )
      .then((body) => {
        const allNotifications = body.data.data;
        set({ notifications: allNotifications });
        let unreadCount = 0;
        allNotifications.map((notification) => {
          notification.read === false ? unreadCount++ : unreadCount;
        });
        set({ unreadNotificationsCount: unreadCount });
        set({ loading: false });
      })
      .catch((error) => {
        console.log("error in retrieveAndSetAllNotifications: ", error);
      });
  },
  markAsRead: (rolePath, notification) => {
    const specifiedRole = rolePath === "Client" ? "client" : "vendor";
    AxiosConnect.patch(
      `/notification/${rolePath}/updateNotificationAsRead/${notification._id}`,
      {
        userRole: specifiedRole,
      },
    ).then((response) => {
      set({ loading: true });
      const allNotifications = response.data.data;
      set({ notifications: allNotifications });
      let unreadCount = 0;
      allNotifications.map((notification) => {
        notification.read === false ? unreadCount++ : unreadCount;
      });
      set({ unreadNotificationsCount: unreadCount });
      set({ loading: false });
    });
  },
  deleteNotification: (rolePath, notification) => {
    const specifiedRole = rolePath === "Client" ? "client" : "vendor";
    AxiosConnect.patch(
      `/notification/${rolePath}/deleteNotification/${notification._id}`,
      {
        userRole: specifiedRole,
      },
    ).then((response) => {
      set({ loading: true });
      const allNotifications = response.data.data;
      set({ notifications: allNotifications });
      let unreadCount = 0;
      allNotifications.map((notification) => {
        notification.read === false ? unreadCount++ : unreadCount;
      });
      set({ unreadNotificationsCount: unreadCount });
      set({ loading: false });
    });
  },
}));
