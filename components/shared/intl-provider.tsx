"use client";

import { useEffect } from "react";
import { NextIntlClientProvider } from "next-intl";
import { useAppStore } from "@/store/app-store";
import { getMessages } from "@/lib/i18n";

export function IntlProvider({ children }: { children: React.ReactNode }) {
  const locale = useAppStore((s) => s.locale);
  const messages = getMessages(locale);

  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  return (
    <NextIntlClientProvider locale={locale} messages={messages} timeZone="UTC">
      {children}
    </NextIntlClientProvider>
  );
}
