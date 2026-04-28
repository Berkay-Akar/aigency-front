"use client";

import { useEffect } from "react";
import { useAppStore } from "@/store/app-store";

/**
 * Applies the user's saved theme (dark/light) to <html> on mount and
 * whenever it changes. Works in tandem with the anti-FOUC inline script
 * in layout.tsx that sets the class before React hydrates.
 */
export function ThemeApplier() {
  const theme = useAppStore((s) => s.theme);

  useEffect(() => {
    const html = document.documentElement;
    if (theme === "light") {
      html.classList.remove("dark");
      html.classList.add("light");
    } else {
      html.classList.remove("light");
      html.classList.add("dark");
    }
  }, [theme]);

  return null;
}
