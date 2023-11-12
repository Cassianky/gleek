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
    ).then((body) => {
      console.log(body.data.data);
      const allNotifications = body.data.data;
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
