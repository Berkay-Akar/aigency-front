import { ToolSelector } from "@/components/features/studio/tool-selector";
import { UploadZone } from "@/components/features/studio/upload-zone";
import { PromptPanel } from "@/components/features/studio/prompt-panel";
import { ResultGrid } from "@/components/features/studio/result-grid";
import { CaptionBar } from "@/components/features/studio/caption-bar";

export default function StudioPage() {
  return (
    <div className="flex flex-col h-full">
      <div className="flex flex-1 overflow-hidden">
        {/* Left: Tool Selector */}
        <ToolSelector />

        {/* Center: Upload + Prompt */}
        <div className="flex-1 flex flex-col overflow-y-auto p-6 gap-5 border-r border-white/[0.06]">
          <div>
            <h1 className="text-xl font-bold text-white mb-1">Studio</h1>
            <p className="text-sm text-white/30">
              Upload your product and let AI do the rest
            </p>
          </div>

          <UploadZone />
          <PromptPanel />
        </div>

        {/* Right: Results */}
        <div className="w-[340px] flex-shrink-0 p-5 overflow-y-auto">
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
