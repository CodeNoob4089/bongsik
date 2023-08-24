import { create } from "zustand";

const useClickedDataStore = create((set) => ({
  clickedData: {},
  setClickedData: (clickedData) => set({ clickedData }),
}));

export default useClickedDataStore;
