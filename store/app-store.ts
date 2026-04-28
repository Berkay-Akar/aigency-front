import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { AppLocale } from "@/lib/i18n";
import { defaultLocale, isAppLocale } from "@/lib/i18n";

interface AppState {
  credits: number;
  workspace: string;
  sidebarCollapsed: boolean;
  locale: AppLocale;
  useBrandKit: boolean;
  theme: "dark" | "light";
  setCredits: (credits: number) => void;
  setWorkspace: (workspace: string) => void;
  toggleSidebar: () => void;
  setLocale: (locale: AppLocale) => void;
  setUseBrandKit: (v: boolean) => void;
  setTheme: (theme: "dark" | "light") => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      credits: 2450,
      workspace: "My Brand",
      sidebarCollapsed: false,
      locale: defaultLocale,
      useBrandKit: false,
      theme:
        typeof window !== "undefined" &&
        window.matchMedia("(prefers-color-scheme: light)").matches
          ? "light"
          : "dark",
      setCredits: (credits) => set({ credits }),
      setWorkspace: (workspace) => set({ workspace }),
      toggleSidebar: () =>
        set((s) => ({ sidebarCollapsed: !s.sidebarCollapsed })),
      setLocale: (locale) => set({ locale }),
      setUseBrandKit: (useBrandKit) => set({ useBrandKit }),
      setTheme: (theme) => set({ theme }),
    }),
    {
      name: "aigencys-app",
      storage: createJSONStorage(() => localStorage),
      partialize: (s) => ({
        locale: s.locale,
        useBrandKit: s.useBrandKit,
        theme: s.theme,
      }),
      merge: (persisted, current) => {
        const p = persisted as Partial<AppState> | undefined;
        const loc =
          p?.locale && isAppLocale(p.locale) ? p.locale : current.locale;
        return { ...current, ...p, locale: loc };
      },
    },
  ),
);
