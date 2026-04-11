import { create } from "zustand";
import {
  aiApi,
  type AiAspectRatio,
  type AiGenerationMode,
  type AiPlatform,
  type AiTone,
  type GeneratePayload,
  type JobStatus,
  type ModelTier,
  type OutputFormat,
} from "@/lib/api";

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

interface StudioState {
  uiMode: StudioUiMode;
  generationMode: AiGenerationMode;
  modelTier: ModelTier;
  prompt: string;
  enhancePrompt: boolean;
  aspectRatio: StudioAspectRatio;
  outputFormat: OutputFormat;
  /** Local object URLs or HTTPS — API accepts only public URLs. */
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

  setUiMode: (m: StudioUiMode) => void;
  setGenerationMode: (m: AiGenerationMode) => void;
  setModelTier: (t: ModelTier) => void;
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

export const useStudioStore = create<StudioState>((set, get) => ({
  uiMode: "quick",
  generationMode: "image-to-image",
  modelTier: "standard",
  prompt: "",
  enhancePrompt: false,
  aspectRatio: "square",
  outputFormat: "png",
  ...initialRefs,
  duration: 5,
  platform: "general",
  tone: "professional",
  ...initialCustomize,
  ...initialJob,
  recentGenerations: [],

  setUiMode: (uiMode) => set({ uiMode }),
  setGenerationMode: (generationMode) =>
    set({
      generationMode,
      ...initialJob,
      result: null,
      generationError: null,
    }),
  setModelTier: (modelTier) => set({ modelTier }),
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
      generationMode: "image-to-image",
      modelTier: "standard",
      prompt: "",
      enhancePrompt: false,
      aspectRatio: "square",
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

    chunks.push(
      `Style strength ~${s.styleStrength}%. Prompt adherence ~${s.promptStrength}%.`
    );
    chunks.push(`Background mode: ${s.backgroundMode}.`);

    if (s.negativePrompt.trim()) {
      chunks.push(`Avoid: ${s.negativePrompt.trim()}`);
    }
    if (s.seed !== null) {
      chunks.push(`Seed: ${s.seed}`);
    }

    const out = chunks.join("\n\n").trim();
    if (out.length >= 3) return out;
    return base.length >= 3 ? base : "Premium product visualization, soft studio light, high detail.";
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
        (u.startsWith("https://") || u.startsWith("http://"))
    );
  },

  shouldUseMock: () => {
    const base = (process.env.NEXT_PUBLIC_API_URL ?? "").trim();
    if (!base) return true;
    const s = get();
    if (s.generationMode === "text-to-image") return false;
    const urls = s.getApiImageUrls();
    if (urls.length === 0) return true;
    return false;
  },

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

    if (
      s.generationMode !== "text-to-image" &&
      s.getApiImageUrls().length === 0
    ) {
      if (s.shouldUseMock()) {
        await get().runMockGeneration();
        return null;
      }
      set({
        generationError: "NEED_HTTPS_REFERENCES",
        isGenerating: false,
      });
      return null;
    }

    if (s.shouldUseMock()) {
      await get().runMockGeneration();
      return null;
    }

    const imageUrls =
      s.generationMode === "text-to-image" ? [] : s.getApiImageUrls();

    const payload: GeneratePayload = {
      mode: s.generationMode,
      modelTier: s.modelTier,
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
    } catch {
      set({
        isGenerating: false,
        jobStatus: "failed",
        progress: 0,
        generationError: "GENERATE_REQUEST_FAILED",
      });
      return null;
    }
  },
}));
