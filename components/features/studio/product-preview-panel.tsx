"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Download,
  RefreshCw,
  X,
  ChevronLeft,
  ChevronRight,
  ImageIcon,
  Loader2,
  AlertCircle,
  Video as VideoIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useStudioStore } from "@/store/studio-store";
import { useTranslations } from "next-intl";
import type { GenerationResult } from "@/store/studio-store";

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
function downloadUrl(url: string, name: string) {
  const a = document.createElement("a");
  a.href = url;
  a.download = name;
  a.target = "_blank";
  a.rel = "noopener noreferrer";
  a.click();
}

// ─── Loading state ─────────────────────────────────────────────────────────────
function LoadingState({
  count,
  progress,
}: {
  count: number;
  progress: number;
}) {
  const t = useTranslations("productStudio");
  return (
    <div className="flex h-full flex-col items-center justify-center gap-6 p-8">
      <div className="flex gap-3">
        {Array.from({ length: count }).map((_, i) => (
          <div
            key={i}
            className="skeleton h-16 w-16 rounded-xl"
            style={{ animationDelay: `${i * 0.15}s` }}
          />
        ))}
      </div>
      <div className="w-full max-w-xs space-y-2 text-center">
        <div className="h-1 w-full overflow-hidden rounded-full bg-white/10">
          <motion.div
            className="h-full rounded-full bg-linear-to-r from-indigo-500 to-violet-500"
            style={{ width: `${Math.max(progress, 8)}%` }}
            transition={{ ease: "easeOut", duration: 0.4 }}
          />
        </div>
        <p className="text-sm font-semibold tabular-nums text-white/50">
          {progress}%
        </p>
        <p className="text-xs text-white/30">{t("previewLoading")}</p>
      </div>
      <Loader2 className="h-6 w-6 animate-spin text-indigo-400" />
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
      <p className="text-sm font-medium text-white/70">{message}</p>
      <button
        type="button"
        onClick={onRetry}
        className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/60 transition hover:bg-white/9"
      >
        {t("previewRetry")}
      </button>
    </div>
  );
}

// ─── Empty state ───────────────────────────────────────────────────────────────
function EmptyState() {
  const t = useTranslations("productStudio");
  return (
    <div className="flex h-full flex-col items-center justify-center gap-3 p-8 text-center">
        <div className="rounded-2xl border border-dashed border-white/10 bg-white/2 p-8">
        <ImageIcon className="mx-auto mb-3 h-10 w-10 text-white/15" />
        <p className="text-sm font-medium text-white/30">{t("previewEmpty")}</p>
        <p className="mt-1 text-xs text-white/20">{t("previewEmptyHint")}</p>
      </div>
    </div>
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
  return (
    <div className="flex h-full flex-col gap-3 p-4">
      <div className="relative min-h-0 flex-1 overflow-hidden rounded-2xl bg-black/40">
        {isVideo ? (
          <video
            src={result.url}
            controls
            className="h-full w-full object-contain"
          />
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={result.url}
            alt="Generated result"
            className="h-full w-full object-contain"
          />
        )}
      </div>
      {/* Actions */}
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() =>
            downloadUrl(
              result.url,
              `aigencys-${activeFlow}-${Date.now()}.${isVideo ? "mp4" : "webp"}`,
            )
          }
          className="flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-white/10 bg-white/5 py-2.5 text-sm text-white/70 transition hover:bg-white/9"
        >
          {isVideo ? (
            <VideoIcon className="h-4 w-4" />
          ) : (
            <Download className="h-4 w-4" />
          )}
          {t("previewDownload")}
        </button>
        <button
          type="button"
          onClick={onRegenerate}
          className="flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-white/10 bg-white/5 py-2.5 text-sm text-white/70 transition hover:bg-white/9"
        >
          <RefreshCw className="h-4 w-4" />
          {t("previewRegenerate")}
        </button>
      </div>
    </div>
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
  const primary = results[primaryIdx];

  return (
    <>
      <div className="flex h-full flex-col gap-3 p-4">
        {/* Primary large image */}
        <div
          className="relative min-h-0 flex-1 cursor-zoom-in overflow-hidden rounded-2xl bg-black/40"
          onClick={() => setLightboxOpen(true)}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={primary.url}
            alt={ANGLE_LABELS[primaryIdx]}
            className="h-full w-full object-contain"
          />
          <div className="pointer-events-none absolute bottom-3 left-3 rounded-full bg-black/50 px-3 py-1 text-[11px] font-semibold text-white backdrop-blur-sm">
            {ANGLE_LABELS[primaryIdx] ?? `Görsel ${primaryIdx + 1}`}
          </div>
        </div>

        {/* Thumbnail strip */}
        <div className="flex gap-2">
          {results.map((r, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setPrimaryIdx(i)}
              className={cn(
                "relative h-16 flex-1 overflow-hidden rounded-xl border transition-all",
                primaryIdx === i
                  ? "border-indigo-500/50 ring-1 ring-indigo-500/30"
                  : "border-white/10 opacity-60 hover:opacity-90",
              )}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={r.url}
                alt={ANGLE_LABELS[i]}
                className="h-full w-full object-cover"
              />
              <div
                className="pointer-events-none absolute inset-x-0 bottom-0 bg-linear-to-t from-black/60 to-transparent px-1 py-1 text-[9px] font-semibold text-white">
                {ANGLE_LABELS[i] ?? i + 1}
              </div>
            </button>
          ))}
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() =>
              downloadUrl(
                primary.url,
                `aigencys-angle-${primaryIdx}-${Date.now()}.webp`,
              )
            }
            className="flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-white/10 bg-white/5 py-2.5 text-sm text-white/70 transition hover:bg-white/9"
          >
            <Download className="h-4 w-4" />
            {t("previewDownloadSelected")}
          </button>
          <button
            type="button"
            onClick={onRegenerate}
            className="flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-white/10 bg-white/5 py-2.5 text-sm text-white/70 transition hover:bg-white/9"
          >
            <RefreshCw className="h-4 w-4" />
            {t("previewRegenerate")}
          </button>
        </div>
      </div>

      {lightboxOpen && (
        <Lightbox
          images={results}
          startIndex={primaryIdx}
          onClose={() => setLightboxOpen(false)}
        />
      )}
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
        "glass-panel flex min-h-80 flex-col overflow-hidden",
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
