import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { AppLocale } from "@/lib/i18n";
import { defaultLocale, isAppLocale } from "@/lib/i18n";

interface AppState {
  credits: number;
  workspace: string;
  sidebarCollapsed: boolean;
  locale: AppLocale;
  setCredits: (credits: number) => void;
  setWorkspace: (workspace: string) => void;
  toggleSidebar: () => void;
  setLocale: (locale: AppLocale) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      credits: 2450,
      workspace: "My Brand",
      sidebarCollapsed: false,
      locale: defaultLocale,
      setCredits: (credits) => set({ credits }),
      setWorkspace: (workspace) => set({ workspace }),
      toggleSidebar: () => set((s) => ({ sidebarCollapsed: !s.sidebarCollapsed })),
      setLocale: (locale) => set({ locale }),
    }),
    {
      name: "aigencys-app",
      storage: createJSONStorage(() => localStorage),
      partialize: (s) => ({ locale: s.locale }),
      merge: (persisted, current) => {
        const p = persisted as Partial<AppState> | undefined;
        const loc = p?.locale && isAppLocale(p.locale) ? p.locale : current.locale;
        return { ...current, ...p, locale: loc };
      },
    }
  )
);
