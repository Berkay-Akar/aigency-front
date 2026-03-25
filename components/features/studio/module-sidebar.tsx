"use client";

import { useState } from "react";
import {
  Sparkles,
  Layers,
  Video,
  ChevronDown,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useStudioStore, type StudioStep } from "@/store/studio-store";

type SubModule = { id: string; label: string };

const SIDEBAR_STEPS: {
  id: StudioStep;
  label: string;
  icon: React.ElementType;
  color: string;
  subModules: SubModule[];
}[] = [
  {
    id: "professionalize",
    label: "Professionalize",
    icon: Sparkles,
    color: "text-violet-400",
    subModules: [
      { id: "packshot", label: "Packshot" },
      { id: "beauty", label: "Beauty Shot" },
      { id: "fashion", label: "Fashion Shot" },
      { id: "pdp", label: "E-Commerce PDP" },
      { id: "catalog", label: "Catalog Cover" },
      { id: "social", label: "Social Media Post" },
    ],
  },
  {
    id: "campaign",
    label: "Campaign Variants",
    icon: Layers,
    color: "text-sky-400",
    subModules: [
      { id: "lighting", label: "Lighting Variants" },
      { id: "background", label: "Background Variants" },
      { id: "angle", label: "Angle Variants" },
      { id: "scenario", label: "Usage Scenario" },
      { id: "platform", label: "Platform Ratios" },
      { id: "style", label: "Style Variants" },
    ],
  },
  {
    id: "video",
    label: "Video for Ads",
    icon: Video,
    color: "text-rose-400",
    subModules: [
      { id: "push-in", label: "Push-in / Zoom" },
      { id: "orbit", label: "Orbit / Rotate" },
      { id: "parallax", label: "Parallax" },
      { id: "spotlight", label: "Spotlight" },
      { id: "pan", label: "Pan / Slide" },
      { id: "text-ad", label: "Text Overlay Ad" },
    ],
  },
];

export function ModuleSidebar() {
  const { activeStep, setActiveStep } = useStudioStore();
  const [expanded, setExpanded] = useState<StudioStep>(activeStep);

  const handleStepClick = (stepId: StudioStep) => {
    setActiveStep(stepId);
    setExpanded((prev) => (prev === stepId ? prev : stepId));
  };

  return (
    <aside className="flex flex-col gap-1 w-full">
      <p className="text-[10px] uppercase tracking-widest text-white/20 font-semibold px-2 mb-2">
        Pipeline
      </p>
      {SIDEBAR_STEPS.map((step, index) => {
        const isActive = activeStep === step.id;
        const isOpen = expanded === step.id;
        const Icon = step.icon;

        return (
          <div key={step.id} className="flex flex-col">
            <button
              onClick={() => handleStepClick(step.id)}
              className={cn(
                "flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 w-full text-left group",
                isActive
                  ? "bg-white/8 text-white"
                  : "text-white/50 hover:text-white/80 hover:bg-white/4"
              )}
            >
              <span
                className={cn(
                  "w-6 h-6 rounded-lg flex items-center justify-center shrink-0 text-[11px] font-bold",
                  isActive ? "bg-white/15" : "bg-white/5"
                )}
              >
                <span className={cn("text-[10px] font-bold", step.color)}>{index + 1}</span>
              </span>
              <span className="flex-1 truncate">{step.label}</span>
              {isOpen ? (
                <ChevronDown className="w-3.5 h-3.5 text-white/30 shrink-0" />
              ) : (
                <ChevronRight className="w-3.5 h-3.5 text-white/20 shrink-0" />
              )}
            </button>

            {isOpen && (
              <div className="ml-3 mt-0.5 mb-1 flex flex-col gap-0.5 border-l border-white/5 pl-3">
                {step.subModules.map((mod) => (
                  <button
                    key={mod.id}
                    onClick={() => {
                      handleStepClick(step.id);
                    }}
                    className="text-xs text-white/40 hover:text-white/70 py-1 text-left transition-colors px-1 rounded"
                  >
                    {mod.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        );
      })}

      <div className="mt-4 pt-4 border-t border-white/5">
        <p className="text-[10px] uppercase tracking-widest text-white/20 font-semibold px-2 mb-2">
          Formats
        </p>
        {["Instagram", "TikTok", "Meta Ads", "Google Display"].map((fmt) => (
          <button
            key={fmt}
            className="w-full text-left text-xs text-white/35 hover:text-white/60 px-3 py-1.5 rounded-lg transition-colors"
          >
            {fmt}
          </button>
        ))}
      </div>
    </aside>
  );
}
