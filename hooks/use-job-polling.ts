"use client";

import { useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { aiApi } from "@/lib/api";
import { useStudioStore } from "@/store/studio-store";

/**
 * Polls GET /jobs/:jobId every 2.5 seconds while a job is in progress.
 * Updates studio store with job status and results when complete.
 */
export function useJobPolling() {
  const { jobId, jobStatus, setJobStatus, setResults } = useStudioStore();
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
      setJobStatus("processing", job.progress ?? 50);
    }

    if (job.status === "completed" && toastedRef.current !== job.id) {
      toastedRef.current = job.id;
      setResults(
        job.result?.images ?? [],
        job.result?.caption,
        job.result?.hashtags
      );
      toast.success("Üretim tamamlandı. Çıktılar hazır.");
    }

    if (job.status === "failed" && toastedRef.current !== job.id) {
      toastedRef.current = job.id;
      setJobStatus("failed", 0);
      toast.error(job.error ?? "Üretim başarısız. Tekrar deneyin.");
    }
  }, [job, setJobStatus, setResults]);
}
