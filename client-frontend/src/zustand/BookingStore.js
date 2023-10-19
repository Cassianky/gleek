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
  approveBooking: async (bookingId) => {
    try {
      set({ isLoading: true });
      const response = await AxiosConnect.patch(
        `/gleekVendor/booking/confirmBooking/${bookingId}`
      );
      set({ bookings: response.data.bookings });
      set({ isLoading: false });
      return response.data.message;
    } catch (error) {
      console.error(error.message);
      throw new Error("Unexpected Server Error!");
    }
  },
  rejectBooking: async (bookingId) => {
    try {
      set({ isLoading: true });
      const response = await AxiosConnect.patch(
        `/gleekVendor/booking/rejectBooking/${bookingId}`
      );
      set({ bookings: response.data.bookings });
      set({ isLoading: false });
      return response.data.message;
    } catch (error) {
      console.error(error.message);
      throw new Error("Unexpected Server Error!");
    }
  },
}));

export default useBookingStore;