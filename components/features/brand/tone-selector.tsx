"use client";

import { useState } from "react";
import { Briefcase, Diamond, Coffee } from "lucide-react";
import { cn } from "@/lib/utils";

const TONES = [
  {
    id: "professional",
    icon: Briefcase,
    label: "Professional",
    desc: "Clean, authoritative, trust-building",
    example: "Elevate your business with our premium solution.",
    color: "text-indigo-400",
    bg: "bg-indigo-500/10",
    border: "border-indigo-500/30",
    activeBg: "bg-indigo-500/15",
    activeBorder: "border-indigo-500/50",
  },
  {
    id: "luxury",
    icon: Diamond,
    label: "Luxury",
    desc: "Exclusive, refined, aspirational",
    example: "Crafted for those who demand nothing but the finest.",
    color: "text-amber-400",
    bg: "bg-amber-500/10",
    border: "border-amber-500/30",
    activeBg: "bg-amber-500/15",
    activeBorder: "border-amber-500/50",
  },
  {
    id: "casual",
    icon: Coffee,
    label: "Casual",
    desc: "Friendly, relatable, conversational",
    example: "Honestly, this is just what you've been looking for 🔥",
    color: "text-emerald-400",
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/30",
    activeBg: "bg-emerald-500/15",
    activeBorder: "border-emerald-500/50",
  },
];

export function ToneSelector() {
  const [active, setActive] = useState("professional");

  return (
    <div className="p-6 rounded-3xl bg-white/[0.02] border border-white/[0.06]">
      <h3 className="text-sm font-semibold text-white mb-1">Brand Tone</h3>
      <p className="text-xs text-white/30 mb-5">
        How should Aigencys write captions for your brand?
      </p>

      <div className="space-y-3">
        {TONES.map(({ id, icon: Icon, label, desc, example, color, bg, border, activeBg, activeBorder }) => {
          const isActive = active === id;
          return (
            <button
              key={id}
              onClick={() => setActive(id)}
              className={cn(
                "w-full text-left p-4 rounded-2xl border transition-all duration-200",
                isActive
                  ? `${activeBg} ${activeBorder}`
                  : "border-white/[0.06] bg-white/[0.01] hover:bg-white/[0.03] hover:border-white/[0.1]"
              )}
            >
              <div className="flex items-start gap-3">
                <div
                  className={cn(
                    "w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0",
                    isActive ? bg : "bg-white/[0.05]"
                  )}
                >
                  <Icon
                    className={cn(
                      "w-4 h-4",
                      isActive ? color : "text-white/30"
                    )}
                  />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-0.5">
                    <span
                      className={cn(
                        "text-sm font-semibold",
                        isActive ? "text-white" : "text-white/50"
                      )}
                    >
                      {label}
                    </span>
                    {isActive && (
                      <span
                        className={cn(
                          "text-[10px] font-medium px-2 py-0.5 rounded-full",
                          bg,
                          color
                        )}
                      >
                        Active
                      </span>
                    )}
                  </div>
                  <p
                    className={cn(
                      "text-xs mb-2",
                      isActive ? "text-white/40" : "text-white/20"
                    )}
                  >
                    {desc}
                  </p>
                  <p
                    className={cn(
                      "text-xs italic",
                      isActive ? "text-white/60" : "text-white/20"
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
