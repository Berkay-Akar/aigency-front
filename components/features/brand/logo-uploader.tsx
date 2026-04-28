"use client";

import { useRef } from "react";
import { Upload, X, Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";

const MAX_FILE_BYTES = 10 * 1024 * 1024; // 10 MB

interface LogoUploaderProps {
  value: string | null;
  onUpload: (file: File) => Promise<void>;
  onRemove: () => void;
  isUploading?: boolean;
}

export function LogoUploader({
  value,
  onUpload,
  onRemove,
  isUploading,
}: LogoUploaderProps) {
  const t = useTranslations("brandKit");
  const tg = useTranslations("generation");
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
    if (!file.type.startsWith("image/")) return;
    if (file.size > MAX_FILE_BYTES) {
      toast.error(tg("fileTooLarge"));
      return;
    }
    await onUpload(file);
  };

  return (
    <div className="p-6 rounded-3xl bg-card border border-border">
      <h3 className="text-sm font-semibold text-foreground mb-1">
        {t("logoTitle")}
      </h3>
      <p className="text-xs text-muted-foreground mb-5">{t("logoDesc")}</p>

      {value ? (
        <div className="relative w-32 h-32 rounded-2xl overflow-hidden bg-white/5 border border-border group">
          <img
            src={value}
            alt="Logo"
            className="w-full h-full object-contain p-3"
          />
          <button
            onClick={onRemove}
            className="absolute top-2 right-2 w-6 h-6 rounded-lg bg-black/50 flex items-center justify-center text-foreground/70 hover:text-foreground opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      ) : (
        <button
          onClick={() => inputRef.current?.click()}
          disabled={isUploading}
          className="flex items-center gap-4 p-4 rounded-2xl border border-dashed border-border hover:border-border/50 hover:bg-muted/30 transition-all w-full disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center shrink-0">
            {isUploading ? (
              <Loader2 className="w-5 h-5 text-muted-foreground animate-spin" />
            ) : (
              <Upload className="w-5 h-5 text-muted-foreground" />
            )}
          </div>
          <div className="text-left">
            <p className="text-sm text-foreground/60 font-medium mb-0.5">
              {isUploading ? t("uploading") : t("uploadLogo")}
            </p>
            <p className="text-xs text-muted-foreground/60">
              {t("formatHint")}
            </p>
          </div>
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) void handleFile(f);
              e.target.value = "";
            }}
          />
        </button>
      )}
    </div>
  );
}
