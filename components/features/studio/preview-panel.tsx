"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  Copy,
  RefreshCw,
  CalendarPlus,
  ImageIcon,
  Film,
} from "lucide-react";
import { toast } from "sonner";
import { Progress } from "@/components/ui/progress";
import { useStudioStore } from "@/store/studio-store";
import type { AiGenerationMode } from "@/lib/api";
import { ScheduleModal } from "./schedule-modal";
import { DownloadFormatMenu } from "./download-format-menu";
import { cn } from "@/lib/utils";

type FastSampleConfig =
  | { type: "single"; src: string }
  | { type: "combine"; output: string }
  | { type: "video"; output: string }
  | null;

// Drop files in public/sample-inputs/ (form placeholders) and public/sample-outputs/ (preview).
const FAST_SAMPLE_IMAGES: Record<AiGenerationMode, FastSampleConfig> = {
  "text-to-image": {
    type: "single",
    src: "/sample-outputs/text-to-image-image.png",
  },
  "image-to-image": {
    type: "combine",
    output: "/sample-outputs/image-to-image-result.png",
  },
  "image-to-video": {
    type: "video",

    output: "/sample-outputs/image-to-video-fast.mp4",
  },
};

function ResultAction({
  onClick,
  icon,
  label,
  highlight,
}: {
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
  highlight?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={label}
      className={cn(
        "group flex items-center justify-center gap-2 rounded-2xl border px-4 py-3 text-sm font-medium transition-all duration-200",
        highlight
          ? "border-indigo-500/30 bg-indigo-500/10 text-indigo-200 hover:bg-indigo-500/20"
          : "border-white/8 bg-white/4 text-white/50 hover:border-white/15 hover:bg-white/8 hover:text-white/80",
      )}
    >
      <span className="shrink-0">{icon}</span>
      <span className="max-w-0 overflow-hidden whitespace-nowrap text-xs transition-all duration-200 group-hover:max-w-30">
        {label}
      </span>
    </button>
  );
}

export function PreviewPanel({ className }: { className?: string }) {
  const t = useTranslations("studio");
  const tg = useTranslations("generation");
  const [scheduleOpen, setScheduleOpen] = useState(false);

  const result = useStudioStore((s) => s.result);
  const isGenerating = useStudioStore((s) => s.isGenerating);
  const progress = useStudioStore((s) => s.progress);
  const prompt = useStudioStore((s) => s.prompt);
  const startGeneration = useStudioStore((s) => s.startGeneration);
  const enhancePromptWithApi = useStudioStore((s) => s.enhancePromptWithApi);
  const generationMode = useStudioStore((s) => s.generationMode);
  const showEmpty = !isGenerating && !result;
  const fastSampleConfig = FAST_SAMPLE_IMAGES[generationMode];

  async function handleCopyPrompt() {
    const text = useStudioStore.getState().buildComposedPrompt();
    try {
      await navigator.clipboard.writeText(text);
      toast.success(tg("copied"));
    } catch {
      toast.error(t("errorTitle"));
    }
  }

  return (
    <div
      className={cn(
        "flex min-h-0 flex-1 flex-col rounded-3xl border border-white/10 bg-[rgb(10_10_12/0.65)] shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_8px_40px_rgba(0,0,0,0.25)] backdrop-blur-xl",
        className,
      )}
    >
      <div className="relative flex min-h-[min(70vh,720px)] flex-1 flex-col p-4 md:p-6">
        <AnimatePresence mode="wait">
          {showEmpty ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              className="flex flex-1 flex-col items-center justify-center gap-5 px-6"
            >
              {/* Sample cards — only shown when configured */}
              {fastSampleConfig?.type === "single" && (
                <div className="flex w-full max-w-sm lg:max-w-[calc((100vh_-_260px)*0.75)] flex-col items-center gap-3">
                  <div className="relative w-full aspect-[3/4] overflow-hidden rounded-2xl border border-white/10 bg-white/3 shadow-[0_8px_40px_rgba(0,0,0,0.35)]">
                    <div className="absolute left-3 top-3 z-10 flex items-center gap-1.5 rounded-lg border border-white/12 bg-black/60 px-2.5 py-1 backdrop-blur-md">
                      <ImageIcon
                        className="h-3 w-3 text-indigo-300/80"
                        aria-hidden
                      />
                      <span className="text-[10px] font-semibold uppercase tracking-wider text-white/60">
                        {t("sampleOutputLabel")}
                      </span>
                    </div>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={fastSampleConfig.src}
                      alt={t("sampleOutputLabel")}
                      className="absolute inset-0 h-full w-full object-cover opacity-60"
                    />
                  </div>
                </div>
              )}

              {fastSampleConfig?.type === "combine" && (
                <div className="flex w-full max-w-sm lg:max-w-[calc((100vh_-_260px)*0.75)] flex-col items-center gap-3">
                  {/* Output card */}
                  <div className="relative w-full aspect-[3/4] overflow-hidden rounded-2xl border border-white/10 bg-white/3 shadow-[0_8px_40px_rgba(0,0,0,0.35)]">
                    <div className="absolute left-3 top-3 z-10 flex items-center gap-1.5 rounded-lg border border-white/12 bg-black/60 px-2.5 py-1 backdrop-blur-md">
                      <ImageIcon
                        className="h-3 w-3 text-indigo-300/80"
                        aria-hidden
                      />
                      <span className="text-[10px] font-semibold uppercase tracking-wider text-white/60">
                        {t("sampleOutputLabel")}
                      </span>
                    </div>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={fastSampleConfig.output}
                      alt={t("sampleOutputLabel")}
                      className="absolute inset-0 h-full w-full object-cover opacity-60"
                    />
                  </div>
                </div>
              )}

              {fastSampleConfig?.type === "video" && (
                <div className="flex w-full max-w-sm lg:max-w-[calc((100vh_-_260px)*0.75)] flex-col items-center gap-3">
                  <div className="relative w-full aspect-[3/4] overflow-hidden rounded-2xl border border-white/10 bg-white/3 shadow-[0_8px_40px_rgba(0,0,0,0.35)]">
                    <div className="absolute left-3 top-3 z-10 flex items-center gap-1.5 rounded-lg border border-white/12 bg-black/60 px-2.5 py-1 backdrop-blur-md">
                      <Film
                        className="h-3 w-3 text-indigo-300/80"
                        aria-hidden
                      />
                      <span className="text-[10px] font-semibold uppercase tracking-wider text-white/60">
                        {t("sampleOutputLabel")}
                      </span>
                    </div>
                    <video
                      src={fastSampleConfig.output}
                      autoPlay
                      loop
                      muted
                      playsInline
                      className="absolute inset-0 h-full w-full object-cover opacity-60"
                    />
                  </div>
                </div>
              )}

              {/* Helper text */}
              <div className="text-center">
                <p className="text-sm font-medium text-white/50">
                  {t("emptyPreviewTitle")}
                </p>
                <p className="mt-1 text-xs text-white/25">
                  {t("emptyPreviewDesc")}
                </p>
              </div>
            </motion.div>
          ) : null}

          {isGenerating ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-1 flex-col items-center justify-center gap-6 px-6"
            >
              <div className="relative w-full max-w-sm lg:max-w-[calc((100vh_-_260px)*0.75)] aspect-[3/4] overflow-hidden rounded-2xl border border-white/8 bg-white/3">
                <motion.div
                  className="absolute inset-0 bg-linear-to-r from-transparent via-indigo-500/20 to-transparent"
                  animate={{ x: ["-100%", "100%"] }}
                  transition={{
                    duration: 1.8,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <Sparkles
                    className="h-10 w-10 text-indigo-400/80"
                    aria-hidden
                  />
                </div>
              </div>
              <div className="w-full max-w-md space-y-2">
                <div className="flex justify-between text-xs text-white/45">
                  <span>{t("loadingTitle")}</span>
                  <span className="tabular-nums">{Math.round(progress)}%</span>
                </div>
                <Progress value={progress} className="h-1.5 bg-white/6" />
                <p className="text-center text-xs text-white/35">
                  {t("loadingHint")}
                </p>
              </div>
            </motion.div>
          ) : null}

          {result && !isGenerating ? (
            <motion.div
              key="result"
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-1 flex-col items-center justify-center gap-5 px-6"
            >
              <div className="flex w-full max-w-sm lg:max-w-[calc((100vh_-_260px)*0.75)] flex-col items-center gap-3">
                {/* Result card */}
                <div className="relative w-full overflow-hidden rounded-2xl border border-white/10 bg-white/3 shadow-[0_8px_40px_rgba(0,0,0,0.35)]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={result.url} alt="" className="w-full h-auto" />
                </div>

                {/* Action bar */}
                <div className="flex items-center gap-2">
                  <DownloadFormatMenu
                    url={result.url}
                    basename={`aigencys-${result.assetId.slice(0, 8)}`}
                    label={tg("download")}
                  />
                  <ResultAction
                    onClick={() => void startGeneration()}
                    icon={<RefreshCw className="h-4 w-4" />}
                    label={t("regenerate")}
                  />
                  <ResultAction
                    onClick={() => void handleCopyPrompt()}
                    icon={<Copy className="h-4 w-4" />}
                    label={t("copyPrompt")}
                  />
                  <ResultAction
                    onClick={async () => {
                      const ok = await enhancePromptWithApi();
                      if (ok) toast.success(t("promptEnhanced"));
                      else toast.error(t("promptEnhanceFailed"));
                    }}
                    icon={<Sparkles className="h-4 w-4" />}
                    label={t("enhancePrompt")}
                  />
                  <ResultAction
                    onClick={() => setScheduleOpen(true)}
                    icon={<CalendarPlus className="h-4 w-4" />}
                    label={t("schedulePost")}
                    highlight
                  />
                </div>
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>

      <ScheduleModal
        open={scheduleOpen}
        onClose={() => setScheduleOpen(false)}
        assetId={result?.assetId}
        imageUrl={result?.url}
        defaultCaption={prompt}
      />
    </div>
  );
}
