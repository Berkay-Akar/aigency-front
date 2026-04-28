"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { UploadDropzone } from "../upload-dropzone";
import { SectionAccordion } from "../section-accordion";
import { cn } from "@/lib/utils";
import { useStudioStore } from "@/store/studio-store";
import type { ModelPhotoOptions } from "@/lib/api";

const FALLBACK_OPTS: ModelPhotoOptions = {
  genders: ["female", "male"],
  ethnicities: [
    "international",
    "european",
    "asian",
    "african",
    "latin-american",
    "middle-eastern",
    "south-asian",
  ],
  ageRanges: ["young-adult", "adult", "mature", "senior"],
  skinColors: ["light", "medium", "tan", "dark"],
  faceTypes: ["angular-bony", "soft-round", "oval", "heart-shaped"],
  eyeColors: ["dark-brown", "light-brown", "blue", "green", "hazel"],
  expressions: ["soft-neutral", "confident", "joyful", "serious"],
  hairColors: [
    "dark-brown",
    "light-brown",
    "black",
    "blonde",
    "auburn",
    "grey",
  ],
  hairstyles: [
    "natural-afro",
    "straight-long",
    "wavy-medium",
    "ponytail",
    "bun",
    "pixie-cut",
    "braids",
    "curly-bob",
  ],
  bodySizes: ["xs", "s", "m", "l", "xl"],
  shotTypes: ["full-body", "three-quarters", "upper-body", "product"],
  resolutions: ["1K", "2K"],
  resolutionCredits: { "1K": 10, "2K": 25 },
};

// Styled select field backed by shadcn Select (portal-rendered, overflow-safe)
function FS({
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
        className="block text-[10px] font-semibold uppercase tracking-wider text-muted-foreground"
      >
        {label}
      </Label>
      <Select
        value={value || undefined}
        onValueChange={(v) => onChange(v ?? "")}
      >
        <SelectTrigger
          size="sm"
          id={id}
          className="h-9 w-full text-sm text-foreground"
        >
          <SelectValue>{value ? (labelMap[value] ?? value) : "—"}</SelectValue>
        </SelectTrigger>
        <SelectContent align="start" sideOffset={4}>
          {options.map((o) => (
            <SelectItem key={o} value={o}>
              {labelMap[o] ?? o}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

function ResolutionToggle() {
  const t = useTranslations("productStudio");
  const productResolution = useStudioStore((s) => s.productResolution);
  const setProductResolution = useStudioStore((s) => s.setProductResolution);
  return (
    <div>
      <Label className="mb-2 block text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
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
                : "liquid-chip text-foreground/45",
            )}
          >
            {r}
            <span className="ml-1.5 text-[10px] font-normal opacity-60">
              {r === "1K" ? "10kr" : "25kr"}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}

function TierPicker() {
  const t = useTranslations("productStudio");
  const gt = useTranslations("generation");
  const productModelTier = useStudioStore((s) => s.productModelTier);
  const setProductModelTier = useStudioStore((s) => s.setProductModelTier);
  const tiers = [
    { id: "fast" as const, label: gt("tierFast") },
    { id: "standard" as const, label: gt("tierStandard") },
    { id: "premium" as const, label: gt("tierPremium") },
  ];
  return (
    <div>
      <Label className="mb-2 block text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
        {t("quality")}
      </Label>
      <div className="flex gap-2">
        {tiers.map(({ id, label }) => (
          <button
            key={id}
            type="button"
            onClick={() => setProductModelTier(id)}
            className={cn(
              "flex-1 rounded-xl border py-2 text-xs font-semibold transition-all",
              productModelTier === id
                ? "liquid-chip liquid-chip-active"
                : "liquid-chip text-foreground/40",
            )}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}

export function ModelPhotoForm() {
  const t = useTranslations("productStudio");
  const s = useStudioStore();
  const opts = s.modelPhotoOptions ?? FALLBACK_OPTS;
  const optLabelMap: Record<string, string> = {
    // genders
    female: t("optFemale"),
    male: t("optMale"),
    // ethnicities
    international: t("optInternational"),
    european: t("optEuropean"),
    asian: t("optAsian"),
    african: t("optAfrican"),
    "latin-american": t("optLatinAmerican"),
    "middle-eastern": t("optMiddleEastern"),
    "south-asian": t("optSouthAsian"),
    // age ranges
    "young-adult": t("optYoungAdult"),
    adult: t("optAdult"),
    mature: t("optMature"),
    senior: t("optSenior"),
    // skin colors
    light: t("optLight"),
    medium: t("optMedium"),
    tan: t("optTan"),
    dark: t("optDark"),
    // face types
    "angular-bony": t("optAngularBony"),
    "soft-round": t("optSoftRound"),
    oval: t("optOval"),
    "heart-shaped": t("optHeartShaped"),
    // eye colors + shared brown shades
    "dark-brown": t("optDarkBrown"),
    "light-brown": t("optLightBrown"),
    blue: t("optBlue"),
    green: t("optGreen"),
    hazel: t("optHazel"),
    // expressions
    "soft-neutral": t("optSoftNeutral"),
    confident: t("optConfident"),
    joyful: t("optJoyful"),
    serious: t("optSerious"),
    // hair colors
    black: t("optBlack"),
    blonde: t("optBlonde"),
    auburn: t("optAuburn"),
    grey: t("optGrey"),
    // hairstyles
    "natural-afro": t("optNaturalAfro"),
    "straight-long": t("optStraightLong"),
    "wavy-medium": t("optWavyMedium"),
    ponytail: t("optPonytail"),
    bun: t("optBun"),
    "pixie-cut": t("optPixieCut"),
    braids: t("optBraids"),
    "curly-bob": t("optCurlyBob"),
    // body sizes
    xs: t("optXs"),
    s: t("optS"),
    m: t("optM"),
    l: t("optL"),
    xl: t("optXl"),
    // shot types
    "full-body": t("optFullBody"),
    "three-quarters": t("optThreeQuarters"),
    "upper-body": t("optUpperBody"),
    product: t("optProduct"),
  };

  useEffect(() => {
    void s.loadModelPhotoOptions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const productImageUrls = useStudioStore((s) => s.productImageUrls);
  const setProductImageUrls = useStudioStore((s) => s.setProductImageUrls);
  const productCustomPrompt = useStudioStore((s) => s.productCustomPrompt);
  const setProductCustomPrompt = useStudioStore(
    (s) => s.setProductCustomPrompt,
  );

  const isGenerating = useStudioStore((s) => s.isProductGenerating);
  const startProductGeneration = useStudioStore(
    (s) => s.startProductGeneration,
  );
  const creditEstimate = s.getProductCreditEstimate();

  const handleAddImage = (file: File, idx: number) => {
    const url = URL.createObjectURL(file);
    const next = [...productImageUrls];
    next[idx] = url;
    setProductImageUrls(next);
  };
  const handleClearImage = (idx: number) => {
    const prev = productImageUrls[idx];
    if (prev?.startsWith("blob:")) URL.revokeObjectURL(prev);
    const next = [...productImageUrls];
    next.splice(idx, 1);
    setProductImageUrls(next);
  };

  const withModel = s.productStyleMode === "with-model";

  return (
    <motion.div
      layout
      className="flex flex-col gap-5"
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.22 }}
    >
      <p className="text-xs leading-relaxed text-muted-foreground">
        {t("modelPhotoDesc")}
      </p>

      {/* Product images (up to 2) */}
      <div>
        <Label className="mb-2 block text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
          {t("productImage")}{" "}
          <span className="text-muted-foreground">
            {t("productImageCount")}
          </span>
        </Label>
        <div className="flex flex-col gap-3">
          <UploadDropzone
            label={t("productImage")}
            previewUrl={productImageUrls[0] ?? null}
            onFile={(f) => handleAddImage(f, 0)}
            onClear={() => handleClearImage(0)}
          />
          <UploadDropzone
            label={t("productImageAlt")}
            previewUrl={productImageUrls[1] ?? null}
            optional
            onFile={(f) => handleAddImage(f, 1)}
            onClear={() => handleClearImage(1)}
          />
        </div>
      </div>

      {/* Style mode toggle */}
      <div>
        <Label className="mb-2 block text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
          {t("mode")}
        </Label>
        <div className="flex gap-2">
          {(
            [
              { id: "with-model" as const, labelKey: "modeWithModel" },
              { id: "product-only" as const, labelKey: "modeProductOnly" },
            ] as const
          ).map(({ id, labelKey }) => (
            <button
              key={id}
              type="button"
              onClick={() => s.setProductStyleMode(id)}
              className={cn(
                "flex-1 rounded-xl border py-2.5 text-sm font-semibold transition-all",
                s.productStyleMode === id
                  ? "liquid-chip liquid-chip-active"
                  : "liquid-chip text-foreground/40",
              )}
            >
              {t(labelKey)}
            </button>
          ))}
        </div>
      </div>

      {/* Model details (with-model only) */}
      {withModel && (
        <motion.div
          className="flex flex-col gap-3"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          transition={{ duration: 0.2 }}
        >
          <SectionAccordion
            title={t("customizeModelTitle")}
            defaultOpen={false}
          >
            <div className="flex flex-col gap-3">
              <FS
                id="m-gender"
                label={t("fieldGender")}
                value={s.modelGender}
                onChange={s.setModelGender}
                options={opts.genders}
                labelMap={optLabelMap}
              />
              <FS
                id="m-eth"
                label={t("fieldEthnicity")}
                value={s.modelEthnicity}
                onChange={s.setModelEthnicity}
                options={opts.ethnicities}
                labelMap={optLabelMap}
              />
              <FS
                id="m-age"
                label={t("fieldAge")}
                value={s.modelAge}
                onChange={s.setModelAge}
                options={opts.ageRanges}
                labelMap={optLabelMap}
              />
              <FS
                id="m-skin"
                label={t("fieldSkin")}
                value={s.modelSkinColor}
                onChange={s.setModelSkinColor}
                options={opts.skinColors}
                labelMap={optLabelMap}
              />
              <FS
                id="m-face"
                label={t("fieldFaceType")}
                value={s.modelFaceType}
                onChange={s.setModelFaceType}
                options={opts.faceTypes}
                labelMap={optLabelMap}
              />
              <FS
                id="m-eye"
                label={t("fieldEye")}
                value={s.modelEyeColor}
                onChange={s.setModelEyeColor}
                options={opts.eyeColors}
                labelMap={optLabelMap}
              />
              <FS
                id="m-expr"
                label={t("fieldExpression")}
                value={s.modelExpression}
                onChange={s.setModelExpression}
                options={opts.expressions}
                labelMap={optLabelMap}
              />
              <FS
                id="m-body"
                label={t("fieldBody")}
                value={s.modelBodySize}
                onChange={s.setModelBodySize}
                options={opts.bodySizes}
                labelMap={optLabelMap}
              />
              <FS
                id="m-hair-c"
                label={t("fieldHairColor")}
                value={s.modelHairColor}
                onChange={s.setModelHairColor}
                options={opts.hairColors}
                labelMap={optLabelMap}
              />
              <FS
                id="m-hair-s"
                label={t("fieldHairStyle")}
                value={s.modelHairstyle}
                onChange={s.setModelHairstyle}
                options={opts.hairstyles}
                labelMap={optLabelMap}
              />
              <FS
                id="m-shot"
                label={t("fieldShotType")}
                value={s.modelShotType}
                onChange={s.setModelShotType}
                options={opts.shotTypes}
                labelMap={optLabelMap}
              />
              {/* Height slider */}
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                    {t("fieldHeight")}
                  </span>
                  <span className="text-[11px] tabular-nums text-foreground/55">
                    {s.modelHeight} cm
                  </span>
                </div>
                <Slider
                  value={[s.modelHeight]}
                  min={150}
                  max={195}
                  step={1}
                  onValueChange={(v) =>
                    s.setModelHeight(Number(Array.isArray(v) ? v[0] : v))
                  }
                  className="py-1"
                />
              </div>
            </div>
          </SectionAccordion>
        </motion.div>
      )}

      {/* product-only shot type */}
      {!withModel && (
        <FS
          id="po-shot"
          label={t("fieldShotType")}
          value={s.productOnlyShotType}
          onChange={s.setProductOnlyShotType}
          options={opts.shotTypes}
          labelMap={optLabelMap}
        />
      )}

      <ResolutionToggle />
      <TierPicker />

      <div>
        <Label className="mb-2 block text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
          {t("extraDirective")}{" "}
          <span className="text-muted-foreground">
            {t("extraDirectiveOptional")}
          </span>
        </Label>
        <Textarea
          value={productCustomPrompt}
          onChange={(e) => setProductCustomPrompt(e.target.value)}
          rows={3}
          maxLength={500}
          placeholder="desert golden hour background…"
          className="resize-none rounded-2xl border-border bg-foreground/[0.04] text-foreground placeholder:text-foreground/30 backdrop-blur-sm focus-visible:border-indigo-500/30 focus-visible:ring-indigo-500/20"
        />
      </div>

      {/* Credit estimate + generate */}
      <div className="space-y-3">
        <p className="text-center text-[11px] text-muted-foreground">
          {t("estimatedCredits")}:{" "}
          <span className="font-semibold text-indigo-500 dark:text-indigo-300">
            {creditEstimate}
          </span>
        </p>

        <button
          type="button"
          disabled={isGenerating || productImageUrls.length === 0}
          onClick={() => void startProductGeneration()}
          className="flex w-full items-center justify-center gap-2 rounded-2xl bg-linear-to-r from-indigo-500 to-violet-600 py-3.5 text-sm font-semibold text-white shadow-lg shadow-indigo-900/30 transition hover:from-indigo-500 hover:to-violet-500 disabled:pointer-events-none disabled:opacity-45"
        >
          {isGenerating ? t("generating") : t("generate")}
        </button>
      </div>
    </motion.div>
  );
}
