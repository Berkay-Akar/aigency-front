"use client";

import { useCallback, useState } from "react";
import { useTranslations } from "next-intl";
import { SlidersHorizontal } from "lucide-react";
import { BuyCreditsModal } from "@/components/features/billing/buy-credits-modal";
import { useJobPolling } from "@/hooks/use-job-polling";
import { useStudioGenerationErrorToast } from "@/hooks/use-studio-generation-error-toast";
import { useWorkspaceData } from "@/hooks/use-workspace-data";
import { useFaviconStatus } from "@/hooks/use-favicon-status";
import { ControlPanel } from "./control-panel";
import { PreviewPanel } from "./preview-panel";
import { RecentGenerationsList } from "./recent-generations-list";
import { MobileControlDrawer } from "./mobile-control-drawer";

export function AiStudioWorkspace() {
  useWorkspaceData();
  useJobPolling();
  useFaviconStatus();

  const t = useTranslations("studio");
  const [mobileControlsOpen, setMobileControlsOpen] = useState(false);
  const [buyCreditsOpen, setBuyCreditsOpen] = useState(false);

  const openBuyCredits = useCallback(() => setBuyCreditsOpen(true), []);
  useStudioGenerationErrorToast({ onBuyCredits: openBuyCredits });

  return (
    <div className="relative flex h-full min-h-0 flex-col gap-4 p-4 md:p-5 lg:flex-row lg:gap-5">
      <BuyCreditsModal open={buyCreditsOpen} onOpenChange={setBuyCreditsOpen} />

      {/* ── Left: controls ───────────────────────────────────────────── */}
      <aside className="hidden w-full shrink-0 lg:block lg:w-90 xl:w-100">
        <ControlPanel className="h-full max-h-[calc(100vh-60px-52px-2.5rem)]" />
      </aside>

      {/* ── Center: preview ──────────────────────────────────────────── */}
      <div className="flex min-h-0 min-w-0 flex-1 flex-col">
        <PreviewPanel className="min-h-70 flex-1 lg:min-h-0" />
      </div>

      {/* ── Right: recent generations ────────────────────────────────── */}
      {/* <aside className="hidden w-55 shrink-0 xl:block xl:w-60">
        <RecentGenerationsList
          vertical
          className="h-full max-h-[calc(100vh-60px-52px-2.5rem)]"
        />
      </aside> */}

      {/* ── Mobile drawer ────────────────────────────────────────────── */}
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
        className="glass-trigger fixed bottom-20 right-4 z-40 flex h-12 items-center gap-2 rounded-2xl px-4 text-sm font-semibold text-foreground shadow-xl shadow-black/40 transition-transform hover:scale-[1.02] hover:bg-foreground/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/50 lg:hidden"
      >
        <SlidersHorizontal className="h-4 w-4 text-indigo-400" aria-hidden />
        {t("configure")}
      </button>
    </div>
  );
}
