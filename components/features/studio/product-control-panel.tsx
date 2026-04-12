"use client";

import { useTranslations } from "next-intl";
import { Layers } from "lucide-react";
import { AnimatePresence } from "framer-motion";
import { useStudioStore, type ProductFlow } from "@/store/studio-store";
import { cn } from "@/lib/utils";
import { ModelPhotoForm } from "./flows/model-photo-form";
import { ProductAnglesForm } from "./flows/product-angles-form";
import { ProductReferenceForm } from "./flows/product-reference-form";
import { ProductSwapForm } from "./flows/product-swap-form";
import { GhostMannequinForm } from "./flows/ghost-mannequin-form";
import { PhotoToVideoForm } from "./flows/photo-to-video-form";

export function ActiveFlowForm({ flow }: { flow: ProductFlow }) {
  switch (flow) {
    case "model-photo":
      return <ModelPhotoForm key="model-photo" />;
    case "product-angles":
      return <ProductAnglesForm key="product-angles" />;
    case "product-reference":
      return <ProductReferenceForm key="product-reference" />;
    case "product-swap":
      return <ProductSwapForm key="product-swap" />;
    case "ghost-mannequin":
      return <GhostMannequinForm key="ghost-mannequin" />;
    case "photo-to-video":
      return <PhotoToVideoForm key="photo-to-video" />;
    default:
      return <ModelPhotoForm key="model-photo" />;
  }
}

export function ProductControlPanel({ className }: { className?: string }) {
  const t = useTranslations("productStudio");
  const activeProductFlow = useStudioStore((s) => s.activeProductFlow);

  return (
    <div
      className={cn(
        "flex h-full min-h-0 flex-col rounded-3xl border border-white/10 bg-[rgb(8_8_10/0.78)] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_8px_40px_rgba(0,0,0,0.35)] backdrop-blur-xl md:p-5",
        className,
      )}
    >
      {/* Header */}
      <div className="mb-5 shrink-0 space-y-1">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-indigo-500/15">
            <Layers className="h-4 w-4 text-indigo-400" aria-hidden />
          </div>
          <div>
            <h1 className="text-base font-semibold tracking-tight text-white">
              {t("productStudio")}
            </h1>
            <p className="text-[11px] text-white/35">{t("navProSub")}</p>
          </div>
        </div>
      </div>

      {/* Scrollable form area */}
      <div className="min-h-0 flex-1 overflow-y-auto pr-1 [-ms-overflow-style:none] [scrollbar-width:thin]">
        <AnimatePresence mode="wait">
          <ActiveFlowForm flow={activeProductFlow} />
        </AnimatePresence>
      </div>
    </div>
  );
}
