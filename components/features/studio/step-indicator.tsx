"use client";

import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { useStudioStore, type StudioStep } from "@/store/studio-store";

const STEPS: { id: StudioStep; label: string; description: string }[] = [
  { id: "professionalize", label: "Professionalize", description: "Studio-quality image" },
  { id: "campaign", label: "Campaign Variants", description: "Multi-format creatives" },
  { id: "video", label: "Video for Ads", description: "Animated ad content" },
];

export function StepIndicator() {
  const { activeStep, setActiveStep, stepResults } = useStudioStore();

  const activeIndex = STEPS.findIndex((s) => s.id === activeStep);

  return (
    <div className="flex items-center gap-0 w-full">
      {STEPS.map((step, index) => {
        const isCompleted = index < activeIndex || Boolean(stepResults[index + 1]?.length);
        const isActive = step.id === activeStep;
        const isLocked = index > 0 && !stepResults[index] && index > activeIndex;

        return (
          <div key={step.id} className="flex items-center flex-1">
            <button
              onClick={() => !isLocked && setActiveStep(step.id)}
              disabled={isLocked}
              className={cn(
                "flex items-center gap-3 flex-1 px-4 py-3 rounded-xl transition-all duration-200 group",
                isActive && "bg-white/5 border border-white/10",
                !isActive && !isLocked && "hover:bg-white/3 cursor-pointer",
                isLocked && "opacity-40 cursor-not-allowed"
              )}
            >
              <div
                className={cn(
                  "w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold shrink-0 transition-all",
                  isCompleted && !isActive && "bg-emerald-500 text-white",
                  isActive && "bg-white text-black",
                  !isActive && !isCompleted && "bg-white/10 text-white/50"
                )}
              >
                {isCompleted && !isActive ? <Check className="w-3.5 h-3.5" /> : index + 1}
              </div>
              <div className="text-left hidden sm:block">
                <p
                  className={cn(
                    "text-sm font-medium leading-none",
                    isActive ? "text-white" : "text-white/50"
                  )}
                >
                  {step.label}
                </p>
                <p className="text-xs text-white/30 mt-0.5">{step.description}</p>
              </div>
            </button>

            {index < STEPS.length - 1 && (
              <div
                className={cn(
                  "h-px w-6 shrink-0 mx-1 transition-colors",
                  index < activeIndex ? "bg-emerald-500/50" : "bg-white/10"
                )}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
