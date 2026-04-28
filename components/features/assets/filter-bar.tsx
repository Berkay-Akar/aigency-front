"use client";

import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";

interface FilterBarProps {
  activeType: string;
  setActiveType: (type: string) => void;
  activePlatform: string;
  setActivePlatform: (platform: string) => void;
}

export function FilterBar({
  activeType,
  setActiveType,
  activePlatform,
  setActivePlatform,
}: FilterBarProps) {
  const t = useTranslations("filterBar");

  const TYPES = [
    { key: "all", label: t("all") },
    { key: "images", label: t("images") },
    { key: "videos", label: t("videos") },
  ];

  const PLATFORMS = [
    { key: "all", label: t("allPlatforms") },
    { key: "instagram", label: t("instagram") },
    { key: "tiktok", label: t("tiktok") },
    { key: "facebook", label: t("facebook") },
  ];

  return (
    <div className="flex items-center gap-4">
      {/* Type filter */}
      <div className="flex items-center gap-1 p-1 rounded-xl bg-white/[0.04] border border-white/[0.07]">
        {TYPES.map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setActiveType(key)}
            className={cn(
              "px-3 py-1.5 rounded-lg text-xs font-medium transition-all",
              activeType === key
                ? "bg-white/10 text-foreground"
                : "text-muted-foreground hover:text-foreground/70",
            )}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Platform filter */}
      <div className="flex items-center gap-1.5">
        {PLATFORMS.map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setActivePlatform(key)}
            className={cn(
              "px-3 py-1.5 rounded-xl border text-xs font-medium transition-all",
              activePlatform === key
                ? "bg-indigo-500/15 border-indigo-500/30 text-indigo-300"
                : "border-white/[0.07] bg-transparent text-muted-foreground hover:text-foreground/70 hover:border-white/[0.12]",
            )}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}
