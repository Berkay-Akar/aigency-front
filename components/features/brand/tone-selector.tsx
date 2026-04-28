"use client";

import {
  Briefcase,
  Diamond,
  Coffee,
  Zap,
  Layers,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";
import type { BrandKitTone } from "@/lib/api";

const TONES: {
  id: BrandKitTone;
  icon: React.ElementType;
  color: string;
  bg: string;
  border: string;
  activeBg: string;
  activeBorder: string;
}[] = [
  {
    id: "PROFESSIONAL",
    icon: Briefcase,
    color: "text-indigo-400",
    bg: "bg-indigo-500/10",
    border: "border-indigo-500/30",
    activeBg: "bg-indigo-500/15",
    activeBorder: "border-indigo-500/50",
  },
  {
    id: "LUXURY",
    icon: Diamond,
    color: "text-amber-400",
    bg: "bg-amber-500/10",
    border: "border-amber-500/30",
    activeBg: "bg-amber-500/15",
    activeBorder: "border-amber-500/50",
  },
  {
    id: "CASUAL",
    icon: Coffee,
    color: "text-emerald-400",
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/30",
    activeBg: "bg-emerald-500/15",
    activeBorder: "border-emerald-500/50",
  },
  {
    id: "BOLD",
    icon: Zap,
    color: "text-orange-400",
    bg: "bg-orange-500/10",
    border: "border-orange-500/30",
    activeBg: "bg-orange-500/15",
    activeBorder: "border-orange-500/50",
  },
  {
    id: "MINIMALIST",
    icon: Layers,
    color: "text-slate-400",
    bg: "bg-slate-500/10",
    border: "border-slate-500/30",
    activeBg: "bg-slate-500/15",
    activeBorder: "border-slate-500/50",
  },
  {
    id: "PLAYFUL",
    icon: Sparkles,
    color: "text-pink-400",
    bg: "bg-pink-500/10",
    border: "border-pink-500/30",
    activeBg: "bg-pink-500/15",
    activeBorder: "border-pink-500/50",
  },
];

interface ToneSelectorProps {
  value: BrandKitTone | null;
  onChange: (tone: BrandKitTone) => void;
}

export function ToneSelector({ value, onChange }: ToneSelectorProps) {
  const t = useTranslations("brandKit");
  return (
    <div className="p-6 rounded-3xl bg-card border border-border">
      <h3 className="text-sm font-semibold text-foreground mb-1">
        {t("toneTitle")}
      </h3>
      <p className="text-xs text-muted-foreground mb-5">{t("toneDesc")}</p>

      <div className="space-y-3">
        {TONES.map(({ id, icon: Icon, color, bg, activeBg, activeBorder }) => {
          const isActive = value === id;
          const label = t(`tone.${id}.label` as Parameters<typeof t>[0]);
          const desc = t(`tone.${id}.desc` as Parameters<typeof t>[0]);
          const example = t(`tone.${id}.example` as Parameters<typeof t>[0]);
          return (
            <button
              key={id}
              onClick={() => onChange(id)}
              className={cn(
                "w-full text-left p-4 rounded-2xl border transition-all duration-200",
                isActive
                  ? `${activeBg} ${activeBorder}`
                  : "border-border bg-card hover:bg-muted/40 hover:border-border/60",
              )}
            >
              <div className="flex items-start gap-3">
                <div
                  className={cn(
                    "w-9 h-9 rounded-xl flex items-center justify-center shrink-0",
                    isActive ? bg : "bg-white/5",
                  )}
                >
                  <Icon
                    className={cn(
                      "w-4 h-4",
                      isActive ? color : "text-muted-foreground/40",
                    )}
                  />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-0.5">
                    <span
                      className={cn(
                        "text-sm font-semibold",
                        isActive ? "text-foreground" : "text-foreground/50",
                      )}
                    >
                      {label}
                    </span>
                    {isActive && (
                      <span
                        className={cn(
                          "text-[10px] font-medium px-2 py-0.5 rounded-full",
                          bg,
                          color,
                        )}
                      >
                        Active
                      </span>
                    )}
                  </div>
                  <p
                    className={cn(
                      "text-xs mb-2",
                      isActive
                        ? "text-muted-foreground"
                        : "text-muted-foreground/50",
                    )}
                  >
                    {desc}
                  </p>
                  <p
                    className={cn(
                      "text-xs italic",
                      isActive
                        ? "text-foreground/60"
                        : "text-muted-foreground/40",
                    )}
                  >
                    &ldquo;{example}&rdquo;
                  </p>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
