import { create } from "zustand";
import AxiosConnect from "../utils/AxiosConnect";

const useBadgeStore = create((set) => ({
  currentBadge: null,
  setCurrentBadge: (newCurrentBadge) => set({ currentBadge: newCurrentBadge }),
  badges: [],
  setBadges: (newBadges) => set({ badges: newBadges }),
  completedBadges: [],
  setCompletedBadges: (newCompletedBadges) =>
    set({ completedBadges: newCompletedBadges }),
  uncompletedBadges: [],
  setUncompletedBadges: (newUncompletedBadges) =>
    set({ uncompletedBadges: newUncompletedBadges }),
  isLoadingBadges: true,
  isLoadingClientProfile: true,
  clientProfile: null,
  setClientProfile: (newClientProfile) =>
    set({ clientProfile: newClientProfile }),
  clientProfileBadges: [],
  getBadges: async () => {
    try {
      set({ isLoadingBadges: true });
      const response = await AxiosConnect.get(
        `/gleek/badge/getAllBadgeRecordsForClient`,
      );
      const data = response.data;
      console.log(data);
      const badges = data.badgeRecords;

      const completedBadges = badges.filter(
        (badge) => badge.isCompleted === true,
      );
      const uncompletedBadges = badges.filter(
        (badge) => badge.isCompleted === false,
      );

      set({
        isLoadingBadges: false,
        badges: badges,
        completedBadges: completedBadges,
        uncompletedBadges: uncompletedBadges,
      });
    } catch (error) {
      throw error;
    }
  },
  getClientProfile: async (clientId) => {
    try {
      set({ isLoadingClientProfile: true });
      const response = await AxiosConnect.get(
        `/gleek/badge/getClientProfile/${clientId}`,
      );
      const data = response.data;
      console.log(data);

      set({
        isLoadingClientProfile: false,
        clientProfile: data.clientProfile,
        clientProfileBadges: data.badgeRecords,
      });
    } catch (error) {
      throw error;
    }
  },
}));

export default useBadgeStore;
