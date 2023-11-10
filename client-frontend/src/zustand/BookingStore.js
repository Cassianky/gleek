import { create } from "zustand";
import AxiosConnect from "../utils/AxiosConnect";

const useBookingStore = create((set) => ({
   bookings: [],
   pendingBookings: [],
   isLoading: false,
   currentBooking: null,
   leaderboard: [],
   setCurrentBooking: (newCurrentBooking) =>
      set({ currentBooking: newCurrentBooking }),
   currentBookingLoading: true,
   setCurrentBookingLoading: (newCurrentBookingLoading) =>
      set({ currentBookingLoading: newCurrentBookingLoading }),
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
   getBookingsWithPendingSurvey: async () => {
      try {
         set({ isLoading: true });
         const response = await AxiosConnect.get(
            "/gleek/booking/pendingSurvey"
         );

         set({ bookings: response.data.bookings });
         set({ isLoading: false });
      } catch (error) {
         console.error(error.message);
         throw error;
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
   rejectBooking: async (bookingId, rejectionReason) => {
      try {
         set({ isLoading: true });
         const response = await AxiosConnect.patch(
            `/gleekVendor/booking/rejectBooking/${bookingId}`,
            { rejectionReason: rejectionReason }
         );
         set({ bookings: response.data.bookings });
         set({ isLoading: false });
         return response.data.message;
      } catch (error) {
         console.error(error.message);
         throw new Error("Unexpected Server Error!");
      }
   },
   cancelBooking: async (bookingId, cancelReason) => {
      try {
         set({ isLoading: true });
         const response = await AxiosConnect.patch(
            `/gleekVendor/booking/cancelBooking/${bookingId}`,
            { cancelReason: cancelReason }
         );
         set({ bookings: response.data.bookings });
         set({ isLoading: false });
         return response.data.message;
      } catch (error) {
         console.error(error.message);
         throw new Error(error.message);
      }
   },
   getAllBookingsForClient: async () => {
      try {
         set({ isLoading: true });
         const response = await AxiosConnect.get(
            "/gleek/booking/getAllBookingsForClient"
         );
         set({ bookings: response.data.bookings });
         console.log(response.data.bookings);
         set({ isLoading: false });
      } catch (error) {
         console.error(error.message);
      }
   },
   getBookingForClient: async (bookingId) => {
      try {
         set({ currentBookingLoading: true });
         const response = await AxiosConnect.get(
            `/gleek/booking/viewBooking/${bookingId}`
         );
         set({ currentBooking: response.data.booking });
         console.log(response.data.booking);
         set({ currentBookingLoading: false });
      } catch (error) {
         console.error(error.message);
      }
   },
   cancelBookingForClient: async (bookingId, cancellationReason) => {
      try {
         set({ isLoading: true });
         const cancelResponse = await AxiosConnect.patch(
            `/gleek/booking/updateBookingStatus/${bookingId}`,
            {
               newStatus: "CANCELLED",
               actionByUserType: "CLIENT",
               actionRemarks: cancellationReason,
            }
         );
         set({ isLoading: false });
         return cancelResponse.data.message;
      } catch (error) {
         console.error(error.message);
         throw new Error(error.message);
      }
   },
   getBookingSummaryPdf: async (id) => {
      try {
         const response = await AxiosConnect.post(
            `/gleek/booking/downloadBookingSummaryUrl/${id}`
         );
         window.open(
            `http://localhost:5000/gleek/booking/downloadBookingSummaryPdf/${response.data}`
         );
         return;
      } catch (err) {
         console.log(err);
         throw new Error(err.message);
      }
   },
   getLeaderboard: async () => {
      try {
         set({ isLoading: true });
         const response = await AxiosConnect.get(`/gleek/leaderboard`);
         let data = Object.entries(response.data);

         data = data.map((entry) => entry[1]);
         data.sort().reverse();
         set({ isLoading: false, leaderboard: data });
         return data;
      } catch (err) {
         console.log(err);
         throw new Error(err.message);
      }
   },
}));

export default useBookingStore;
