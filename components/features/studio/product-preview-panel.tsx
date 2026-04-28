"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  RefreshCw,
  X,
  ChevronLeft,
  ChevronRight,
  ImageIcon,
  Sparkles,
  AlertCircle,
  Video as VideoIcon,
  CalendarPlus,
  Copy,
} from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { downloadAsBlob } from "@/lib/utils";
import { useStudioStore } from "@/store/studio-store";
import { useTranslations } from "next-intl";
import type { GenerationResult, ProductFlow } from "@/store/studio-store";
import { toast } from "sonner";
import { ScheduleModal } from "./schedule-modal";
import { DownloadFormatMenu } from "./download-format-menu";

// Drop a file in public/sample-outputs/ with the matching name to override the
// nanoBanana fallback for that specific PRO flow.
const PRO_SAMPLE_IMAGES: Record<ProductFlow, string | null> = {
  "model-photo": null, // /sample-outputs/pro-model-photo.jpg
  "product-angles": null, // /sample-outputs/pro-product-angles.jpg
  "product-reference": "/sample-outputs/pro-reference-output.jpg",
  "product-swap": "/sample-outputs/swap-output.webp", // /sample-outputs/pro-product-swap.jpg
  "ghost-mannequin": null, // /sample-outputs/pro-ghost-mannequin.jpg
  "photo-to-video": null, // /sample-outputs/pro-photo-to-video.jpg
  upscale: null,
};

// ─── Lightbox ──────────────────────────────────────────────────────────────────
function Lightbox({
  images,
  startIndex,
  onClose,
}: {
  images: GenerationResult[];
  startIndex: number;
  onClose: () => void;
}) {
  const [idx, setIdx] = useState(startIndex);
  const current = images[idx];

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 backdrop-blur-xl"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <button
          type="button"
          className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20"
          onClick={onClose}
        >
          <X className="h-5 w-5" />
        </button>

        {/* Prev */}
        {images.length > 1 && idx > 0 && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setIdx((i) => i - 1);
            }}
            className="absolute left-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
        )}

        {/* Image */}
        <motion.div
          key={idx}
          className="max-h-[90vh] max-w-[90vw]"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", bounce: 0.1, duration: 0.3 }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={current.url}
            alt={`Result ${idx + 1}`}
            className="max-h-[80vh] max-w-[80vw] rounded-2xl object-contain shadow-2xl"
          />
        </motion.div>

        {/* Next */}
        {images.length > 1 && idx < images.length - 1 && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setIdx((i) => i + 1);
            }}
            className="absolute right-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        )}

        {/* Dot indicator */}
        {images.length > 1 && (
          <div className="absolute bottom-6 flex gap-2">
            {images.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setIdx(i);
                }}
                className={cn(
                  "h-2 rounded-full transition-all",
                  i === idx ? "w-5 bg-white" : "w-2 bg-white/40",
                )}
              />
            ))}
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  );
}

// ─── Download helper ───────────────────────────────────────────────────────────
async function downloadUrl(url: string, name: string) {
  await downloadAsBlob(url, name);
}

// ─── Loading state ─────────────────────────────────────────────────────────────
function LoadingState({ progress }: { count: number; progress: number }) {
  const t = useTranslations("productStudio");
  return (
    <div className="flex h-full flex-col items-center justify-center gap-6 p-8">
      <div className="relative w-full max-w-sm lg:max-w-[calc((100vh_-_280px)*0.75)] aspect-[3/4] overflow-hidden rounded-2xl border border-white/8 bg-white/3">
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
          <Sparkles className="h-10 w-10 text-indigo-400/80" aria-hidden />
        </div>
      </div>
      <div className="w-full max-w-md space-y-2">
        <div className="flex justify-between text-xs text-foreground/45">
          <span>{t("previewLoading")}</span>
          <span className="tabular-nums">{Math.round(progress)}%</span>
        </div>
        <Progress value={progress} className="h-1.5 bg-foreground/[0.06]" />
        <p className="text-center text-xs text-foreground/35">
          {t("previewLoading")}
        </p>
      </div>
    </div>
  );
}

// ─── Error state ───────────────────────────────────────────────────────────────
function ErrorState({
  message,
  onRetry,
}: {
  message: string;
  onRetry: () => void;
}) {
  const t = useTranslations("productStudio");
  return (
    <div className="flex h-full flex-col items-center justify-center gap-4 p-8 text-center">
      <AlertCircle className="h-10 w-10 text-red-400" />
      <p className="text-sm font-medium text-foreground/70">{message}</p>
      <button
        type="button"
        onClick={onRetry}
        className="rounded-xl border border-border bg-foreground/[0.05] px-4 py-2 text-sm text-foreground/60 transition hover:bg-foreground/[0.09]"
      >
        {t("previewRetry")}
      </button>
    </div>
  );
}

// ─── Empty state ───────────────────────────────────────────────────────────────
function EmptyState() {
  const t = useTranslations("productStudio");
  const activeProductFlow = useStudioStore((s) => s.activeProductFlow);
  const proSampleSrc = PRO_SAMPLE_IMAGES[activeProductFlow];
  return (
    <div className="flex h-full flex-col items-center justify-center gap-5 p-8">
      <div className="relative w-full max-w-sm lg:max-w-[calc((100vh_-_280px)*0.75)] aspect-[3/4] overflow-hidden rounded-2xl border border-border bg-foreground/[0.03] shadow-sm">
        {proSampleSrc ? (
          <>
            <div className="absolute left-3 top-3 z-10 flex items-center gap-1.5 rounded-lg border border-white/12 bg-black/60 px-2.5 py-1 backdrop-blur-md">
              <ImageIcon className="h-3 w-3 text-indigo-300/80" aria-hidden />
              <span className="text-[10px] font-semibold uppercase tracking-wider text-white/60">
                {t("sampleOutputLabel")}
              </span>
            </div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={proSampleSrc}
              alt={t("sampleOutputLabel")}
              className="absolute inset-0 h-full w-full object-cover opacity-60"
            />
          </>
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <ImageIcon className="h-8 w-8 text-foreground/20" aria-hidden />
          </div>
        )}
      </div>
      <div className="text-center">
        <p className="text-sm font-medium text-foreground/50">
          {t("previewEmpty")}
        </p>
        <p className="mt-1 text-xs text-muted-foreground">
          {t("previewEmptyHint")}
        </p>
      </div>
    </div>
  );
}

// ─── Action button (icon only, shows label on hover) ───────────────────────────
function ActionBtn({
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
        "group relative flex items-center justify-center gap-2 rounded-2xl border px-4 py-3 text-sm font-medium transition-all duration-200",
        highlight
          ? "border-indigo-500/30 bg-indigo-500/10 text-indigo-500 dark:text-indigo-200 hover:bg-indigo-500/20"
          : "border-border bg-foreground/[0.04] text-foreground/50 hover:border-border hover:bg-foreground/[0.08] hover:text-foreground/80",
      )}
    >
      <span className="shrink-0">{icon}</span>
      <span className="max-w-0 overflow-hidden whitespace-nowrap text-xs transition-all duration-200 group-hover:max-w-30">
        {label}
      </span>
    </button>
  );
}

// ─── Single result ─────────────────────────────────────────────────────────────
function SingleResult({
  result,
  activeFlow,
  onRegenerate,
}: {
  result: GenerationResult;
  activeFlow: string;
  onRegenerate: () => void;
}) {
  const t = useTranslations("productStudio");
  const isVideo = activeFlow === "photo-to-video";
  const [scheduleOpen, setScheduleOpen] = useState(false);

  return (
    <>
      <div className="flex flex-col items-center justify-center gap-5 p-6 h-full">
        {/* Result card — same fixed size as loading/empty state */}
        <div className="relative w-full max-w-sm lg:max-w-[calc((100vh_-_280px)*0.75)] aspect-[3/4] overflow-hidden rounded-2xl border border-border shadow-sm bg-black/20">
          {isVideo ? (
            <video
              src={result.url}
              controls
              className="absolute inset-0 h-full w-full object-contain"
            />
          ) : (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={result.url}
              alt="Generated result"
              className="absolute inset-0 h-full w-full object-contain"
            />
          )}
        </div>

        {/* Action bar */}
        <div className="flex items-center gap-2">
          {isVideo ? (
            <ActionBtn
              onClick={() =>
                void downloadUrl(
                  result.url,
                  `aigencys-${activeFlow}-${Date.now()}.mp4`,
                )
              }
              icon={<VideoIcon className="h-4 w-4" />}
              label={t("previewDownload")}
            />
          ) : (
            <DownloadFormatMenu
              url={result.url}
              basename={`aigencys-${activeFlow}`}
              label={t("previewDownload")}
            />
          )}
          <ActionBtn
            onClick={onRegenerate}
            icon={<RefreshCw className="h-4 w-4" />}
            label={t("previewRegenerate")}
          />
          <ActionBtn
            onClick={async () => {
              try {
                await navigator.clipboard.writeText(result.url);
                toast.success(t("previewCopy"));
              } catch {
                toast.error("Copy failed");
              }
            }}
            icon={<Copy className="h-4 w-4" />}
            label={t("previewCopy")}
          />
          <ActionBtn
            onClick={() => setScheduleOpen(true)}
            icon={<CalendarPlus className="h-4 w-4" />}
            label={t("previewSchedule")}
            highlight
          />
        </div>
      </div>

      <ScheduleModal
        open={scheduleOpen}
        onClose={() => setScheduleOpen(false)}
        imageUrl={result.url}
      />
    </>
  );
}

// ─── Multi result (angles) ─────────────────────────────────────────────────────
function MultiResult({
  results,
  onRegenerate,
}: {
  results: GenerationResult[];
  onRegenerate: () => void;
}) {
  const t = useTranslations("productStudio");
  const ANGLE_LABELS = [t("angleFront"), t("angle45"), t("angleProfile")];
  const [primaryIdx, setPrimaryIdx] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [scheduleOpen, setScheduleOpen] = useState(false);
  const primary = results[primaryIdx];

  return (
    <>
      <div className="flex flex-col items-center justify-center gap-5 p-6 h-full">
        {/* Primary card */}
        <div
          className="relative w-full max-w-sm lg:max-w-[calc((100vh_-_280px)*0.75)] aspect-[3/4] cursor-zoom-in overflow-hidden rounded-2xl border border-white/10 shadow-[0_8px_40px_rgba(0,0,0,0.35)] bg-black/20"
          onClick={() => setLightboxOpen(true)}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={primary.url}
            alt={ANGLE_LABELS[primaryIdx]}
            className="absolute inset-0 h-full w-full object-contain"
          />
          <div className="pointer-events-none absolute bottom-3 left-3 rounded-full bg-black/50 px-3 py-1 text-[11px] font-semibold text-white backdrop-blur-sm">
            {ANGLE_LABELS[primaryIdx] ?? `Görsel ${primaryIdx + 1}`}
          </div>
        </div>

        {/* Thumbnail strip */}
        <div className="flex w-full max-w-sm lg:max-w-[calc((100vh_-_280px)*0.75)] gap-2">
          {results.map((r, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setPrimaryIdx(i)}
              className={cn(
                "relative h-16 flex-1 overflow-hidden rounded-xl border transition-all",
                primaryIdx === i
                  ? "border-indigo-500/50 ring-1 ring-indigo-500/30"
                  : "border-border opacity-60 hover:opacity-90",
              )}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={r.url}
                alt={ANGLE_LABELS[i]}
                className="h-full w-full object-cover"
              />
              <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-linear-to-t from-black/60 to-transparent px-1 py-1 text-[9px] font-semibold text-white">
                {ANGLE_LABELS[i] ?? i + 1}
              </div>
            </button>
          ))}
        </div>

        {/* Action bar */}
        <div className="flex items-center gap-2">
          <DownloadFormatMenu
            url={primary.url}
            basename={`aigencys-angle-${primaryIdx}`}
            label={t("previewDownloadSelected")}
          />
          <ActionBtn
            onClick={onRegenerate}
            icon={<RefreshCw className="h-4 w-4" />}
            label={t("previewRegenerate")}
          />
          <ActionBtn
            onClick={async () => {
              try {
                await navigator.clipboard.writeText(primary.url);
                toast.success(t("previewCopy"));
              } catch {
                toast.error("Copy failed");
              }
            }}
            icon={<Copy className="h-4 w-4" />}
            label={t("previewCopy")}
          />
          <ActionBtn
            onClick={() => setScheduleOpen(true)}
            icon={<CalendarPlus className="h-4 w-4" />}
            label={t("previewSchedule")}
            highlight
          />
        </div>
      </div>

      {lightboxOpen && (
        <Lightbox
          images={results}
          startIndex={primaryIdx}
          onClose={() => setLightboxOpen(false)}
        />
      )}

      <ScheduleModal
        open={scheduleOpen}
        onClose={() => setScheduleOpen(false)}
        imageUrl={primary.url}
      />
    </>
  );
}

// ─── Main component ────────────────────────────────────────────────────────────
export function ProductPreviewPanel({ className }: { className?: string }) {
  const isProductGenerating = useStudioStore((s) => s.isProductGenerating);
  const productProgress = useStudioStore((s) => s.productProgress);
  const productResults = useStudioStore((s) => s.productResults);
  const productError = useStudioStore((s) => s.productError);
  const productJobIds = useStudioStore((s) => s.productJobIds);
  const activeProductFlow = useStudioStore((s) => s.activeProductFlow);
  const resetProductState = useStudioStore((s) => s.resetProductState);
  const startProductGeneration = useStudioStore(
    (s) => s.startProductGeneration,
  );

  const jobCount = productJobIds.length || 1;

  return (
    <div
      className={cn(
        "glass-panel flex min-h-80 max-h-[calc(100vh-8rem)] flex-col overflow-hidden",
        className,
      )}
    >
      <AnimatePresence mode="wait">
        {productError ? (
          <motion.div
            key="error"
            className="flex-1"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <ErrorState
              message={productError}
              onRetry={() => {
                resetProductState();
                void startProductGeneration();
              }}
            />
          </motion.div>
        ) : isProductGenerating ? (
          <motion.div
            key="loading"
            className="flex-1"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <LoadingState count={jobCount} progress={productProgress} />
          </motion.div>
        ) : productResults.length > 1 ? (
          <motion.div
            key="multi"
            className="flex-1"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            <MultiResult
              results={productResults}
              onRegenerate={() => {
                resetProductState();
                void startProductGeneration();
              }}
            />
          </motion.div>
        ) : productResults.length === 1 ? (
          <motion.div
            key="single"
            className="flex-1"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            <SingleResult
              result={productResults[0]}
              activeFlow={activeProductFlow}
              onRegenerate={() => {
                resetProductState();
                void startProductGeneration();
              }}
            />
          </motion.div>
        ) : (
          <motion.div
            key="empty"
            className="flex-1"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <EmptyState />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
