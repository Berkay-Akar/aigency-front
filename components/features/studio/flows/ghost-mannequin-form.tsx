"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { UploadDropzone } from "../upload-dropzone";
import { cn } from "@/lib/utils";
import { useStudioStore } from "@/store/studio-store";

const BG_PRESETS = ["white", "light grey", "soft beige", "black", "cream"];

export function GhostMannequinForm() {
  const t = useTranslations("productStudio");
  const s = useStudioStore();
  const productImageUrls = useStudioStore((st) => st.productImageUrls);
  const setProductImageUrls = useStudioStore((st) => st.setProductImageUrls);
  const ghostQuality = useStudioStore((st) => st.ghostQuality);
  const setGhostQuality = useStudioStore((st) => st.setGhostQuality);
  const ghostBackgroundColor = useStudioStore((st) => st.ghostBackgroundColor);
  const setGhostBackgroundColor = useStudioStore(
    (st) => st.setGhostBackgroundColor,
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
      <p className="text-xs leading-relaxed text-white/40">{t("ghostDesc")}</p>

      <UploadDropzone
          compact
          label={t("clothingPhoto")}
          previewUrl={primaryUrl}
          onFile={(f) => {
            const prev = primaryUrl;
            if (prev?.startsWith("blob:")) URL.revokeObjectURL(prev);
            setProductImageUrls([URL.createObjectURL(f)]);
          }}
          onClear={() => {
            if (primaryUrl?.startsWith("blob:"))
              URL.revokeObjectURL(primaryUrl);
            setProductImageUrls([]);
          }}
        />

      {/* Quality selector */}
      <div>
        <Label className="mb-2 block text-[10px] font-semibold uppercase tracking-wider text-white/35">
          {t("quality")}
        </Label>
        <div className="flex gap-2">
          {(
            [
              {
                id: "standard" as const,
                labelKey: "ghostStandard",
                creditsKey: "ghostStandardCredits",
                descKey: "ghostStandardDesc",
              },
              {
                id: "premium" as const,
                labelKey: "ghostPremium",
                creditsKey: "ghostPremiumCredits",
                descKey: "ghostPremiumDesc",
              },
            ] as const
          ).map(({ id, labelKey, creditsKey, descKey }) => (
            <button
              key={id}
              type="button"
              onClick={() => setGhostQuality(id)}
              className={cn(
                "flex flex-1 flex-col items-center gap-1 rounded-xl border py-3 text-sm font-semibold transition-all",
                ghostQuality === id
                  ? "liquid-chip liquid-chip-active"
                  : "liquid-chip text-white/40",
              )}
            >
              {t(labelKey)}
              <span
                className={cn(
                  "text-[10px] font-bold",
                  ghostQuality === id ? "text-indigo-300" : "text-white/30",
                )}
              >
                {t(creditsKey)}
              </span>
              <span
                className={cn(
                  "text-[9px] font-normal text-center leading-tight",
                  ghostQuality === id ? "text-indigo-300/60" : "text-white/20",
                )}
              >
                {t(descKey)}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Background color presets */}
      <div>
        <Label className="mb-2 block text-[10px] font-semibold uppercase tracking-wider text-white/35">
          {t("background")}
        </Label>
        <div className="flex flex-wrap gap-2">
          {BG_PRESETS.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setGhostBackgroundColor(c)}
              className={cn(
                "rounded-xl border px-3 py-1.5 text-xs font-medium capitalize transition-all",
                ghostBackgroundColor === c
                  ? "liquid-chip liquid-chip-active"
                  : "liquid-chip text-white/45",
              )}
            >
              {c}
            </button>
          ))}
        </div>
        <Input
          value={ghostBackgroundColor}
          onChange={(e) => setGhostBackgroundColor(e.target.value)}
          placeholder={t("customColorPlaceholder")}
          className="mt-2 h-9 rounded-xl border-white/10 bg-white/4 text-sm text-white placeholder:text-white/25"
        />
      </div>

      <div
        className="rounded-xl border border-amber-500/15 bg-amber-500/6 px-3 py-2 text-[11px] text-amber-200/70"
        dangerouslySetInnerHTML={{ __html: t.raw("ghostPngNote") }}
      />

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
          placeholder="preserve the collar shape…"
          className="resize-none rounded-2xl border-white/10 bg-white/4 text-white placeholder:text-white/25 backdrop-blur-sm focus-visible:border-indigo-500/30 focus-visible:ring-indigo-500/20"
        />
      </div>

      {/* Credit estimate + generate */}
      <div className="space-y-3">
        <p className="text-center text-[11px] text-white/40">
          {t("estimatedCredits")}:{" "}
          <span className="font-semibold text-indigo-300">{creditEstimate}</span>
        </p>

        <button
          type="button"
          disabled={isGenerating || productImageUrls.length === 0}
          onClick={() => void startProductGeneration()}
          className="flex w-full items-center justify-center gap-2 rounded-2xl bg-linear-to-r from-indigo-600 to-violet-600 py-3.5 text-sm font-semibold text-white shadow-lg shadow-indigo-900/30 transition hover:from-indigo-500 hover:to-violet-500 disabled:pointer-events-none disabled:opacity-45"
        >
          {isGenerating ? t("generating") : t("applyGhost")}
        </button>
      </div>
    </motion.div>
  );
}
