import { create } from "zustand";
import AxiosConnect from "../utils/AxiosConnect";

export const useTestimonialStore = create((set) => ({
  testimonials: [],
  isLoading: true,
  getAllTestimonials: async () => {
    try {
      const response = await AxiosConnect.get(`/gleek/testimonial/`);
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
}));
