import { create } from 'zustand';
import createApi from "@/api/axios";
import { toast } from "@/hooks/use-toast";

interface ScrapingStore {
  is_scraping: boolean;
  error: string | null;
  startScraping: (languageId: string) => Promise<void>;
  stopScraping: () => Promise<void>;
}

const scraping_api = createApi("api/scrape");

const useScraping = create<ScrapingStore>((set) => ({
  is_scraping: false,
  error: null,

  startScraping: async (languageId: string) => {
    set({ is_scraping: true, error: null });

    try {
      const response = await scraping_api.post("/scrape", {
        language_id: languageId,
      });

      if (response.data.success) {
        toast({
          title: "Success",
          description: "Scraping started successfully",
          variant: "success",
        });
      } else {
        throw new Error(response.data.message || "Failed to start scraping");
      }
    } catch (error: any) {
      set({ error: error.message || "Failed to start scraping" });
      toast({
        title: "Error",
        description: error.message || "Failed to start scraping",
        variant: "destructive",
      });
      set({ is_scraping: false });
    }
  },

  stopScraping: async () => {
    try {
      const response = await scraping_api.post("/stop");
      if (response.data.success) {
        toast({
          title: "Success",
          description: "Scraping stopped successfully",
          variant: "success",
        });
      } else {
        throw new Error(response.data.message || "Failed to stop scraping");
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to stop scraping",
        variant: "destructive",
      });
    } finally {
      set({ is_scraping: false });
    }
  },
}));

export default useScraping; 