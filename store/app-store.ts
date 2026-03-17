import { create } from "zustand";

interface AppState {
  credits: number;
  workspace: string;
  sidebarCollapsed: boolean;
  setCredits: (credits: number) => void;
  setWorkspace: (workspace: string) => void;
  toggleSidebar: () => void;
}

export const useAppStore = create<AppState>((set) => ({
  credits: 2450,
  workspace: "My Brand",
  sidebarCollapsed: false,
  setCredits: (credits) => set({ credits }),
  setWorkspace: (workspace) => set({ workspace }),
  toggleSidebar: () => set((s) => ({ sidebarCollapsed: !s.sidebarCollapsed })),
}));
