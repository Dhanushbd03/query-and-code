import { create } from "zustand";

interface DialogStore {
  isAuthOpen: boolean;
  openAuthDialog: () => void;
  closeAuthDialog: () => void;
}

const useDialogStore = create<DialogStore>((set) => ({
  isAuthOpen: false,
  openAuthDialog: () => {
    set({ isAuthOpen: true });
  },
  closeAuthDialog: () => {
    set({ isAuthOpen: false });
  },
}));

export default useDialogStore;
