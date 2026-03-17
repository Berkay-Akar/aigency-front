"use client";

import { useRef, useState } from "react";
import { Upload, X, ImageIcon } from "lucide-react";

export function LogoUploader() {
  const [logo, setLogo] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = (file: File) => {
    if (!file.type.startsWith("image/")) return;
    setLogo(URL.createObjectURL(file));
  };

  return (
    <div className="p-6 rounded-3xl bg-white/[0.02] border border-white/[0.06]">
      <h3 className="text-sm font-semibold text-white mb-1">Brand Logo</h3>
      <p className="text-xs text-white/30 mb-5">
        Upload your logo for consistent AI-generated content
      </p>

      {logo ? (
        <div className="relative w-32 h-32 rounded-2xl overflow-hidden bg-white/[0.05] border border-white/[0.1] group">
          <img src={logo} alt="Logo" className="w-full h-full object-contain p-3" />
          <button
            onClick={() => setLogo(null)}
            className="absolute top-2 right-2 w-6 h-6 rounded-lg bg-black/50 flex items-center justify-center text-white/70 hover:text-white opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      ) : (
        <button
          onClick={() => inputRef.current?.click()}
          className="flex items-center gap-4 p-4 rounded-2xl border border-dashed border-white/[0.1] hover:border-white/[0.2] hover:bg-white/[0.02] transition-all w-full"
        >
          <div className="w-12 h-12 rounded-xl bg-white/[0.05] flex items-center justify-center flex-shrink-0">
            <Upload className="w-5 h-5 text-white/30" />
          </div>
          <div className="text-left">
            <p className="text-sm text-white/50 font-medium mb-0.5">
              Upload logo
            </p>
            <p className="text-xs text-white/20">PNG, SVG recommended</p>
          </div>
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) handleFile(f);
            }}
          />
        </button>
      )}
    </div>
  );
}
