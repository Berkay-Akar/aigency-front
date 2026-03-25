"use client";

import { cn } from "@/lib/utils";
import { useStudioStore } from "@/store/studio-store";

const OUTPUT_TYPES = [
  { id: "packshot", label: "Beyaz fon packshot" },
  { id: "beauty", label: "Soft beauty" },
  { id: "fashion", label: "Fashion shot" },
  { id: "pdp", label: "E-ticaret PDP" },
  { id: "catalog", label: "Katalog kapağı" },
  { id: "social", label: "Sosyal post" },
];

const STYLE_PRESETS = [
  { id: "e-commerce", label: "Stüdyo beyaz" },
  { id: "luxury", label: "Lüks kampanya" },
  { id: "editorial", label: "Editorial" },
  { id: "beauty", label: "Beauty ticari" },
  { id: "minimal", label: "Minimal clean" },
];

const BG_TYPES = [
  { id: "white", label: "Saf beyaz" },
  { id: "gradient", label: "Gradient" },
  { id: "transparent", label: "Şeffaf" },
  { id: "scene", label: "Özel sahne" },
];

const OUTPUT_COUNTS = [1, 3, 6] as const;

const ASPECTS = [
  { id: "1:1", label: "1:1" },
  { id: "4:5", label: "4:5" },
  { id: "9:16", label: "9:16" },
  { id: "16:9", label: "16:9" },
];

export function Step1Config() {
  const {
    outputTypes,
    toggleOutputType,
    stylePreset,
    setStylePreset,
    bgType,
    setBgType,
    professionalOutputCount,
    setProfessionalOutputCount,
    aspectRatioPreset,
    setAspectRatioPreset,
  } = useStudioStore();

  const creditEstimate = outputTypes.length * 8;

  return (
    <div className="flex flex-col gap-5">
      <div>
        <label className="text-[10px] text-white/35 uppercase tracking-[0.2em] font-semibold mb-2.5 block">
          Çıktı türleri
        </label>
        <div className="grid grid-cols-2 gap-1.5">
          {OUTPUT_TYPES.map((type) => {
            const selected = outputTypes.includes(type.id);
            return (
              <button
                key={type.id}
                type="button"
                onClick={() => toggleOutputType(type.id)}
                className={cn(
                  "px-3 py-2.5 rounded-2xl text-xs font-medium transition-all duration-200 text-left border",
                  selected
                    ? "bg-white/[0.08] border-white/20 text-white shadow-[0_0_24px_-8px_rgba(255,255,255,0.15)]"
                    : "bg-white/[0.03] border-white/[0.06] text-white/45 hover:border-white/15 hover:text-white/75"
                )}
              >
                {type.label}
              </button>
            );
          })}
        </div>
      </div>

      <div>
        <label className="text-[10px] text-white/35 uppercase tracking-[0.2em] font-semibold mb-2.5 block">
          Görünüm stili
        </label>
        <div className="flex flex-wrap gap-1.5">
          {STYLE_PRESETS.map((preset) => (
            <button
              key={preset.id}
              type="button"
              onClick={() => setStylePreset(preset.id)}
              className={cn(
                "px-3 py-1.5 rounded-xl text-xs font-medium transition-all border",
                stylePreset === preset.id
                  ? "bg-violet-500/25 border-violet-400/35 text-violet-100"
                  : "bg-white/[0.04] border-white/[0.08] text-white/45 hover:border-white/18"
              )}
            >
              {preset.label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="text-[10px] text-white/35 uppercase tracking-[0.2em] font-semibold mb-2.5 block">
          Arka plan
        </label>
        <div className="grid grid-cols-2 gap-1.5">
          {BG_TYPES.map((bg) => (
            <button
              key={bg.id}
              type="button"
              onClick={() => setBgType(bg.id)}
              className={cn(
                "px-3 py-2.5 rounded-2xl text-xs font-medium transition-all border text-left",
                bgType === bg.id
                  ? "bg-white/[0.08] border-white/20 text-white"
                  : "bg-white/[0.03] border-white/[0.06] text-white/45 hover:border-white/15"
              )}
            >
              {bg.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-[10px] text-white/35 uppercase tracking-[0.2em] font-semibold mb-2 block">
            Çıktı adedi
          </label>
          <div className="flex gap-1">
            {OUTPUT_COUNTS.map((n) => (
              <button
                key={n}
                type="button"
                onClick={() => setProfessionalOutputCount(n)}
                className={cn(
                  "flex-1 py-2 rounded-xl text-xs font-semibold border transition-all",
                  professionalOutputCount === n
                    ? "bg-violet-500/30 border-violet-400/40 text-white"
                    : "bg-white/[0.03] border-white/[0.08] text-white/40"
                )}
              >
                {n}
              </button>
            ))}
          </div>
        </div>
        <div>
          <label className="text-[10px] text-white/35 uppercase tracking-[0.2em] font-semibold mb-2 block">
            En-boy
          </label>
          <div className="grid grid-cols-2 gap-1">
            {ASPECTS.map((a) => (
              <button
                key={a.id}
                type="button"
                onClick={() => setAspectRatioPreset(a.id)}
                className={cn(
                  "py-1.5 rounded-lg text-[10px] font-medium border transition-all",
                  aspectRatioPreset === a.id
                    ? "bg-white/10 border-white/25 text-white"
                    : "bg-white/[0.03] border-white/[0.06] text-white/35"
                )}
              >
                {a.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <p className="text-[11px] text-white/30 flex items-center gap-2">
        <span className="size-1.5 rounded-full bg-violet-400/70" />
        Tahmini {creditEstimate} kredi · seçilen tür başına 8
      </p>
    </div>
  );
}
