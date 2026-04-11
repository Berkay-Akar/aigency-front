"use client";

import { useState } from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import {
  Download,
  Sparkles,
  Copy,
  RefreshCw,
  Layers,
  CalendarPlus,
  ImageIcon,
  AlertCircle,
} from "lucide-react";
import { toast } from "sonner";
import { Progress } from "@/components/ui/progress";
import { useStudioStore } from "@/store/studio-store";
import { ScheduleModal } from "./schedule-modal";
import { formatGenerationErrorMessage } from "@/lib/generation-error-message";
import { cn } from "@/lib/utils";

export function PreviewPanel({ className }: { className?: string }) {
  const t = useTranslations("studio");
  const tg = useTranslations("generation");
  const [scheduleOpen, setScheduleOpen] = useState(false);

  const result = useStudioStore((s) => s.result);
  const isGenerating = useStudioStore((s) => s.isGenerating);
  const progress = useStudioStore((s) => s.progress);
  const generationError = useStudioStore((s) => s.generationError);
  const prompt = useStudioStore((s) => s.prompt);
  const composedPreview = useStudioStore((s) => s.buildComposedPrompt());
  const startGeneration = useStudioStore((s) => s.startGeneration);
  const enhancePromptWithApi = useStudioStore((s) => s.enhancePromptWithApi);
  const resetGenerationUi = useStudioStore((s) => s.resetGenerationUi);

  const showEmpty = !isGenerating && !result && !generationError;

  async function handleCopyPrompt() {
    const text = useStudioStore.getState().buildComposedPrompt();
    try {
      await navigator.clipboard.writeText(text);
      toast.success(tg("copied"));
    } catch {
      toast.error(t("errorTitle"));
    }
  }

  async function handleDownload() {
    if (!result?.url) return;
    try {
      const a = document.createElement("a");
      a.href = result.url;
      a.download = `aigencys-${result.assetId.slice(0, 8)}.png`;
      a.target = "_blank";
      a.rel = "noreferrer";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      toast.success(t("downloadStarted"));
    } catch {
      toast.error(t("errorTitle"));
    }
  }

  return (
    <div
      className={cn(
        "flex min-h-0 flex-1 flex-col rounded-3xl border border-white/[0.08] bg-gradient-to-b from-white/[0.04] to-transparent shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] backdrop-blur-sm",
        className
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
              className="flex flex-1 flex-col items-center justify-center gap-4 px-6 text-center"
            >
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-white/[0.08] bg-white/[0.04]">
                <ImageIcon className="h-8 w-8 text-white/25" aria-hidden />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white/90">{t("emptyPreviewTitle")}</h3>
                <p className="mt-2 max-w-sm text-sm text-white/40">{t("emptyPreviewDesc")}</p>
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
              <div className="relative h-48 w-full max-w-md overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.03]">
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-indigo-500/20 to-transparent"
                  animate={{ x: ["-100%", "100%"] }}
                  transition={{ duration: 1.8, repeat: Infinity, ease: "linear" }}
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <Sparkles className="h-10 w-10 text-indigo-400/80" aria-hidden />
                </div>
              </div>
              <div className="w-full max-w-md space-y-2">
                <div className="flex justify-between text-xs text-white/45">
                  <span>{t("loadingTitle")}</span>
                  <span className="tabular-nums">{Math.round(progress)}%</span>
                </div>
                <Progress value={progress} className="h-1.5 bg-white/[0.06]" />
                <p className="text-center text-xs text-white/35">{t("loadingHint")}</p>
              </div>
            </motion.div>
          ) : null}

          {generationError && !isGenerating ? (
            <motion.div
              key="error"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="flex flex-1 flex-col items-center justify-center gap-4 px-6 text-center"
            >
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-red-500/25 bg-red-500/10">
                <AlertCircle className="h-7 w-7 text-red-400" aria-hidden />
              </div>
              <h3 className="text-lg font-semibold text-white">{t("errorTitle")}</h3>
              <p className="max-w-md text-sm text-white/45">
                {formatGenerationErrorMessage(generationError, tg)}
              </p>
              <button
                type="button"
                onClick={() => {
                  resetGenerationUi();
                }}
                className="rounded-2xl border border-white/[0.12] px-5 py-2.5 text-sm font-medium text-white/80 transition-colors hover:bg-white/[0.06] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/40"
              >
                {tg("retry")}
              </button>
            </motion.div>
          ) : null}

          {result && !isGenerating && !generationError ? (
            <motion.div
              key="result"
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-1 flex-col gap-4"
            >
              <div className="relative min-h-0 flex-1 overflow-hidden rounded-2xl border border-white/[0.08] bg-black/40">
                <img
                  src={result.url}
                  alt=""
                  className="h-full w-full max-h-[min(62vh,640px)] object-contain"
                />
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => void handleDownload()}
                  className="inline-flex items-center gap-2 rounded-xl border border-white/[0.1] bg-white/[0.05] px-3 py-2 text-xs font-medium text-white/80 transition-colors hover:bg-white/[0.09] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/40"
                >
                  <Download className="h-3.5 w-3.5" aria-hidden />
                  {tg("download")}
                </button>
                <button
                  type="button"
                  onClick={() => void startGeneration()}
                  className="inline-flex items-center gap-2 rounded-xl border border-white/[0.1] bg-white/[0.05] px-3 py-2 text-xs font-medium text-white/80 transition-colors hover:bg-white/[0.09] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/40"
                >
                  <RefreshCw className="h-3.5 w-3.5" aria-hidden />
                  {t("regenerate")}
                </button>
                <button
                  type="button"
                  onClick={() => void handleCopyPrompt()}
                  className="inline-flex items-center gap-2 rounded-xl border border-white/[0.1] bg-white/[0.05] px-3 py-2 text-xs font-medium text-white/80 transition-colors hover:bg-white/[0.09] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/40"
                >
                  <Copy className="h-3.5 w-3.5" aria-hidden />
                  {t("copyPrompt")}
                </button>
                <button
                  type="button"
                  onClick={async () => {
                    const ok = await enhancePromptWithApi();
                    if (ok) toast.success(t("promptEnhanced"));
                    else toast.error(t("promptEnhanceFailed"));
                  }}
                  className="inline-flex items-center gap-2 rounded-xl border border-white/[0.1] bg-white/[0.05] px-3 py-2 text-xs font-medium text-white/80 transition-colors hover:bg-white/[0.09] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/40"
                >
                  <Sparkles className="h-3.5 w-3.5" aria-hidden />
                  {t("enhancePrompt")}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    toast.message(t("variationsStarted"));
                    void startGeneration();
                  }}
                  className="inline-flex items-center gap-2 rounded-xl border border-white/[0.1] bg-white/[0.05] px-3 py-2 text-xs font-medium text-white/80 transition-colors hover:bg-white/[0.09] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/40"
                >
                  <Layers className="h-3.5 w-3.5" aria-hidden />
                  {t("variations")}
                </button>
                <Link
                  href={`/assets?highlight=${encodeURIComponent(result.assetId)}`}
                  className="inline-flex items-center gap-2 rounded-xl border border-indigo-500/25 bg-indigo-500/10 px-3 py-2 text-xs font-medium text-indigo-200 transition-colors hover:bg-indigo-500/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/40"
                >
                  {t("openAssets")}
                </Link>
                <button
                  type="button"
                  onClick={() => setScheduleOpen(true)}
                  className="inline-flex items-center gap-2 rounded-xl border border-white/[0.1] bg-white/[0.05] px-3 py-2 text-xs font-medium text-white/80 transition-colors hover:bg-white/[0.09] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/40"
                >
                  <CalendarPlus className="h-3.5 w-3.5" aria-hidden />
                  {t("schedulePost")}
                </button>
              </div>
              {composedPreview.length >= 3 ? (
                <p className="line-clamp-2 text-[11px] text-white/30">
                  <span className="text-white/45">{tg("prompt")}: </span>
                  {composedPreview}
                </p>
              ) : null}
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
