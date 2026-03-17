"use client";

import { Sparkles, User, ImageOff, Film } from "lucide-react";
import { cn } from "@/lib/utils";
import { useStudioStore, type StudioTool } from "@/store/studio-store";

const TOOLS: { id: StudioTool; icon: React.ElementType; label: string; desc: string; credits: number }[] = [
  {
    id: "product-enhance",
    icon: Sparkles,
    label: "Product Enhance",
    desc: "AI-enhance any product photo",
    credits: 4,
  },
  {
    id: "fashion-model",
    icon: User,
    label: "Fashion Model",
    desc: "Place product on a model",
    credits: 8,
  },
  {
    id: "background-replace",
    icon: ImageOff,
    label: "BG Replace",
    desc: "Swap any background",
    credits: 3,
  },
  {
    id: "video",
    icon: Film,
    label: "Video",
    desc: "Animate your product",
    credits: 20,
  },
];

export function ToolSelector() {
  const { activeTool, setActiveTool } = useStudioStore();

  return (
    <div className="w-[200px] flex-shrink-0 border-r border-white/[0.06] bg-[#0c0c0c] flex flex-col overflow-y-auto">
      <div className="p-4 border-b border-white/[0.06]">
        <p className="text-xs font-semibold text-white/30 uppercase tracking-widest">
          Tools
        </p>
      </div>

      <div className="p-3 space-y-1.5">
        {TOOLS.map(({ id, icon: Icon, label, desc, credits }) => {
          const active = activeTool === id;
          return (
            <button
              key={id}
              onClick={() => setActiveTool(id)}
              className={cn(
                "w-full text-left p-3 rounded-2xl transition-all duration-150 group",
                active
                  ? "bg-indigo-500/15 border border-indigo-500/25"
                  : "border border-transparent hover:bg-white/[0.04]"
              )}
            >
              <div className="flex items-center gap-2.5 mb-1.5">
                <div
                  className={cn(
                    "w-7 h-7 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors",
                    active
                      ? "bg-indigo-500/20"
                      : "bg-white/[0.05] group-hover:bg-white/[0.08]"
                  )}
                >
                  <Icon
                    className={cn(
                      "w-3.5 h-3.5",
                      active ? "text-indigo-400" : "text-white/40"
                    )}
                  />
                </div>
                <span
                  className={cn(
                    "text-sm font-medium",
                    active ? "text-white" : "text-white/50"
                  )}
                >
                  {label}
                </span>
              </div>
              <p
                className={cn(
                  "text-xs pl-9 leading-relaxed",
                  active ? "text-white/40" : "text-white/20"
                )}
              >
                {desc}
              </p>
              <div className="pl-9 mt-1.5">
                <span
                  className={cn(
                    "text-[10px] font-medium",
                    active ? "text-indigo-400/70" : "text-white/20"
                  )}
                >
                  {credits} credits each
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
