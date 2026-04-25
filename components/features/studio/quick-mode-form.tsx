"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { UploadDropzone } from "./upload-dropzone";
import { CreditCostDisplay } from "./credit-cost-display";
import { GenerateButton } from "./generate-button";
import { StudioModelPicker } from "./studio-model-picker";
import { useStudioStore } from "@/store/studio-store";
import { cn } from "@/lib/utils";
import type { AiPlatform, AiTone, AiGenerationMode } from "@/lib/api";

// Per-mode example images for upload slots (drop files in public/sample-inputs/).
const UPLOAD_EXAMPLES: Partial<
  Record<AiGenerationMode, { main: string; style: string }>
> = {
  "image-to-image": {
    main: "/sample-inputs/image-to-image-pic1.jpg",
    style: "/sample-inputs/image-to-image-pic2.jpg",
  },
  "image-to-video": {
    main: "/sample-inputs/image-to-video-input-fast.png",
    style: "/sample-inputs/image-to-video-input-fast.png",
  },
};

export function QuickModeForm() {
  const t = useTranslations("generation");
  const ts = useTranslations("studio");

  const generationMode = useStudioStore((s) => s.generationMode);
  const setGenerationMode = useStudioStore((s) => s.setGenerationMode);
  const studioPriceTier = useStudioStore((s) => s.studioPriceTier);
  const setStudioPriceTier = useStudioStore((s) => s.setStudioPriceTier);
  const falModelId = useStudioStore((s) => s.falModelId);
  const setFalModelId = useStudioStore((s) => s.setFalModelId);
  const aspectRatio = useStudioStore((s) => s.aspectRatio);
  const setAspectRatio = useStudioStore((s) => s.setAspectRatio);
  const prompt = useStudioStore((s) => s.prompt);
  const setPrompt = useStudioStore((s) => s.setPrompt);
  const mainReferenceUrl = useStudioStore((s) => s.mainReferenceUrl);
  const setMainReferenceUrl = useStudioStore((s) => s.setMainReferenceUrl);
  const styleReferenceUrl = useStudioStore((s) => s.styleReferenceUrl);
  const setStyleReferenceUrl = useStudioStore((s) => s.setStyleReferenceUrl);
  const duration = useStudioStore((s) => s.duration);
  const setDuration = useStudioStore((s) => s.setDuration);
  const platform = useStudioStore((s) => s.platform);
  const setPlatform = useStudioStore((s) => s.setPlatform);
  const tone = useStudioStore((s) => s.tone);
  const setTone = useStudioStore((s) => s.setTone);
  const isGenerating = useStudioStore((s) => s.isGenerating);
  const startGeneration = useStudioStore((s) => s.startGeneration);
  const setUiMode = useStudioStore((s) => s.setUiMode);
  const generationError = useStudioStore((s) => s.generationError);

  const apiMissing =
    (process.env.NEXT_PUBLIC_API_URL ?? "").trim().length === 0;
  const showMockHint =
    apiMissing &&
    ((mainReferenceUrl?.startsWith("blob:") ?? false) ||
      (styleReferenceUrl?.startsWith("blob:") ?? false));

  return (
    <motion.div
      layout
      className="flex flex-col gap-5"
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.25 }}
    >
      <StudioModelPicker
        mode={generationMode}
        studioPriceTier={studioPriceTier}
        falModelId={falModelId}
        onModeChange={setGenerationMode}
        onStudioPriceTierChange={setStudioPriceTier}
        onFalModelIdChange={setFalModelId}
      />

      <p className="text-xs leading-relaxed text-white/40">
        {ts("helperQuick")}
      </p>

      {showMockHint ? (
        <p className="rounded-2xl border border-amber-500/20 bg-amber-500/[0.07] px-3 py-2 text-[11px] text-amber-200/90">
          {t("mockLocalImage")}
        </p>
      ) : null}

      {generationMode !== "text-to-image" ? (
        <UploadDropzone
          label={t("referenceImage")}
          previewUrl={mainReferenceUrl}
          exampleSrc={UPLOAD_EXAMPLES[generationMode]?.main ?? null}
          onFile={(file) => {
            const url = URL.createObjectURL(file);
            setMainReferenceUrl(url);
          }}
          onClear={() => {
            if (mainReferenceUrl?.startsWith("blob:")) {
              URL.revokeObjectURL(mainReferenceUrl);
            }
            setMainReferenceUrl(null);
          }}
        />
      ) : null}

      {generationMode !== "image-to-video" && (
        <UploadDropzone
          label={t("styleReference")}
          optional
          previewUrl={styleReferenceUrl}
          exampleSrc={UPLOAD_EXAMPLES[generationMode]?.style ?? null}
          onFile={(file) => {
            const url = URL.createObjectURL(file);
            setStyleReferenceUrl(url);
          }}
          onClear={() => {
            if (styleReferenceUrl?.startsWith("blob:")) {
              URL.revokeObjectURL(styleReferenceUrl);
            }
            setStyleReferenceUrl(null);
          }}
        />
      )}

      <div>
        <Label className="mb-2 block text-[10px] font-semibold uppercase tracking-wider text-white/35">
          {t("aspectRatio")}
        </Label>
        <div className="grid grid-cols-3 gap-2">
          {(
            [
              { id: "portrait" as const, label: t("ratioPortrait") },
              { id: "landscape" as const, label: t("ratioLandscape") },
              { id: "square" as const, label: t("ratioSquare") },
            ] as const
          ).map(({ id, label }) => (
            <button
              key={id}
              type="button"
              onClick={() => setAspectRatio(id)}
              className={cn(
                "rounded-xl border py-2.5 text-xs font-medium backdrop-blur-sm transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/40",
                aspectRatio === id
                  ? "border-indigo-500/50 bg-indigo-500/20 text-indigo-100"
                  : "border-white/10 bg-white/5 text-white/45 hover:bg-white/8 hover:text-white/70",
              )}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {generationMode === "image-to-video" ? (
        <div>
          <Label className="mb-2 block text-[10px] font-semibold uppercase tracking-wider text-white/35">
            {t("duration")}
          </Label>
          <div className="flex gap-2">
            {([5, 10] as const).map((d) => (
              <button
                key={d}
                type="button"
                onClick={() => setDuration(d)}
                className={cn(
                  "flex-1 rounded-xl border py-2.5 text-sm font-medium backdrop-blur-sm transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/40",
                  duration === d
                    ? "border-indigo-500/50 bg-indigo-500/20 text-indigo-100"
                    : "border-white/10 bg-white/5 text-white/45 hover:bg-white/8",
                )}
              >
                {d} {t("seconds")}
              </button>
            ))}
          </div>
        </div>
      ) : null}

      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label className="mb-1.5 block text-[10px] font-semibold uppercase tracking-wider text-white/35">
            {t("platform")}
          </Label>
          <Select
            value={platform}
            onValueChange={(v) => setPlatform(v as AiPlatform)}
          >
            <SelectTrigger className="h-10 w-full text-sm text-white">
              <SelectValue>
                {platform === "general"
                  ? t("platformGeneral")
                  : platform === "instagram"
                    ? t("platformInstagram")
                    : platform === "tiktok"
                      ? t("platformTiktok")
                      : platform || t("platform")}
              </SelectValue>
            </SelectTrigger>
            <SelectContent align="start" sideOffset={6}>
              <SelectItem value="general">{t("platformGeneral")}</SelectItem>
              <SelectItem value="instagram">
                {t("platformInstagram")}
              </SelectItem>
              <SelectItem value="tiktok">{t("platformTiktok")}</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label className="mb-1.5 block text-[10px] font-semibold uppercase tracking-wider text-white/35">
            {t("tone")}
          </Label>
          <Select value={tone} onValueChange={(v) => setTone(v as AiTone)}>
            <SelectTrigger className="h-10 w-full text-sm text-white">
              <SelectValue>
                {tone === "professional"
                  ? t("toneProfessional")
                  : tone === "casual"
                    ? t("toneCasual")
                    : tone === "humorous"
                      ? t("toneHumorous")
                      : tone === "inspirational"
                        ? t("toneInspirational")
                        : tone || t("tone")}
              </SelectValue>
            </SelectTrigger>
            <SelectContent align="start" sideOffset={6}>
              <SelectItem value="professional">
                {t("toneProfessional")}
              </SelectItem>
              <SelectItem value="casual">{t("toneCasual")}</SelectItem>
              <SelectItem value="humorous">{t("toneHumorous")}</SelectItem>
              <SelectItem value="inspirational">
                {t("toneInspirational")}
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div>
        <Label
          htmlFor="studio-prompt-quick"
          className="mb-2 block text-[10px] font-semibold uppercase tracking-wider text-white/35"
        >
          {t("prompt")}
        </Label>
        <Textarea
          id="studio-prompt-quick"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          rows={4}
          placeholder={t("promptPlaceholder")}
          className="resize-none rounded-2xl border-white/10 bg-white/4 text-white placeholder:text-white/25 backdrop-blur-sm focus-visible:border-indigo-500/30 focus-visible:ring-indigo-500/20"
        />
      </div>

      <CreditCostDisplay />

      <GenerateButton
        loading={isGenerating}
        onClick={() => {
          void startGeneration();
        }}
      />

      <button
        type="button"
        onClick={() => setUiMode("customize")}
        className="w-full rounded-2xl border border-white/10 bg-white/4 py-3 text-sm font-medium text-white/55 shadow-none backdrop-blur-sm transition-colors hover:border-indigo-500/30 hover:bg-indigo-500/10 hover:text-indigo-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/40"
      >
        <span className="block text-[10px] font-normal uppercase tracking-wider text-white/30">
          {ts("tryCustomize")}
        </span>
        {ts("tryCustomizeCta")}
      </button>
    </motion.div>
  );
}
