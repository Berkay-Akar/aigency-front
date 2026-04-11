"use client";

import { useCallback, useState } from "react";
import { useTranslations } from "next-intl";
import { ImageIcon, Upload, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface UploadDropzoneProps {
  label: string;
  optional?: boolean;
  previewUrl: string | null;
  onFile: (file: File) => void;
  onClear: () => void;
  className?: string;
}

export function UploadDropzone({
  label,
  optional,
  previewUrl,
  onFile,
  onClear,
  className,
}: UploadDropzoneProps) {
  const t = useTranslations("generation");
  const [dragOver, setDragOver] = useState(false);

  const handleFile = useCallback(
    (file: File) => {
      if (!file.type.startsWith("image/")) return;
      onFile(file);
    },
    [onFile]
  );

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragOver(false);
      const file = e.dataTransfer.files[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  const onInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) handleFile(file);
      e.target.value = "";
    },
    [handleFile]
  );

  const inputId = `upload-${label.replace(/\s+/g, "-").toLowerCase()}`;

  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex items-center justify-between gap-2">
        <label
          htmlFor={inputId}
          className="text-[10px] font-semibold uppercase tracking-wider text-white/40"
        >
          {label}
          {optional ? (
            <span className="ml-1.5 font-normal normal-case text-white/25">
              ({t("optional")})
            </span>
          ) : null}
        </label>
      </div>

      {previewUrl ? (
        <div className="relative aspect-[4/3] max-h-40 w-full overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.02]">
          <img
            src={previewUrl}
            alt=""
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 transition-opacity hover:opacity-100">
            <button
              type="button"
              onClick={onClear}
              className="flex items-center gap-2 rounded-xl border border-white/20 bg-white/10 px-3 py-2 text-sm font-medium text-white backdrop-blur-sm transition-colors hover:bg-white/20"
            >
              <X className="h-4 w-4" aria-hidden />
              {t("remove")}
            </button>
          </div>
          <div className="absolute bottom-2 left-2 flex items-center gap-1 rounded-lg bg-black/60 px-2 py-1 text-[10px] text-white/70 backdrop-blur-sm">
            <ImageIcon className="h-3 w-3" aria-hidden />
            {t("referenceReady")}
          </div>
        </div>
      ) : (
        <label
          htmlFor={inputId}
          className={cn(
            "relative flex min-h-[120px] cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed px-4 py-6 transition-all duration-200",
            dragOver
              ? "border-indigo-500/50 bg-indigo-500/[0.07]"
              : "border-white/[0.1] bg-white/[0.02] hover:border-white/[0.18] hover:bg-white/[0.04]"
          )}
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={onDrop}
        >
          <input
            id={inputId}
            type="file"
            accept="image/*"
            className="sr-only"
            onChange={onInput}
          />
          <div
            className={cn(
              "mb-3 flex h-11 w-11 items-center justify-center rounded-2xl",
              dragOver ? "bg-indigo-500/20" : "bg-white/[0.06]"
            )}
          >
            <Upload
              className={cn(
                "h-5 w-5",
                dragOver ? "text-indigo-400" : "text-white/35"
              )}
              aria-hidden
            />
          </div>
          <p className="text-center text-sm font-medium text-white/65">
            {t("dropOrClick")}
          </p>
          <p className="mt-1 text-center text-[11px] text-white/30">{t("formats")}</p>
        </label>
      )}
    </div>
  );
}
