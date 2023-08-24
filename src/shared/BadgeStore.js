import create from "zustand";

const useBadgeStore = create((set) => ({
  badges: [],
  ownedBadges: [],
  setBadges: (badges) => set({ badges }),
  setOwnedBadges: (ownedBadges) => set({ ownedBadges }),
}));

export default useBadgeStore;
