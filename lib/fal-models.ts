import type { ModelTier } from "@/lib/api";
import type { StudioPriceTier } from "@/lib/studio-model-catalog";

const PRICE_TO_API_TIER: Record<StudioPriceTier, ModelTier> = {
  ucuz: "fast",
  orta: "standard",
  pahali: "premium",
};

/** Backend `modelTier` alanı ile uyumluluk. */
export function priceTierToModelTier(tier: StudioPriceTier): ModelTier {
  return PRICE_TO_API_TIER[tier];
}
