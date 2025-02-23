import { create } from "zustand";

interface ChatStore {
  is_intro: boolean;
  set_is_intro: (isIntro: boolean) => void;
}

const useChat = create<ChatStore>((set) => ({
  is_intro: false,
  set_is_intro: (isIntro: boolean) => {
    set({ is_intro: isIntro });
  },
}));

export default useChat;
