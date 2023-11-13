import { create } from "zustand";
import AxiosConnect from "../utils/AxiosConnect.js";
// import update from "immutability-helper";
// import { devtools } from "zustand/middleware";

export const updateCurrentActivity = (selectedActivity) => {
  useActivityStore.setState((prevState) => ({
    ...prevState,
    currentActivity: selectedActivity,
  }));
  console.log(
    "activity store current activity updated::",
    useActivityStore.getState(),
  );
};

export const updateAllActivity = (newAllActivities) => {
  useActivityStore.setState((prevState) => ({
    ...prevState,
    allActivities: newAllActivities,
  }));
  console.log(
    "activity store all activity updated::",
    useActivityStore.getState(),
  );
};

export const useSelectedNavItemStore = create((set) => ({
  selectedItem: "Home",
  setSelectedItem: (item) => set({ selectedItem: item }),
}));

export const useAdminStore = create((set) => ({
  authenticated: false,
  admin: null,
  adminError: null,
  isLoading: false,
  token: null,
  admins: null,
  setAdmin: (admin) => set({ admin }),
  setAuthenticated: (authenticated) => set({ authenticated }), // Use the argument
  login: async (email, password) => {
    set({ isLoading: true, adminError: null });
    try {
      const response = await AxiosConnect.post("/gleekAdmin/login", {
        email: email,
        password: password,
      });
      const data = response.data;
      set({
        admin: data.admin,
        authenticated: true,
        token: data.token,
      });
      setTimeout(() => {
        set({ isLoading: false });
      }, 500);
      return true;
    } catch (error) {
      console.log(error);
      console.log(error.message);
      setTimeout(() => {
        set({
          adminError: error,
          isLoading: false,
        });
      }, 500);
      return false;
    }
  },
  logout: async () => {
    // Implement your logout logic and update authenticated state
    set({
      admin: null, // Clear admin data
      authenticated: false, // Set authenticated to false
    });
    try {
      const response = await AxiosConnect.get("/gleekAdmin/logout");
      setTimeout(() => {
        set({
          isLoading: false,
          admin: null,
          authenticated: false,
          adminError: null,
          token: null,
        });
      }, 500);
    } catch (err) {
      console.log("ERROR: ", err.message);
    }
  },
  changePassword: async (password) => {
    try {
      const response = await AxiosConnect.post("/gleekAdmin/changePassword", {
        password: password,
      });
      const data = response.data;
      set({ admin: data.admin, authenticated: true });
      setTimeout(() => {
        set({ isLoading: false });
      }, 500);
      return true;
    } catch (error) {
      console.log(error);
      setTimeout(() => {
        set({
          adminError: error,
          isLoading: false,
        });
      }, 500);
      return false;
    }
  },
  recoverPassword: async (email) => {
    try {
      const response = await AxiosConnect.post("/gleekAdmin/recoverPassword", {
        email: email,
      });
      const data = response.data;
      setTimeout(() => {
        set({ isLoading: false });
      }, 500);
      return data;
    } catch (error) {
      console.log(error);
      setTimeout(() => {
        set({
          isLoading: false,
        });
      }, 500);
      return false;
    }
  },
  register: async (newAdmin) => {
    set({ isLoading: true, adminError: null });
    try {
      const response = await AxiosConnect.post(
        "/gleekAdmin/register",
        newAdmin,
      );
      const data = response.data;
      console.log(data);
      setTimeout(() => {
        set({ isLoading: false });
      }, 500);
      return true;
    } catch (error) {
      console.log(error);
      setTimeout(() => {
        set({
          isLoading: false,
        });
      }, 500);
      return false;
    }
  },
  getAllAdmins: async () => {
    set({ isLoading: true, adminError: null });
    try {
      const response = await AxiosConnect.get("/gleekAdmin");
      const data = response.data;
      console.log(data);
      setTimeout(() => {
        set({ isLoading: false, admins: response.data });
      }, 500);
      return data;
    } catch (error) {
      console.log(error);
      return false;
    }
  },
  verifyEmail: async (token) => {
    try {
      const response = await AxiosConnect.get(`/gleekAdmin/verify/${token}`);
      console.log(response);
      if (response.data.status === "success") {
        set({ admin: response.data.admin });
      }
      return response;
    } catch (error) {
      console.log(error);
      throw error;
    }
  },
  resendVerifyEmail: async (email) => {
    try {
      const response = await AxiosConnect.post(
        `/gleekAdmin/resendVerificationEmail/`,
        {
          email: email,
        },
      );
      return response;
    } catch (error) {
      console.log(error);
      throw error;
    }
  },
}));

export const useFeaturedActivityStore = create((set) => ({
  featuredActivity: null,
  isLoadingFeaturedActivity: true,
  getFeaturedActivity: async (activityId) => {
    try {
      const res = await AxiosConnect.get(`/activity/feature/${activityId}`);
      set({
        featuredActivity: res.data,
        isLoadingFeaturedActivity: false,
      });
      return res.data;
    } catch (error) {
      console.error(error);
      throw new Error(error.message);
    }
  },
  updateFeaturedActivity: async (activityId, updateFeaturedActivity) => {
    try {
      const res = await AxiosConnect.post(
        `/activity/feature/${activityId}`,
        updateFeaturedActivity,
      );
      set({
        featuredActivity: res.data,
        isLoadingFeaturedActivity: false,
      });
      return res.data;
    } catch (error) {
      console.error(error);
      throw new Error(error.message);
    }
  },
}));

export const useActivityStore = create((set) => ({
  activities: [],
  isLoading: false,
  newActivity: null,
  activityDetails: {},
  selectedTab: "publishedTab",
  pendingApprovalActivities: [],
  selectedActivityTab: "publishedTab",
  setActivities: (activities) => {
    set({ activities });
  },
  setPendingApprovalActivities: (pendingApprovalActivities) => {
    set({ pendingApprovalActivities });
  },
  setSelectedTab: (thing) => {
    set({ selectedTab: thing });
  },
  setSelectedActivityTab: (thing) => {
    set({ selectedActivityTab: thing });
  },
  getActivity: async () => {
    try {
      set({ isLoading: true });
      const response = await AxiosConnect.get("/activity/all");
      set({
        activities: response.data.publishedActivities,
        pendingApprovalActivities: response.data.pendingApprovalActivities,
      });
      set({ isLoading: false });
    } catch (error) {
      console.error(error);
    }
  },
  getActivityForAdmin: async (adminId) => {
    try {
      set({ isLoading: true });
      const response = await AxiosConnect.get(
        `/activity/myActivities/${adminId}`,
      );
      set({ activities: response.data.data });
      set({ isLoading: false });
    } catch (error) {
      console.error(error);
    }
  },
  createActivity: async (newActivityData) => {
    try {
      const response = await AxiosConnect.postMultiPart(
        "/activity/addActivity",
        newActivityData,
      );
      set({ newActivity: response.data.activity });
    } catch (error) {
      console.error("Unexpected Server Error!", error);
      throw new Error("Unexpected Server Error!");
    }
  },
  getSingleActivity: async (activityId) => {
    try {
      set({ isLoading: true });
      const response = await AxiosConnect.get(
        `/activity/viewActivity/${activityId}`,
      );
      set({ activityDetails: response.data.data });
      set({ isLoading: false });
    } catch (error) {
      console.error(error);
    }
  },
  saveActivity: async (activityDraftData) => {
    try {
      const response = await AxiosConnect.postMultiPart(
        "/activity/saveActivity",
        activityDraftData,
      );
      set({ newActivity: response.data.activity });
    } catch (error) {
      throw new Error("Unexpected Server Error!");
    }
  },
  deleteActivity: async (activityId) => {
    try {
      const updatedActivities = await AxiosConnect.delete(
        `/activity/deleteDraft/${activityId}`,
      );
      set({ activities: updatedActivities.data.activity });
      set({ selectedTab: "draftTab" });
      return updatedActivities.data.message;
    } catch (error) {
      console.log(error);
    }
  },
  bulkDeleteActivity: async (activityIds) => {
    try {
      const updatedActivities = await AxiosConnect.delete(
        "/activity/bulkDelete",
        activityIds,
      );
      set({
        activities: updatedActivities.data.activity,
        selectedTab: "draftTab",
      });
      return updatedActivities.data.message;
    } catch (error) {
      console.log(error);
    }
  },
  approveActivity: async (activityId, adminId, markup) => {
    try {
      const updatedActivities = await AxiosConnect.patch(
        "/activity/approveActivity",
        activityId,
        { adminId: adminId, markup: markup },
      );
      set({
        selectedActivityTab: "pendingApprovalTab",
      });
      return updatedActivities.data.message;
    } catch (error) {
      console.log(error);
      throw new Error(error.message);
    }
  },
  rejectActivity: async (activityId, rejectionReason, adminId) => {
    try {
      const updatedActivities = await AxiosConnect.patch(
        "/activity/rejectActivity",
        activityId,
        { rejectionReason: rejectionReason, adminId: adminId },
      );
      set({
        selectedActivityTab: "pendingApprovalTab",
      });
      return updatedActivities.data.message;
    } catch (error) {
      console.log(error);
      throw new Error(error.message);
    }
  },
}));

export const useThemeStore = create((set) => ({
  themes: [],
  isThemeLoading: false,
  getThemes: async () => {
    try {
      set({ isThemeLoading: true });
      const response = await AxiosConnect.get("/activity/getThemes");
      set({ themes: response.data });
      set({ isThemeLoading: false });
    } catch (error) {
      console.error(error);
    }
  },
  getActiveThemes: async () => {
    try {
      set({ isThemeLoading: true });
      const response = await AxiosConnect.get("/activity/getActiveThemes");
      set({ themes: response.data });
      set({ isThemeLoading: false });
    } catch (error) {
      console.error(error);
    }
  },
  addThemes: async (themes, status) => {
    const data = { themes, status };
    try {
      set({ isThemeLoading: true });
      const response = await AxiosConnect.post("/activity/addThemes", data);
      set({
        themes: response.data,
      });
      set({ isThemeLoading: false });
      return response.data.message;
    } catch (error) {
      console.error(error);
      throw new Error(error);
    }
  },
  updateTheme: async (theme) => {
    try {
      set({ isThemeLoading: true });
      const response = await AxiosConnect.post("/activity/updateTheme", {
        theme: theme,
      });
      set({
        themes: response.data,
      });
      set({ isThemeLoading: false });
      return response.data.message;
    } catch (error) {
      console.error(error);
      throw new Error(error);
    }
  },
}));

export const useSnackbarStore = create((set) => ({
  isOpen: false,
  message: "",
  type: "success",
  openSnackbar: (message, type = "success") => {
    set({ isOpen: true, message, type });
  },
  closeSnackbar: () => {
    set({ isOpen: false, message: "", type: "success" });
  },
}));

export const useVendorStore = create((set) => ({
  vendors: [],
  vendor: null,
  isVendorLoading: false,
  vendorTypes: {},
  getVendors: async () => {
    try {
      set({ isVendorLoading: true });
      const response = await AxiosConnect.get("/vendor/viewAllVendors");
      set({ vendors: response.data });
      set({ isVendorLoading: false });
    } catch (error) {
      console.error(error);
    }
  },
  updateVendor: async (id, payload) => {
    try {
      set(() => ({ isVendorLoading: true }));
      await AxiosConnect.patch("/vendor/updateVendor", id, payload);
      const response = await AxiosConnect.get("/vendor/viewAllVendors");
      set({ vendors: response.data });
      set(() => ({ isVendorLoading: false }));
    } catch (error) {
      console.error(error);
    }
  },
  createVendor: async (vendorData) => {
    try {
      set({ isVendorLoading: true });
      const response = await AxiosConnect.post("/vendor/addVendor", vendorData);
      set({ vendor: response.data });
      setTimeout(() => {
        set({ isVendorLoading: false });
      }, 500);
      return true;
    } catch (error) {
      console.error(error);
      throw error;
    }
  },
  vendorTypesFetcher: async () => {
    try {
      const response = await AxiosConnect.get(
        "/gleek/vendor/getAllVendorTypes",
      );
      const data = response.data;
      set({ vendorTypes: data.VendorTypeEnum });
    } catch (error) {
      console.error(error);
    }
  },
  // vendorDetails: {},
  getVendorDetails: async (vendorId) => {
    try {
      set({ isVendorLoading: true });
      console.log("loading get vendor details vendorId", vendorId);
      const response = await AxiosConnect.get(`/vendor/viewVendor/${vendorId}`);
      console.log(response);
      set({ vendor: response.data });
      set({ isVendorLoading: false });
    } catch (error) {
      set({ isVendorLoading: false });
      console.error(error);
    }
  },
  hasActiveBookings: async (vendorId) => {
    try {
      const response = await AxiosConnect.get(
        `/vendor/hasActiveBookings/${vendorId}`,
      );
      return response.data;
    } catch (error) {
      console.error(error);
      throw new Error(error.message);
    }
  },
  toggleIsDisabled: async (vendorId, isDisabled) => {
    try {
      set(() => ({ isVendorLoading: true }));
      console.log(vendorId);
      const toggleResponse = await AxiosConnect.patch(
        "/vendor/toggleVendorIsDisabled",
        vendorId,
        {
          isDisabled: isDisabled,
        },
      );
      const response = await AxiosConnect.get("/vendor/viewAllVendors");
      set({ vendors: response.data });
      set(() => ({ isVendorLoading: false }));
      return toggleResponse.data.message;
    } catch (error) {
      set(() => ({ isVendorLoading: false }));
      console.error(error.message);
      throw new Error(error.message);
    }
  },
}));

export const useClientStore = create((set) => ({
  clients: [],
  isLoading: false,
  getClients: async () => {
    try {
      set({ isLoading: true });
      const response = await AxiosConnect.get("/client/getAllClients");
      set({ clients: response.data });
      set({ isLoading: false });
    } catch (error) {
      console.error(error);
    }
  },
  updateClient: async (id, payload) => {
    try {
      set(() => ({ isLoading: true }));
      await AxiosConnect.patch("/client/update", id, payload);
      const response = await AxiosConnect.get("/client/getAllClients");
      set({ clients: response.data });
      set(() => ({ isLoading: false }));
    } catch (error) {
      console.error(error);
    }
  },
  clientDetails: {},
  getClientDetails: async (clientId) => {
    try {
      set({ isLoading: true });
      const response = await AxiosConnect.get(
        `/client/getClientDetails/${clientId}`,
      );
      set({ clientDetails: response.data });
      set({ isLoading: false });
    } catch (error) {
      console.error(error);
    }
  },
  hasActiveBookings: async (clientId) => {
    try {
      const response = await AxiosConnect.get(
        `/client/hasActiveBookings/${clientId}`,
      );
      return response.data;
    } catch (error) {
      console.error(error);
      throw new Error(error.message);
    }
  },
  toggleIsDisabled: async (clientId, isDisabled) => {
    try {
      set(() => ({ isLoading: true }));
      console.log(clientId);
      const toggleResponse = await AxiosConnect.patch(
        "/client/toggleClientIsDisabled",
        clientId,
        {
          isDisabled: isDisabled,
        },
      );
      const response = await AxiosConnect.get("/client/getAllClients");
      set({ clients: response.data });
      set(() => ({ isLoading: false }));
      return toggleResponse.data.message;
    } catch (error) {
      set(() => ({ isLoading: false }));
      console.error(error.message);
      throw new Error(error.message);
    }
  },
}));

export const useBookingStore = create((set) => ({
  bookings: [],
  pendingBookings: [],
  isLoading: false,
  getAllBookings: async () => {
    try {
      set({ isLoading: true });
      const response = await AxiosConnect.get("/booking/getAllBookings");
      set({
        bookings: response.data.bookings.map((item) => ({
          ...item,
          id: item._id,
        })),
      });
      set({ isLoading: false });
    } catch (error) {
      console.error(error.message);
    }
  },
  approveBooking: async (bookingId) => {
    try {
      set({ isLoading: true });
      const approveResponse = await AxiosConnect.patch(
        "/booking/updateBookingStatus",
        bookingId,
        {
          newStatus: "CONFIRMED",
          actionByUserType: "ADMIN",
        },
      );
      const bookingsResponse = await AxiosConnect.get(
        "/booking/getAllBookings",
      );
      set({
        bookings: bookingsResponse.data.bookings.map((item) => ({
          ...item,
          id: item._id,
        })),
      });
      set({ isLoading: false });
      return approveResponse.data.message;
    } catch (error) {
      set({ isLoading: false });
      console.error(error.message);
      throw new Error(error.message);
    }
  },
  rejectBooking: async (bookingId, rejectionReason) => {
    try {
      set({ isLoading: true });
      const rejectResponse = await AxiosConnect.patch(
        "/booking/updateBookingStatus",
        bookingId,
        {
          newStatus: "REJECTED",
          actionByUserType: "ADMIN",
          actionRemarks: rejectionReason,
        },
      );
      const bookingsResponse = await AxiosConnect.get(
        "/booking/getAllBookings",
      );
      set({
        bookings: bookingsResponse.data.bookings.map((item) => ({
          ...item,
          id: item._id,
        })),
      });
      set({ isLoading: false });
      return rejectResponse.data.message;
    } catch (error) {
      console.error(error.message);
      throw new Error(error.message);
    }
  },
  cancelBooking: async (bookingId, cancellationReason) => {
    try {
      set({ isLoading: true });
      const cancelResponse = await AxiosConnect.patch(
        "/booking/updateBookingStatus",
        bookingId,
        {
          newStatus: "CANCELLED",
          actionByUserType: "ADMIN",
          actionRemarks: cancellationReason,
        },
      );
      const bookingsResponse = await AxiosConnect.get(
        "/booking/getAllBookings",
      );
      set({
        bookings: bookingsResponse.data.bookings.map((item) => ({
          ...item,
          id: item._id,
        })),
      });
      set({ isLoading: false });
      return cancelResponse.data.message;
    } catch (error) {
      console.error(error.message);
      throw new Error(error.message);
    }
  },
  updateBookingToPaid: async (bookingId) => {
    try {
      set({ isLoading: true });
      const updateResponse = await AxiosConnect.patch(
        "/booking/updateBookingStatus",
        bookingId,
        {
          newStatus: "PAID",
          actionByUserType: "ADMIN",
        },
      );
      const bookingsResponse = await AxiosConnect.get(
        "/booking/getAllBookings",
      );
      set({
        bookings: bookingsResponse.data.bookings.map((item) => ({
          ...item,
          id: item._id,
        })),
      });
      set({ isLoading: false });
      return updateResponse.data.message;
    } catch (error) {
      set({ isLoading: false });
      console.error(error.message);
      throw new Error(error.message);
    }
  },
}));

export const useAdminSurveyResponseStore = create((set) => ({
  survey: null,
  surveys: [],
  isLoading: true,
  getSubmittedSurveys: async () => {
    try {
      const response = await AxiosConnect.get("/survey/submitted");
      console.log("getSubmittedSurveys", response.data);
      set({ surveys: response.data, isLoading: false });
    } catch (error) {
      console.error(error);
      throw error;
    }
  },
  getSurveyDetails: async (surveyId) => {
    try {
      const response = await AxiosConnect.get(`/survey/${surveyId}`);
      console.log("getSurveyDetails", response.data);
      set({ survey: response.data, isLoading: false });
    } catch (error) {
      console.error(error);
      throw error;
    }
  },
}));

export const useReviewStore = create((set) => ({
  reviews: [],
  activity: null,
  isLoading: true,
  getReviewsForActivity: async (id) => {
    try {
      const response = await AxiosConnect.get(`/review/activity/${id}`);
      console.log("getReviewsForActivity", response.data);
      set({
        reviews: response.data.reviews,
        activity: response.data.activity,
        isLoading: false,
      });
    } catch (error) {
      console.error(error);
      throw error;
    }
  },
  toggleReviewVisibility: async (reviewId) => {
    try {
      const response = await AxiosConnect.get(
        `/review/${reviewId}/toggleVisibility`,
      );
      const updatedReview = response.data;

      set((state) => {
        const updatedReviews = state.reviews.map((review) => {
          if (review._id === updatedReview._id) {
            return {
              ...review,
              hidden: updatedReview.hidden,
            };
          }
          return review;
        });
        return {
          ...state,
          reviews: updatedReviews,
          isLoading: false,
        };
      });
    } catch (error) {
      console.error(error);
      throw error;
    }
  },
}));

export const useTestimonialStore = create((set) => ({
  testimonials: [],
  testimonial: null,
  isLoading: true,
  getAllTestimonials: async () => {
    try {
      const response = await AxiosConnect.get(`/testimonial/`);
      console.log("getAllTestimonials", response.data);
      set({
        testimonials: response.data,
        isLoading: false,
      });
    } catch (error) {
      console.error(error);
      throw error;
    }
  },
  getTestimonialById: async (testimonialId) => {
    try {
      const response = await AxiosConnect.get(`/testimonial/${testimonialId}`);
      console.log("getTestimonialById", response.data);
      set({
        testimonial: response.data.testimonial,
        isLoading: false,
      });
      return response.data.testimonial;
    } catch (error) {
      console.error(error);
      throw error;
    }
  },
  updateTestimonialById: async (testimonialId, updateData) => {
    try {
      const response = await AxiosConnect.patch(
        `/testimonial`,
        testimonialId,
        updateData,
      );
      console.log("updateTestimonialById", response.data);
      set({
        testimonial: response.data.testimonial,
        isLoading: false,
      });
      return response.data.testimonial;
    } catch (error) {
      console.error(error);
      throw error;
    }
  },
  hasTestimonialForSurvey: async (surveyId) => {
    try {
      const response = await AxiosConnect.get(
        `/testimonial/survey/${surveyId}`,
      );
      console.log("hasTestimonialForSurvey", response.data);

      return response.data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  },
  createTestimonialForSurvey: async (surveyId) => {
    try {
      const response = await AxiosConnect.post(`/testimonial/create`, {
        surveyId,
      });
      console.log("createTestimonialForSurvey", response.data);

      return response.data.testimonial;
    } catch (error) {
      console.error(error);
      throw error;
    }
  },
  deleteTestimonial: async (testimonialId) => {
    try {
      const response = await AxiosConnect.delete(
        `/testimonial/${testimonialId}`,
      );
      console.log("deleteTestimonial", response.data);
    } catch (error) {
      console.error(error);
      throw error;
    }
  },
  toggleTestimonialVisibility: async (testimonialId) => {
    try {
      const response = await AxiosConnect.post(
        `/testimonial/${testimonialId}/toggleVisibility`,
      );
      const updatedTestimonial = response.data;

      set((state) => {
        const updatedTestimonials = state.testimonials.map((t) => {
          if (t._id === updatedTestimonial._id) {
            return {
              ...t,
              hidden: updatedTestimonial.hidden,
            };
          }
          return t;
        });
        return {
          ...state,
          testimonials: updatedTestimonials,
          isLoading: false,
        };
      });
    } catch (error) {
      console.error(error);
      throw error;
    }
  },
}));

export const useImageUploadTestStore = create((set) => ({
  testActivities: [],
  setTestActivities: (newActivityList) => {
    set({ testActivities: newActivityList });
  },
}));

export const useNotificationStore = create((set) => ({
  notifications: [],
  unreadNotificationsCount: 0,
  loading: true,
  retrieveAndSetAllNotifications: (adminCredentials) => {
    set({ loading: true }),
      AxiosConnect.getWithParams("/notification/adminAllNotifications", {
        adminId: adminCredentials._id,
        adminRole: adminCredentials.role,
      }).then((body) => {
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

export const useChatStore = create((set) => ({
  user: {},
  allChatrooms: [],
  currentChatroomMessages: [],
  selectedChat: null,
  loadingMessage: false,
  setUser: (currentUser) => {
    set({ user: currentUser });
  },
  setSelectedChat: (chatSelected) => {
    set({ selectedChat: chatSelected });
  },
  sendMessage: (messageContent, chatroomId, socket) => {
    const params = {
      senderRole: "Admin",
      content: messageContent,
      chatroomId: chatroomId,
    };
    AxiosConnect.post("/chatMessage/admin/sendMessage", params).then(
      (response) => {
        console.log(
          "after send message received data of message: ",
          response.data,
        );
        socket.emit("new message", response.data);
        AxiosConnect.get("/chatroom/admin/fetchChats").then((response) => {
          console.log(response.data);
          set({ allChatrooms: response.data });
          AxiosConnect.get(`/chatMessage/admin/allMessages/${chatroomId}`).then(
            (response) => {
              console.log("after send message set chat window");
              set({ currentChatroomMessages: response.data });
            },
          );
        });
      },
    );
  },
  retrieveAndSetAllChatRooms: () => {
    AxiosConnect.get("/chatroom/admin/fetchChats").then((response) => {
      console.log(response.data);
      set({ allChatrooms: response.data });
    });
  },
  retrieveAndSetChatroomMessages: (chatroomId, socket) => {
    AxiosConnect.get(`/chatMessage/admin/allMessages/${chatroomId}`).then(
      (response) => {
        console.log(chatroomId);
        set({ currentChatroomMessages: response.data });
        socket.emit("join chat", chatroomId);
      },
    );
  },
}));
