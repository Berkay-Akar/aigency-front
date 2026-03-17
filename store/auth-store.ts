import { create } from "zustand";
import { setToken, removeToken, getToken, setStoredUser, getStoredUser } from "@/lib/auth";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
}

interface AuthState {
  user: AuthUser | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (token: string, user: AuthUser) => void;
  logout: () => void;
  hydrate: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  isAuthenticated: false,

  login: (token, user) => {
    setToken(token);
    setStoredUser(user as unknown as Record<string, unknown>);
    set({ token, user, isAuthenticated: true });
  },

  logout: () => {
    removeToken();
    set({ token: null, user: null, isAuthenticated: false });
    if (typeof window !== "undefined") {
      window.location.href = "/login";
    }
  },

  hydrate: () => {
    const token = getToken();
    const user = getStoredUser() as AuthUser | null;
    if (token && user) {
      set({ token, user, isAuthenticated: true });
    }
  },
}));
