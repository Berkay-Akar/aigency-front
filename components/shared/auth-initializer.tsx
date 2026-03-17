"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/store/auth-store";

/**
 * Hydrates auth state from localStorage on initial mount.
 * Rendered once at the root — no UI output.
 */
export function AuthInitializer() {
  const hydrate = useAuthStore((s) => s.hydrate);
  useEffect(() => {
    hydrate();
  }, [hydrate]);
  return null;
}
