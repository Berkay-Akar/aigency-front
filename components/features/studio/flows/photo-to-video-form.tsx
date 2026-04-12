"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { UploadDropzone } from "../upload-dropzone";
import { cn } from "@/lib/utils";
import { useStudioStore } from "@/store/studio-store";

export function PhotoToVideoForm() {
  const t = useTranslations("productStudio");
  const gt = useTranslations("generation");
  const s = useStudioStore();

  const PLATFORM_INFO = {
    instagram: {
      label: "Instagram",
      ratio: "9:16",
      desc: t("videoPlatformInstagramDesc"),
    },
    tiktok: {
      label: "TikTok",
      ratio: "9:16",
      desc: t("videoPlatformTiktokDesc"),
    },
    general: {
      label: t("platform") === "Platform" ? "General" : "Genel",
      ratio: "1:1",
      desc: t("videoPlatformGeneralDesc"),
    },
  } as const;
  const productImageUrls = useStudioStore((st) => st.productImageUrls);
  const setProductImageUrls = useStudioStore((st) => st.setProductImageUrls);
  const videoPlatform = useStudioStore((st) => st.videoPlatform);
  const setVideoPlatform = useStudioStore((st) => st.setVideoPlatform);
  const videoDuration = useStudioStore((st) => st.videoDuration);
  const setVideoDuration = useStudioStore((st) => st.setVideoDuration);
  const productModelTier = useStudioStore((st) => st.productModelTier);
  const setProductModelTier = useStudioStore((st) => st.setProductModelTier);
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
      <p className="text-xs leading-relaxed text-white/40">{t("videoDesc")}</p>

      <UploadDropzone
        label={t("sourcePhoto")}
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

      {/* Platform */}
      <div>
        <Label className="mb-2 block text-[10px] font-semibold uppercase tracking-wider text-white/35">
          {t("platform")}
        </Label>
        <div className="flex gap-2">
          {(
            Object.entries(PLATFORM_INFO) as [
              keyof typeof PLATFORM_INFO,
              (typeof PLATFORM_INFO)[keyof typeof PLATFORM_INFO],
            ][]
          ).map(([id, info]) => (
            <button
              key={id}
              type="button"
              onClick={() => setVideoPlatform(id)}
              className={cn(
                "flex flex-1 flex-col items-center gap-0.5 rounded-xl border py-3 text-sm font-semibold transition-all",
                videoPlatform === id
                  ? "liquid-chip liquid-chip-active"
                  : "liquid-chip text-white/40",
              )}
            >
              {info.label}
              <span
                className={cn(
                  "text-[10px] font-bold",
                  videoPlatform === id ? "text-indigo-300" : "text-white/30",
                )}
              >
                {info.ratio}
              </span>
              <span
                className={cn(
                  "text-[9px] font-normal",
                  videoPlatform === id ? "text-indigo-300/60" : "text-white/20",
                )}
              >
                {info.desc}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Duration */}
      <div>
        <Label className="mb-2 block text-[10px] font-semibold uppercase tracking-wider text-white/35">
          {t("duration")}
        </Label>
        <div className="flex gap-2">
          {[
            { d: 5 as const, credits: 50 },
            { d: 10 as const, credits: 100 },
          ].map(({ d, credits }) => (
            <button
              key={d}
              type="button"
              onClick={() => setVideoDuration(d)}
              className={cn(
                "flex flex-1 flex-col items-center gap-0.5 rounded-xl border py-3 transition-all",
                videoDuration === d
                  ? "liquid-chip liquid-chip-active"
                  : "liquid-chip text-white/40",
              )}
            >
              <span className="text-sm font-semibold">
                {t("durationSec", { d })}
              </span>
              <span
                className={cn(
                  "text-[10px] font-bold",
                  videoDuration === d ? "text-indigo-300" : "text-white/30",
                )}
              >
                {t("durationCredits", { credits })}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Model tier */}
      <div>
        <Label className="mb-2 block text-[10px] font-semibold uppercase tracking-wider text-white/35">
          {t("quality")}
        </Label>
        <div className="flex gap-2">
          {(["fast", "standard", "premium"] as const).map((tier) => (
            <button
              key={tier}
              type="button"
              onClick={() => setProductModelTier(tier)}
              className={cn(
                "flex-1 rounded-xl border py-2 text-xs font-semibold capitalize transition-all",
                productModelTier === tier
                  ? "liquid-chip liquid-chip-active"
                  : "liquid-chip text-white/40",
              )}
            >
              {tier === "fast"
                ? gt("tierFast")
                : tier === "standard"
                  ? gt("tierStandard")
                  : gt("tierPremium")}
            </button>
          ))}
        </div>
      </div>

      <div>
        <Label className="mb-2 block text-[10px] font-semibold uppercase tracking-wider text-white/35">
          {t("motionDirective")}{" "}
          <span className="text-white/25">{t("extraDirectiveOptional")}</span>
        </Label>
        <Textarea
          value={productCustomPrompt}
          onChange={(e) => setProductCustomPrompt(e.target.value)}
          rows={3}
          maxLength={500}
          placeholder="gentle wind blowing through the fabric…"
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
          {isGenerating ? t("generatingVideo") : t("generateVideo")}
        </button>
      </div>
    </motion.div>
  );
}
