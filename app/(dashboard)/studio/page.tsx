"use client";

import { AiStudioWorkspace } from "@/components/features/studio/ai-studio-workspace";
import { ProductStudioWorkspace } from "@/components/features/studio/product-studio-workspace";
import { StudioTopNav } from "@/components/features/studio/studio-top-nav";
import { useStudioStore } from "@/store/studio-store";

export default function StudioPage() {
  const studioTab = useStudioStore((s) => s.studioTab);

  return (
    <div className="flex h-full flex-col bg-[#050505]">
      <StudioTopNav />
      <div className="min-h-0 flex-1">
        {studioTab === "creative" ? (
          <AiStudioWorkspace />
        ) : (
          <ProductStudioWorkspace />
        )}
      </div>
    </div>
  );
}
