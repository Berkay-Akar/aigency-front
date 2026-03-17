"use client";

import { useState } from "react";
import { ToolSelector } from "@/components/features/studio/tool-selector";
import { UploadZone } from "@/components/features/studio/upload-zone";
import { PromptPanel } from "@/components/features/studio/prompt-panel";
import { ResultGrid } from "@/components/features/studio/result-grid";
import { CaptionBar } from "@/components/features/studio/caption-bar";
import { MobileToolSelector } from "@/components/features/studio/mobile-tool-selector";
import { cn } from "@/lib/utils";

type MobileTab = "create" | "results";

export default function StudioPage() {
  const [mobileTab, setMobileTab] = useState<MobileTab>("create");

  return (
    <div className="flex flex-col h-full">
      {/* Mobile tab switcher */}
      <div className="md:hidden flex items-center gap-1 px-4 pt-4 pb-2">
        {(["create", "results"] as MobileTab[]).map((tab) => (
          <button
            key={tab}
            onClick={() => setMobileTab(tab)}
            className={cn(
              "flex-1 py-2 rounded-xl text-sm font-medium transition-colors capitalize",
              mobileTab === tab
                ? "bg-indigo-600 text-white"
                : "bg-white/[0.05] text-white/40 hover:text-white/70"
            )}
          >
            {tab === "create" ? "Create" : "Results"}
          </button>
        ))}
      </div>

      {/* 3-panel layout */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left: Tool Selector — desktop only */}
        <div className="hidden md:flex">
          <ToolSelector />
        </div>

        {/* Center: Upload + Prompt */}
        <div
          className={cn(
            "flex-1 flex flex-col overflow-y-auto p-4 md:p-6 gap-5 md:border-r md:border-white/[0.06]",
            mobileTab === "results" ? "hidden md:flex" : "flex"
          )}
        >
          {/* Mobile: horizontal tool selector */}
          <div className="md:hidden">
            <MobileToolSelector />
          </div>

          <div className="hidden md:block">
            <h1 className="text-xl font-bold text-white mb-1">Studio</h1>
            <p className="text-sm text-white/30">
              Upload your product and let AI do the rest
            </p>
          </div>

          <UploadZone />
          <PromptPanel />
        </div>

        {/* Right: Results */}
        <div
          className={cn(
            "w-full md:w-[340px] flex-shrink-0 p-4 md:p-5 overflow-y-auto",
            mobileTab === "create" ? "hidden md:block" : "block"
          )}
        >
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-sm font-semibold text-white/60">Results</h2>
            <span className="text-xs text-white/20">4 variations</span>
          </div>
          <ResultGrid />
        </div>
      </div>

      {/* Bottom: Caption Bar */}
      <CaptionBar />
    </div>
  );
}
