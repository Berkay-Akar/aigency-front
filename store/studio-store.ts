import { isAxiosError } from "axios";
import { create } from "zustand";
import {
  aiApi,
  productApi,
  type AiAspectRatio,
  type AiGenerationMode,
  type AiPlatform,
  type AiTone,
  type Asset,
  type GeneratePayload,
  type GenerationJob,
  type JobStatus,
  type ModelPhotoOptions,
  type OutputFormat,
} from "@/lib/api";
import { priceTierToModelTier } from "@/lib/fal-models";
import { buildResolvedReferenceImageUrls } from "@/lib/studio-reference-url";
import {
  defaultFalModelId,
  isFalModelAllowedForMode,
  modelsForModeAndTier,
  priceTierForModel,
  type StudioPriceTier,
} from "@/lib/studio-model-catalog";

type StudioAspectRatio = Exclude<AiAspectRatio, "custom">;

export interface GenerationResult {
  url: string;
  assetId: string;
}

export interface RecentGenerationItem {
  id: string;
  thumb: string;
  label: string;
  at: string;
  assetId?: string;
}

export type StudioUiMode = "quick" | "customize";

export type BackgroundMode = "auto" | "transparent" | "original";

export type ProductFlow =
  | "model-photo"
  | "product-angles"
  | "product-reference"
  | "product-swap"
  | "ghost-mannequin"
  | "photo-to-video";

export type ProductResolution = "1K" | "2K";
export type ProductModelTier = "fast" | "standard" | "premium";

const DEFAULT_STUDIO_MODE: AiGenerationMode = "image-to-image";
const DEFAULT_STUDIO_PRICE_TIER: StudioPriceTier = "orta";

interface StudioState {
  uiMode: StudioUiMode;
  generationMode: AiGenerationMode;
  /** Ucuz / orta / pahalı — API `modelTier` ile eşlenir. */
  studioPriceTier: StudioPriceTier;
  /** Katalogdaki tam fal model yolu. */
  falModelId: string;
  prompt: string;
  enhancePrompt: boolean;
  aspectRatio: StudioAspectRatio;
  outputFormat: OutputFormat;
  /** Önizleme: blob:/data:/http(s) — üretimde blob/data sıkıştırılıp data URL olarak gönderilir. */
  mainReferenceUrl: string | null;
  styleReferenceUrl: string | null;
  backgroundReferenceUrl: string | null;
  duration: 5 | 10;
  platform: AiPlatform;
  tone: AiTone;
  negativePrompt: string;
  seed: number | null;
  styleStrength: number;
  promptStrength: number;
  backgroundMode: BackgroundMode;
  gender: string;
  ageRange: string;
  ethnicity: string;
  skinTone: string;
  hairColor: string;
  hairStyle: string;
  expression: string;
  bodyType: string;
  heightEmphasis: number;
  poseStyle: string;
  cameraFraming: string;
  jobId: string | null;
  jobStatus: JobStatus | null;
  isGenerating: boolean;
  progress: number;
  result: GenerationResult | null;
  generationError: string | null;
  lastCreditsCost: number | null;
  recentGenerations: RecentGenerationItem[];

  // ─── Product Studio ────────────────────────────────────────────────────────
  /** Top-level tab: creative (existing) vs product (6 new flows) */
  studioTab: "creative" | "product";
  activeProductFlow: ProductFlow;
  /** Cached from GET /ai/model-photo/options */
  modelPhotoOptions: ModelPhotoOptions | null;
  /** Shared product image uploads (blob: or https:) */
  productImageUrls: string[];
  productResolution: ProductResolution;
  productModelTier: ProductModelTier;
  productCustomPrompt: string;
  // Flow 1 — Model Photo
  productStyleMode: "with-model" | "product-only";
  modelGender: string;
  modelEthnicity: string;
  modelAge: string;
  modelSkinColor: string;
  modelFaceType: string;
  modelEyeColor: string;
  modelExpression: string;
  modelBodySize: string;
  modelHeight: number;
  modelHairColor: string;
  modelHairstyle: string;
  modelShotType: string;
  productOnlyShotType: string;
  // Flow 2 — Product Angles
  anglesCount: 1 | 2 | 3;
  // Flow 3 — Product Reference
  productReferenceImageUrl: string | null;
  productReferenceStyleMode: "minimal" | "bold";
  // Flow 4 — Product Swap
  productSceneImageUrl: string | null;
  // Flow 5 — Ghost Mannequin
  ghostQuality: "standard" | "premium";
  ghostBackgroundColor: string;
  // Flow 6 — Photo to Video
  videoPlatform: "instagram" | "tiktok" | "general";
  videoDuration: 5 | 10;
  // Product job state
  productJobIds: string[];
  productResults: GenerationResult[];
  isProductGenerating: boolean;
  productError: string | null;
  productProgress: number;
  productLastCreditsCost: number | null;
  productRecentSessions: {
    id: string;
    results: GenerationResult[];
    flow: ProductFlow;
    at: string;
  }[];

  setUiMode: (m: StudioUiMode) => void;
  setGenerationMode: (m: AiGenerationMode) => void;
  setStudioPriceTier: (t: StudioPriceTier) => void;
  setFalModelId: (id: string) => void;
  setPrompt: (p: string) => void;
  setEnhancePrompt: (v: boolean) => void;
  setAspectRatio: (r: StudioAspectRatio) => void;
  setOutputFormat: (f: OutputFormat) => void;
  setMainReferenceUrl: (u: string | null) => void;
  setStyleReferenceUrl: (u: string | null) => void;
  setBackgroundReferenceUrl: (u: string | null) => void;
  setDuration: (d: 5 | 10) => void;
  setPlatform: (p: AiPlatform) => void;
  setTone: (t: AiTone) => void;
  setNegativePrompt: (p: string) => void;
  setSeed: (n: number | null) => void;
  setStyleStrength: (n: number) => void;
  setPromptStrength: (n: number) => void;
  setBackgroundMode: (m: BackgroundMode) => void;
  setGender: (v: string) => void;
  setAgeRange: (v: string) => void;
  setEthnicity: (v: string) => void;
  setSkinTone: (v: string) => void;
  setHairColor: (v: string) => void;
  setHairStyle: (v: string) => void;
  setExpression: (v: string) => void;
  setBodyType: (v: string) => void;
  setHeightEmphasis: (n: number) => void;
  setPoseStyle: (v: string) => void;
  setCameraFraming: (v: string) => void;

  setJobStatus: (status: JobStatus, progress?: number) => void;
  /** Pass `false` as second arg to skip appending to recent (e.g. revisiting a thumb). */
  setResult: (r: GenerationResult | null, recentLabel?: string | false) => void;
  setGenerationError: (e: string | null) => void;
  resetGenerationUi: () => void;
  resetProject: () => void;

  buildComposedPrompt: () => string;
  getEstimatedCredits: () => number;
  getApiImageUrls: () => string[];
  shouldUseMock: () => boolean;

  startGeneration: () => Promise<string | null>;
  runMockGeneration: () => Promise<void>;
  enhancePromptWithApi: () => Promise<boolean>;

  // ─── Product Studio setters ────────────────────────────────────────────────
  setStudioTab: (tab: "creative" | "product") => void;
  setActiveProductFlow: (flow: ProductFlow) => void;
  setModelPhotoOptions: (opts: ModelPhotoOptions | null) => void;
  setProductImageUrls: (urls: string[]) => void;
  setProductResolution: (r: ProductResolution) => void;
  setProductModelTier: (t: ProductModelTier) => void;
  setProductCustomPrompt: (p: string) => void;
  setProductStyleMode: (m: "with-model" | "product-only") => void;
  setModelGender: (v: string) => void;
  setModelEthnicity: (v: string) => void;
  setModelAge: (v: string) => void;
  setModelSkinColor: (v: string) => void;
  setModelFaceType: (v: string) => void;
  setModelEyeColor: (v: string) => void;
  setModelExpression: (v: string) => void;
  setModelBodySize: (v: string) => void;
  setModelHeight: (n: number) => void;
  setModelHairColor: (v: string) => void;
  setModelHairstyle: (v: string) => void;
  setModelShotType: (v: string) => void;
  setProductOnlyShotType: (v: string) => void;
  setAnglesCount: (n: 1 | 2 | 3) => void;
  setProductReferenceImageUrl: (u: string | null) => void;
  setProductReferenceStyleMode: (m: "minimal" | "bold") => void;
  setProductSceneImageUrl: (u: string | null) => void;
  setGhostQuality: (q: "standard" | "premium") => void;
  setGhostBackgroundColor: (c: string) => void;
  setVideoPlatform: (p: "instagram" | "tiktok" | "general") => void;
  setVideoDuration: (d: 5 | 10) => void;
  setProductJobIds: (ids: string[]) => void;
  setProductResults: (results: GenerationResult[]) => void;
  setIsProductGenerating: (v: boolean) => void;
  clearProductRecentSessions: () => void;
  setProductError: (e: string | null) => void;
  setProductProgress: (n: number) => void;
  // ─── Product Studio methods ────────────────────────────────────────────────
  loadModelPhotoOptions: () => Promise<void>;
  startProductGeneration: () => Promise<string[] | null>;
  getProductCreditEstimate: () => number;
  resetProductState: () => void;
  loadFromAsset: (asset: Asset) => void;
}

const MOCK_RESULT =
  "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1024&h=1024&fit=crop";

function delay(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

function randomId() {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

const initialRefs = {
  mainReferenceUrl: null as string | null,
  styleReferenceUrl: null as string | null,
  backgroundReferenceUrl: null as string | null,
};

const initialCustomize = {
  negativePrompt: "",
  seed: null as number | null,
  styleStrength: 72,
  promptStrength: 78,
  backgroundMode: "auto" as BackgroundMode,
  gender: "",
  ageRange: "",
  ethnicity: "",
  skinTone: "",
  hairColor: "",
  hairStyle: "",
  expression: "",
  bodyType: "",
  heightEmphasis: 50,
  poseStyle: "",
  cameraFraming: "",
};

const initialJob = {
  jobId: null as string | null,
  jobStatus: null as JobStatus | null,
  isGenerating: false,
  progress: 0,
  result: null as GenerationResult | null,
  generationError: null as string | null,
  lastCreditsCost: null as number | null,
};

const initialProductState = {
  studioTab: "creative" as "creative" | "product",
  activeProductFlow: "model-photo" as ProductFlow,
  modelPhotoOptions: null as ModelPhotoOptions | null,
  productImageUrls: [] as string[],
  productResolution: "1K" as ProductResolution,
  productModelTier: "standard" as ProductModelTier,
  productCustomPrompt: "",
  productStyleMode: "with-model" as "with-model" | "product-only",
  modelGender: "female",
  modelEthnicity: "international",
  modelAge: "young-adult",
  modelSkinColor: "light",
  modelFaceType: "oval",
  modelEyeColor: "dark-brown",
  modelExpression: "soft-neutral",
  modelBodySize: "m",
  modelHeight: 170,
  modelHairColor: "dark-brown",
  modelHairstyle: "straight-long",
  modelShotType: "full-body",
  productOnlyShotType: "product",
  anglesCount: 1 as 1 | 2 | 3,
  productReferenceImageUrl: null as string | null,
  productReferenceStyleMode: "minimal" as "minimal" | "bold",
  productSceneImageUrl: null as string | null,
  ghostQuality: "standard" as "standard" | "premium",
  ghostBackgroundColor: "white",
  videoPlatform: "instagram" as "instagram" | "tiktok" | "general",
  videoDuration: 5 as 5 | 10,
  productJobIds: [] as string[],
  productResults: [] as GenerationResult[],
  productRecentSessions: [] as {
    id: string;
    results: GenerationResult[];
    flow: ProductFlow;
    at: string;
  }[],
  isProductGenerating: false,
  productError: null as string | null,
  productProgress: 0,
  productLastCreditsCost: null as number | null,
};

export const useStudioStore = create<StudioState>((set, get) => ({
  uiMode: "quick",
  generationMode: DEFAULT_STUDIO_MODE,
  studioPriceTier: DEFAULT_STUDIO_PRICE_TIER,
  falModelId: defaultFalModelId(DEFAULT_STUDIO_MODE, DEFAULT_STUDIO_PRICE_TIER),
  prompt: "",
  enhancePrompt: false,
  aspectRatio: "portrait",
  outputFormat: "png",
  ...initialRefs,
  duration: 5,
  platform: "general",
  tone: "professional",
  ...initialCustomize,
  ...initialJob,
  recentGenerations: [],
  ...initialProductState,

  setUiMode: (uiMode) => set({ uiMode }),
  setGenerationMode: (generationMode) =>
    set((state) => {
      const falModelId = isFalModelAllowedForMode(
        generationMode,
        state.falModelId,
      )
        ? state.falModelId
        : defaultFalModelId(generationMode, state.studioPriceTier);
      return {
        generationMode,
        falModelId,
        ...initialJob,
        result: null,
        generationError: null,
        mainReferenceUrl: null,
        styleReferenceUrl: null,
        backgroundReferenceUrl: null,
      };
    }),
  setStudioPriceTier: (studioPriceTier) =>
    set((state) => {
      const options = modelsForModeAndTier(
        state.generationMode,
        studioPriceTier,
      );
      const stillValid = options.some((m) => m.falModelId === state.falModelId);
      return {
        studioPriceTier,
        falModelId: stillValid
          ? state.falModelId
          : defaultFalModelId(state.generationMode, studioPriceTier),
      };
    }),
  setFalModelId: (falModelId) =>
    set((state) => {
      if (!isFalModelAllowedForMode(state.generationMode, falModelId)) {
        return {};
      }
      const pt = priceTierForModel(state.generationMode, falModelId);
      return {
        falModelId,
        ...(pt ? { studioPriceTier: pt } : {}),
      };
    }),
  setPrompt: (prompt) => set({ prompt }),
  setEnhancePrompt: (enhancePrompt) => set({ enhancePrompt }),
  setAspectRatio: (aspectRatio) => set({ aspectRatio }),
  setOutputFormat: (outputFormat) => set({ outputFormat }),
  setMainReferenceUrl: (mainReferenceUrl) => set({ mainReferenceUrl }),
  setStyleReferenceUrl: (styleReferenceUrl) => set({ styleReferenceUrl }),
  setBackgroundReferenceUrl: (backgroundReferenceUrl) =>
    set({ backgroundReferenceUrl }),
  setDuration: (duration) => set({ duration }),
  setPlatform: (platform) => set({ platform }),
  setTone: (tone) => set({ tone }),
  setNegativePrompt: (negativePrompt) => set({ negativePrompt }),
  setSeed: (seed) => set({ seed }),
  setStyleStrength: (styleStrength) => set({ styleStrength }),
  setPromptStrength: (promptStrength) => set({ promptStrength }),
  setBackgroundMode: (backgroundMode) => set({ backgroundMode }),
  setGender: (gender) => set({ gender }),
  setAgeRange: (ageRange) => set({ ageRange }),
  setEthnicity: (ethnicity) => set({ ethnicity }),
  setSkinTone: (skinTone) => set({ skinTone }),
  setHairColor: (hairColor) => set({ hairColor }),
  setHairStyle: (hairStyle) => set({ hairStyle }),
  setExpression: (expression) => set({ expression }),
  setBodyType: (bodyType) => set({ bodyType }),
  setHeightEmphasis: (heightEmphasis) => set({ heightEmphasis }),
  setPoseStyle: (poseStyle) => set({ poseStyle }),
  setCameraFraming: (cameraFraming) => set({ cameraFraming }),

  setJobStatus: (jobStatus, progress) =>
    set((s) => ({
      jobStatus,
      isGenerating: jobStatus === "queued" || jobStatus === "processing",
      progress: progress ?? s.progress,
    })),

  setResult: (result, recentLabel) =>
    set((state) => {
      if (!result) {
        return {
          result: null,
          isGenerating: false,
          progress: 0,
          jobStatus: null,
          generationError: null,
        };
      }
      const pushRecent = recentLabel !== false;
      const label =
        typeof recentLabel === "string" && recentLabel.length > 0
          ? recentLabel
          : "Generation";
      return {
        result,
        isGenerating: false,
        progress: 100,
        jobStatus: "completed",
        generationError: null,
        recentGenerations: pushRecent
          ? [
              {
                id: randomId(),
                thumb: result.url,
                label,
                at: new Date().toLocaleTimeString(undefined, {
                  hour: "2-digit",
                  minute: "2-digit",
                }),
                assetId: result.assetId,
              },
              ...state.recentGenerations,
            ].slice(0, 12)
          : state.recentGenerations,
      };
    }),

  setGenerationError: (generationError) =>
    set({
      generationError,
      isGenerating: false,
      jobStatus: generationError ? "failed" : null,
      progress: 0,
    }),

  resetGenerationUi: () =>
    set({
      ...initialJob,
    }),

  resetProject: () =>
    set({
      uiMode: "quick",
      generationMode: DEFAULT_STUDIO_MODE,
      studioPriceTier: DEFAULT_STUDIO_PRICE_TIER,
      falModelId: defaultFalModelId(
        DEFAULT_STUDIO_MODE,
        DEFAULT_STUDIO_PRICE_TIER,
      ),
      prompt: "",
      enhancePrompt: false,
      aspectRatio: "portrait",
      outputFormat: "png",
      ...initialRefs,
      duration: 5,
      platform: "general",
      tone: "professional",
      ...initialCustomize,
      ...initialJob,
      recentGenerations: get().recentGenerations,
    }),

  buildComposedPrompt: () => {
    const s = get();
    const chunks: string[] = [];
    const base = s.prompt.trim();
    if (base.length >= 3) chunks.push(base);

    const subject = [
      s.gender && `Gender: ${s.gender}`,
      s.ageRange && `Age range: ${s.ageRange}`,
      s.ethnicity && `Appearance: ${s.ethnicity}`,
      s.skinTone && `Skin tone: ${s.skinTone}`,
      s.hairColor && `Hair color: ${s.hairColor}`,
      s.hairStyle && `Hair style: ${s.hairStyle}`,
      s.expression && `Expression: ${s.expression}`,
    ]
      .filter(Boolean)
      .join(". ");
    if (subject) chunks.push(subject);

    const body = [
      s.bodyType && `Body type: ${s.bodyType}`,
      s.heightEmphasis !== 50 && `Height emphasis: ${s.heightEmphasis}%`,
      s.poseStyle && `Pose: ${s.poseStyle}`,
      s.cameraFraming && `Framing: ${s.cameraFraming}`,
    ]
      .filter(Boolean)
      .join(". ");
    if (body) chunks.push(body);

    // chunks.push(
    //   `Style strength ~${s.styleStrength}%. Prompt adherence ~${s.promptStrength}%.`,
    // );
    // chunks.push(`Background mode: ${s.backgroundMode}.`);

    if (s.negativePrompt.trim()) {
      chunks.push(`Avoid: ${s.negativePrompt.trim()}`);
    }
    if (s.seed !== null) {
      chunks.push(`Seed: ${s.seed}`);
    }

    const out = chunks.join("\n\n").trim();
    if (out.length >= 3) return out;
    return base.length >= 3
      ? base
      : "Premium product visualization, soft studio light, high detail.";
  },

  getEstimatedCredits: () => {
    return get().generationMode === "image-to-video" ? 50 : 10;
  },

  getApiImageUrls: () => {
    const { mainReferenceUrl, styleReferenceUrl, backgroundReferenceUrl } =
      get();
    return [mainReferenceUrl, styleReferenceUrl, backgroundReferenceUrl].filter(
      (u): u is string =>
        typeof u === "string" &&
        (u.startsWith("https://") || u.startsWith("http://")),
    );
  },

  /** Sadece `NEXT_PUBLIC_API_URL` yoksa — adres varken görsel modlarında mock yerine NEED_HTTPS_REFERENCES veya gerçek istek. */
  shouldUseMock: () =>
    (process.env.NEXT_PUBLIC_API_URL ?? "").trim().length === 0,

  runMockGeneration: async () => {
    const label =
      get().generationMode === "image-to-video"
        ? "Video"
        : get().generationMode === "text-to-image"
          ? "Text to image"
          : "Image to image";
    set({
      isGenerating: true,
      generationError: null,
      result: null,
      jobId: null,
      jobStatus: "processing",
      progress: 18,
      lastCreditsCost: get().getEstimatedCredits(),
    });
    await delay(400);
    set({ progress: 45 });
    await delay(700);
    set({ progress: 72 });
    await delay(600);
    const assetId = `mock-${randomId()}`;
    const result: GenerationResult = { url: MOCK_RESULT, assetId };
    set((state) => ({
      isGenerating: false,
      jobStatus: "completed",
      progress: 100,
      result,
      recentGenerations: [
        {
          id: randomId(),
          thumb: result.url,
          label,
          at: new Date().toLocaleTimeString(undefined, {
            hour: "2-digit",
            minute: "2-digit",
          }),
          assetId: result.assetId,
        },
        ...state.recentGenerations,
      ].slice(0, 12),
    }));
  },

  enhancePromptWithApi: async () => {
    const composed = get().buildComposedPrompt();
    const mode = get().generationMode;
    try {
      const { enhancedPrompt } = await aiApi.enhancePrompt(composed, mode);
      set({ prompt: enhancedPrompt });
      return true;
    } catch {
      return false;
    }
  },

  startGeneration: async () => {
    const s = get();
    const composed = s.buildComposedPrompt();
    if (composed.length < 3) {
      set({
        generationError: "PROMPT_TOO_SHORT",
        isGenerating: false,
      });
      return null;
    }

    const refSlots = [
      s.mainReferenceUrl,
      s.styleReferenceUrl,
      s.backgroundReferenceUrl,
    ];
    const needsRefs = s.generationMode !== "text-to-image";
    const hasAnyReferencePreview = refSlots.some(Boolean);

    if (needsRefs && !hasAnyReferencePreview) {
      if (s.shouldUseMock()) {
        await get().runMockGeneration();
        return null;
      }
      set({
        generationError: "NEED_REFERENCE_IMAGE",
        isGenerating: false,
      });
      return null;
    }

    if (s.shouldUseMock()) {
      await get().runMockGeneration();
      return null;
    }

    let imageUrls: string[] = [];
    if (needsRefs) {
      imageUrls = await buildResolvedReferenceImageUrls(refSlots);
      if (imageUrls.length === 0) {
        set({
          generationError: "REFERENCE_PREPARE_FAILED",
          isGenerating: false,
        });
        return null;
      }
    }

    const payload: GeneratePayload = {
      mode: s.generationMode,
      modelTier: priceTierToModelTier(s.studioPriceTier),
      modelId: s.falModelId,
      prompt: composed.slice(0, 4000),
      enhancePrompt: s.enhancePrompt,
      aspectRatio: s.aspectRatio,
      outputFormat: s.outputFormat,
      imageUrls,
      duration: s.generationMode === "image-to-video" ? s.duration : undefined,
      platform: s.platform,
      tone: s.tone,
    };

    try {
      set({
        isGenerating: true,
        generationError: null,
        result: null,
        progress: 8,
        jobId: null,
        jobStatus: "queued",
      });
      const res = await aiApi.generate(payload);
      set({
        jobId: res.jobId,
        jobStatus: "queued",
        progress: 15,
        lastCreditsCost: res.creditsCost,
      });
      return res.jobId;
    } catch (e) {
      const insufficient =
        isAxiosError(e) &&
        (e.response?.status === 402 ||
          /credit|kredi|402/i.test(
            String(
              (e.response?.data as { message?: string } | undefined)?.message ??
                "",
            ),
          ));
      set({
        isGenerating: false,
        jobStatus: "failed",
        progress: 0,
        generationError: insufficient
          ? "INSUFFICIENT_CREDITS"
          : "GENERATE_REQUEST_FAILED",
      });
      return null;
    }
  },

  // ─── Product Studio setters ───────────────────────────────────────────────
  setStudioTab: (studioTab) => set({ studioTab }),
  setActiveProductFlow: (activeProductFlow) =>
    set({
      activeProductFlow,
      productResults: [],
      productJobIds: [],
      productError: null,
      productProgress: 0,
    }),
  setModelPhotoOptions: (modelPhotoOptions) => set({ modelPhotoOptions }),
  setProductImageUrls: (productImageUrls) => set({ productImageUrls }),
  setProductResolution: (productResolution) => set({ productResolution }),
  setProductModelTier: (productModelTier) => set({ productModelTier }),
  setProductCustomPrompt: (productCustomPrompt) => set({ productCustomPrompt }),
  setProductStyleMode: (productStyleMode) => set({ productStyleMode }),
  setModelGender: (modelGender) => set({ modelGender }),
  setModelEthnicity: (modelEthnicity) => set({ modelEthnicity }),
  setModelAge: (modelAge) => set({ modelAge }),
  setModelSkinColor: (modelSkinColor) => set({ modelSkinColor }),
  setModelFaceType: (modelFaceType) => set({ modelFaceType }),
  setModelEyeColor: (modelEyeColor) => set({ modelEyeColor }),
  setModelExpression: (modelExpression) => set({ modelExpression }),
  setModelBodySize: (modelBodySize) => set({ modelBodySize }),
  setModelHeight: (modelHeight) => set({ modelHeight }),
  setModelHairColor: (modelHairColor) => set({ modelHairColor }),
  setModelHairstyle: (modelHairstyle) => set({ modelHairstyle }),
  setModelShotType: (modelShotType) => set({ modelShotType }),
  setProductOnlyShotType: (productOnlyShotType) => set({ productOnlyShotType }),
  setAnglesCount: (anglesCount) => set({ anglesCount }),
  setProductReferenceImageUrl: (productReferenceImageUrl) =>
    set({ productReferenceImageUrl }),
  setProductReferenceStyleMode: (productReferenceStyleMode) =>
    set({ productReferenceStyleMode }),
  setProductSceneImageUrl: (productSceneImageUrl) =>
    set({ productSceneImageUrl }),
  setGhostQuality: (ghostQuality) => set({ ghostQuality }),
  setGhostBackgroundColor: (ghostBackgroundColor) =>
    set({ ghostBackgroundColor }),
  setVideoPlatform: (videoPlatform) => set({ videoPlatform }),
  setVideoDuration: (videoDuration) => set({ videoDuration }),
  setProductJobIds: (productJobIds) => set({ productJobIds }),
  setProductResults: (productResults) =>
    set((state) => ({
      productResults,
      isProductGenerating: false,
      productProgress: 100,
      productRecentSessions:
        productResults.length > 0
          ? [
              {
                id: randomId(),
                results: productResults,
                flow: state.activeProductFlow,
                at: new Date().toLocaleTimeString(undefined, {
                  hour: "2-digit",
                  minute: "2-digit",
                }),
              },
              ...state.productRecentSessions,
            ].slice(0, 10)
          : state.productRecentSessions,
    })),
  clearProductRecentSessions: () => set({ productRecentSessions: [] }),
  setIsProductGenerating: (isProductGenerating) => set({ isProductGenerating }),
  setProductError: (productError) =>
    set({ productError, isProductGenerating: false, productProgress: 0 }),
  setProductProgress: (productProgress) => set({ productProgress }),

  // ─── Product Studio: load options ────────────────────────────────────────
  loadModelPhotoOptions: async () => {
    if (get().modelPhotoOptions) return; // already cached
    try {
      const opts = await productApi.getModelPhotoOptions();
      const s = get();
      set({
        modelPhotoOptions: opts,
        // fill any field that isn't in the returned option set back to the first valid option
        modelGender: opts.genders.includes(s.modelGender)
          ? s.modelGender
          : (opts.genders[0] ?? ""),
        modelEthnicity: opts.ethnicities.includes(s.modelEthnicity)
          ? s.modelEthnicity
          : (opts.ethnicities[0] ?? ""),
        modelAge: opts.ageRanges.includes(s.modelAge)
          ? s.modelAge
          : (opts.ageRanges[0] ?? ""),
        modelSkinColor: opts.skinColors.includes(s.modelSkinColor)
          ? s.modelSkinColor
          : (opts.skinColors[0] ?? ""),
        modelFaceType: opts.faceTypes.includes(s.modelFaceType)
          ? s.modelFaceType
          : (opts.faceTypes[0] ?? ""),
        modelEyeColor: opts.eyeColors.includes(s.modelEyeColor)
          ? s.modelEyeColor
          : (opts.eyeColors[0] ?? ""),
        modelExpression: opts.expressions.includes(s.modelExpression)
          ? s.modelExpression
          : (opts.expressions[0] ?? ""),
        modelBodySize: opts.bodySizes.includes(s.modelBodySize)
          ? s.modelBodySize
          : (opts.bodySizes[0] ?? ""),
        modelHairColor: opts.hairColors.includes(s.modelHairColor)
          ? s.modelHairColor
          : (opts.hairColors[0] ?? ""),
        modelHairstyle: opts.hairstyles.includes(s.modelHairstyle)
          ? s.modelHairstyle
          : (opts.hairstyles[0] ?? ""),
        modelShotType: opts.shotTypes.includes(s.modelShotType)
          ? s.modelShotType
          : (opts.shotTypes[0] ?? ""),
      });
    } catch {
      // silent — form will still work with FALLBACK_OPTS
    }
  },

  // ─── Product Studio: credit estimate ─────────────────────────────────────
  getProductCreditEstimate: () => {
    const s = get();
    switch (s.activeProductFlow) {
      case "model-photo":
        return s.productResolution === "2K" ? 25 : 10;
      case "product-angles":
        return s.anglesCount * (s.productResolution === "2K" ? 25 : 10);
      case "product-reference":
        return s.productResolution === "2K" ? 25 : 10;
      case "product-swap":
        return s.productResolution === "2K" ? 25 : 10;
      case "ghost-mannequin":
        return s.ghostQuality === "premium" ? 40 : 20;
      case "photo-to-video":
        return s.videoDuration === 10 ? 100 : 50;
      default:
        return 10;
    }
  },

  // ─── Product Studio: reset ────────────────────────────────────────────────
  resetProductState: () =>
    set({
      productResults: [],
      productJobIds: [],
      productError: null,
      productProgress: 0,
      isProductGenerating: false,
      productLastCreditsCost: null,
    }),

  // ─── Load asset into studio form ─────────────────────────────────────────
  loadFromAsset: (asset) => {
    const job: GenerationJob | undefined = asset.generationJob;
    const CREATIVE_MODES: AiGenerationMode[] = [
      "image-to-image",
      "text-to-image",
      "image-to-video",
    ];
    const PRODUCT_JOB_TYPES: Record<string, ProductFlow> = {
      GHOST_MANNEQUIN: "ghost-mannequin",
      MODEL_PHOTO: "model-photo",
      PRODUCT_ANGLES: "product-angles",
      PRODUCT_REFERENCE: "product-reference",
      PRODUCT_SWAP: "product-swap",
      PHOTO_TO_VIDEO: "photo-to-video",
    };

    const jobTypeUpper = (job?.jobType ?? "").toUpperCase();
    const productFlow = PRODUCT_JOB_TYPES[jobTypeUpper];

    if (productFlow) {
      set({
        studioTab: "product",
        activeProductFlow: productFlow,
        productCustomPrompt: job?.prompt ?? "",
        productImageUrls: job?.imageUrls ?? [],
        productResults: [{ url: asset.url, assetId: asset.id }],
        productJobIds: [],
        productError: null,
        productProgress: 0,
        isProductGenerating: false,
        ...(job?.customization && productFlow === "ghost-mannequin"
          ? {
              ghostQuality: ((job.customization as Record<string, string>)
                .quality === "premium"
                ? "premium"
                : "standard") as "standard" | "premium",
              ghostBackgroundColor:
                (job.customization as Record<string, string>).backgroundColor ??
                "white",
            }
          : {}),
      });
    } else {
      const mode = CREATIVE_MODES.includes(job?.mode as AiGenerationMode)
        ? (job?.mode as AiGenerationMode)
        : "image-to-image";
      const validAspectRatios = ["portrait", "landscape", "square"] as const;
      const aspectRatio = validAspectRatios.includes(
        job?.aspectRatio as (typeof validAspectRatios)[number],
      )
        ? (job?.aspectRatio as "portrait" | "landscape" | "square")
        : "portrait";
      const validFormats = ["png", "jpeg", "webp"] as const;
      const outputFormat = validFormats.includes(
        job?.outputFormat as (typeof validFormats)[number],
      )
        ? (job?.outputFormat as "png" | "jpeg" | "webp")
        : "png";

      set({
        studioTab: "creative",
        generationMode: mode,
        prompt: job?.prompt ?? "",
        aspectRatio,
        outputFormat,
        platform: (job?.platform as AiPlatform | null) ?? "general",
        tone: (job?.tone as AiTone | null) ?? "professional",
        ...initialJob,
        result: { url: asset.url, assetId: asset.id },
        generationError: null,
        mainReferenceUrl: job?.imageUrls?.[0] ?? null,
        styleReferenceUrl: null,
        backgroundReferenceUrl: null,
      });
    }
  },

  // ─── Product Studio: start generation ────────────────────────────────────
  startProductGeneration: async () => {
    const s = get();
    set({
      isProductGenerating: true,
      productError: null,
      productResults: [],
      productJobIds: [],
      productProgress: 5,
    });

    try {
      switch (s.activeProductFlow) {
        // ── Flow 1: Model Photo ──────────────────────────────────────────────
        case "model-photo": {
          if (s.productImageUrls.length === 0) {
            set({
              isProductGenerating: false,
              productError: "Ürün görseli seçin",
            });
            return null;
          }
          const resolvedUrls = await buildResolvedReferenceImageUrls(
            s.productImageUrls,
          );
          if (resolvedUrls.length === 0) {
            set({
              isProductGenerating: false,
              productError: "Görsel yüklenemedi",
            });
            return null;
          }
          const payload = {
            productImageUrls: resolvedUrls,
            styleMode: s.productStyleMode,
            resolution: s.productResolution,
            modelTier: s.productModelTier,
            outputFormat: "webp" as const,
            customPrompt: s.productCustomPrompt || undefined,
            ...(s.productStyleMode === "with-model"
              ? {
                  modelDetails: {
                    gender: s.modelGender || undefined,
                    ethnicity: s.modelEthnicity || undefined,
                    age: s.modelAge || undefined,
                    skinColor: s.modelSkinColor || undefined,
                    faceType: s.modelFaceType || undefined,
                    eyeColor: s.modelEyeColor || undefined,
                    expression: s.modelExpression || undefined,
                  },
                  customization: {
                    bodySize: s.modelBodySize || undefined,
                    height: s.modelHeight || undefined,
                    hairColor: s.modelHairColor || undefined,
                    hairstyle: s.modelHairstyle || undefined,
                    shotType: s.modelShotType || undefined,
                  },
                }
              : { shotType: s.productOnlyShotType || "product" }),
          };
          const res = await productApi.generateModelPhoto(payload);
          set({
            productJobIds: [res.jobId],
            productLastCreditsCost: res.creditsCost,
            productProgress: 15,
          });
          return [res.jobId];
        }

        // ── Flow 2: Product Angles ───────────────────────────────────────────
        case "product-angles": {
          if (s.productImageUrls.length === 0) {
            set({
              isProductGenerating: false,
              productError: "Ürün görseli seçin",
            });
            return null;
          }
          const [resolvedUrl] = await buildResolvedReferenceImageUrls([
            s.productImageUrls[0],
          ]);
          if (!resolvedUrl) {
            set({
              isProductGenerating: false,
              productError: "Görsel yüklenemedi",
            });
            return null;
          }
          const res = await productApi.generateProductAngles({
            productImageUrl: resolvedUrl,
            count: s.anglesCount,
            resolution: s.productResolution,
            modelTier: s.productModelTier,
            outputFormat: "webp",
            customPrompt: s.productCustomPrompt || undefined,
          });
          set({
            productJobIds: res.jobIds,
            productLastCreditsCost: res.totalCredits,
            productProgress: 15,
          });
          return res.jobIds;
        }

        // ── Flow 3: Product Reference ────────────────────────────────────────
        case "product-reference": {
          if (s.productImageUrls.length === 0 || !s.productReferenceImageUrl) {
            set({
              isProductGenerating: false,
              productError: "Ürün ve referans görseli seçin",
            });
            return null;
          }
          const [productUrl, referenceUrl] =
            await buildResolvedReferenceImageUrls([
              s.productImageUrls[0],
              s.productReferenceImageUrl,
            ]);
          if (!productUrl || !referenceUrl) {
            set({
              isProductGenerating: false,
              productError: "Görsel yüklenemedi",
            });
            return null;
          }
          const res = await productApi.generateProductReference({
            productImageUrl: productUrl,
            referenceImageUrl: referenceUrl,
            styleMode: s.productReferenceStyleMode,
            resolution: s.productResolution,
            modelTier: s.productModelTier,
            outputFormat: "webp",
            customPrompt: s.productCustomPrompt || undefined,
          });
          set({
            productJobIds: [res.jobId],
            productLastCreditsCost: res.creditsCost,
            productProgress: 15,
          });
          return [res.jobId];
        }

        // ── Flow 4: Product Swap ─────────────────────────────────────────────
        case "product-swap": {
          if (s.productImageUrls.length === 0 || !s.productSceneImageUrl) {
            set({
              isProductGenerating: false,
              productError: "Ürün ve sahne görseli seçin",
            });
            return null;
          }
          const [productUrl, sceneUrl] = await buildResolvedReferenceImageUrls([
            s.productImageUrls[0],
            s.productSceneImageUrl,
          ]);
          if (!productUrl || !sceneUrl) {
            set({
              isProductGenerating: false,
              productError: "Görsel yüklenemedi",
            });
            return null;
          }
          const res = await productApi.generateProductSwap({
            productImageUrl: productUrl,
            sceneImageUrl: sceneUrl,
            resolution: s.productResolution,
            modelTier: s.productModelTier,
            outputFormat: "webp",
            customPrompt: s.productCustomPrompt || undefined,
          });
          set({
            productJobIds: [res.jobId],
            productLastCreditsCost: res.creditsCost,
            productProgress: 15,
          });
          return [res.jobId];
        }

        // ── Flow 5: Ghost Mannequin ──────────────────────────────────────────
        case "ghost-mannequin": {
          if (s.productImageUrls.length === 0) {
            set({
              isProductGenerating: false,
              productError: "Giysi görseli seçin",
            });
            return null;
          }
          const [imageUrl] = await buildResolvedReferenceImageUrls([
            s.productImageUrls[0],
          ]);
          if (!imageUrl) {
            set({
              isProductGenerating: false,
              productError: "Görsel yüklenemedi",
            });
            return null;
          }
          const res = await productApi.generateGhostMannequin({
            productImageUrl: imageUrl,
            quality: s.ghostQuality,
            backgroundColor: s.ghostBackgroundColor || "white",
            outputFormat: "png",
            customPrompt: s.productCustomPrompt || undefined,
          });
          set({
            productJobIds: [res.jobId],
            productLastCreditsCost: res.creditsCost,
            productProgress: 15,
          });
          return [res.jobId];
        }

        // ── Flow 6: Photo to Video ───────────────────────────────────────────
        case "photo-to-video": {
          if (s.productImageUrls.length === 0) {
            set({ isProductGenerating: false, productError: "Fotoğraf seçin" });
            return null;
          }
          const [imageUrl] = await buildResolvedReferenceImageUrls([
            s.productImageUrls[0],
          ]);
          if (!imageUrl) {
            set({
              isProductGenerating: false,
              productError: "Görsel yüklenemedi",
            });
            return null;
          }
          const res = await productApi.generatePhotoToVideo({
            imageUrl,
            platform: s.videoPlatform,
            duration: s.videoDuration,
            modelTier: s.productModelTier,
            customPrompt: s.productCustomPrompt || undefined,
          });
          set({
            productJobIds: [res.jobId],
            productLastCreditsCost: res.creditsCost,
            productProgress: 15,
          });
          return [res.jobId];
        }

        default:
          set({ isProductGenerating: false });
          return null;
      }
    } catch (e) {
      const insufficient =
        isAxiosError(e) &&
        (e.response?.status === 402 ||
          /credit|kredi|402/i.test(
            String(
              (e.response?.data as { message?: string } | undefined)?.message ??
                "",
            ),
          ));
      set({
        isProductGenerating: false,
        productError: insufficient ? "Yetersiz kredi" : "Üretim başlatılamadı",
      });
      return null;
    }
  },
}));
