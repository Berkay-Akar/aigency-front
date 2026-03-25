import type { StudioStep } from "@/store/studio-store";

export type StudioCreativeModeId =
  | "image_to_professional"
  | "same_product_models"
  | "same_model_products"
  | "multi_angle"
  | "lighting_variations"
  | "image_to_video_ads";

export interface StudioModePreset {
  activeStep: StudioStep;
  variantType?: string;
  outputTypes?: string[];
  stylePreset?: string;
  bgType?: string;
  targetStyle?: string;
  videoMotion?: string;
  videoDuration?: 6 | 10 | 15;
  videoAspect?: string;
}

export const STUDIO_CREATIVE_MODES: {
  id: StudioCreativeModeId;
  title: string;
  description: string;
  badge: string;
  preset: StudioModePreset;
}[] = [
  {
    id: "image_to_professional",
    title: "Görselden profesyonel görsele",
    description: "Amatör çekimi stüdyo kalitesine taşıyın; ışık, fon ve renk düzeltmesi.",
    badge: "Popüler",
    preset: {
      activeStep: "professionalize",
      outputTypes: ["packshot", "pdp", "social"],
      stylePreset: "e-commerce",
      bgType: "white",
    },
  },
  {
    id: "same_product_models",
    title: "Aynı ürün · çoklu model",
    description: "Tek SKU’yu farklı model ve yaşam tarzı varyasyonlarıyla üretin.",
    badge: "Pro",
    preset: {
      activeStep: "campaign",
      variantType: "scenario",
      targetStyle: "young",
    },
  },
  {
    id: "same_model_products",
    title: "Aynı model · çoklu ürün",
    description: "Sabit model kimliğiyle koleksiyon ve lookbook çıktıları.",
    badge: "Yeni",
    preset: {
      activeStep: "campaign",
      variantType: "style",
      targetStyle: "luxury",
    },
  },
  {
    id: "multi_angle",
    title: "Çoklu açı ürün çekimi",
    description: "Ön, yan, 45° ve detay kırılımlarıyla PDP seti oluşturun.",
    badge: "Hızlı",
    preset: {
      activeStep: "campaign",
      variantType: "angle",
      targetStyle: "premium",
    },
  },
  {
    id: "lighting_variations",
    title: "Işık varyasyonları",
    description: "Soft, hard ve editorial ışık ortamlarında A/B test materyali.",
    badge: "A/B",
    preset: {
      activeStep: "campaign",
      variantType: "lighting",
      targetStyle: "minimal",
    },
  },
  {
    id: "image_to_video_ads",
    title: "Profesyonel görselden video reklam",
    description: "Push-in, orbit ve spotlight ile 6–15 sn reklam kırılımları.",
    badge: "Beta",
    preset: {
      activeStep: "video",
      videoMotion: "push-in",
      videoDuration: 6,
      videoAspect: "9:16",
    },
  },
];

export function getStudioModeById(id: string) {
  return STUDIO_CREATIVE_MODES.find((m) => m.id === id);
}
