"use client";

import { useState } from "react";
import { SlidersHorizontal, RefreshCw } from "lucide-react";
import { useTranslations } from "next-intl";
import { useProductJobPolling } from "@/hooks/use-job-polling";
import { useWorkspaceData } from "@/hooks/use-workspace-data";
import { useStudioStore } from "@/store/studio-store";
import { cn } from "@/lib/utils";
import { ProductPreviewPanel } from "./product-preview-panel";
import { ProductControlPanel } from "./product-control-panel";
import { ActiveFlowForm } from "./product-control-panel";
import { FlowTabBar } from "./flow-tab-bar";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

// ─── Right: product recent sessions panel ────────────────────────────────────
function ProductRecentPanel({ className }: { className?: string }) {
  const t = useTranslations("productStudio");
  const sessions = useStudioStore((s) => s.productRecentSessions);
  const startProductGeneration = useStudioStore(
    (s) => s.startProductGeneration,
  );

  if (sessions.length === 0) {
    return (
      <div
        className={cn(
          "rounded-2xl border border-dashed border-border p-5 text-center text-xs text-muted-foreground",
          className,
        )}
      >
        {t("noRecentProduct")}
      </div>
    );
  }

  return (
    <div
      className={cn(
        "flex flex-col gap-3 overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
        className,
      )}
    >
      <p className="shrink-0 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
        {t("recentGenerations")}
      </p>
      {sessions.map((session) => (
        <div
          key={session.id}
          className="shrink-0 overflow-hidden rounded-2xl border border-border bg-foreground/[0.02]"
        >
          {/* Thumbnail grid */}
          <div
            className={cn(
              "grid gap-0.5",
              session.results.length === 1 ? "grid-cols-1" : "grid-cols-2",
            )}
          >
            {session.results.slice(0, 4).map((r, i) => (
              <div
                key={i}
                className="relative aspect-square overflow-hidden bg-black/30"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={r.url}
                  alt=""
                  className="h-full w-full object-cover"
                />
              </div>
            ))}
          </div>
          {/* Footer */}
          <div className="flex items-center justify-between gap-1 px-2.5 py-2">
            <span className="text-[10px] text-muted-foreground">
              {session.at}
            </span>
            <button
              type="button"
              onClick={() => void startProductGeneration()}
              className="flex items-center gap-1 rounded-lg px-2 py-1 text-[10px] font-semibold text-foreground/50 transition hover:bg-foreground/[0.06] hover:text-foreground/80"
            >
              <RefreshCw className="h-3 w-3" />
              {t("previewRegenerate")}
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

export function ProductStudioWorkspace() {
  useWorkspaceData();
  useProductJobPolling();

  const t = useTranslations("productStudio");
  const [mobileOpen, setMobileOpen] = useState(false);
  const activeProductFlow = useStudioStore((s) => s.activeProductFlow);

  return (
    <div className="relative flex h-full min-h-0 flex-col gap-4 p-4 md:p-5 lg:flex-row lg:gap-5">
      {/* ── Left: flow form ──────────────────────────────────────────── */}
      <aside className="hidden w-full shrink-0 lg:block lg:w-90 xl:w-100">
        <ProductControlPanel className="h-full max-h-[calc(100vh-60px-44px-2.5rem)]" />
      </aside>

      {/* ── Center: preview ──────────────────────────────────────────── */}
      <div className="flex min-h-0 min-w-0 flex-1 flex-col">
        <ProductPreviewPanel className="min-h-70 flex-1 lg:min-h-0" />
      </div>

      {/* ── Right: recent sessions ───────────────────────────────────── */}
      {/* <aside className="hidden w-50 shrink-0 xl:block xl:w-55">
        <ProductRecentPanel className="h-full max-h-[calc(100vh-60px-44px-2.5rem)]" />
      </aside> */}

      {/* ── Mobile drawer ────────────────────────────────────────────── */}
      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetContent
          side="bottom"
          className="glass-panel max-h-[90svh] rounded-t-3xl border-0 shadow-2xl"
        >
          <SheetHeader className="px-5 pb-0 pt-4">
            <SheetTitle className="text-sm font-semibold text-foreground/70">
              {t("flowSettingsTitle")}
            </SheetTitle>
          </SheetHeader>
          <div className="overflow-y-auto px-5 pb-6">
            <div className="mb-4">
              <FlowTabBar />
            </div>
            <ActiveFlowForm flow={activeProductFlow} />
          </div>
        </SheetContent>
      </Sheet>

      {/* ── Mobile FAB ──────────────────────────────────────────────── */}
      <button
        type="button"
        onClick={() => setMobileOpen(true)}
        className="glass-trigger fixed bottom-20 right-4 z-40 flex h-12 items-center gap-2 rounded-2xl px-4 text-sm font-semibold text-foreground shadow-xl shadow-black/40 transition-transform hover:scale-[1.02] hover:bg-foreground/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/50 lg:hidden"
      >
        <SlidersHorizontal className="h-4 w-4 text-indigo-400" aria-hidden />
        {t("settings")}
      </button>
    </div>
  );
}
