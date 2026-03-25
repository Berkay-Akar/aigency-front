"use client";

import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { workspaceApi, billingApi, healthApi } from "@/lib/api";
import { useAppStore } from "@/store/app-store";

/**
 * Fetches workspace name, credit balance, and API health.
 * Syncs results into global Zustand app store.
 */
export function useWorkspaceData() {
  const { setWorkspace, setCredits } = useAppStore();

  const workspaceQ = useQuery({
    queryKey: ["workspace"],
    queryFn: () => workspaceApi.get(),
  });

  const balanceQ = useQuery({
    queryKey: ["billing", "balance"],
    queryFn: () => billingApi.getBalance(),
  });

  const healthQ = useQuery({
    queryKey: ["health"],
    queryFn: () => healthApi.check(),
    refetchInterval: 60_000,
  });

  // Sync workspace name into global store
  useEffect(() => {
    if (workspaceQ.data?.name) {
      setWorkspace(workspaceQ.data.name);
    }
  }, [workspaceQ.data, setWorkspace]);

  // Sync credits into global store
  useEffect(() => {
    if (balanceQ.data?.credits !== undefined) {
      setCredits(balanceQ.data.credits);
    }
  }, [balanceQ.data, setCredits]);

  return {
    workspace: workspaceQ.data,
    balance: balanceQ.data,
    health: healthQ.data,
    isLoading: workspaceQ.isLoading || balanceQ.isLoading,
  };
}
