"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { UploadDropzone } from "./upload-dropzone";
import { SectionAccordion } from "./section-accordion";
import { CreditCostDisplay } from "./credit-cost-display";
import { GenerateButton } from "./generate-button";
import { StudioModelPicker } from "./studio-model-picker";
import { useStudioStore } from "@/store/studio-store";
import { cn } from "@/lib/utils";

function FieldSelect({
  id,
  label,
  value,
  onChange,
  options,
  labelMap = {},
}: {
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: string[];
  labelMap?: Record<string, string>;
}) {
  return (
    <div className="space-y-1.5">
      <Label
        htmlFor={id}
        className="text-[10px] font-semibold uppercase tracking-wider text-white/35"
      >
        {label}
      </Label>
      <select
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="glass-trigger h-10 w-full rounded-xl px-3 text-sm text-white focus-visible:border-indigo-500/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/30"
      >
        <option value="">—</option>
        {options.map((o) => (
          <option key={o} value={o} className="bg-[#111]">
            {labelMap[o] ?? o}
          </option>
        ))}
      </select>
    </div>
  );
}

export function CustomizeModeForm() {
  const t = useTranslations("generation");
  const ts = useTranslations("studio");

  const s = useStudioStore();
  const isGenerating = useStudioStore((st) => st.isGenerating);
  const startGeneration = useStudioStore((st) => st.startGeneration);
  const enhancePrompt = useStudioStore((st) => st.enhancePrompt);
  const setEnhancePrompt = useStudioStore((st) => st.setEnhancePrompt);

  const subjectLabelMap: Record<string, string> = {
    // gender
    Woman: t("optGenderWoman"),
    Man: t("optGenderMan"),
    "Non-binary": t("optGenderNonBinary"),
    Any: t("optGenderAny"),
    // age
    "young adult": t("optAgeYoung"),
    adult: t("optAgeAdult"),
    "mid-life": t("optAgeMidLife"),
    mature: t("optAgeMature"),
    senior: t("optAgeSenior"),
    // ethnicity
    Neutral: t("optEthNeutral"),
    "East Asian": t("optEthEastAsian"),
    "South Asian": t("optEthSouthAsian"),
    Black: t("optEthBlack"),
    Latine: t("optEthLatine"),
    "Middle Eastern": t("optEthMiddleEastern"),
    White: t("optEthWhite"),
    Mixed: t("optEthMixed"),
    // skin tone
    Fair: t("optSkinFair"),
    Light: t("optSkinLight"),
    Medium: t("optSkinMedium"),
    Tan: t("optSkinTan"),
    Deep: t("optSkinDeep"),
    "Rich deep": t("optSkinRichDeep"),
    // hair color
    Black_hair: t("optHairBlack"),
    Brown: t("optHairBrown"),
    Blonde: t("optHairBlonde"),
    Auburn: t("optHairAuburn"),
    Red: t("optHairRed"),
    Gray: t("optHairGray"),
    "Fashion color": t("optHairFashion"),
    // hair style
    Sleek: t("optHairSleek"),
    Wavy: t("optHairWavy"),
    Curly: t("optHairCurly"),
    "Short crop": t("optHairShortCrop"),
    "Long layers": t("optHairLongLayers"),
    Updo: t("optHairUpdo"),
    Braided: t("optHairBraided"),
    // expression
    "Soft smile": t("optExprSoftSmile"),
    Confident: t("optExprConfident"),
    Serious: t("optExprSerious"),
    Playful: t("optExprPlayful"),
    Editorial: t("optExprEditorial"),
    // body type
    Athletic: t("optBodyAthletic"),
    Average: t("optBodyAverage"),
    Curvy: t("optBodyCurvy"),
    Slim: t("optBodySlim"),
    Plus: t("optBodyPlus"),
    Runway: t("optBodyRunway"),
    // pose
    Standing: t("optPoseStanding"),
    Seated: t("optPoseSeated"),
    Walking: t("optPoseWalking"),
    "Hero pose": t("optPoseHero"),
    "Casual lean": t("optPoseCasualLean"),
    "Hands visible": t("optPoseHandsVisible"),
    // camera framing
    "Full body": t("optFrameFull"),
    "Three-quarter": t("optFrameThreeQ"),
    "Waist-up": t("optFrameWaistUp"),
    "Close-up": t("optFrameCloseUp"),
    "Macro detail": t("optFrameMacro"),
  };

  const apiMissing =
    (process.env.NEXT_PUBLIC_API_URL ?? "").trim().length === 0;
  const showMockHint =
    apiMissing &&
    ((s.mainReferenceUrl?.startsWith("blob:") ?? false) ||
      (s.styleReferenceUrl?.startsWith("blob:") ?? false) ||
      (s.backgroundReferenceUrl?.startsWith("blob:") ?? false));

  return (
    <motion.div
      layout
      className="flex flex-col gap-4 pb-2"
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.25 }}
    >
      <p className="text-xs leading-relaxed text-white/40">
        {ts("helperCustomize")}
      </p>

      {showMockHint ? (
        <p className="rounded-2xl border border-amber-500/20 bg-amber-500/[0.07] px-3 py-2 text-[11px] text-amber-200/90">
          {t("mockLocalImage")}
        </p>
      ) : null}

      <StudioModelPicker
        mode={s.generationMode}
        studioPriceTier={s.studioPriceTier}
        falModelId={s.falModelId}
        onModeChange={s.setGenerationMode}
        onStudioPriceTierChange={s.setStudioPriceTier}
        onFalModelIdChange={s.setFalModelId}
      />

      <SectionAccordion title={t("sectionReference")} defaultOpen>
        <div className="space-y-4">
          {s.generationMode !== "text-to-image" ? (
            <UploadDropzone
              label={t("referenceImage")}
              previewUrl={s.mainReferenceUrl}
              onFile={(file) => {
                const url = URL.createObjectURL(file);
                s.setMainReferenceUrl(url);
              }}
              onClear={() => {
                if (s.mainReferenceUrl?.startsWith("blob:")) {
                  URL.revokeObjectURL(s.mainReferenceUrl);
                }
                s.setMainReferenceUrl(null);
              }}
            />
          ) : null}
          <UploadDropzone
            label={t("styleReference")}
            optional
            previewUrl={s.styleReferenceUrl}
            onFile={(file) => {
              const url = URL.createObjectURL(file);
              s.setStyleReferenceUrl(url);
            }}
            onClear={() => {
              if (s.styleReferenceUrl?.startsWith("blob:")) {
                URL.revokeObjectURL(s.styleReferenceUrl);
              }
              s.setStyleReferenceUrl(null);
            }}
          />
          <UploadDropzone
            label={t("backgroundReference")}
            optional
            previewUrl={s.backgroundReferenceUrl}
            onFile={(file) => {
              const url = URL.createObjectURL(file);
              s.setBackgroundReferenceUrl(url);
            }}
            onClear={() => {
              if (s.backgroundReferenceUrl?.startsWith("blob:")) {
                URL.revokeObjectURL(s.backgroundReferenceUrl);
              }
              s.setBackgroundReferenceUrl(null);
            }}
          />
        </div>
      </SectionAccordion>

      <SectionAccordion title={t("sectionSubject")}>
        <p className="mb-3 text-[11px] text-white/35">{t("subjectHint")}</p>
        <div className="grid gap-3 sm:grid-cols-2">
          <FieldSelect
            id="g-gender"
            label={t("gender")}
            value={s.gender}
            onChange={s.setGender}
            options={["Woman", "Man", "Non-binary", "Any"]}
            labelMap={subjectLabelMap}
          />
          <FieldSelect
            id="g-age"
            label={t("ageRange")}
            value={s.ageRange}
            onChange={s.setAgeRange}
            options={["young adult", "adult", "mid-life", "mature", "senior"]}
            labelMap={subjectLabelMap}
          />
          <FieldSelect
            id="g-eth"
            label={t("ethnicity")}
            value={s.ethnicity}
            onChange={s.setEthnicity}
            options={[
              "Neutral",
              "East Asian",
              "South Asian",
              "Black",
              "Latine",
              "Middle Eastern",
              "White",
              "Mixed",
            ]}
            labelMap={subjectLabelMap}
          />
          <FieldSelect
            id="g-skin"
            label={t("skinTone")}
            value={s.skinTone}
            onChange={s.setSkinTone}
            options={["Fair", "Light", "Medium", "Tan", "Deep", "Rich deep"]}
            labelMap={subjectLabelMap}
          />
          <FieldSelect
            id="g-hc"
            label={t("hairColor")}
            value={s.hairColor}
            onChange={s.setHairColor}
            options={[
              "Black",
              "Brown",
              "Blonde",
              "Auburn",
              "Red",
              "Gray",
              "Fashion color",
            ]}
            labelMap={{
              Black: t("optHairBlack"),
              Brown: t("optHairBrown"),
              Blonde: t("optHairBlonde"),
              Auburn: t("optHairAuburn"),
              Red: t("optHairRed"),
              Gray: t("optHairGray"),
              "Fashion color": t("optHairFashion"),
            }}
          />
          <FieldSelect
            id="g-hs"
            label={t("hairStyle")}
            value={s.hairStyle}
            onChange={s.setHairStyle}
            options={[
              "Sleek",
              "Wavy",
              "Curly",
              "Short crop",
              "Long layers",
              "Updo",
              "Braided",
            ]}
            labelMap={subjectLabelMap}
          />
          <FieldSelect
            id="g-ex"
            label={t("expression")}
            value={s.expression}
            onChange={s.setExpression}
            options={[
              "Neutral",
              "Soft smile",
              "Confident",
              "Serious",
              "Playful",
              "Editorial",
            ]}
            labelMap={subjectLabelMap}
          />
        </div>
      </SectionAccordion>

      <SectionAccordion title={t("sectionBody")}>
        <div className="space-y-4">
          <FieldSelect
            id="g-body"
            label={t("bodyType")}
            value={s.bodyType}
            onChange={s.setBodyType}
            options={["Athletic", "Average", "Curvy", "Slim", "Plus", "Runway"]}
            labelMap={subjectLabelMap}
          />
          <div className="space-y-2">
            <div className="flex justify-between text-[10px] font-semibold uppercase tracking-wider text-white/35">
              <span>{t("height")}</span>
              <span className="tabular-nums text-white/50">
                {s.heightEmphasis}%
              </span>
            </div>
            <Slider
              value={[s.heightEmphasis]}
              onValueChange={(v) => {
                const arr = Array.isArray(v) ? v : [v];
                s.setHeightEmphasis(Number(arr[0]) || 50);
              }}
              min={0}
              max={100}
              step={1}
              className="py-1"
            />
          </div>
          <FieldSelect
            id="g-pose"
            label={t("poseStyle")}
            value={s.poseStyle}
            onChange={s.setPoseStyle}
            options={[
              "Standing",
              "Seated",
              "Walking",
              "Hero pose",
              "Casual lean",
              "Hands visible",
            ]}
            labelMap={subjectLabelMap}
          />
          <FieldSelect
            id="g-frame"
            label={t("cameraFraming")}
            value={s.cameraFraming}
            onChange={s.setCameraFraming}
            options={[
              "Full body",
              "Three-quarter",
              "Waist-up",
              "Close-up",
              "Macro detail",
            ]}
            labelMap={subjectLabelMap}
          />
        </div>
      </SectionAccordion>

      <SectionAccordion title={t("sectionOutput")} defaultOpen>
        <div className="space-y-4">
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
                  onClick={() => s.setAspectRatio(id)}
                  className={cn(
                    "rounded-xl border py-2 text-xs font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/40",
                    s.aspectRatio === id
                      ? "border-indigo-500/50 bg-indigo-500/15 text-indigo-200"
                      : "border-white/8 bg-white/2 text-white/45",
                  )}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-[10px] font-semibold uppercase tracking-wider text-white/35">
              <span>{t("styleStrength")}</span>
              <span className="tabular-nums text-white/50">
                {s.styleStrength}%
              </span>
            </div>
            <Slider
              value={[s.styleStrength]}
              onValueChange={(v) => {
                const arr = Array.isArray(v) ? v : [v];
                s.setStyleStrength(Number(arr[0]) || 72);
              }}
              min={0}
              max={100}
            />
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-[10px] font-semibold uppercase tracking-wider text-white/35">
              <span>{t("promptStrength")}</span>
              <span className="tabular-nums text-white/50">
                {s.promptStrength}%
              </span>
            </div>
            <Slider
              value={[s.promptStrength]}
              onValueChange={(v) => {
                const arr = Array.isArray(v) ? v : [v];
                s.setPromptStrength(Number(arr[0]) || 78);
              }}
              min={0}
              max={100}
            />
          </div>

          <div>
            <Label className="mb-2 block text-[10px] font-semibold uppercase tracking-wider text-white/35">
              {t("backgroundMode")}
            </Label>
            <div className="grid grid-cols-3 gap-2">
              {(
                [
                  { id: "auto" as const, label: t("bgAuto") },
                  { id: "transparent" as const, label: t("bgTransparent") },
                  { id: "original" as const, label: t("bgOriginal") },
                ] as const
              ).map(({ id, label }) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => s.setBackgroundMode(id)}
                  className={cn(
                    "rounded-xl border py-2 text-[11px] font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/40",
                    s.backgroundMode === id
                      ? "border-indigo-500/50 bg-indigo-500/15 text-indigo-200"
                      : "border-white/8 bg-white/2 text-white/45",
                  )}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          <FieldSelect
            id="g-outfmt"
            label={t("outputFormat")}
            value={s.outputFormat}
            onChange={(v) => s.setOutputFormat(v as "png" | "jpeg" | "webp")}
            options={["png", "jpeg", "webp"]}
          />

          {s.generationMode === "image-to-video" ? (
            <div>
              <Label className="mb-2 block text-[10px] font-semibold uppercase tracking-wider text-white/35">
                {t("duration")}
              </Label>
              <div className="flex gap-2">
                {([5, 10] as const).map((d) => (
                  <button
                    key={d}
                    type="button"
                    onClick={() => s.setDuration(d)}
                    className={cn(
                      "flex-1 rounded-xl border py-2 text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/40",
                      s.duration === d
                        ? "border-indigo-500/50 bg-indigo-500/15 text-indigo-200"
                        : "border-white/8 text-white/45",
                    )}
                  >
                    {d} {t("seconds")}
                  </button>
                ))}
              </div>
            </div>
          ) : null}
        </div>
      </SectionAccordion>

      <SectionAccordion title={t("sectionExtra")}>
        <div className="space-y-4">
          <div>
            <Label
              htmlFor="neg-prompt"
              className="mb-2 block text-[10px] font-semibold uppercase tracking-wider text-white/35"
            >
              {t("negativePrompt")}
            </Label>
            <Textarea
              id="neg-prompt"
              value={s.negativePrompt}
              onChange={(e) => s.setNegativePrompt(e.target.value)}
              rows={2}
              placeholder={t("negativePlaceholder")}
              className="resize-none rounded-2xl border-white/8 bg-white/4 text-sm text-white placeholder:text-white/25"
            />
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label
                htmlFor="seed-input"
                className="text-[10px] font-semibold uppercase tracking-wider text-white/35"
              >
                {t("seed")}
              </Label>
              <div className="flex gap-2">
                <Input
                  id="seed-input"
                  type="number"
                  value={s.seed ?? ""}
                  onChange={(e) => {
                    const v = e.target.value;
                    s.setSeed(v === "" ? null : Number(v));
                  }}
                  placeholder={t("seedRandom")}
                  className="h-10 flex-1 rounded-xl border-white/8 bg-white/4 text-white"
                />
                <button
                  type="button"
                  onClick={() => s.setSeed(null)}
                  className="rounded-xl border border-white/8 px-3 text-xs text-white/50 transition-colors hover:bg-white/5"
                >
                  {t("seedRandom")}
                </button>
              </div>
            </div>
          </div>

          <button
            type="button"
            role="switch"
            aria-checked={enhancePrompt}
            onClick={() => setEnhancePrompt(!enhancePrompt)}
            className={cn(
              "flex w-full items-center justify-between rounded-2xl border px-4 py-3 text-left text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/40",
              enhancePrompt
                ? "border-indigo-500/40 bg-indigo-500/10 text-indigo-100"
                : "border-white/8 bg-white/2 text-white/60",
            )}
          >
            <span>{t("enhanceWithGpt")}</span>
            <span
              className={cn(
                "relative inline-flex h-6 w-10 shrink-0 rounded-full border transition-colors",
                enhancePrompt
                  ? "border-indigo-400/50 bg-indigo-500/40"
                  : "border-white/20 bg-white/10",
              )}
            >
              <span
                className={cn(
                  "absolute top-0.5 left-0.5 h-4 w-4 rounded-full bg-white transition-transform",
                  enhancePrompt && "translate-x-4",
                )}
              />
            </span>
          </button>
        </div>
      </SectionAccordion>

      <div>
        <Label
          htmlFor="studio-prompt-custom"
          className="mb-2 block text-[10px] font-semibold uppercase tracking-wider text-white/35"
        >
          {t("prompt")}
        </Label>
        <Textarea
          id="studio-prompt-custom"
          value={s.prompt}
          onChange={(e) => s.setPrompt(e.target.value)}
          rows={4}
          placeholder={t("promptPlaceholder")}
          className="resize-none rounded-2xl border-white/8 bg-white/4 text-white placeholder:text-white/25"
        />
      </div>

      <div className="sticky bottom-0 z-10 space-y-3 border-t border-white/10 bg-[rgb(8_8_10/0.92)] pt-4 shadow-[0_-12px_40px_rgba(0,0,0,0.4)] backdrop-blur-xl">
        <CreditCostDisplay />
        <GenerateButton
          loading={isGenerating}
          onClick={() => {
            void startGeneration();
          }}
        />
        <button
          type="button"
          onClick={() => s.setUiMode("quick")}
          className="w-full rounded-2xl py-2.5 text-sm font-medium text-white/45 transition-colors hover:text-white/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/40"
        >
          {ts("backToQuick")}
        </button>
      </div>
    </motion.div>
  );
}
