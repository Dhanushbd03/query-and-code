import { create } from 'zustand';
import createApi from "@/api/axios";
import { toast } from "@/hooks/use-toast";

interface VectorizationStore {
  is_vectorizing: boolean;
  error: string | null;
  startVectorization: (languageId: string) => Promise<void>;
  stopVectorization: () => Promise<void>;
}

const vectorization_api = createApi("api/indexing");

const useVectorization = create<VectorizationStore>((set) => ({
  is_vectorizing: false,
  error: null,

  startVectorization: async (languageId: string) => {
    set({ is_vectorizing: true, error: null });

    try {
      const response = await vectorization_api.post("/", {
        language_id: languageId,
      });

      if (response.data.success) {
        toast({
          title: "Success",
          description: "Vectorization started successfully",
          variant: "success",
        });
      } else {
        throw new Error(response.data.message || "Failed to start vectorization");
      }
    } catch (error: any) {
      set({ error: error.message || "Failed to start vectorization" });
      toast({
        title: "Error",
        description: error.message || "Failed to start vectorization",
        variant: "destructive",
      });
      set({ is_vectorizing: false });
    }
  },

  stopVectorization: async () => {
    try {
      const response = await vectorization_api.post("/stop");
      if (response.data.success) {
        toast({
          title: "Success",
          description: "Vectorization stopped successfully",
          variant: "success",
        });
      } else {
        throw new Error(response.data.message || "Failed to stop vectorization");
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to stop vectorization",
        variant: "destructive",
      });
    } finally {
      set({ is_vectorizing: false });
    }
  },
}));

export default useVectorization; 