import { create } from "zustand";

export type StudioTool = "product-enhance" | "fashion-model" | "background-replace" | "video";

interface StudioState {
  activeTool: StudioTool;
  uploadedImage: string | null;
  productName: string;
  brandName: string;
  prompt: string;
  isGenerating: boolean;
  progress: number;
  results: string[];
  caption: string;
  hashtags: string[];
  setActiveTool: (tool: StudioTool) => void;
  setUploadedImage: (url: string | null) => void;
  setProductName: (name: string) => void;
  setBrandName: (name: string) => void;
  setPrompt: (prompt: string) => void;
  setCaption: (caption: string) => void;
  startGeneration: () => void;
  resetGeneration: () => void;
}

export const useStudioStore = create<StudioState>((set, get) => ({
  activeTool: "product-enhance",
  uploadedImage: null,
  productName: "",
  brandName: "",
  prompt: "",
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
  setCaption: (caption) => set({ caption }),

  startGeneration: () => {
    set({ isGenerating: true, progress: 0, results: [] });
    const interval = setInterval(() => {
      const current = get().progress;
      if (current >= 100) {
        clearInterval(interval);
        set({
          isGenerating: false,
          progress: 100,
          results: [
            "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop",
            "https://images.unsplash.com/photo-1585386959984-a4155224a1ad?w=400&h=400&fit=crop",
            "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop",
            "https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=400&h=400&fit=crop",
          ],
          caption:
            "Elevate your aesthetic with premium quality that speaks for itself. ✨ Crafted for those who demand nothing but the best.",
          hashtags: [
            "#luxury",
            "#premium",
            "#aesthetic",
            "#style",
            "#quality",
            "#design",
            "#lifestyle",
            "#brand",
          ],
        });
      } else {
        set({ progress: Math.min(current + Math.random() * 15 + 5, 100) });
      }
    }, 300);
  },

  resetGeneration: () =>
    set({
      results: [],
      progress: 0,
      isGenerating: false,
      caption: "",
      hashtags: [],
    }),
}));
