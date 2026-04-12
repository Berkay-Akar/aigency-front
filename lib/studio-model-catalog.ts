import type { AiGenerationMode } from "@/lib/api";

/** Fiyat kademesi — API `modelTier` ile eşlenir: ucuz→fast, orta→standard, pahali→premium */
export type StudioPriceTier = "ucuz" | "orta" | "pahali";

export interface StudioCatalogModel {
  label: string;
  falModelId: string;
}

export type StudioModeCatalog = {
  ucuz: StudioCatalogModel[];
  orta: StudioCatalogModel[];
  pahali: StudioCatalogModel[];
  all: readonly string[];
};

export const STUDIO_MODEL_CATALOG: Record<AiGenerationMode, StudioModeCatalog> =
  {
    "text-to-image": {
      ucuz: [
        { label: "Nano Banana", falModelId: "fal-ai/nano-banana" },
        { label: "Imagen 3", falModelId: "fal-ai/imagen3/fast" },
      ],
      orta: [
        { label: "Nano Banana 2", falModelId: "fal-ai/nano-banana-2" },
        { label: "Imagen 3", falModelId: "fal-ai/imagen3" },
        { label: "Recraft v4", falModelId: "fal-ai/recraft/v4/text-to-image" },
      ],
      pahali: [
        { label: "Nano Banana Pro", falModelId: "fal-ai/nano-banana-pro" },
        {
          label: "Imagen 4",
          falModelId: "fal-ai/imagen4/preview/ultra",
        },
        { label: "Flux 2 Pro", falModelId: "fal-ai/flux-2-pro" },
      ],
      all: [
        "fal-ai/nano-banana",
        "fal-ai/imagen3/fast",
        "fal-ai/nano-banana-2",
        "fal-ai/imagen3",
        "fal-ai/recraft/v4/text-to-image",
        "fal-ai/nano-banana-pro",
        "fal-ai/imagen4/preview/ultra",
        "fal-ai/flux-2-pro",
      ],
    },
    "image-to-image": {
      ucuz: [
        {
          label: "Gemini 3.1",
          falModelId: "fal-ai/gemini-3.1-flash-image-preview/edit",
        },
        { label: "Nano Banana", falModelId: "fal-ai/nano-banana/edit" },
      ],
      orta: [
        {
          label: "Flux Kontext Max",
          falModelId: "fal-ai/flux-pro/kontext/max/multi",
        },
        {
          label: "Nano Banana 2",
          falModelId: "fal-ai/nano-banana-2/edit",
        },
        {
          label: "Kling Image O3",
          falModelId: "fal-ai/kling-image/o3/image-to-image",
        },
      ],
      pahali: [
        {
          label: "Nano Banana Pro",
          falModelId: "fal-ai/nano-banana-pro/edit",
        },
        { label: "Flux 2 Pro", falModelId: "fal-ai/flux-2-pro/edit" },
      ],
      all: [
        "fal-ai/gemini-3.1-flash-image-preview/edit",
        "fal-ai/nano-banana/edit",
        "fal-ai/flux-pro/kontext/max/multi",
        "fal-ai/nano-banana-2/edit",
        "fal-ai/kling-image/o3/image-to-image",
        "fal-ai/nano-banana-pro/edit",
        "fal-ai/flux-2-pro/edit",
      ],
    },
    "image-to-video": {
      ucuz: [
        {
          label: "Kling v2.1",
          falModelId: "fal-ai/kling-video/v2.1/standard/image-to-video",
        },
        {
          label: "Pixverse v3.5",
          falModelId: "fal-ai/pixverse/v3.5/image-to-video/fast",
        },
      ],
      orta: [
        {
          label: "Kling v2.1 Pro",
          falModelId: "fal-ai/kling-video/v2.1/pro/image-to-video",
        },
        { label: "Sora 2", falModelId: "fal-ai/sora-2/image-to-video" },
        {
          label: "Veo 3.1",
          falModelId: "fal-ai/veo3.1/fast/image-to-video",
        },
      ],
      pahali: [
        {
          label: "Sora 2 Pro",
          falModelId: "fal-ai/sora-2/image-to-video/pro",
        },
        {
          label: "Kling v2.1",
          falModelId: "fal-ai/kling-video/v2.1/master/image-to-video",
        },
        { label: "Veo 3.1", falModelId: "fal-ai/veo3.1/image-to-video" },
      ],
      all: [
        "fal-ai/kling-video/v2.1/standard/image-to-video",
        "fal-ai/pixverse/v3.5/image-to-video/fast",
        "fal-ai/kling-video/v2.1/pro/image-to-video",
        "fal-ai/sora-2/image-to-video",
        "fal-ai/veo3.1/fast/image-to-video",
        "fal-ai/sora-2/image-to-video/pro",
        "fal-ai/kling-video/v2.1/master/image-to-video",
        "fal-ai/veo3.1/image-to-video",
      ],
    },
  } as const;

export const STUDIO_PRICE_TIERS: StudioPriceTier[] = ["ucuz", "orta", "pahali"];

export function modelsForModeAndTier(
  mode: AiGenerationMode,
  tier: StudioPriceTier,
): StudioCatalogModel[] {
  return [...STUDIO_MODEL_CATALOG[mode][tier]];
}

export function defaultFalModelId(
  mode: AiGenerationMode,
  tier: StudioPriceTier,
): string {
  const list = STUDIO_MODEL_CATALOG[mode][tier];
  return list[0]?.falModelId ?? STUDIO_MODEL_CATALOG[mode].all[0]!;
}

export function isFalModelAllowedForMode(
  mode: AiGenerationMode,
  falModelId: string,
): boolean {
  return (STUDIO_MODEL_CATALOG[mode].all as readonly string[]).includes(
    falModelId,
  );
}

/** Seçili model hangi fiyat kademesinde (dropdown senkronu için). */
export function priceTierForModel(
  mode: AiGenerationMode,
  falModelId: string,
): StudioPriceTier | null {
  for (const tier of STUDIO_PRICE_TIERS) {
    if (
      STUDIO_MODEL_CATALOG[mode][tier].some((m) => m.falModelId === falModelId)
    ) {
      return tier;
    }
  }
  return null;
}

/** Tetikleyici / özet satırı için katalog etiketi (Base UI Value bazen sadece id gösteriyor). */
export function labelForFalModelInMode(
  mode: AiGenerationMode,
  falModelId: string,
): string {
  for (const tier of STUDIO_PRICE_TIERS) {
    const found = STUDIO_MODEL_CATALOG[mode][tier].find(
      (m) => m.falModelId === falModelId,
    );
    if (found) return found.label;
  }
  return falModelId;
}
