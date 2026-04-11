import type { AiGenerationMode, ModelTier } from "@/lib/api";

export const FAL_MODEL_MAP = {
  "text-to-image": {
    fast: "fal-ai/imagen3/fast",
    standard: "fal-ai/imagen3",
    premium: "fal-ai/flux-2-pro",
  },
  "image-to-image": {
    fast: "fal-ai/nano-banana/edit",
    standard: "fal-ai/flux-pro/kontext/max/multi",
    premium: "fal-ai/nano-banana-pro/edit",
  },
  "image-to-video": {
    fast: "fal-ai/kling-video/v2.1/standard/image-to-video",
    standard: "fal-ai/kling-video/v2.1/pro/image-to-video",
    premium: "fal-ai/kling-video/v2.1/master/image-to-video",
  },
} as const satisfies Record<AiGenerationMode, Record<ModelTier, string>>;

export interface StudioModelOption {
  /** Stable composite key, e.g. "tti-fast". */
  value: string;
  mode: AiGenerationMode;
  tier: ModelTier;
  /** Full fal.ai model identifier (display only; API uses mode + tier). */
  modelId: string;
  /** i18n key under the "generation" namespace. */
  labelKey: string;
  credits: number;
}

export const STUDIO_MODEL_OPTIONS: StudioModelOption[] = [
  // text-to-image
  {
    value: "tti-fast",
    mode: "text-to-image",
    tier: "fast",
    modelId: FAL_MODEL_MAP["text-to-image"].fast,
    labelKey: "modelTtiFast",
    credits: 10,
  },
  {
    value: "tti-standard",
    mode: "text-to-image",
    tier: "standard",
    modelId: FAL_MODEL_MAP["text-to-image"].standard,
    labelKey: "modelTtiStandard",
    credits: 10,
  },
  {
    value: "tti-premium",
    mode: "text-to-image",
    tier: "premium",
    modelId: FAL_MODEL_MAP["text-to-image"].premium,
    labelKey: "modelTtiPremium",
    credits: 10,
  },
  // image-to-image
  {
    value: "iti-fast",
    mode: "image-to-image",
    tier: "fast",
    modelId: FAL_MODEL_MAP["image-to-image"].fast,
    labelKey: "modelItiFast",
    credits: 10,
  },
  {
    value: "iti-standard",
    mode: "image-to-image",
    tier: "standard",
    modelId: FAL_MODEL_MAP["image-to-image"].standard,
    labelKey: "modelItiStandard",
    credits: 10,
  },
  {
    value: "iti-premium",
    mode: "image-to-image",
    tier: "premium",
    modelId: FAL_MODEL_MAP["image-to-image"].premium,
    labelKey: "modelItiPremium",
    credits: 10,
  },
  // image-to-video
  {
    value: "itv-fast",
    mode: "image-to-video",
    tier: "fast",
    modelId: FAL_MODEL_MAP["image-to-video"].fast,
    labelKey: "modelItvFast",
    credits: 50,
  },
  {
    value: "itv-standard",
    mode: "image-to-video",
    tier: "standard",
    modelId: FAL_MODEL_MAP["image-to-video"].standard,
    labelKey: "modelItvStandard",
    credits: 50,
  },
  {
    value: "itv-premium",
    mode: "image-to-video",
    tier: "premium",
    modelId: FAL_MODEL_MAP["image-to-video"].premium,
    labelKey: "modelItvPremium",
    credits: 50,
  },
];

export function getModelOption(
  mode: AiGenerationMode,
  tier: ModelTier
): StudioModelOption {
  return (
    STUDIO_MODEL_OPTIONS.find((o) => o.mode === mode && o.tier === tier) ??
    STUDIO_MODEL_OPTIONS[1]
  );
}

export function getModelId(mode: AiGenerationMode, tier: ModelTier): string {
  return FAL_MODEL_MAP[mode][tier];
}

export function parseModelValue(
  value: string
): { mode: AiGenerationMode; tier: ModelTier } | null {
  const option = STUDIO_MODEL_OPTIONS.find((o) => o.value === value);
  if (!option) return null;
  return { mode: option.mode, tier: option.tier };
}
