"use client";

import { motion } from "framer-motion";
import { useWorkspaceData } from "@/hooks/use-workspace-data";
import { useStudioStore } from "@/store/studio-store";
import { StudioHeader } from "@/components/features/studio/studio-header";
import { UploadStage } from "@/components/features/studio/upload-stage";
import { ModeSelector } from "@/components/features/studio/mode-selector";
import { ConfigPanel } from "@/components/features/studio/config-panel";
import { GenerateBar } from "@/components/features/studio/generate-bar";
import { BeforeAfterBlock } from "@/components/features/studio/before-after-block";
import { ResultsGallery } from "@/components/features/studio/results-gallery";
import { StudioSidePanel } from "@/components/features/studio/studio-side-panel";
import { ExportStrip } from "@/components/features/studio/export-strip";
import { VideoFlowSection } from "@/components/features/studio/video-flow-section";
import { TemplateGrid } from "@/components/features/studio/template-grid";
import { CaptionBar } from "@/components/features/studio/caption-bar";

export default function StudioPage() {
  useWorkspaceData();

  const uploadedImage = useStudioStore((s) => s.uploadedImage);
  const firstResult = useStudioStore((s) => s.results[0] ?? null);

  return (
    <div className="min-h-full bg-[#050505]">
      <StudioHeader />

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
        className="mx-auto max-w-[1400px] space-y-16 px-4 py-10 md:px-8 md:py-14"
      >
        <UploadStage />

        <ModeSelector />

        <ConfigPanel />

        <GenerateBar />

        <BeforeAfterBlock beforeSrc={uploadedImage} afterSrc={firstResult} />

        <section className="space-y-4">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <h2 className="text-lg font-medium text-white">Çıktı galerisi</h2>
              <p className="mt-1 text-sm text-white/35">
                Masonry düzen · hero + varyasyonlar · dışa aktarma.
              </p>
            </div>
          </div>

          <div className="grid items-start gap-8 lg:grid-cols-12">
            <div className="space-y-6 lg:col-span-8">
              <ResultsGallery />
              <ExportStrip />
            </div>
            <div className="lg:col-span-4 lg:sticky lg:top-28">
              <StudioSidePanel />
            </div>
          </div>
        </section>

        <VideoFlowSection />

        <TemplateGrid />
      </motion.div>

      <CaptionBar />
    </div>
  );
}
