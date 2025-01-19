import { create } from "zustand";

interface DialogStore {
  isAuthOpen: boolean;
  openAuthDialog: () => void;
  closeAuthDialog: () => void;
}

const useDialogStore = create<DialogStore>((set, get) => ({
  isAuthOpen: false,
  openAuthDialog: () => {
    set({ isAuthOpen: true });
    console.log("Auth dialog opened");
    console.log("isAuthOpen:", get().isAuthOpen);
  },
  closeAuthDialog: () => {
    set({ isAuthOpen: false });
    console.log("Auth dialog closed");
    console.log("isAuthOpen:", get().isAuthOpen);
  },
}));

export default useDialogStore;
