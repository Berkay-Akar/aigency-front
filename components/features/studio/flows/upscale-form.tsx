"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { UploadDropzone } from "../upload-dropzone";
import { useStudioStore } from "@/store/studio-store";

const MAX_FILE_BYTES = 10 * 1024 * 1024;

export function UpscaleForm() {
  const t = useTranslations("productStudio");

  const upscaleType = useStudioStore((s) => s.upscaleType);
  const setUpscaleType = useStudioStore((s) => s.setUpscaleType);
  const upscaleInputUrl = useStudioStore((s) => s.upscaleInputUrl);
  const setUpscaleInputUrl = useStudioStore((s) => s.setUpscaleInputUrl);
  const upscaleVideoUrlInput = useStudioStore((s) => s.upscaleVideoUrlInput);
  const setUpscaleVideoUrlInput = useStudioStore(
    (s) => s.setUpscaleVideoUrlInput,
  );
  const isGenerating = useStudioStore((s) => s.isGenerating);
  const startGeneration = useStudioStore((s) => s.startGeneration);
  const creditEstimate = upscaleType === "video" ? 25 : 5;

  const canGenerate =
    upscaleType === "image"
      ? upscaleInputUrl !== null
      : upscaleInputUrl !== null || upscaleVideoUrlInput.trim().length > 0;

  return (
    <motion.div
      layout
      className="flex flex-col gap-5"
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.22 }}
    >
      <p className="text-xs leading-relaxed text-muted-foreground">
        {t("upscaleDesc")}
      </p>

      {/* Media type select */}
      <div>
        <Label className="mb-1.5 block text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
          {t("upscaleType")}
        </Label>
        <Select
          value={upscaleType}
          onValueChange={(v) => {
            // Clear previous input when switching type
            if (upscaleInputUrl?.startsWith("blob:")) {
              URL.revokeObjectURL(upscaleInputUrl);
            }
            setUpscaleInputUrl(null);
            setUpscaleVideoUrlInput("");
            setUpscaleType(v as "image" | "video");
          }}
        >
          <SelectTrigger className="h-10 w-full text-sm text-foreground">
            <SelectValue>
              {upscaleType === "image"
                ? t("upscaleTypeImage")
                : t("upscaleTypeVideo")}
            </SelectValue>
          </SelectTrigger>
          <SelectContent align="start" sideOffset={6}>
            <SelectItem value="image">{t("upscaleTypeImage")}</SelectItem>
            <SelectItem value="video">{t("upscaleTypeVideo")}</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Image upload */}
      {upscaleType === "image" ? (
        <UploadDropzone
          label={t("upscaleImageLabel")}
          previewUrl={upscaleInputUrl}
          accept="image/*"
          maxSizeBytes={MAX_FILE_BYTES}
          onFile={(file) => {
            if (upscaleInputUrl?.startsWith("blob:")) {
              URL.revokeObjectURL(upscaleInputUrl);
            }
            setUpscaleInputUrl(URL.createObjectURL(file));
          }}
          onClear={() => {
            if (upscaleInputUrl?.startsWith("blob:")) {
              URL.revokeObjectURL(upscaleInputUrl);
            }
            setUpscaleInputUrl(null);
          }}
        />
      ) : (
        /* Video: URL paste + file upload */
        <div className="flex flex-col gap-3">
          <div>
            <Label
              htmlFor="upscale-video-url"
              className="mb-1.5 block text-[10px] font-semibold uppercase tracking-wider text-muted-foreground"
            >
              {t("upscaleVideoLabel")}
            </Label>
            <Input
              id="upscale-video-url"
              value={upscaleVideoUrlInput}
              onChange={(e) => {
                setUpscaleVideoUrlInput(e.target.value);
                // If user types a URL, clear any uploaded file
                if (upscaleInputUrl?.startsWith("blob:")) {
                  URL.revokeObjectURL(upscaleInputUrl);
                  setUpscaleInputUrl(null);
                }
              }}
              placeholder={t("pasteVideoUrl")}
              className="h-10 rounded-2xl border-border bg-foreground/[0.04] text-foreground placeholder:text-foreground/30"
            />
          </div>

          <p className="text-center text-[10px] text-muted-foreground">
            — {t("upscaleOrUpload")} —
          </p>

          <UploadDropzone
            label={t("upscaleVideoLabel")}
            previewUrl={upscaleInputUrl}
            accept="video/*"
            maxSizeBytes={MAX_FILE_BYTES}
            onFile={(file) => {
              if (upscaleInputUrl?.startsWith("blob:")) {
                URL.revokeObjectURL(upscaleInputUrl);
              }
              setUpscaleInputUrl(URL.createObjectURL(file));
              // Clear URL text input when file is uploaded
              setUpscaleVideoUrlInput("");
            }}
            onClear={() => {
              if (upscaleInputUrl?.startsWith("blob:")) {
                URL.revokeObjectURL(upscaleInputUrl);
              }
              setUpscaleInputUrl(null);
            }}
          />
        </div>
      )}

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
          disabled={isGenerating || !canGenerate}
          onClick={() => void startGeneration()}
          className="flex w-full items-center justify-center gap-2 rounded-2xl bg-linear-to-r from-indigo-500 to-violet-600 py-3.5 text-sm font-semibold text-white shadow-lg shadow-indigo-900/30 transition hover:from-indigo-500 hover:to-violet-500 disabled:pointer-events-none disabled:opacity-45"
        >
          {isGenerating ? t("upscaleGenerating") : t("upscaleGenerate")}
        </button>
      </div>
    </motion.div>
  );
}
