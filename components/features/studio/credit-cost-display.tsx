"use client";

import { useTranslations } from "next-intl";
import { Zap } from "lucide-react";
import { useStudioStore } from "@/store/studio-store";

export function CreditCostDisplay() {
  const t = useTranslations("studio");
  const credits = useStudioStore((s) => s.getEstimatedCredits());
  const last = useStudioStore((s) => s.lastCreditsCost);

  return (
    <div className="flex items-center justify-between gap-3 rounded-2xl border border-border bg-gradient-to-r from-indigo-500/[0.08] to-violet-500/[0.06] px-4 py-3">
      <div className="flex items-center gap-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-indigo-500/15">
          <Zap className="h-4 w-4 text-indigo-400" aria-hidden />
        </div>
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
            {t("estimatedCredits")}
          </p>
          <p className="text-lg font-semibold tabular-nums text-foreground">
            {last !== null ? last : credits}{" "}
            <span className="text-sm font-normal text-foreground/45">
              {t("credits")}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
