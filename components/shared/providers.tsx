"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import { Toaster } from "@/components/ui/sonner";
import { AuthInitializer } from "@/components/shared/auth-initializer";
import { IntlProvider } from "@/components/shared/intl-provider";
import { ThemeApplier } from "@/components/shared/theme-applier";
import { useAppStore } from "@/store/app-store";

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000,
            retry: 1,
          },
        },
      }),
  );

  const theme = useAppStore((s) => s.theme);

  return (
    <QueryClientProvider client={queryClient}>
      <IntlProvider>
        <ThemeApplier />
        <AuthInitializer />
        {children}
        <Toaster position="bottom-right" theme={theme} />
      </IntlProvider>
    </QueryClientProvider>
  );
}
