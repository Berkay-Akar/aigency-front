"use client";

import { useStudioStore, type StudioTool } from "@/store/studio-store";
import { cn } from "@/lib/utils";

const TOOLS: { id: StudioTool; label: string }[] = [
  { id: "product-enhance", label: "Enhance" },
  { id: "fashion-model", label: "Model" },
  { id: "background-replace", label: "Background" },
  { id: "video", label: "Video" },
];

export function MobileToolSelector() {
  const { activeTool, setActiveTool } = useStudioStore();

  return (
    <div className="flex gap-2 overflow-x-auto pb-1">
      {TOOLS.map(({ id, label }) => (
        <button
          key={id}
          onClick={() => setActiveTool(id)}
          className={cn(
            "flex-shrink-0 px-3 py-1.5 rounded-xl text-xs font-medium transition-colors",
            activeTool === id
              ? "bg-indigo-600 text-white"
              : "bg-white/[0.06] text-white/40 hover:text-white/70"
          )}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
