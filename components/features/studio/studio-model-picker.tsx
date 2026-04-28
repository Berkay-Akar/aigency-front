"use client";

import { useEffect } from "react";
import { useTranslations } from "next-intl";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import type { AiGenerationMode } from "@/lib/api";
import {
  labelForFalModelInMode,
  modelsForModeAndTier,
  STUDIO_PRICE_TIERS,
  type StudioPriceTier,
} from "@/lib/studio-model-catalog";

const TIER_LABEL_KEYS: Record<StudioPriceTier, string> = {
  ucuz: "tierFast",
  orta: "tierStandard",
  pahali: "tierPremium",
};

type GenKey = Parameters<ReturnType<typeof useTranslations<"generation">>>[0];

function liquidPill(active: boolean) {
  return cn(
    "rounded-xl border px-2 py-2.5 text-center text-[11px] font-medium backdrop-blur-sm transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/40 sm:text-xs",
    active
      ? "border-indigo-500/50 bg-indigo-500/25 text-indigo-100 shadow-[inset_0_1px_0_rgba(255,255,255,0.12)]"
      : "border-border bg-foreground/[0.05] text-foreground/50 hover:border-border hover:bg-foreground/[0.08] hover:text-foreground/75",
  );
}

export function StudioModelPicker({
  mode,
  studioPriceTier,
  falModelId,
  onModeChange,
  onStudioPriceTierChange,
  onFalModelIdChange,
}: {
  mode: AiGenerationMode;
  studioPriceTier: StudioPriceTier;
  falModelId: string;
  onModeChange: (m: AiGenerationMode) => void;
  onStudioPriceTierChange: (t: StudioPriceTier) => void;
  onFalModelIdChange: (id: string) => void;
}) {
  const t = useTranslations("generation");
  const modelChoices = modelsForModeAndTier(mode, studioPriceTier);
  const valueInList = modelChoices.some((m) => m.falModelId === falModelId);
  const selectValue = valueInList ? falModelId : modelChoices[0]?.falModelId;
  const activeDisplayLabel =
    selectValue != null
      ? labelForFalModelInMode(mode, selectValue)
      : labelForFalModelInMode(mode, falModelId);

  useEffect(() => {
    const choices = modelsForModeAndTier(mode, studioPriceTier);
    const ok = choices.some((m) => m.falModelId === falModelId);
    if (!ok && choices[0]) {
      onFalModelIdChange(choices[0].falModelId);
    }
  }, [mode, studioPriceTier, falModelId, onFalModelIdChange]);

  return (
    <div className="space-y-4">
      <div>
        <Label className="mb-2 block text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
          {t("tierSection")}
        </Label>
        <div className="grid grid-cols-3 gap-2">
          {STUDIO_PRICE_TIERS.map((tierId) => (
            <button
              key={tierId}
              type="button"
              onClick={() => onStudioPriceTierChange(tierId)}
              className={liquidPill(studioPriceTier === tierId)}
            >
              {t(TIER_LABEL_KEYS[tierId] as GenKey)}
            </button>
          ))}
        </div>
      </div>

      <div>
        <Label className="mb-2 block text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
          {t("modelNameLabel")}
        </Label>
        <Select
          value={selectValue}
          onValueChange={(v) => onFalModelIdChange(String(v))}
        >
          <SelectTrigger
            size="default"
            className="h-10 w-full text-sm text-foreground data-placeholder:text-foreground/40"
          >
            <SelectValue placeholder={t("modelNameLabel")}>
              {(v) =>
                typeof v === "string" && v
                  ? labelForFalModelInMode(mode, v)
                  : activeDisplayLabel
              }
            </SelectValue>
          </SelectTrigger>
          <SelectContent align="start" sideOffset={6}>
            {modelChoices.map((m) => (
              <SelectItem key={m.falModelId} value={m.falModelId}>
                {m.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
