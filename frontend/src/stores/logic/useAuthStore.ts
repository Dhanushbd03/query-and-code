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
  signUp: (
    username: string,
    email: string,
    password: string
  ) => Promise<boolean>;
  signIn: (identifier: string, password: string) => Promise<boolean>; // Username or email
  getUser: () => void;
  logout: () => void;
}
const authApi = createApi("api/auth");
const userApi = createApi("api/user");

const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  isAuthenticated: false,

  signUp: async (username, email, password) => {
    try {
      const usernameValue = username.trim().toLowerCase();
      console.log(usernameValue);
      const response = await authApi.post("/register", {
        username: usernameValue,
        email,
        password,
      });
      toast({
        title: "Account created",
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
    try {
      const response = await userApi.get("/");
      set({ user: response.data.user, isAuthenticated: true });
    } catch (error: any) {
      set({ user: null, isAuthenticated: false });
    }
  },
}));

export default useAuthStore;
