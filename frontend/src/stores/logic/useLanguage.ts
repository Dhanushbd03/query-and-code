import createApi from "@/api/axios";
import { create } from "zustand";
import { toast } from "@/hooks/use-toast";
import { Language } from "@/models/model";

const lang_api = createApi("api/languages");

interface LanguageStore {
  languages: Language[];
  getLanguages: () => Promise<void>;
  l_loading: boolean;
}

const useLanguage = create<LanguageStore>((set) => ({
  languages: [],
  l_loading: false,

  getLanguages: async () => {
    set({ l_loading: true });

    try {
      const { data } = await lang_api.get("/");
      if (data.success) {
        set({ languages: data.data });
      } else {
        throw new Error(data.message);
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Something went wrong",
        variant: "destructive",
      });
    } finally {
      set({ l_loading: false });
    }
  },
}));

export default useLanguage;
