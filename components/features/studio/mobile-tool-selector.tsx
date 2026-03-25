"use client";

import { useStudioStore, type StudioStep } from "@/store/studio-store";
import { cn } from "@/lib/utils";

const STEPS: { id: StudioStep; label: string; color: string; activeColor: string }[] = [
  { id: "professionalize", label: "Professionalize", color: "bg-white/[0.06]", activeColor: "bg-violet-600 text-white" },
  { id: "campaign", label: "Campaign", color: "bg-white/[0.06]", activeColor: "bg-sky-600 text-white" },
  { id: "video", label: "Video Ads", color: "bg-white/[0.06]", activeColor: "bg-rose-600 text-white" },
];

export function MobileToolSelector() {
  const { activeStep, setActiveStep } = useStudioStore();

  return (
    <div className="flex gap-2 overflow-x-auto pb-1">
      {STEPS.map(({ id, label, activeColor, color }) => (
        <button
          key={id}
          onClick={() => setActiveStep(id)}
          className={cn(
            "shrink-0 px-4 py-1.5 rounded-xl text-xs font-medium transition-colors",
            activeStep === id ? activeColor : `${color} text-white/40 hover:text-white/70`
          )}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
