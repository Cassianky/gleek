import { create } from "zustand";
import axios from "axios";
import AxiosConnect from "../utils/AxiosConnect";

const useAdminSurveyResponseStore = create((set) => ({
  survey: null,
  surveys: null,
  isLoadingSurvey: true,
  isSurveyAvailable: false,

  // Get a survey by ID
  getSurvey: async (surveyId) => {
    try {
      const response = await AxiosConnect.get(`/gleek/survey/${surveyId}`);
      set({ survey: response.data, isLoadingSurvey: false });
    } catch (error) {
      console.error(error);
      throw error;
    }
  },

  // Get the survey for a booking
  // {survey, review}
  getSurveyForBooking: async (bookingId) => {
    try {
      const response = await AxiosConnect.get(
        `/gleek/survey/booking/${bookingId}`,
      );
      console.log(response.data);
      if (response.data ) {
        set({
          survey: response.data.survey,
          isLoadingSurvey: false,
          isSurveyAvailable: true,
        });
      }

      return response.data;
    } catch (error) {
      console.error(error);
      set({ isSurveyAvailable: false, isLoadingSurvey: false });
      throw error;
    }
  },

  // Submit survey
  submitSurveyForBooking: async (bookingId, survey, review) => {
    try {
      const response = await AxiosConnect.post(
        `/gleek/survey/booking/${bookingId}/submit`,
        {survey, review},
      );
      console.log(response.data);
      set({ survey: response.data, isLoadingSurvey: false });
      return response.data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  },

  // Get the survey for a booking
  surveyDraftForBooking: async (bookingId, formData) => {
    try {
      const response = await AxiosConnect.post(
        `/gleek/survey/booking/${bookingId}/draft`,
        formData,
      );
      console.log(response.data);
      set({ survey: response.data, isLoadingSurvey: false });
      return response.data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  },

  // Get all pending surveys
  getAllPendingSurveys: async () => {
    try {
      const response = await AxiosConnect.get("/gleek/survey/pending");
      set({ surveys: response.data, isLoadingSurvey: false });
    } catch (error) {
      console.error(error);
      throw error;
    }
  },

  // // Update a survey by ID
  // updateSurvey: async (surveyId, updateData) => {
  //   try {
  //     const response = await AxiosConnect.post(
  //       `/gleek/survey/${surveyId}`,
  //       updateData,
  //     );
  //     set({ survey: response.data, isLoadingSurvey: false });
  //   } catch (error) {
  //     console.error(error);
  //     throw error;
  //   }
  // },

  // // Submit a new survey
  // submitSurvey: async (surveyId, surveyData) => {
  //   try {
  //     const response = await AxiosConnect.post(
  //       `/gleek/survey/${surveyId}/submit`,
  //       surveyData,
  //     );
  //     set({ survey: response.data, isLoadingSurvey: false });
  //   } catch (error) {
  //     console.error(error);
  //     throw error;
  //   }
  // },
}));

export default useAdminSurveyResponseStore;
