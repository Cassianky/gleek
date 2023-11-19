import { create } from "zustand";
import AxiosConnect from "../utils/AxiosConnect";

const useAnalyticsStore = create((set) => ({
  data: null,
  pendingBookings: [],
  isLoading: false,
  currentBooking: null,
  reviews: null,
  getDashboard: async () => {
    try {
      set({ isLoading: true });
      const response = await AxiosConnect.get("/gleekVendor/dashboard/view");
      const reviewResponse = await AxiosConnect.get(
        "/gleekVendor/dashboard/bookingReviews",
      );
      set({
        data: response.data,
      });
      set({
        reviews: reviewResponse.data,
      });
      set({ isLoading: false });
    } catch (error) {
      console.error(error.message);
    }
  },
}));

export default useAnalyticsStore;
