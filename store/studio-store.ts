import { create } from "zustand";
import { aiApi, type GeneratePayload, type JobStatus } from "@/lib/api";

export type StudioTool = "product-enhance" | "fashion-model" | "background-replace" | "video";

interface StudioState {
  activeTool: StudioTool;
  uploadedImage: string | null;
  productName: string;
  brandName: string;
  prompt: string;
  platform: string;
  tone: string;

  // Job tracking
  jobId: string | null;
  jobStatus: JobStatus | null;
  isGenerating: boolean;
  progress: number;

  // Results
  results: string[];
  caption: string;
  hashtags: string[];

  // Actions
  setActiveTool: (tool: StudioTool) => void;
  setUploadedImage: (url: string | null) => void;
  setProductName: (name: string) => void;
  setBrandName: (name: string) => void;
  setPrompt: (prompt: string) => void;
  setPlatform: (platform: string) => void;
  setTone: (tone: string) => void;
  setCaption: (caption: string) => void;
  setJobStatus: (status: JobStatus, progress?: number) => void;
  setResults: (images: string[], caption?: string, hashtags?: string[]) => void;

  /**
   * Triggers POST /ai/generate and returns the jobId.
   * Actual polling is handled by the useJobPolling hook in the component.
   */
  startGeneration: () => Promise<string | null>;
  resetGeneration: () => void;
}

export const useStudioStore = create<StudioState>((set, get) => ({
  activeTool: "product-enhance",
  uploadedImage: null,
  productName: "",
  brandName: "",
  prompt: "",
  platform: "instagram",
  tone: "professional",

  jobId: null,
  jobStatus: null,
  isGenerating: false,
  progress: 0,

  results: [],
  caption: "",
  hashtags: [],

  setActiveTool: (tool) => set({ activeTool: tool }),
  setUploadedImage: (url) => set({ uploadedImage: url }),
  setProductName: (name) => set({ productName: name }),
  setBrandName: (name) => set({ brandName: name }),
  setPrompt: (prompt) => set({ prompt }),
  setPlatform: (platform) => set({ platform }),
  setTone: (tone) => set({ tone }),
  setCaption: (caption) => set({ caption }),

  setJobStatus: (status, progress) =>
    set((s) => ({
      jobStatus: status,
      isGenerating: status === "queued" || status === "processing",
      progress: progress ?? s.progress,
    })),

  setResults: (images, caption, hashtags) =>
    set({
      results: images,
      caption: caption ?? "",
      hashtags: hashtags ?? [],
      isGenerating: false,
      progress: 100,
    }),

  startGeneration: async () => {
    const { activeTool, prompt, platform, tone, productName, brandName } = get();

    const payload: GeneratePayload = {
      type: activeTool,
      prompt: [productName, brandName, prompt].filter(Boolean).join(", "),
      platform,
      tone,
      options: {
        productName,
        brandName,
      },
    };

    try {
      set({ isGenerating: true, progress: 5, jobId: null, jobStatus: "queued", results: [] });
      const res = await aiApi.generate(payload);
      const { jobId } = res.data;
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
