"use client";

import { X, ArrowRight } from "lucide-react";
import { useStudioStore, type StudioStep } from "@/store/studio-store";

const STEP_LABELS: Record<StudioStep, string> = {
  professionalize: "Adım 1 — Profesyonelleştirme",
  campaign: "Adım 2 — Kampanya varyantları",
  video: "Adım 3 — Video reklam",
};

const STEP_NUMBER: Record<StudioStep, number> = {
  professionalize: 1,
  campaign: 2,
  video: 3,
};

const STEP_COLORS: Record<StudioStep, string> = {
  professionalize: "border-violet-500/30 bg-violet-500/8",
  campaign: "border-sky-500/30 bg-sky-500/8",
  video: "border-rose-500/30 bg-rose-500/8",
};

const LABEL_COLORS: Record<StudioStep, string> = {
  professionalize: "text-violet-300",
  campaign: "text-sky-300",
  video: "text-rose-300",
};

export function StepInputBanner() {
  const { activeStep, stepInput, setStepInput, setUploadedImage } = useStudioStore();
  const stepNum = STEP_NUMBER[activeStep];
  const inputUrl = stepInput[stepNum];

  if (!inputUrl) return null;

  const sourceStepNum = stepNum - 1;
  const sourceLabel =
    sourceStepNum === 1 ? "Adım 1 — Profesyonelleştirme" : "Adım 2 — Kampanya varyantları";

  const handleDismiss = () => {
    setStepInput(stepNum, null);
    setUploadedImage(null);
  };

  return (
    <div
      className={`flex items-center gap-3 rounded-xl border px-3 py-2.5 text-sm ${STEP_COLORS[activeStep]}`}
    >
      <div className="size-10 shrink-0 overflow-hidden rounded-lg border border-white/10">
        <img src={inputUrl} alt="" className="size-full object-cover" />
      </div>

      <div className="min-w-0 flex-1">
        <div className="mb-0.5 flex items-center gap-1.5">
          <span className="text-xs text-white/40">{sourceLabel}</span>
          <ArrowRight className="size-3 text-white/20" />
          <span className={`text-xs font-medium ${LABEL_COLORS[activeStep]}`}>
            {STEP_LABELS[activeStep]}
          </span>
        </div>
        <p className="truncate text-xs text-white/35">
          Seçilen önceki çıktı kaynak görsel olarak kullanılıyor.
        </p>
      </div>

      <button
        type="button"
        onClick={handleDismiss}
        className="shrink-0 rounded-lg p-1 text-white/30 transition-colors hover:bg-white/10 hover:text-white/60"
        title="Kaynağı kaldır"
      >
        <X className="size-3.5" />
      </button>
    </div>
  );
}
