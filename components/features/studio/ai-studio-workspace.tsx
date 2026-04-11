"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { SlidersHorizontal } from "lucide-react";
import { useJobPolling } from "@/hooks/use-job-polling";
import { useWorkspaceData } from "@/hooks/use-workspace-data";
import { ControlPanel } from "./control-panel";
import { PreviewPanel } from "./preview-panel";
import { RecentGenerationsList } from "./recent-generations-list";
import { MobileControlDrawer } from "./mobile-control-drawer";

export function AiStudioWorkspace() {
  useWorkspaceData();
  useJobPolling();

  const t = useTranslations("studio");
  const [mobileControlsOpen, setMobileControlsOpen] = useState(false);

  return (
    <div className="relative flex h-full min-h-0 flex-col gap-4 p-4 md:p-5 lg:flex-row lg:gap-6">
      <aside className="hidden w-full shrink-0 lg:block lg:w-[380px] lg:max-w-[420px]">
        <div className="lg:sticky lg:top-0 lg:max-h-[calc(100vh-60px-2.5rem)]">
          <ControlPanel className="h-full max-h-[calc(100vh-60px-2.5rem)]" />
        </div>
      </aside>

      <div className="flex min-h-0 min-w-0 flex-1 flex-col gap-4">
        <PreviewPanel className="order-1 min-h-[280px] flex-1 lg:min-h-0" />
        <RecentGenerationsList className="order-2 shrink-0" />
      </div>

      <MobileControlDrawer
        open={mobileControlsOpen}
        onOpenChange={setMobileControlsOpen}
        title={t("configure")}
      >
        <ControlPanel className="border-0 bg-transparent p-0 shadow-none backdrop-blur-none" />
      </MobileControlDrawer>

      <button
        type="button"
        onClick={() => setMobileControlsOpen(true)}
        className="fixed bottom-20 right-4 z-40 flex h-12 items-center gap-2 rounded-2xl border border-white/[0.12] bg-[#0c0c0c]/95 px-4 text-sm font-semibold text-white shadow-xl shadow-black/40 backdrop-blur-md transition-transform hover:scale-[1.02] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/50 lg:hidden"
      >
        <SlidersHorizontal className="h-4 w-4 text-indigo-400" aria-hidden />
        {t("configure")}
      </button>
    </div>
  );
}
