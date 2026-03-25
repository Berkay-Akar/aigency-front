import { create } from "zustand";
import { aiApi, type GeneratePayload, type JobStatus } from "@/lib/api";
import {
  type StudioCreativeModeId,
  getStudioModeById,
} from "@/lib/studio-creative-modes";

export type StudioStep = "professionalize" | "campaign" | "video";

export interface RecentGenerationItem {
  id: string;
  thumb: string;
  label: string;
  at: string;
}

interface StudioState {
  studioModeId: StudioCreativeModeId;

  // Active pipeline step
  activeStep: StudioStep;

  // Shared upload state
  uploadedImage: string | null;
  productName: string;
  brandName: string;
  prompt: string;

  // ── Step 1: Professionalize ────────────────────────────────
  outputTypes: string[];
  stylePreset: string;
  bgType: string;
  professionalOutputCount: 1 | 3 | 6;
  aspectRatioPreset: string;

  // ── Step 2: Campaign Variants ──────────────────────────────
  variantType: string;
  variantCount: 3 | 5 | 10;
  platformFormats: string[];
  targetStyle: string;
  consistencyLevel: number;
  detailPreservation: number;

  // ── Step 3: Video for Ads ──────────────────────────────────
  videoMotion: string;
  videoDuration: 6 | 10 | 15;
  videoAspect: string;
  textOverlay: boolean;
  motionStrength: number;

  // Pipeline: per-step selected source image
  stepInput: Record<number, string | null>;

  // Job tracking
  jobId: string | null;
  jobStatus: JobStatus | null;
  isGenerating: boolean;
  progress: number;

  // Results
  results: string[];
  caption: string;
  hashtags: string[];

  // Step-completed results stored per step for pipeline chaining
  stepResults: Record<number, string[]>;

  recentGenerations: RecentGenerationItem[];

  // Actions
  setStudioMode: (modeId: StudioCreativeModeId) => void;
  resetProject: () => void;

  setActiveStep: (step: StudioStep) => void;
  setUploadedImage: (url: string | null) => void;
  setProductName: (name: string) => void;
  setBrandName: (name: string) => void;
  setPrompt: (prompt: string) => void;
  setCaption: (caption: string) => void;

  // Step 1
  toggleOutputType: (type: string) => void;
  setStylePreset: (preset: string) => void;
  setBgType: (bg: string) => void;
  setProfessionalOutputCount: (n: 1 | 3 | 6) => void;
  setAspectRatioPreset: (ratio: string) => void;

  // Step 2
  setVariantType: (type: string) => void;
  setVariantCount: (count: 3 | 5 | 10) => void;
  togglePlatformFormat: (fmt: string) => void;
  setTargetStyle: (style: string) => void;
  setConsistencyLevel: (n: number) => void;
  setDetailPreservation: (n: number) => void;

  // Step 3
  setVideoMotion: (motion: string) => void;
  setVideoDuration: (duration: 6 | 10 | 15) => void;
  setVideoAspect: (aspect: string) => void;
  setTextOverlay: (val: boolean) => void;
  setMotionStrength: (n: number) => void;

  // Pipeline chaining
  useResultAsNextStepInput: (imageUrl: string, fromStep: number) => void;
  setStepInput: (step: number, url: string | null) => void;

  // Job
  setJobStatus: (status: JobStatus, progress?: number) => void;
  setResults: (images: string[], caption?: string, hashtags?: string[]) => void;
  startGeneration: () => Promise<string | null>;
  resetGeneration: () => void;
}

const STEP_NUMBER: Record<StudioStep, number> = {
  professionalize: 1,
  campaign: 2,
  video: 3,
};

const initialState: Pick<
  StudioState,
  | "studioModeId"
  | "activeStep"
  | "uploadedImage"
  | "productName"
  | "brandName"
  | "prompt"
  | "outputTypes"
  | "stylePreset"
  | "bgType"
  | "professionalOutputCount"
  | "aspectRatioPreset"
  | "variantType"
  | "variantCount"
  | "platformFormats"
  | "targetStyle"
  | "consistencyLevel"
  | "detailPreservation"
  | "videoMotion"
  | "videoDuration"
  | "videoAspect"
  | "textOverlay"
  | "motionStrength"
  | "stepInput"
  | "jobId"
  | "jobStatus"
  | "isGenerating"
  | "progress"
  | "results"
  | "caption"
  | "hashtags"
  | "stepResults"
  | "recentGenerations"
> = {
  studioModeId: "image_to_professional",
  activeStep: "professionalize",
  uploadedImage: null,
  productName: "",
  brandName: "",
  prompt: "",
  outputTypes: ["packshot"],
  stylePreset: "e-commerce",
  bgType: "white",
  professionalOutputCount: 3,
  aspectRatioPreset: "1:1",
  variantType: "lighting",
  variantCount: 3,
  platformFormats: ["1:1"],
  targetStyle: "premium",
  consistencyLevel: 72,
  detailPreservation: 84,
  videoMotion: "push-in",
  videoDuration: 6,
  videoAspect: "9:16",
  textOverlay: false,
  motionStrength: 62,
  stepInput: { 1: null, 2: null, 3: null },
  jobId: null,
  jobStatus: null,
  isGenerating: false,
  progress: 0,
  results: [],
  caption: "",
  hashtags: [],
  stepResults: {},
  recentGenerations: [],
};

export const useStudioStore = create<StudioState>((set, get) => ({
  ...initialState,

  setStudioMode: (modeId) => {
    const def = getStudioModeById(modeId);
    if (!def) return;
    const { preset } = def;
    set((s) => ({
      studioModeId: modeId,
      activeStep: preset.activeStep,
      ...(preset.outputTypes ? { outputTypes: preset.outputTypes } : {}),
      ...(preset.stylePreset ? { stylePreset: preset.stylePreset } : {}),
      ...(preset.bgType ? { bgType: preset.bgType } : {}),
      ...(preset.variantType ? { variantType: preset.variantType } : {}),
      ...(preset.targetStyle ? { targetStyle: preset.targetStyle } : {}),
      ...(preset.videoMotion ? { videoMotion: preset.videoMotion } : {}),
      ...(preset.videoDuration ? { videoDuration: preset.videoDuration } : {}),
      ...(preset.videoAspect ? { videoAspect: preset.videoAspect } : {}),
      jobId: null,
      jobStatus: null,
      isGenerating: false,
      progress: 0,
      recentGenerations: s.recentGenerations,
    }));
  },

  resetProject: () =>
    set({
      ...initialState,
      recentGenerations: get().recentGenerations,
    }),

  setActiveStep: (step) =>
    set({ activeStep: step, results: [], progress: 0, jobId: null, jobStatus: null }),

  setUploadedImage: (url) => set({ uploadedImage: url }),
  setProductName: (name) => set({ productName: name }),
  setBrandName: (name) => set({ brandName: name }),
  setPrompt: (prompt) => set({ prompt }),
  setCaption: (caption) => set({ caption }),

  toggleOutputType: (type) =>
    set((s) => ({
      outputTypes: s.outputTypes.includes(type)
        ? s.outputTypes.filter((t) => t !== type)
        : [...s.outputTypes, type],
    })),
  setStylePreset: (preset) => set({ stylePreset: preset }),
  setBgType: (bg) => set({ bgType: bg }),
  setProfessionalOutputCount: (n) => set({ professionalOutputCount: n }),
  setAspectRatioPreset: (ratio) => set({ aspectRatioPreset: ratio }),

  setVariantType: (type) => set({ variantType: type }),
  setVariantCount: (count) => set({ variantCount: count }),
  togglePlatformFormat: (fmt) =>
    set((s) => ({
      platformFormats: s.platformFormats.includes(fmt)
        ? s.platformFormats.filter((f) => f !== fmt)
        : [...s.platformFormats, fmt],
    })),
  setTargetStyle: (style) => set({ targetStyle: style }),
  setConsistencyLevel: (n) => set({ consistencyLevel: n }),
  setDetailPreservation: (n) => set({ detailPreservation: n }),

  setVideoMotion: (motion) => set({ videoMotion: motion }),
  setVideoDuration: (duration) => set({ videoDuration: duration }),
  setVideoAspect: (aspect) => set({ videoAspect: aspect }),
  setTextOverlay: (val) => set({ textOverlay: val }),
  setMotionStrength: (n) => set({ motionStrength: n }),

  useResultAsNextStepInput: (imageUrl, fromStep) => {
    const nextStep = fromStep + 1;
    const stepMap: Record<number, StudioStep> = {
      2: "campaign",
      3: "video",
    };
    const next = stepMap[nextStep];
    if (!next) return;
    set((s) => ({
      stepInput: { ...s.stepInput, [nextStep]: imageUrl },
      uploadedImage: imageUrl,
      activeStep: next,
      results: [],
      progress: 0,
      jobId: null,
      jobStatus: null,
    }));
  },

  setStepInput: (step, url) =>
    set((s) => ({ stepInput: { ...s.stepInput, [step]: url } })),

  setJobStatus: (status, progress) =>
    set((s) => ({
      jobStatus: status,
      isGenerating: status === "queued" || status === "processing",
      progress: progress ?? s.progress,
    })),

  setResults: (images, caption, hashtags) => {
    const { activeStep } = get();
    const stepNum = STEP_NUMBER[activeStep];
    const thumb = images[0];
    const label =
      activeStep === "professionalize"
        ? "Profesyonelleştirme"
        : activeStep === "campaign"
          ? "Kampanya varyantları"
          : "Video reklam";
    set((s) => ({
      results: images,
      caption: caption ?? "",
      hashtags: hashtags ?? [],
      isGenerating: false,
      progress: 100,
      stepResults: { ...s.stepResults, [stepNum]: images },
      recentGenerations:
        thumb && images.length > 0
          ? [
              {
                id: crypto.randomUUID(),
                thumb,
                label,
                at: new Date().toLocaleTimeString("tr-TR", {
                  hour: "2-digit",
                  minute: "2-digit",
                }),
              },
              ...s.recentGenerations,
            ].slice(0, 8)
          : s.recentGenerations,
    }));
  },

  startGeneration: async () => {
    const {
      activeStep,
      prompt,
      productName,
      brandName,
      uploadedImage,
      outputTypes,
      stylePreset,
      bgType,
      professionalOutputCount,
      aspectRatioPreset,
      variantType,
      variantCount,
      platformFormats,
      targetStyle,
      consistencyLevel,
      detailPreservation,
      videoMotion,
      videoDuration,
      videoAspect,
      textOverlay,
      motionStrength,
      studioModeId,
    } = get();

    const stepNum = STEP_NUMBER[activeStep];

    const options: Record<string, unknown> = {
      productName,
      brandName,
      step: stepNum,
      studioModeId,
      aspectRatioPreset,
      professionalOutputCount,
      consistencyLevel,
      detailPreservation,
      motionStrength,
    };

    if (activeStep === "professionalize") {
      Object.assign(options, {
        outputTypes,
        stylePreset,
        bgType,
        sourceImage: uploadedImage,
      });
    } else if (activeStep === "campaign") {
      Object.assign(options, {
        variantType,
        variantCount,
        platformFormats,
        targetStyle,
        sourceImage: uploadedImage,
      });
    } else if (activeStep === "video") {
      Object.assign(options, {
        videoMotion,
        videoDuration,
        videoAspect,
        textOverlay,
        sourceImage: uploadedImage,
      });
    }

    const payload: GeneratePayload = {
      type: activeStep,
      prompt: [productName, brandName, prompt].filter(Boolean).join(", "),
      platform: platformFormats[0] ?? "instagram",
      tone: targetStyle,
      options,
    };

    try {
      set({
        isGenerating: true,
        progress: 5,
        jobId: null,
        jobStatus: "queued",
        results: [],
      });
      const res = await aiApi.generate(payload);
      const { jobId } = res;
      set({ jobId, jobStatus: "queued", progress: 10 });
      return jobId;
    } catch {
      set({ isGenerating: false, jobStatus: "failed", progress: 0 });
      return null;
    }
  },

  resetGeneration: () =>
    set({
      results: [],
      progress: 0,
      isGenerating: false,
      jobId: null,
      jobStatus: null,
      caption: "",
      hashtags: [],
    }),
}));
