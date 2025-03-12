import { create } from "zustand";
import { toast } from "@/hooks/use-toast";
import createApi from "@/api/axios";

interface User {
  name: string;
  email: string;
}

interface AuthStore {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  signUp: (name: string, email: string, password: string) => Promise<boolean>;
  signIn: (identifier: string, password: string) => Promise<boolean>;
  getUser: () => void;
  logout: () => void;
}

const authApi = createApi("api/auth");
const userApi = createApi("api/user");

const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  isAuthenticated: false,
  loading: false,
  signUp: async (username, email, password) => {
    try {
      const usernameValue = username.trim().toLowerCase();
      const response = await authApi.post("/register", {
        name: usernameValue,
        email,
        password,
      });
      toast({
        title: "Account created successfully 🎉 , Please Login with your credentials and boost your productivity",
        description: response.data.message,
        variant: "success",
      });
      return true;
    } catch (error: any) {
      toast({
        title: "Sign-up failed",
        description: error.response.data.message,
        variant: "destructive",
      });
      return false;
    }
  },

  signIn: async (identifier, password) => {
    try {
      const response = await authApi.post("/login", { identifier, password });
      set({ user: response.data.user, isAuthenticated: true });
      toast({
        title: "Login successful",
        description: "You have been logged in",
        variant: "success",
      });
      return true;
    } catch (error: any) {
      toast({
        title: "Login failed",
        description: error.response.data.message,
        variant: "destructive",
      });
      return false;
    }
  },

  logout: async () => {
    try {
      await authApi.post("/logout");
      set({ user: null, isAuthenticated: false });
      window.location.href = "/";
      toast({
        title: "Logout successful",
        description: "You have been logged out",
        variant: "warning",
      });
    } catch (error: any) {
      toast({
        title: "Logout failed",
        description: error.response.data.message,
        variant: "destructive",
      });
    }
  },

  getUser: async () => {
    set({ loading: true }); // Start loading
    try {
      const response = await userApi.get("/");
      set({ user: response.data.user, isAuthenticated: true, loading: false });
    } catch (error: any) {
      set({ user: null, isAuthenticated: false, loading: false });
    }
  },
}));

export default useAuthStore;
