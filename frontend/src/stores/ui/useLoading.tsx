import { create } from "zustand";

interface loadingStore {
  loading: boolean;
  set_loading: (loading: boolean) => void;
}

const useLoading = create<loadingStore>((set) => ({
  loading: false,
  set_loading: (loading: boolean) => {
    set({ loading: loading });
  },
}));

export default useLoading;
