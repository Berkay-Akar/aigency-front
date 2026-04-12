"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { UploadDropzone } from "../upload-dropzone";
import { cn } from "@/lib/utils";
import { useStudioStore } from "@/store/studio-store";

function ResolutionToggle() {
  const t = useTranslations("productStudio");
  const productResolution = useStudioStore((s) => s.productResolution);
  const setProductResolution = useStudioStore((s) => s.setProductResolution);
  return (
    <div>
      <Label className="mb-2 block text-[10px] font-semibold uppercase tracking-wider text-white/35">
        {t("resolution")}
      </Label>
      <div className="flex gap-2">
        {(["1K", "2K"] as const).map((r) => (
          <button
            key={r}
            type="button"
            onClick={() => setProductResolution(r)}
            className={cn(
              "flex-1 rounded-xl border py-2 text-sm font-semibold transition-all",
              productResolution === r
                ? "liquid-chip liquid-chip-active"
                : "liquid-chip text-white/45",
            )}
          >
            {r}{" "}
            <span className="ml-1 text-[10px] font-normal opacity-60">
              {r === "1K" ? "10kr" : "25kr"}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}

export function ProductReferenceForm() {
  const t = useTranslations("productStudio");
  const s = useStudioStore();
  const productImageUrls = useStudioStore((st) => st.productImageUrls);
  const setProductImageUrls = useStudioStore((st) => st.setProductImageUrls);
  const productReferenceImageUrl = useStudioStore(
    (st) => st.productReferenceImageUrl,
  );
  const setProductReferenceImageUrl = useStudioStore(
    (st) => st.setProductReferenceImageUrl,
  );
  const productReferenceStyleMode = useStudioStore(
    (st) => st.productReferenceStyleMode,
  );
  const setProductReferenceStyleMode = useStudioStore(
    (st) => st.setProductReferenceStyleMode,
  );
  const productCustomPrompt = useStudioStore((st) => st.productCustomPrompt);
  const setProductCustomPrompt = useStudioStore(
    (st) => st.setProductCustomPrompt,
  );
  const isGenerating = useStudioStore((st) => st.isProductGenerating);
  const startProductGeneration = useStudioStore(
    (st) => st.startProductGeneration,
  );
  const creditEstimate = s.getProductCreditEstimate();

  const primaryUrl = productImageUrls[0] ?? null;

  return (
    <motion.div
      layout
      className="flex flex-col gap-5"
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.22 }}
    >
      <p className="text-xs leading-relaxed text-white/40">
        {t("referenceDesc")}
      </p>

      <UploadDropzone
        label={t("productImage")}
        previewUrl={primaryUrl}
        onFile={(f) => {
          const prev = primaryUrl;
          if (prev?.startsWith("blob:")) URL.revokeObjectURL(prev);
          setProductImageUrls([URL.createObjectURL(f)]);
        }}
        onClear={() => {
          if (primaryUrl?.startsWith("blob:")) URL.revokeObjectURL(primaryUrl);
          setProductImageUrls([]);
        }}
      />

      <UploadDropzone
        label={t("referenceImage")}
        previewUrl={productReferenceImageUrl}
        onFile={(f) => {
          const prev = productReferenceImageUrl;
          if (prev?.startsWith("blob:")) URL.revokeObjectURL(prev);
          setProductReferenceImageUrl(URL.createObjectURL(f));
        }}
        onClear={() => {
          if (productReferenceImageUrl?.startsWith("blob:"))
            URL.revokeObjectURL(productReferenceImageUrl);
          setProductReferenceImageUrl(null);
        }}
      />

      {/* Style mode */}
      <div>
        <Label className="mb-2 block text-[10px] font-semibold uppercase tracking-wider text-white/35">
          {t("style")}
        </Label>
        <div className="flex gap-2">
          {(
            [
              {
                id: "minimal" as const,
                labelKey: "styleMinimal",
                descKey: "styleMinimalDesc",
              },
              {
                id: "bold" as const,
                labelKey: "styleBold",
                descKey: "styleBoldDesc",
              },
            ] as const
          ).map(({ id, labelKey, descKey }) => (
            <button
              key={id}
              type="button"
              onClick={() => setProductReferenceStyleMode(id)}
              className={cn(
                "flex flex-1 flex-col items-center gap-0.5 rounded-xl border py-3 text-sm font-semibold transition-all",
                productReferenceStyleMode === id
                  ? "liquid-chip liquid-chip-active"
                  : "liquid-chip text-white/40",
              )}
            >
              {t(labelKey)}
              <span
                className={cn(
                  "text-[10px] font-normal",
                  productReferenceStyleMode === id
                    ? "text-indigo-300/70"
                    : "text-white/25",
                )}
              >
                {t(descKey)}
              </span>
            </button>
          ))}
        </div>
      </div>

      <ResolutionToggle />

      <div>
        <Label className="mb-2 block text-[10px] font-semibold uppercase tracking-wider text-white/35">
          {t("extraDirective")}{" "}
          <span className="text-white/25">{t("extraDirectiveOptional")}</span>
        </Label>
        <Textarea
          value={productCustomPrompt}
          onChange={(e) => setProductCustomPrompt(e.target.value)}
          rows={3}
          maxLength={500}
          placeholder="desert sand dunes, golden hour…"
          className="resize-none rounded-2xl border-white/10 bg-white/4 text-white placeholder:text-white/25 backdrop-blur-sm focus-visible:border-indigo-500/30 focus-visible:ring-indigo-500/20"
        />
      </div>

      {/* Credit estimate + generate */}
      <div className="space-y-3">
        <p className="text-center text-[11px] text-white/40">
          {t("estimatedCredits")}:{" "}
          <span className="font-semibold text-indigo-300">
            {creditEstimate}
          </span>
        </p>

        <button
          type="button"
          disabled={
            isGenerating ||
            productImageUrls.length === 0 ||
            !productReferenceImageUrl
          }
          onClick={() => void startProductGeneration()}
          className="flex w-full items-center justify-center gap-2 rounded-2xl bg-linear-to-r from-indigo-600 to-violet-600 py-3.5 text-sm font-semibold text-white shadow-lg shadow-indigo-900/30 transition hover:from-indigo-500 hover:to-violet-500 disabled:pointer-events-none disabled:opacity-45"
        >
          {isGenerating ? t("generating") : t("applyReferenceStyle")}
        </button>
      </div>
    </motion.div>
  );
}
