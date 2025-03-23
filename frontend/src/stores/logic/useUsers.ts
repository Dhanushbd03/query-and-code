import { create } from 'zustand'
import createApi from "@/api/axios"
import { toast } from "@/hooks/use-toast";

interface UserStats {
  conversation_count: number;
  languages_interacted: number;
  days_used: number;
}

interface User {
  id: string;
  username: string;
  email: string;
  created_at: string;
  stats: UserStats;
}

interface UsersStore {
  users: User[];
  loading: boolean;
  getAllUsers: () => Promise<void>;
}

const admin_api = createApi("api/admin")

const useUsers = create<UsersStore>((set) => ({
  users: [],
  loading: false,
  getAllUsers: async () => {
    set({ loading: true });
    try {
      const response = await admin_api.get("/users");
      
      if (response.data.success) {
        set({ users: response.data.data });
      } else {
        toast({
          title: "Error",
          description: response.data.message || "Failed to fetch users",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to fetch users",
        variant: "destructive",
      });
    } finally {
      set({ loading: false });
    }
  },
}));

export default useUsers; 