import { create } from "zustand";
import bcrypt from "bcryptjs";

interface User {
  username: string;
  password: string;
}

interface AuthStore {
  user: User | null;
  isAuthenticated: boolean;
  signUp: (username: string, password: string) => void;
  signIn: (username: string, password: string) => boolean;
  logout: () => void;
}

const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  isAuthenticated: false,

  // Sign-up function
  signUp: (username, passwordInput) => {
    const password = bcrypt.hashSync(passwordInput, 10);
    set({
      user: { username, password },
      isAuthenticated: true,
    });
  },

  // Sign-in function
  signIn: (username, password) => {
    let success = false;
    set((state) => {
      if (
        state.user &&
        state.user.username === username &&
        state.user.password === password
      ) {
        success = true;
        return { isAuthenticated: true };
      }
      return state;
    });
    return success;
  },

  // Logout function
  logout: () =>
    set({
      user: null,
      isAuthenticated: false,
    }),
}));

export default useAuthStore;
