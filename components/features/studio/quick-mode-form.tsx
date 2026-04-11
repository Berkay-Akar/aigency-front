"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { UploadDropzone } from "./upload-dropzone";
import { CreditCostDisplay } from "./credit-cost-display";
import { GenerateButton } from "./generate-button";
import { useStudioStore } from "@/store/studio-store";
import { formatGenerationErrorMessage } from "@/lib/generation-error-message";
import { cn } from "@/lib/utils";
import {
  STUDIO_MODEL_OPTIONS,
  getModelOption,
  parseModelValue,
  type StudioModelOption,
} from "@/lib/fal-models";
import type { AiGenerationMode, ModelTier } from "@/lib/api";

type TFn = ReturnType<typeof useTranslations<"generation">>;

const MODE_ORDER: AiGenerationMode[] = [
  "text-to-image",
  "image-to-image",
  "image-to-video",
];

const GROUP_KEY: Record<AiGenerationMode, string> = {
  "text-to-image": "modelGroupTti",
  "image-to-image": "modelGroupIti",
  "image-to-video": "modelGroupItv",
};

function ModelSelect({
  mode,
  tier,
  onChange,
  t,
}: {
  mode: AiGenerationMode;
  tier: ModelTier;
  onChange: (mode: AiGenerationMode, tier: ModelTier) => void;
  t: TFn;
}) {
  const selected = getModelOption(mode, tier);
  const groupedOptions = MODE_ORDER.map((m) => ({
    groupKey: GROUP_KEY[m],
    options: STUDIO_MODEL_OPTIONS.filter((o) => o.mode === m),
  }));

  return (
    <div>
      <Label className="mb-2 block text-[10px] font-semibold uppercase tracking-wider text-white/35">
        {t("mode")}
      </Label>
      <select
        value={selected.value}
        onChange={(e) => {
          const parsed = parseModelValue(e.target.value);
          if (parsed) onChange(parsed.mode, parsed.tier);
        }}
        className="h-10 w-full rounded-xl border border-white/[0.08] bg-white/[0.04] px-3 text-sm text-white focus-visible:border-indigo-500/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/30"
      >
        {groupedOptions.map(({ groupKey, options }) => (
          <optgroup
            key={groupKey}
            label={t(groupKey as Parameters<TFn>[0])}
            className="bg-[#111]"
          >
            {options.map((o: StudioModelOption) => (
              <option key={o.value} value={o.value} className="bg-[#111]">
                {t(o.labelKey as Parameters<TFn>[0])}
              </option>
            ))}
          </optgroup>
        ))}
      </select>
      <p className="mt-1.5 text-[10px] text-white/25">
        {t("activeModel")}: {selected.modelId}
      </p>
    </div>
  );
}

export function QuickModeForm() {
  const t = useTranslations("generation");
  const ts = useTranslations("studio");

  const generationMode = useStudioStore((s) => s.generationMode);
  const setGenerationMode = useStudioStore((s) => s.setGenerationMode);
  const modelTier = useStudioStore((s) => s.modelTier);
  const setModelTier = useStudioStore((s) => s.setModelTier);
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

  const showMockHint =
    (mainReferenceUrl?.startsWith("blob:") ?? false) ||
    (styleReferenceUrl?.startsWith("blob:") ?? false);

  return (
    <motion.div
      layout
      className="flex flex-col gap-5"
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.25 }}
    >
      <p className="text-xs leading-relaxed text-white/40">{ts("helperQuick")}</p>

      {showMockHint ? (
        <p className="rounded-2xl border border-amber-500/20 bg-amber-500/[0.07] px-3 py-2 text-[11px] text-amber-200/90">
          {t("mockLocalImage")}
        </p>
      ) : null}

      {generationError ? (
        <p className="rounded-2xl border border-red-500/25 bg-red-500/10 px-3 py-2 text-xs text-red-300">
          {formatGenerationErrorMessage(generationError, t)}
        </p>
      ) : null}

      <ModelSelect
        mode={generationMode}
        tier={modelTier}
        onChange={(m, t2) => {
          setGenerationMode(m);
          setModelTier(t2);
        }}
        t={t}
      />

      {generationMode !== "text-to-image" ? (
        <UploadDropzone
          label={t("referenceImage")}
          previewUrl={mainReferenceUrl}
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

      <UploadDropzone
        label={t("styleReference")}
        optional
        previewUrl={styleReferenceUrl}
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
                "rounded-xl border py-2.5 text-xs font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/40",
                aspectRatio === id
                  ? "border-indigo-500/50 bg-indigo-500/15 text-indigo-200"
                  : "border-white/[0.08] bg-white/[0.02] text-white/45 hover:text-white/70"
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
                  "flex-1 rounded-xl border py-2.5 text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/40",
                  duration === d
                    ? "border-indigo-500/50 bg-indigo-500/15 text-indigo-200"
                    : "border-white/[0.08] bg-white/[0.02] text-white/45"
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
          <select
            value={platform}
            onChange={(e) =>
              setPlatform(e.target.value as "instagram" | "tiktok" | "general")
            }
            className="h-10 w-full rounded-xl border border-white/[0.08] bg-white/[0.04] px-3 text-sm text-white focus-visible:border-indigo-500/40 focus-visible:outline-none"
          >
            <option value="general" className="bg-[#111]">General</option>
            <option value="instagram" className="bg-[#111]">Instagram</option>
            <option value="tiktok" className="bg-[#111]">TikTok</option>
          </select>
        </div>
        <div>
          <Label className="mb-1.5 block text-[10px] font-semibold uppercase tracking-wider text-white/35">
            {t("tone")}
          </Label>
          <select
            value={tone}
            onChange={(e) =>
              setTone(
                e.target.value as
                  | "professional"
                  | "casual"
                  | "humorous"
                  | "inspirational"
              )
            }
            className="h-10 w-full rounded-xl border border-white/[0.08] bg-white/[0.04] px-3 text-sm text-white focus-visible:border-indigo-500/40 focus-visible:outline-none"
          >
            <option value="professional" className="bg-[#111]">{t("toneProfessional")}</option>
            <option value="casual" className="bg-[#111]">{t("toneCasual")}</option>
            <option value="humorous" className="bg-[#111]">{t("toneHumorous")}</option>
            <option value="inspirational" className="bg-[#111]">{t("toneInspirational")}</option>
          </select>
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
          className="resize-none rounded-2xl border-white/[0.08] bg-white/[0.04] text-white placeholder:text-white/25 focus-visible:border-indigo-500/30 focus-visible:ring-indigo-500/20"
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
        className="w-full rounded-2xl border border-white/[0.08] bg-transparent py-3 text-sm font-medium text-white/55 transition-colors hover:border-indigo-500/30 hover:bg-indigo-500/[0.06] hover:text-indigo-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/40"
      >
        <span className="block text-[10px] font-normal uppercase tracking-wider text-white/30">
          {ts("tryCustomize")}
        </span>
        {ts("tryCustomizeCta")}
      </button>
    </motion.div>
  );
}
