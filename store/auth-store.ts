import { create } from "zustand";
import {
  setToken,
  removeToken,
  getToken,
  setStoredUser,
  getStoredUser,
  setRefreshToken,
  removeRefreshToken,
  setActiveBrandId,
  getActiveBrandId,
  clearBrandSessions,
  addOrUpdateBrandSession,
} from "@/lib/auth";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  workspaceId?: string;
}

interface AuthState {
  user: AuthUser | null;
  token: string | null;
  activeWorkspaceId: string | null;
  isAuthenticated: boolean;
  login: (token: string, user: AuthUser, refreshToken?: string) => void;
  addAccountLogin: (
    token: string,
    user: AuthUser,
    refreshToken?: string,
  ) => void;
  logout: () => void;
  hydrate: () => void;
  switchBrand: (workspaceId: string) => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  activeWorkspaceId: null,
  isAuthenticated: false,

  login: (token, user, refreshToken) => {
    const wsId = user.workspaceId ?? user.id;
    setToken(token);
    if (refreshToken) {
      setRefreshToken(refreshToken);
    } else {
      removeRefreshToken();
    }
    setStoredUser(user as unknown as Record<string, unknown>);
    addOrUpdateBrandSession({
      workspaceId: wsId,
      name: user.name,
      token,
      refreshToken,
    });
    setActiveBrandId(wsId);
    set({ token, user, isAuthenticated: true, activeWorkspaceId: wsId });
  },

  addAccountLogin: (token, user, refreshToken) => {
    const wsId = user.workspaceId ?? user.id;
    addOrUpdateBrandSession({
      workspaceId: wsId,
      name: user.name,
      token,
      refreshToken,
    });
    setActiveBrandId(wsId);
    setToken(token);
    if (refreshToken) setRefreshToken(refreshToken);
    setStoredUser(user as unknown as Record<string, unknown>);
    set({ token, user, isAuthenticated: true, activeWorkspaceId: wsId });
  },

  logout: () => {
    removeToken(); // also clears brand-sessions + active-workspace-id
    set({
      token: null,
      user: null,
      activeWorkspaceId: null,
      isAuthenticated: false,
    });
    if (typeof window !== "undefined") {
      window.location.href = "/login";
    }
  },

  hydrate: () => {
    const token = getToken();
    const user = getStoredUser() as AuthUser | null;
    if (token && user) {
      set({
        token,
        user,
        isAuthenticated: true,
        activeWorkspaceId: getActiveBrandId(),
      });
    }
  },

  switchBrand: async (workspaceId: string) => {
    setActiveBrandId(workspaceId);
    set({ activeWorkspaceId: workspaceId });
  },
}));
