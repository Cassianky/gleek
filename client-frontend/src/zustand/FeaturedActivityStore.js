import { create } from "zustand";
import AxiosConnect from "../utils/AxiosConnect.js";
export const useFeaturedActivityStore = create((set) => ({
  activities: null,
  isLoadingFeaturedActivities: true,

  getTodayFeatures: async () => {
    try {
      const res = await AxiosConnect.get(`/gleek/activity/feature/`);
      set({
        activities: res.data,
        isLoadingFeaturedActivities: false,
      });
      return res.data;
    } catch (error) {
      console.error(error);
      throw new Error(error.message);
    }
  },
}));
