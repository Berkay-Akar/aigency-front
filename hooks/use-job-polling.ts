"use client";

import { useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { aiApi } from "@/lib/api";
import { useStudioStore } from "@/store/studio-store";

function jobLabel(mode: string) {
  if (mode === "image-to-video") return "Video";
  if (mode === "text-to-image") return "Text to image";
  return "Image to image";
}

/**
 * Polls GET /jobs/:jobId while a job is in progress.
 * Updates studio store when complete or failed.
 */
export function useJobPolling() {
  const t = useTranslations("studio");
  const jobId = useStudioStore((s) => s.jobId);
  const jobStatus = useStudioStore((s) => s.jobStatus);
  const generationMode = useStudioStore((s) => s.generationMode);
  const setJobStatus = useStudioStore((s) => s.setJobStatus);
  const setResult = useStudioStore((s) => s.setResult);
  const setGenerationError = useStudioStore((s) => s.setGenerationError);
  const toastedRef = useRef<string | null>(null);

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

    if (job.status === "completed" && job.result && toastedRef.current !== job.id) {
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
  }, [
    job,
    generationMode,
    setJobStatus,
    setResult,
    setGenerationError,
    t,
  ]);
}
