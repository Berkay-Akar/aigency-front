"use client";

import { useTranslations } from "next-intl";
import { Languages } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAppStore } from "@/store/app-store";
import type { AppLocale } from "@/lib/i18n";

export function LanguageSwitcher() {
  const t = useTranslations("settings");
  const locale = useAppStore((s) => s.locale);
  const setLocale = useAppStore((s) => s.setLocale);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className="flex h-8 w-8 items-center justify-center rounded-xl text-white/35 outline-none transition-colors hover:bg-white/[0.06] hover:text-white/70 focus-visible:ring-2 focus-visible:ring-indigo-500/40 md:h-9 md:w-9"
        aria-label={t("language")}
      >
        <Languages className="h-4 w-4" aria-hidden />
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="min-w-[140px] rounded-xl border-white/[0.08] bg-[#111] text-white"
      >
        <DropdownMenuItem
          className="rounded-lg text-sm focus:bg-white/[0.08]"
          onClick={() => setLocale("en" as AppLocale)}
        >
          <span className={locale === "en" ? "font-semibold text-indigo-300" : ""}>
            {t("english")}
          </span>
        </DropdownMenuItem>
        <DropdownMenuItem
          className="rounded-lg text-sm focus:bg-white/[0.08]"
          onClick={() => setLocale("tr" as AppLocale)}
        >
          <span className={locale === "tr" ? "font-semibold text-indigo-300" : ""}>
            {t("turkish")}
          </span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
