"use client";

import { useEffect, useRef } from "react";
import { useQuery, useQueries } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { aiApi } from "@/lib/api";
import { useStudioStore } from "@/store/studio-store";
import type { GenerationResult } from "@/store/studio-store";

function jobLabel(mode: string) {
  if (mode === "image-to-video") return "Video";
  if (mode === "text-to-image") return "Text to image";
  return "Image to image";
}

/**
 * Polls GET /jobs/:jobId while a job is in progress.
 * Updates studio store when complete or failed.
 */
const SESSION_JOB_KEY = "aigencys-job-id";

export function useJobPolling() {
  const t = useTranslations("studio");
  const jobId = useStudioStore((s) => s.jobId);
  const jobStatus = useStudioStore((s) => s.jobStatus);
  const generationMode = useStudioStore((s) => s.generationMode);
  const setJobStatus = useStudioStore((s) => s.setJobStatus);
  const setResult = useStudioStore((s) => s.setResult);
  const setGenerationError = useStudioStore((s) => s.setGenerationError);
  const toastedRef = useRef<string | null>(null);

  // On mount: restore an in-progress job from sessionStorage so polling
  // resumes after a page refresh.
  useEffect(() => {
    const saved = sessionStorage.getItem(SESSION_JOB_KEY);
    if (saved && !useStudioStore.getState().jobId) {
      useStudioStore.setState({
        jobId: saved,
        jobStatus: "processing",
        isGenerating: true,
        progress: 0,
      });
    }
  }, []);

  // Persist active jobId so a page refresh can recover it.
  useEffect(() => {
    if (jobId && (jobStatus === "queued" || jobStatus === "processing")) {
      sessionStorage.setItem(SESSION_JOB_KEY, jobId);
    } else {
      sessionStorage.removeItem(SESSION_JOB_KEY);
    }
  }, [jobId, jobStatus]);

  const isActive =
    !!jobId && (jobStatus === "queued" || jobStatus === "processing");

  const { data: job } = useQuery({
    queryKey: ["job", jobId],
    queryFn: () => aiApi.getJob(jobId!),
    enabled: isActive,
    refetchInterval: isActive ? 2500 : false,
  });

  useEffect(() => {
    if (!job) return;

    if (job.status === "processing") {
      setJobStatus("processing", job.progress ?? 55);
    }

    if (
      job.status === "completed" &&
      job.result &&
      toastedRef.current !== job.id
    ) {
      toastedRef.current = job.id;
      setResult(job.result, jobLabel(generationMode));
      toast.success(t("jobComplete"));
    }

    if (job.status === "failed" && toastedRef.current !== job.id) {
      toastedRef.current = job.id;
      const msg = job.failedReason ?? job.error ?? t("jobFailed");
      setGenerationError(msg);
      toast.error(msg);
    }
  }, [job, generationMode, setJobStatus, setResult, setGenerationError, t]);
}

/**
 * Polls all product job IDs (supports 1–3 parallel jobs for product-angles).
 * Updates productResults as each job finishes; sets isProductGenerating=false when all done.
 */
export function useProductJobPolling() {
  const productJobIds = useStudioStore((s) => s.productJobIds);
  const isProductGenerating = useStudioStore((s) => s.isProductGenerating);
  const setProductResults = useStudioStore((s) => s.setProductResults);
  const setProductError = useStudioStore((s) => s.setProductError);
  const setProductProgress = useStudioStore((s) => s.setProductProgress);
  const toastedRef = useRef<string | null>(null);

  const enabled = isProductGenerating && productJobIds.length > 0;

  const jobQueries = useQueries({
    queries: productJobIds.map((jobId) => ({
      queryKey: ["product-job", jobId],
      queryFn: () => aiApi.getJob(jobId),
      enabled,
      refetchInterval: enabled ? 2500 : (false as const),
    })),
  });

  useEffect(() => {
    if (!enabled || jobQueries.length === 0) return;

    const anyFailed = jobQueries.some((q) => q.data?.status === "failed");
    if (anyFailed) {
      const failedQ = jobQueries.find((q) => q.data?.status === "failed");
      const msg =
        failedQ?.data?.failedReason ??
        failedQ?.data?.error ??
        "Üretim başarısız";
      if (toastedRef.current !== msg) {
        toastedRef.current = msg;
        setProductError(msg);
        toast.error(msg);
      }
      return;
    }

    // Update progress from the fastest-progressing job
    const progresses = jobQueries
      .map((q) => q.data?.progress ?? 0)
      .filter((p) => p > 0);
    if (progresses.length > 0) {
      const avg = Math.round(
        progresses.reduce((a, b) => a + b, 0) / progresses.length,
      );
      if (avg > 0) setProductProgress(avg);
    }

    const allCompleted = jobQueries.every(
      (q) => q.data?.status === "completed" && q.data.result,
    );
    if (allCompleted) {
      const successKey = productJobIds.join(",");
      if (toastedRef.current === successKey) return;
      toastedRef.current = successKey;

      const results = jobQueries
        .map((q) => q.data?.result)
        .filter((r): r is GenerationResult => !!r);
      setProductResults(results);
      toast.success("Üretim tamamlandı!");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [jobQueries.map((q) => q.data?.status).join(","), enabled]);
}
