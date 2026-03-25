"use client";

import { Loader2, Zap } from "lucide-react";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useStudioStore } from "@/store/studio-store";
import { useJobPolling } from "@/hooks/use-job-polling";

const STATUS_TR: Record<string, string> = {
  queued: "Kuyrukta — başlıyor…",
  processing: "Üretiliyor…",
  completed: "Tamam",
  failed: "Başarısız",
};

function useEstimatedCredits() {
  const { activeStep, outputTypes, variantCount } = useStudioStore();
  if (activeStep === "professionalize") return outputTypes.length * 8;
  if (activeStep === "campaign") return variantCount * 6;
  return 20;
}

function useEstimatedSeconds() {
  const { activeStep, variantCount, videoDuration } = useStudioStore();
  if (activeStep === "video") return 35 + videoDuration * 2;
  if (activeStep === "campaign") return 40 + variantCount * 8;
  return 45;
}

function modeSummaryTr(studioModeId: string, activeStep: string) {
  const map: Record<string, string> = {
    image_to_professional: "Görselden profesyonel görsele",
    same_product_models: "Aynı ürün · çoklu model",
    same_model_products: "Aynı model · çoklu ürün",
    multi_angle: "Çoklu açı ürün çekimi",
    lighting_variations: "Işık varyasyonları",
    image_to_video_ads: "Profesyonel görselden video reklam",
  };
  return (
    map[studioModeId] ??
    (activeStep === "video"
      ? "Video reklam"
      : activeStep === "campaign"
        ? "Kampanya varyantları"
        : "Profesyonelleştirme")
  );
}

export function GenerateBar() {
  useJobPolling();

  const {
    isGenerating,
    progress,
    jobStatus,
    uploadedImage,
    startGeneration,
    activeStep,
    studioModeId,
  } = useStudioStore();

  const credits = useEstimatedCredits();
  const etaSec = useEstimatedSeconds();
  const canGenerate = !!uploadedImage && !isGenerating;

  const gradient =
    activeStep === "professionalize"
      ? "from-violet-600 to-fuchsia-600 shadow-violet-500/25"
      : activeStep === "campaign"
        ? "from-cyan-600 to-sky-600 shadow-cyan-500/20"
        : "from-rose-600 to-orange-600 shadow-rose-500/20";

  const handleGenerate = async () => {
    const jobId = await startGeneration();
    if (!jobId) {
      toast.error("Üretim başlatılamadı. Tekrar deneyin.");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="rounded-3xl border border-white/[0.08] bg-gradient-to-b from-white/[0.05] to-transparent p-6 md:p-8"
    >
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/35">
            Özet
          </p>
          <p className="mt-1 text-sm text-white/80">{modeSummaryTr(studioModeId, activeStep)}</p>
          <p className="mt-1 text-xs text-white/35">
            Mod: <span className="text-white/55">{studioModeId.replace(/_/g, " ")}</span>
          </p>
        </div>
        <div className="flex flex-wrap gap-4 text-sm">
          <div>
            <p className="text-[10px] uppercase tracking-wider text-white/30">Tahmini kredi</p>
            <p className="font-semibold text-white">{credits}</p>
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-wider text-white/30">Süre (tahmini)</p>
            <p className="font-semibold text-white">~{etaSec}s</p>
          </div>
        </div>
      </div>

      {isGenerating && (
        <div className="mt-5 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-white/45">
              {jobStatus ? STATUS_TR[jobStatus] ?? jobStatus : "Hazırlanıyor…"}
            </span>
            <span className="font-medium text-violet-300">{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="h-1.5 bg-white/[0.06] [&>div]:bg-violet-500" />
        </div>
      )}

      {jobStatus === "failed" && !isGenerating && (
        <div className="mt-4 rounded-2xl border border-red-500/25 bg-red-500/10 px-4 py-3 text-xs text-red-300">
          Üretim başarısız. Ayarları kontrol edip tekrar deneyin.
        </div>
      )}

      <Button
        type="button"
        disabled={!canGenerate}
        onClick={handleGenerate}
        className={`mt-6 h-14 w-full rounded-2xl bg-gradient-to-r text-base font-semibold text-white disabled:opacity-40 ${gradient}`}
      >
        {isGenerating ? (
          <>
            <Loader2 className="mr-2 size-5 animate-spin" />
            Üretiliyor…
          </>
        ) : (
          <>
            <Zap className="mr-2 size-5" />
            Varlıkları üret
          </>
        )}
      </Button>

      {!uploadedImage && !isGenerating && (
        <p className="mt-3 text-center text-xs text-white/25">
          Devam etmek için bir görsel yükleyin.
        </p>
      )}
    </motion.div>
  );
}
