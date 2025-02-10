import { create } from "zustand";

interface SidebarStore {
  is_sidebar_open: boolean;
  set_is_sidebar_open: () => void;
}

const useSidebar = create<SidebarStore>((set, get) => ({
  is_sidebar_open: true,
  set_is_sidebar_open: () => {
    set({ is_sidebar_open: !get().is_sidebar_open });
  },
}));

export default useSidebar;
