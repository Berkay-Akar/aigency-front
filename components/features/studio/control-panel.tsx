"use client";

import { useTranslations } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, SlidersHorizontal } from "lucide-react";
import { QuickModeForm } from "./quick-mode-form";
import { CustomizeModeForm } from "./customize-mode-form";
import { UpscaleForm } from "./flows/upscale-form";
import { useStudioStore } from "@/store/studio-store";
import { cn } from "@/lib/utils";

export function ControlPanel({ className }: { className?: string }) {
  const t = useTranslations("studio");
  const uiMode = useStudioStore((s) => s.uiMode);
  const setUiMode = useStudioStore((s) => s.setUiMode);
  const generationMode = useStudioStore((s) => s.generationMode);

  return (
    <div
      className={cn(
        "flex h-full min-h-0 flex-col rounded-3xl border border-border dark:bg-[rgb(8_8_10/0.78)] bg-card/80 p-4 shadow-sm backdrop-blur-xl md:p-5",
        className,
      )}
    >
      <div className="mb-5 shrink-0 space-y-1">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-indigo-500/15">
            <Sparkles className="h-4 w-4 text-indigo-400" aria-hidden />
          </div>
          <div>
            <h1 className="text-base font-semibold tracking-tight text-foreground">
              {t("title")}
            </h1>
            <p className="text-[11px] text-muted-foreground">{t("subtitle")}</p>
          </div>
        </div>
      </div>

      {generationMode !== "upscale" &&
        generationMode !== "seedream-model-dressing" &&
        generationMode !== "seedream-product-scene" && (
          <div
            className="mb-5 flex shrink-0 rounded-2xl border border-border bg-foreground/5 p-1 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] backdrop-blur-sm"
            role="tablist"
            aria-label={t("title")}
          >
            <button
              type="button"
              role="tab"
              aria-selected={uiMode === "quick"}
              onClick={() => setUiMode("quick")}
              className={cn(
                "relative flex flex-1 items-center justify-center gap-1.5 rounded-xl py-2.5 text-xs font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/40",
                uiMode === "quick"
                  ? "text-foreground"
                  : "text-foreground/40 hover:text-foreground/65",
              )}
            >
              {uiMode === "quick" ? (
                <motion.span
                  layoutId="studioModePill"
                  className="absolute inset-0 rounded-xl bg-linear-to-r from-indigo-500/35 to-violet-600/25 shadow-inner"
                  transition={{ type: "spring", stiffness: 380, damping: 32 }}
                />
              ) : null}
              <span className="relative z-10">{t("quick")}</span>
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={uiMode === "customize"}
              onClick={() => setUiMode("customize")}
              className={cn(
                "relative flex flex-1 items-center justify-center gap-1.5 rounded-xl py-2.5 text-xs font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/40",
                uiMode === "customize"
                  ? "text-foreground"
                  : "text-foreground/40 hover:text-foreground/65",
              )}
            >
              {uiMode === "customize" ? (
                <motion.span
                  layoutId="studioModePill"
                  className="absolute inset-0 rounded-xl bg-linear-to-r from-indigo-500/35 to-violet-600/25 shadow-inner"
                  transition={{ type: "spring", stiffness: 380, damping: 32 }}
                />
              ) : null}
              <SlidersHorizontal
                className="relative z-10 h-3.5 w-3.5 opacity-80"
                aria-hidden
              />
              <span className="relative z-10">{t("customize")}</span>
            </button>
          </div>
        )}

      <div className="min-h-0 flex-1 overflow-y-auto pr-1 [-ms-overflow-style:none] [scrollbar-width:thin]">
        <AnimatePresence mode="wait">
          {generationMode === "upscale" ? (
            <UpscaleForm key="upscale" />
          ) : uiMode === "quick" ? (
            <QuickModeForm key="quick" />
          ) : (
            <CustomizeModeForm key="customize" />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
