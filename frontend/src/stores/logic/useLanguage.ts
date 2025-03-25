import createApi from "@/api/axios";
import { create } from "zustand";
import { toast } from "@/hooks/use-toast";
import { Language } from "@/models/model";

const lang_api = createApi("api/languages");

interface LanguageStore {
  languages: Language[];
  loading: boolean;
  error: string | null;
  getLanguages: () => Promise<void>;
  addLanguage: (name: string, description?: string, github_url?: string) => Promise<void>;
  updateLanguage: (id: string, data: Partial<Language>) => Promise<void>;
  deleteLanguage: (id: string) => Promise<void>;
}

const useLanguage = create<LanguageStore>((set) => ({
  languages: [],
  loading: false,
  error: null,

  getLanguages: async () => {
    try {
      set({ loading: true, error: null });
      const response = await lang_api.get("/");
      if (response.data.success) {
        set({ languages: response.data.data });
      } else {
        throw new Error(response.data.message);
      }
    } catch (error: any) {
      set({ error: error.message });
      toast({
        title: "Error",
        description: "Failed to fetch languages",
        variant: "destructive",
      });
    } finally {
      set({ loading: false });
    }
  },

  addLanguage: async (name: string, description?: string, github_url?: string) => {
    try {
      set({ loading: true, error: null });
      const response = await lang_api.post("/", {
        name,
        description,
        github_url,
      });
      if (response.data.success) {
        set((state) => ({
          languages: [...state.languages, response.data.data],
        }));
        toast({
          title: "Success",
          description: "Language added successfully",
          variant: "success",
        });
      } else {
        throw new Error(response.data.message);
      }
    } catch (error: any) {
      set({ error: error.message });
      toast({
        title: "Error",
        description: "Failed to add language",
        variant: "destructive",
      });
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  updateLanguage: async (id: string, data: Partial<Language>) => {
    try {
      set({ loading: true, error: null });
      const response = await lang_api.put(`/${id}`, data);
      if (response.data.success) {
        set((state) => ({
          languages: state.languages.map((lang) =>
            lang.id === id ? { ...lang, ...response.data.data } : lang
          ),
        }));
        toast({
          title: "Success",
          description: "Language updated successfully",
          variant: "success",
        });
      } else {
        throw new Error(response.data.message);
      }
    } catch (error: any) {
      set({ error: error.message });
      toast({
        title: "Error",
        description: "Failed to update language",
        variant: "destructive",
      });
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  deleteLanguage: async (id: string) => {
    try {
      set({ loading: true, error: null });
      const response = await lang_api.delete(`/${id}`);
      if (response.data.success) {
        set((state) => ({
          languages: state.languages.filter((lang) => lang.id !== id),
        }));
        toast({
          title: "Success",
          description: "Language deleted successfully",
          variant: "success",
        });
      } else {
        throw new Error(response.data.message);
      }
    } catch (error: any) {
      set({ error: error.message });
      toast({
        title: "Error",
        description: "Failed to delete language",
        variant: "destructive",
      });
      throw error;
    } finally {
      set({ loading: false });
    }
  },
}));

export default useLanguage;
