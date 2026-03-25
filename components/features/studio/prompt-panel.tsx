"use client";

import { Zap, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useStudioStore } from "@/store/studio-store";
import { useJobPolling } from "@/hooks/use-job-polling";
import { Step1Config } from "./step1-config";
import { Step2Config } from "./step2-config";
import { Step3Config } from "./step3-config";

const JOB_STATUS_LABELS: Record<string, string> = {
  queued: "Queued — waiting to start…",
  processing: "AI is generating…",
  completed: "Done!",
  failed: "Generation failed",
};

const STEP_COLORS = {
  professionalize: "bg-violet-600 hover:bg-violet-500 shadow-violet-500/20 hover:shadow-violet-500/30",
  campaign: "bg-sky-600 hover:bg-sky-500 shadow-sky-500/20 hover:shadow-sky-500/30",
  video: "bg-rose-600 hover:bg-rose-500 shadow-rose-500/20 hover:shadow-rose-500/30",
};

function useCreditCost() {
  const { activeStep, outputTypes, variantCount } = useStudioStore();
  if (activeStep === "professionalize") return outputTypes.length * 8;
  if (activeStep === "campaign") return variantCount * 6;
  return 20;
}

export function PromptPanel() {
  useJobPolling();

  const {
    activeStep,
    productName,
    brandName,
    prompt,
    isGenerating,
    progress,
    jobStatus,
    uploadedImage,
    setProductName,
    setBrandName,
    setPrompt,
    startGeneration,
  } = useStudioStore();

  const cost = useCreditCost();
  const canGenerate = !!uploadedImage && !isGenerating;
  const buttonColor = STEP_COLORS[activeStep];

  const handleGenerate = async () => {
    const jobId = await startGeneration();
    if (!jobId) {
      toast.error("Failed to start generation. Please try again.");
    }
  };

  return (
    <div className="flex flex-col gap-5">
      {/* Common fields */}
      <div className="space-y-3">
        <div>
          <label className="text-xs text-white/40 font-medium uppercase tracking-wider mb-1.5 block">
            Product name
          </label>
          <Input
            placeholder="e.g. Luxe Serum"
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
            className="bg-white/4 border-white/8 rounded-xl text-white placeholder:text-white/20 focus-visible:ring-indigo-500/40 focus-visible:border-indigo-500/40"
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
            className="bg-white/4 border-white/8 rounded-xl text-white placeholder:text-white/20 focus-visible:ring-indigo-500/40 focus-visible:border-indigo-500/40"
          />
        </div>
      </div>

      {/* Divider */}
      <div className="h-px bg-white/6" />

      {/* Step-specific config */}
      {activeStep === "professionalize" && <Step1Config />}
      {activeStep === "campaign" && <Step2Config />}
      {activeStep === "video" && <Step3Config />}

      {/* Optional prompt */}
      <div>
        <label className="text-xs text-white/40 font-medium uppercase tracking-wider mb-1.5 block">
          Additional prompt{" "}
          <span className="text-white/20 normal-case">(optional)</span>
        </label>
        <Textarea
          placeholder="e.g. Marble surface, warm morning light, luxury feel…"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          rows={2}
          className="bg-white/4 border-white/8 rounded-xl text-white placeholder:text-white/20 resize-none focus-visible:ring-indigo-500/40 focus-visible:border-indigo-500/40 text-sm"
        />
      </div>

      {/* Progress */}
      {isGenerating && (
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-white/40">
              {jobStatus ? JOB_STATUS_LABELS[jobStatus] : "Preparing…"}
            </span>
            <span className="text-indigo-400 font-medium">{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="h-1.5 bg-white/6 [&>div]:bg-indigo-500" />
        </div>
      )}

      {/* Error */}
      {jobStatus === "failed" && !isGenerating && (
        <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs">
          Generation failed. Check your settings and try again.
        </div>
      )}

      {/* Generate button */}
      <Button
        disabled={!canGenerate}
        onClick={handleGenerate}
        className={`w-full h-12 rounded-2xl disabled:opacity-40 text-white font-semibold text-base shadow-lg transition-all ${buttonColor}`}
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
