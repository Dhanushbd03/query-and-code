import { create } from 'zustand';
import createApi from "@/api/axios";
import { toast } from "@/hooks/use-toast";

export interface HourlyActivity {
  hour: string;
  chats: number;
}

export interface WeeklyActivity {
  day: string;
  chats: number;
}

export interface LanguageDistribution {
  name: string;
  value: number;
}

export interface QuickStats {
  totalChats: number;
  averageResponseTime: number;
  activeUsers: number;
  satisfactionRate: number;
}

interface AnalyticsStore {
  hourlyData: HourlyActivity[];
  weeklyData: WeeklyActivity[];
  languageData: LanguageDistribution[];
  quickStats: QuickStats | null;
  loading: boolean;
  error: string | null;
  fetchAnalytics: () => Promise<void>;
}

const analytics_api = createApi("api/analytics");

const useAnalytics = create<AnalyticsStore>((set) => ({
  hourlyData: [],
  weeklyData: [],
  languageData: [],
  quickStats: null,
  loading: false,
  error: null,

  fetchAnalytics: async () => {
    set({ loading: true, error: null });

    try {
      const [hourlyRes, weeklyRes, languageRes, statsRes] = await Promise.all([
        analytics_api.get("/hourly-activity"),
        analytics_api.get("/weekly-activity"),
        analytics_api.get("/language-distribution"),
        analytics_api.get("/quick-stats")
      ]);

      if (hourlyRes.data.success && weeklyRes.data.success && 
          languageRes.data.success && statsRes.data.success) {
        
        // Map hourly data
        const hourlyData = hourlyRes.data.data.map((item: any) => ({
          hour: new Date(item.hour).toLocaleTimeString('en-US', { 
            hour: '2-digit', 
            minute: '2-digit',
            hour12: false 
          }),
          chats: item.message_count
        }));

        // Map weekly data
        const weeklyData = weeklyRes.data.data.map((item: any) => ({
          day: new Date(item.day).toLocaleDateString('en-US', { weekday: 'long' }),
          chats: item.message_count
        }));

        // Map language data
        const languageData = languageRes.data.data.map((item: any) => ({
          name: item.language,
          value: item.message_count
        }));

        // Map quick stats
        const quickStats = {
          totalChats: statsRes.data.data.total_chats_today,
          averageResponseTime: Math.round(statsRes.data.data.avg_response_time / 60), // Convert seconds to minutes
          activeUsers: statsRes.data.data.active_users_today,
          satisfactionRate: 95 // This is a placeholder since it's not in the backend yet
        };

        set({
          hourlyData,
          weeklyData,
          languageData,
          quickStats
        });
      } else {
        throw new Error("Failed to fetch analytics data");
      }
    } catch (error: any) {
      set({ error: error.message || "Failed to fetch analytics data" });
      toast({
        title: "Error",
        description: "Failed to fetch analytics data",
        variant: "destructive",
      });
    } finally {
      set({ loading: false });
    }
  },
}));

export default useAnalytics; 