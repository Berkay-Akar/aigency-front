"use client";

import { cn } from "@/lib/utils";
import { useStudioStore } from "@/store/studio-store";
import { Slider } from "@/components/ui/slider";

const VARIANT_TYPES = [
  { id: "lighting", label: "Işık ortamı" },
  { id: "background", label: "Arka plan" },
  { id: "angle", label: "Kamera açısı" },
  { id: "scenario", label: "Kullanım senaryosu" },
  { id: "platform", label: "Platform oranı" },
  { id: "style", label: "Stil varyasyonu" },
];

const VARIANT_COUNTS: Array<3 | 5 | 10> = [3, 5, 10];

const PLATFORM_FORMATS = [
  { id: "1:1", label: "1:1 Feed" },
  { id: "4:5", label: "4:5 Portre" },
  { id: "9:16", label: "9:16 Story" },
  { id: "16:9", label: "16:9 Banner" },
];

const TARGET_STYLES = [
  { id: "premium", label: "Premium" },
  { id: "young", label: "Genç / Cesur" },
  { id: "luxury", label: "Lüks" },
  { id: "minimal", label: "Minimal" },
];

export function Step2Config() {
  const {
    variantType,
    setVariantType,
    variantCount,
    setVariantCount,
    platformFormats,
    togglePlatformFormat,
    targetStyle,
    setTargetStyle,
    consistencyLevel,
    setConsistencyLevel,
    detailPreservation,
    setDetailPreservation,
  } = useStudioStore();

  return (
    <div className="flex flex-col gap-5">
      <div>
        <label className="text-[10px] text-white/35 uppercase tracking-[0.2em] font-semibold mb-2.5 block">
          Varyasyon ekseni
        </label>
        <div className="grid grid-cols-2 gap-1.5">
          {VARIANT_TYPES.map((vt) => (
            <button
              key={vt.id}
              type="button"
              onClick={() => setVariantType(vt.id)}
              className={cn(
                "px-3 py-2.5 rounded-2xl text-xs font-medium transition-all border text-left",
                variantType === vt.id
                  ? "bg-cyan-500/20 border-cyan-400/35 text-cyan-100"
                  : "bg-white/[0.03] border-white/[0.06] text-white/45 hover:border-white/15"
              )}
            >
              {vt.label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="text-[10px] text-white/35 uppercase tracking-[0.2em] font-semibold mb-2.5 block">
          Varyasyon adedi
        </label>
        <div className="flex gap-2">
          {VARIANT_COUNTS.map((count) => (
            <button
              key={count}
              type="button"
              onClick={() => setVariantCount(count)}
              className={cn(
                "flex-1 py-2.5 rounded-2xl text-sm font-semibold transition-all border",
                variantCount === count
                  ? "bg-cyan-500/25 border-cyan-400/40 text-white"
                  : "bg-white/[0.03] border-white/[0.08] text-white/40"
              )}
            >
              {count}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="text-[10px] text-white/35 uppercase tracking-[0.2em] font-semibold mb-2.5 block">
          Platform formatları
        </label>
        <div className="grid grid-cols-2 gap-1.5">
          {PLATFORM_FORMATS.map((fmt) => {
            const selected = platformFormats.includes(fmt.id);
            return (
              <button
                key={fmt.id}
                type="button"
                onClick={() => togglePlatformFormat(fmt.id)}
                className={cn(
                  "px-3 py-2.5 rounded-2xl text-xs font-medium transition-all border text-left",
                  selected
                    ? "bg-cyan-500/20 border-cyan-400/35 text-cyan-50"
                    : "bg-white/[0.03] border-white/[0.06] text-white/40"
                )}
              >
                {fmt.label}
              </button>
            );
          })}
        </div>
      </div>

      <div>
        <label className="text-[10px] text-white/35 uppercase tracking-[0.2em] font-semibold mb-2.5 block">
          Hedef ton
        </label>
        <div className="flex flex-wrap gap-1.5">
          {TARGET_STYLES.map((s) => (
            <button
              key={s.id}
              type="button"
              onClick={() => setTargetStyle(s.id)}
              className={cn(
                "px-3 py-1.5 rounded-xl text-xs font-medium transition-all border",
                targetStyle === s.id
                  ? "bg-cyan-500/25 border-cyan-400/40 text-white"
                  : "bg-white/[0.04] border-white/[0.08] text-white/45"
              )}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-4 rounded-2xl border border-white/[0.06] bg-white/[0.02] p-4">
        <div>
          <div className="flex justify-between text-[11px] text-white/50 mb-2">
            <span>Tutarlılık</span>
            <span className="text-white/70">{consistencyLevel}</span>
          </div>
          <Slider
            value={[consistencyLevel]}
            min={0}
            max={100}
            step={1}
            onValueChange={(v) => {
              const n = Array.isArray(v) ? v[0] : v;
              setConsistencyLevel(typeof n === "number" ? n : 72);
            }}
            className="w-full"
          />
        </div>
        <div>
          <div className="flex justify-between text-[11px] text-white/50 mb-2">
            <span>Detay koruma</span>
            <span className="text-white/70">{detailPreservation}</span>
          </div>
          <Slider
            value={[detailPreservation]}
            min={0}
            max={100}
            step={1}
            onValueChange={(v) => {
              const n = Array.isArray(v) ? v[0] : v;
              setDetailPreservation(typeof n === "number" ? n : 84);
            }}
            className="w-full"
          />
        </div>
      </div>

      <p className="text-[11px] text-white/30 flex items-center gap-2">
        <span className="size-1.5 rounded-full bg-cyan-400/70" />
        Tahmini {variantCount * 6} kredi · {variantCount} varyasyon × 6
      </p>
    </div>
  );
}
