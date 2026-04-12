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
              {t("perUnit")}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}

// 3 angle preview icons as SVG silhouettes
const ANGLE_ICONS = [
  // Front view
  <svg
    key="front"
    className="h-6 w-6"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.5}
  >
    <rect x="7" y="3" width="10" height="18" rx="2" />
    <line
      x1="12"
      y1="3"
      x2="12"
      y2="21"
      strokeDasharray="2 2"
      strokeOpacity={0.4}
    />
  </svg>,
  // 45° view
  <svg
    key="45"
    className="h-6 w-6"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.5}
  >
    <path d="M5 5 L19 7 L19 19 L5 17 Z" />
    <line x1="5" y1="5" x2="5" y2="17" />
  </svg>,
  // Profile view
  <svg
    key="profile"
    className="h-6 w-6"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.5}
  >
    <path d="M14 3 L8 6 L8 18 L14 21 Z" />
    <line x1="14" y1="3" x2="14" y2="21" />
  </svg>,
];

export function ProductAnglesForm() {
  const t = useTranslations("productStudio");
  const s = useStudioStore();
  const productImageUrls = useStudioStore((s) => s.productImageUrls);
  const setProductImageUrls = useStudioStore((s) => s.setProductImageUrls);
  const productCustomPrompt = useStudioStore((s) => s.productCustomPrompt);
  const setProductCustomPrompt = useStudioStore(
    (s) => s.setProductCustomPrompt,
  );
  const anglesCount = useStudioStore((s) => s.anglesCount);
  const setAnglesCount = useStudioStore((s) => s.setAnglesCount);
  const productResolution = useStudioStore((s) => s.productResolution);
  const isGenerating = useStudioStore((s) => s.isProductGenerating);
  const startProductGeneration = useStudioStore(
    (s) => s.startProductGeneration,
  );
  const creditEstimate = s.getProductCreditEstimate();

  const primaryUrl = productImageUrls[0] ?? null;

  const ANGLE_LABEL_KEYS = [t("angleFront"), t("angle45"), t("angleProfile")];

  const handleFile = (file: File) => {
    const url = URL.createObjectURL(file);
    setProductImageUrls([url]);
  };
  const handleClear = () => {
    if (primaryUrl?.startsWith("blob:")) URL.revokeObjectURL(primaryUrl);
    setProductImageUrls([]);
  };

  return (
    <motion.div
      layout
      className="flex flex-col gap-5"
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.22 }}
    >
      <p className="text-xs leading-relaxed text-white/40">{t("anglesDesc")}</p>

      <UploadDropzone
        label={t("productImage")}
        previewUrl={primaryUrl}
        onFile={handleFile}
        onClear={handleClear}
      />

      {/* Count selector */}
      <div>
        <Label className="mb-2 block text-[10px] font-semibold uppercase tracking-wider text-white/35">
          {t("howManyAngles")}
        </Label>
        <div className="flex gap-2">
          {([1, 2, 3] as const).map((n) => (
            <button
              key={n}
              type="button"
              onClick={() => setAnglesCount(n)}
              className={cn(
                "flex flex-1 flex-col items-center gap-2 rounded-xl border py-3 text-xs font-semibold transition-all",
                anglesCount === n
                  ? "liquid-chip liquid-chip-active"
                  : "liquid-chip text-white/40",
              )}
            >
              <div
                className={cn(
                  "flex gap-1",
                  anglesCount === n ? "text-indigo-300" : "text-white/30",
                )}
              >
                {ANGLE_ICONS.slice(0, n)}
              </div>
              <span>{t("angleUnit", { n })}</span>
              <span
                className={cn(
                  "text-[9px] leading-tight text-center",
                  anglesCount === n ? "text-indigo-300/70" : "text-white/20",
                )}
              >
                {ANGLE_LABEL_KEYS.slice(0, n).join(" · ")}
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
          placeholder="luxury packaging focus…"
          className="resize-none rounded-2xl border-white/10 bg-white/4 text-white placeholder:text-white/25 backdrop-blur-sm focus-visible:border-indigo-500/30 focus-visible:ring-indigo-500/20"
        />
      </div>

      {/* Credit estimate + generate */}
      <div className="space-y-3">
        <p className="text-center text-[11px] text-white/40">
          {t("estimatedCredits")}:{" "}
          <span className="font-semibold text-indigo-300">{creditEstimate}</span>
          <span className="ml-1 opacity-60">
            ({anglesCount} × {productResolution === "2K" ? 25 : 10})
          </span>
        </p>

        <button
          type="button"
          disabled={isGenerating || productImageUrls.length === 0}
          onClick={() => void startProductGeneration()}
          className="flex w-full items-center justify-center gap-2 rounded-2xl bg-linear-to-r from-indigo-600 to-violet-600 py-3.5 text-sm font-semibold text-white shadow-lg shadow-indigo-900/30 transition hover:from-indigo-500 hover:to-violet-500 disabled:pointer-events-none disabled:opacity-45"
        >
          {isGenerating ? t("generating") : t("angleUnit", { n: anglesCount })}
        </button>
      </div>
    </motion.div>
  );
}
