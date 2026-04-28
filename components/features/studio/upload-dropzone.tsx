"use client";

import { useCallback, useState } from "react";
import { useTranslations } from "next-intl";
import { ImageIcon, Upload, X } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const MAX_FILE_BYTES = 10 * 1024 * 1024; // 10 MB

interface UploadDropzoneProps {
  label: string;
  optional?: boolean;
  previewUrl: string | null;
  onFile: (file: File) => void;
  onClear: () => void;
  className?: string;
  compact?: boolean;
  /** Faded example image shown in the empty slot so the user knows what to upload */
  exampleSrc?: string | null;
  /** Override max file size in bytes (default 10 MB) */
  maxSizeBytes?: number;
  /** Accept string for input element (default "image/*") */
  accept?: string;
}

export function UploadDropzone({
  label,
  optional,
  previewUrl,
  onFile,
  onClear,
  className,
  compact = false,
  exampleSrc = null,
  maxSizeBytes = MAX_FILE_BYTES,
  accept = "image/*",
}: UploadDropzoneProps) {
  const t = useTranslations("generation");
  const [dragOver, setDragOver] = useState(false);

  const handleFile = useCallback(
    (file: File) => {
      if (accept === "image/*" && !file.type.startsWith("image/")) return;
      if (file.size > maxSizeBytes) {
        toast.error(t("fileTooLarge"));
        return;
      }
      onFile(file);
    },
    [onFile, maxSizeBytes, accept, t],
  );

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragOver(false);
      const file = e.dataTransfer.files[0];
      if (file) handleFile(file);
    },
    [handleFile],
  );

  const onInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) handleFile(file);
      e.target.value = "";
    },
    [handleFile],
  );

  const inputId = `upload-${label.replace(/\s+/g, "-").toLowerCase()}`;

  // ── Compact tile mode ─────────────────────────────────────────────
  if (compact) {
    return (
      <div className={cn("flex flex-col gap-1.5", className)}>
        <span className="text-[10px] font-semibold uppercase tracking-wider text-foreground/40">
          {label}
          {optional ? (
            <span className="ml-1 font-normal normal-case text-foreground/25">
              ({t("optional")})
            </span>
          ) : null}
        </span>
        {previewUrl ? (
          <div className="group relative aspect-3/4 w-full overflow-hidden rounded-xl border border-white/10 bg-white/5">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={previewUrl}
              alt=""
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 flex items-center justify-center bg-black/55 opacity-0 transition-opacity group-hover:opacity-100">
              <button
                type="button"
                onClick={onClear}
                className="rounded-lg border border-white/20 bg-white/10 p-1.5 text-white backdrop-blur-sm transition-colors hover:bg-white/20"
              >
                <X className="h-3.5 w-3.5" aria-hidden />
              </button>
            </div>
          </div>
        ) : (
          <label
            htmlFor={inputId}
            className={cn(
              "relative flex aspect-3/4 w-full cursor-pointer flex-col items-center justify-center overflow-hidden rounded-xl border-2 border-dashed transition-all duration-200",
              dragOver
                ? "border-indigo-500/50 bg-indigo-500/10"
                : "border-white/10 bg-foreground/[0.03] hover:border-border hover:bg-foreground/[0.06]",
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
              accept={accept}
              className="sr-only"
              onChange={onInput}
            />
            {exampleSrc && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={exampleSrc}
                alt=""
                aria-hidden
                className="absolute inset-0 h-full w-full object-cover opacity-[0.22]"
              />
            )}
            <Upload
              className={cn(
                "relative z-10 h-5 w-5",
                dragOver ? "text-indigo-400" : "text-foreground/30",
              )}
              aria-hidden
            />
          </label>
        )}
      </div>
    );
  }

  // ── Normal (full) mode ────────────────────────────────────────────
  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex items-center justify-between gap-2">
        <label
          htmlFor={inputId}
          className="text-[10px] font-semibold uppercase tracking-wider text-foreground/40"
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
        <div className="relative aspect-[3/4] w-full overflow-hidden rounded-2xl border border-white/10 bg-white/5 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] backdrop-blur-sm">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={previewUrl} alt="" className="h-full w-full object-cover" />
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
            "relative flex aspect-[3/4] w-full cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed px-4 py-6 transition-all duration-200",
            dragOver
              ? "border-indigo-500/50 bg-indigo-500/15 backdrop-blur-sm"
              : "border-white/10 bg-foreground/5 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] backdrop-blur-sm hover:border-border hover:bg-foreground/[0.08]",
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
            accept={accept}
            className="sr-only"
            onChange={onInput}
          />
          {exampleSrc && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={exampleSrc}
              alt=""
              aria-hidden
              className="absolute inset-0 h-full w-full object-cover opacity-[0.22]"
            />
          )}
          <div
            className={cn(
              "relative z-10 mb-3 flex h-11 w-11 items-center justify-center rounded-2xl",
              dragOver ? "bg-indigo-500/20" : "bg-foreground/[0.06]",
            )}
          >
            <Upload
              className={cn(
                "h-5 w-5",
                dragOver ? "text-indigo-400" : "text-foreground/35",
              )}
              aria-hidden
            />
          </div>
          <p className="relative z-10 text-center text-sm font-medium text-foreground/65">
            {t("dropOrClick")}
          </p>
          <p className="relative z-10 mt-1 text-center text-[11px] text-muted-foreground">
            {t("formats")}
          </p>
        </label>
      )}
    </div>
  );
}
