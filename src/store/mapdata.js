import create from "zustand";

const useMapDataStore = create((set) => ({
  data: [],
  setData: (data) => set({ data }),
}));

export default useMapDataStore;
