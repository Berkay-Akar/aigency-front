"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { ImageIcon, Wand2, Film } from "lucide-react";
import { cn } from "@/lib/utils";
import { useStudioStore } from "@/store/studio-store";
import { FlowTabBar } from "./flow-tab-bar";
import type { AiGenerationMode } from "@/lib/api";

const FAST_TABS: {
  id: AiGenerationMode;
  navKey: "modeNavTti" | "modeNavIti" | "modeNavItv";
  icon: React.ComponentType<{ className?: string }>;
}[] = [
  { id: "text-to-image", navKey: "modeNavTti", icon: ImageIcon },
  { id: "image-to-image", navKey: "modeNavIti", icon: Wand2 },
  { id: "image-to-video", navKey: "modeNavItv", icon: Film },
];

export function StudioTopNav() {
  const t = useTranslations("productStudio");
  const tg = useTranslations("generation");
  const studioTab = useStudioStore((s) => s.studioTab);
  const setStudioTab = useStudioStore((s) => s.setStudioTab);
  const generationMode = useStudioStore((s) => s.generationMode);
  const setGenerationMode = useStudioStore((s) => s.setGenerationMode);

  const TABS = [
    { id: "creative" as const, label: t("navFast"), sub: t("navFastSub") },
    { id: "product" as const, label: t("navPro"), sub: t("navProSub") },
  ] as const;

  return (
    <div className="flex h-13 shrink-0 items-center justify-center gap-0 border-b border-white/[0.07] px-4 md:px-6">
      {/* FAST / PRO tabs */}
      <div className="relative flex items-center gap-1">
        {TABS.map((tab) => {
          const active = studioTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setStudioTab(tab.id)}
              className={cn(
                "relative flex items-baseline gap-1.5 rounded-xl px-3.5 py-2 transition-colors select-none",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/40",
              )}
            >
              {active && (
                <motion.div
                  layoutId="studio-nav-pill"
                  className="absolute inset-0 rounded-xl bg-white/[0.07]"
                  transition={{ type: "spring", bounce: 0.15, duration: 0.32 }}
                />
              )}
              <span
                className={cn(
                  "relative text-sm font-bold tracking-wide transition-colors",
                  active ? "text-white" : "text-white/35",
                )}
              >
                {tab.label}
              </span>
              <span
                className={cn(
                  "relative text-[11px] font-normal transition-colors",
                  active ? "text-white/50" : "text-white/20",
                )}
              >
                {tab.sub}
              </span>
            </button>
          );
        })}
      </div>

      {/* Separator */}
      <div className="mx-4 h-5 w-px shrink-0 bg-white/12" />

      {/* Flow tabs — product mode: PRO flows; creative mode: FAST generation modes */}
      {studioTab === "product" ? (
        <div className="min-w-0 overflow-hidden">
          <FlowTabBar compact />
        </div>
      ) : (
        <div className="flex gap-1 overflow-x-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
          {FAST_TABS.map(({ id, navKey, icon: Icon }) => (
            <button
              key={id}
              type="button"
              onClick={() => setGenerationMode(id)}
              className={cn(
                "relative flex shrink-0 items-center gap-2 rounded-xl px-3.5 py-1.5 transition-colors select-none",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/40",
                "text-xs font-semibold uppercase tracking-wider",
                generationMode === id
                  ? "text-indigo-200"
                  : "text-white/40 hover:text-white/65",
              )}
            >
              {generationMode === id && (
                <motion.div
                  layoutId="fast-mode-pill"
                  className="absolute inset-0 rounded-xl border border-indigo-500/30 bg-indigo-500/[0.14]"
                  transition={{ type: "spring", bounce: 0.18, duration: 0.38 }}
                />
              )}
              <Icon className="relative z-10 h-4 w-4 shrink-0" />
              <span className="relative z-10 whitespace-nowrap">{tg(navKey)}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
