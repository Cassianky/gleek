import { create } from "zustand";
import AxiosConnect from "../utils/AxiosConnect";

const useBookingStore = create((set) => ({
  bookings: [],
  pendingBookings: [],
  isLoading: false,
  getBookingsForVendor: async () => {
    try {
      set({ isLoading: true });
      const response = await AxiosConnect.get(
        "/gleekVendor/booking/getAllBookings"
      );
      set({ bookings: response.data.bookings });
      set({ isLoading: false });
    } catch (error) {
      console.error(error.message);
    }
  },
}));

export default useBookingStore;
