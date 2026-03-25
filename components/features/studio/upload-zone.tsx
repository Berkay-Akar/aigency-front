"use client";

import { useCallback, useState } from "react";
import { Upload, X, ImageIcon, Link2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useStudioStore } from "@/store/studio-store";
import { StepInputBanner } from "./step-input-banner";

const STEP_NUMBER: Record<string, number> = {
  professionalize: 1,
  campaign: 2,
  video: 3,
};

export function UploadZone() {
  const { uploadedImage, setUploadedImage, activeStep, stepInput } = useStudioStore();
  const [dragOver, setDragOver] = useState(false);

  const stepNum = STEP_NUMBER[activeStep] ?? 1;
  const hasPipelineInput = !!stepInput[stepNum];

  const handleFile = useCallback(
    (file: File) => {
      if (!file.type.startsWith("image/")) return;
      const url = URL.createObjectURL(file);
      setUploadedImage(url);
    },
    [setUploadedImage]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragOver(false);
      const file = e.dataTransfer.files[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  return (
    <div className="flex flex-col gap-2">
      {/* Pipeline input banner — shown when image came from previous step */}
      {hasPipelineInput && <StepInputBanner />}

      {uploadedImage ? (
        <div className="relative aspect-square rounded-3xl overflow-hidden group">
          <img
            src={uploadedImage}
            alt="Source image"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <button
              type="button"
              onClick={() => setUploadedImage(null)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 border border-white/20 text-white text-sm font-medium hover:bg-white/20 transition-colors"
            >
              <X className="w-4 h-4" />
              Kaldır
            </button>
          </div>
          <div className="absolute bottom-3 left-3 px-2.5 py-1.5 rounded-xl bg-black/60 backdrop-blur-sm text-white/70 text-xs font-medium flex items-center gap-1.5">
            {hasPipelineInput ? (
              <>
                <Link2 className="w-3 h-3" />
                Önceki adımdan
              </>
            ) : (
              <>
                <ImageIcon className="w-3 h-3" />
                Görsel hazır
              </>
            )}
          </div>
        </div>
      ) : (
        <label
          htmlFor="upload-input"
          className={cn(
            "relative flex flex-col items-center justify-center aspect-square rounded-3xl border-2 border-dashed cursor-pointer transition-all duration-200",
            dragOver
              ? "border-indigo-500/60 bg-indigo-500/7"
              : "border-white/10 bg-white/2 hover:border-white/20 hover:bg-white/3"
          )}
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
        >
          <input
            id="upload-input"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleInputChange}
          />

          <div
            className={cn(
              "w-14 h-14 rounded-2xl flex items-center justify-center mb-5 transition-colors",
              dragOver ? "bg-indigo-500/20" : "bg-white/5"
            )}
          >
            <Upload
              className={cn("w-6 h-6", dragOver ? "text-indigo-400" : "text-white/30")}
            />
          </div>

          <p className="text-white/70 text-sm font-medium mb-2">
            {dragOver ? "Bırakın" : "Görseli buraya sürükleyin"}
          </p>
          <p className="text-white/30 text-xs mb-4">veya tıklayıp seçin</p>

          <div className="flex items-center gap-2">
            {["JPG", "PNG", "WEBP"].map((ext) => (
              <span
                key={ext}
                className="px-2 py-1 rounded-lg bg-white/4 border border-white/6 text-white/30 text-[10px] font-medium"
              >
                {ext}
              </span>
            ))}
          </div>
        </label>
      )}
    </div>
  );
}
