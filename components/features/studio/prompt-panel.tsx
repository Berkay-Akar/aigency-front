"use client";

import { Zap, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useStudioStore } from "@/store/studio-store";

const CREDIT_COST: Record<string, number> = {
  "product-enhance": 16,
  "fashion-model": 32,
  "background-replace": 12,
  video: 80,
};

export function PromptPanel() {
  const {
    activeTool,
    productName,
    brandName,
    prompt,
    isGenerating,
    progress,
    uploadedImage,
    setProductName,
    setBrandName,
    setPrompt,
    startGeneration,
  } = useStudioStore();

  const cost = CREDIT_COST[activeTool] ?? 16;
  const canGenerate = !!uploadedImage && !isGenerating;

  return (
    <div className="flex flex-col gap-4">
      {/* Fields */}
      <div className="space-y-3">
        <div>
          <label className="text-xs text-white/40 font-medium uppercase tracking-wider mb-1.5 block">
            Product name
          </label>
          <Input
            placeholder="e.g. Luxe Serum"
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
            className="bg-white/[0.04] border-white/[0.08] rounded-xl text-white placeholder:text-white/20 focus-visible:ring-indigo-500/40 focus-visible:border-indigo-500/40"
          />
        </div>
        <div>
          <label className="text-xs text-white/40 font-medium uppercase tracking-wider mb-1.5 block">
            Brand
          </label>
          <Input
            placeholder="e.g. Bloom Beauty"
            value={brandName}
            onChange={(e) => setBrandName(e.target.value)}
            className="bg-white/[0.04] border-white/[0.08] rounded-xl text-white placeholder:text-white/20 focus-visible:ring-indigo-500/40 focus-visible:border-indigo-500/40"
          />
        </div>
        <div>
          <label className="text-xs text-white/40 font-medium uppercase tracking-wider mb-1.5 block">
            Style prompt{" "}
            <span className="text-white/20 normal-case">(optional)</span>
          </label>
          <Textarea
            placeholder="e.g. Minimal studio, marble surface, warm morning light…"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            rows={3}
            className="bg-white/[0.04] border-white/[0.08] rounded-xl text-white placeholder:text-white/20 resize-none focus-visible:ring-indigo-500/40 focus-visible:border-indigo-500/40"
          />
        </div>
      </div>

      {/* Progress bar when generating */}
      {isGenerating && (
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-white/40">Generating variations…</span>
            <span className="text-indigo-400 font-medium">
              {Math.round(progress)}%
            </span>
          </div>
          <Progress
            value={progress}
            className="h-1.5 bg-white/[0.06] [&>div]:bg-indigo-500"
          />
        </div>
      )}

      {/* Generate button */}
      <Button
        disabled={!canGenerate}
        onClick={startGeneration}
        className="w-full h-12 rounded-2xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white font-semibold text-base shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/30 transition-all"
      >
        {isGenerating ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Generating…
          </>
        ) : (
          <>
            <Zap className="w-4 h-4 mr-2" />
            Generate — {cost} credits
          </>
        )}
      </Button>

      {!uploadedImage && !isGenerating && (
        <p className="text-center text-xs text-white/20">
          Upload a product photo to get started
        </p>
      )}
    </div>
  );
}
