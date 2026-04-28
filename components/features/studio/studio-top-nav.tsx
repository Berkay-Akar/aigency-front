"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import {
  ImageIcon,
  Wand2,
  Film,
  Shirt,
  Package,
  ArrowUpFromLine,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useStudioStore } from "@/store/studio-store";
import { FlowTabBar } from "./flow-tab-bar";
import type { AiGenerationMode } from "@/lib/api";

const FAST_TABS: {
  id: AiGenerationMode;
  navKey:
    | "modeNavTti"
    | "modeNavIti"
    | "modeNavItv"
    | "modeNavSeedreamModel"
    | "modeNavSeedreamScene"
    | "modeNavUpscale";
  icon: React.ComponentType<{ className?: string }>;
}[] = [
  { id: "text-to-image", navKey: "modeNavTti", icon: ImageIcon },
  { id: "image-to-image", navKey: "modeNavIti", icon: Wand2 },
  { id: "image-to-video", navKey: "modeNavItv", icon: Film },
  {
    id: "seedream-model-dressing",
    navKey: "modeNavSeedreamModel",
    icon: Shirt,
  },
  {
    id: "seedream-product-scene",
    navKey: "modeNavSeedreamScene",
    icon: Package,
  },
  { id: "upscale", navKey: "modeNavUpscale", icon: ArrowUpFromLine },
];

export function StudioTopNav() {
  const t = useTranslations("productStudio");
  const tg = useTranslations("generation");
  const studioTab = useStudioStore((s) => s.studioTab);
  const setStudioTab = useStudioStore((s) => s.setStudioTab);
  const generationMode = useStudioStore((s) => s.generationMode);
  const setGenerationMode = useStudioStore((s) => s.setGenerationMode);
  const setActiveProductFlow = useStudioStore((s) => s.setActiveProductFlow);

  const TABS = [
    { id: "creative" as const, label: t("navFast"), sub: t("navFastSub") },
    { id: "product" as const, label: t("navPro"), sub: t("navProSub") },
  ] as const;

  return (
    <div className="flex h-14 shrink-0 items-center border-b border-border">
      {/* Left section — fixed width matching control-panel column (padding + panel + gap) */}
      <div className="flex shrink-0 items-center gap-1 px-4 md:px-5 lg:w-[400px] xl:w-[440px]">
        {TABS.map((tab) => {
          const active = studioTab === tab.id;
          const isFast = tab.id === "creative";
          const pillClass = isFast
            ? "bg-indigo-500/15 border border-indigo-500/40 dark:bg-indigo-500/[0.18]"
            : "bg-violet-500/15 border border-violet-500/40 dark:bg-violet-500/[0.18]";
          const activeLabelClass = isFast
            ? "text-indigo-600 dark:text-indigo-300"
            : "text-violet-600 dark:text-violet-300";
          const activeSubClass = isFast
            ? "text-indigo-500/75 dark:text-indigo-400/65"
            : "text-violet-500/75 dark:text-violet-400/65";
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setStudioTab(tab.id)}
              className={cn(
                "relative flex items-baseline gap-2 rounded-xl px-4 py-2.5 transition-colors select-none",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/40",
              )}
            >
              {active && (
                <motion.div
                  layoutId="studio-nav-pill"
                  className={cn("absolute inset-0 rounded-xl", pillClass)}
                  transition={{ type: "spring", bounce: 0.15, duration: 0.32 }}
                />
              )}
              <span
                className={cn(
                  "relative text-sm font-bold tracking-widest transition-colors",
                  active
                    ? activeLabelClass
                    : "text-foreground/40 hover:text-foreground/60",
                )}
              >
                {tab.label}
              </span>
              <span
                className={cn(
                  "relative text-[11px] font-normal transition-colors",
                  active ? activeSubClass : "text-foreground/22",
                )}
              >
                {tab.sub}
              </span>
            </button>
          );
        })}
      </div>

      {/* Separator — only below lg (desktop uses section border instead) */}
      <div className="mx-2 h-5 w-px shrink-0 bg-foreground/15 lg:hidden" />

      {/* Right section — mode tabs aligned over the preview column */}
      <div className="flex flex-1 min-w-0 items-center gap-1 overflow-x-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden pl-4 pr-4 lg:pl-5 lg:border-l lg:border-border/30">
        {studioTab === "product" ? (
          <FlowTabBar compact />
        ) : (
          <>
            {FAST_TABS.map(({ id, navKey, icon: Icon }) => (
              <button
                key={id}
                type="button"
                onClick={() => {
                  setGenerationMode(id);
                  if (id === "upscale") setActiveProductFlow("upscale");
                }}
                className={cn(
                  "relative flex shrink-0 items-center gap-2 rounded-xl px-4 py-2 transition-colors select-none",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/40",
                  "text-xs font-semibold uppercase tracking-wider",
                  generationMode === id
                    ? "text-indigo-500 dark:text-indigo-200"
                    : "text-foreground/45 hover:text-foreground/70",
                )}
              >
                {generationMode === id && (
                  <motion.div
                    layoutId="fast-mode-pill"
                    className="absolute inset-0 rounded-xl border border-indigo-500/30 bg-indigo-500/[0.14]"
                    transition={{
                      type: "spring",
                      bounce: 0.18,
                      duration: 0.38,
                    }}
                  />
                )}
                <Icon className="relative z-10 h-4 w-4 shrink-0" />
                <span className="relative z-10 whitespace-nowrap">
                  {tg(navKey)}
                </span>
              </button>
            ))}
          </>
        )}
      </div>
    </div>
  );
}
