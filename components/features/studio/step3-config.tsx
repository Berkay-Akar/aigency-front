"use client";

import { cn } from "@/lib/utils";
import { useStudioStore } from "@/store/studio-store";
import { Slider } from "@/components/ui/slider";

const MOTION_TYPES = [
  { id: "push-in", label: "Push-in" },
  { id: "zoom-out", label: "Zoom out" },
  { id: "orbit", label: "Orbit" },
  { id: "parallax", label: "Parallax" },
  { id: "spotlight", label: "Spotlight" },
  { id: "pan", label: "Pan" },
];

const DURATIONS: Array<6 | 10 | 15> = [6, 10, 15];

const ASPECT_RATIOS = [
  { id: "9:16", label: "9:16 Dikey" },
  { id: "1:1", label: "1:1 Kare" },
  { id: "16:9", label: "16:9 Yatay" },
];

export function Step3Config() {
  const {
    videoMotion,
    setVideoMotion,
    videoDuration,
    setVideoDuration,
    videoAspect,
    setVideoAspect,
    textOverlay,
    setTextOverlay,
    motionStrength,
    setMotionStrength,
  } = useStudioStore();

  return (
    <div className="flex flex-col gap-5">
      <div>
        <label className="text-[10px] text-white/35 uppercase tracking-[0.2em] font-semibold mb-2.5 block">
          Hareket tipi
        </label>
        <div className="grid grid-cols-2 gap-1.5">
          {MOTION_TYPES.map((m) => (
            <button
              key={m.id}
              type="button"
              onClick={() => setVideoMotion(m.id)}
              className={cn(
                "px-3 py-2.5 rounded-2xl text-xs font-medium transition-all border text-left",
                videoMotion === m.id
                  ? "bg-rose-500/25 border-rose-400/35 text-rose-50"
                  : "bg-white/[0.03] border-white/[0.06] text-white/45"
              )}
            >
              {m.label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="text-[10px] text-white/35 uppercase tracking-[0.2em] font-semibold mb-2.5 block">
          Süre
        </label>
        <div className="flex gap-2">
          {DURATIONS.map((d) => (
            <button
              key={d}
              type="button"
              onClick={() => setVideoDuration(d)}
              className={cn(
                "flex-1 py-2.5 rounded-2xl text-sm font-semibold transition-all border",
                videoDuration === d
                  ? "bg-rose-500/30 border-rose-400/40 text-white"
                  : "bg-white/[0.03] border-white/[0.08] text-white/40"
              )}
            >
              {d}s
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="text-[10px] text-white/35 uppercase tracking-[0.2em] font-semibold mb-2.5 block">
          En-boy
        </label>
        <div className="flex flex-col gap-1.5">
          {ASPECT_RATIOS.map((ar) => (
            <button
              key={ar.id}
              type="button"
              onClick={() => setVideoAspect(ar.id)}
              className={cn(
                "px-3 py-2.5 rounded-2xl text-xs font-medium transition-all border text-left",
                videoAspect === ar.id
                  ? "bg-rose-500/25 border-rose-400/35 text-rose-50"
                  : "bg-white/[0.03] border-white/[0.06] text-white/45"
              )}
            >
              {ar.label}
            </button>
          ))}
        </div>
      </div>

      <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-4">
        <div className="flex justify-between text-[11px] text-white/50 mb-2">
          <span>Hareket gücü</span>
          <span className="text-white/70">{motionStrength}</span>
        </div>
        <Slider
          value={[motionStrength]}
          min={0}
          max={100}
          step={1}
          onValueChange={(v) => {
            const n = Array.isArray(v) ? v[0] : v;
            setMotionStrength(typeof n === "number" ? n : 62);
          }}
          className="w-full"
        />
      </div>

      <div>
        <label className="text-[10px] text-white/35 uppercase tracking-[0.2em] font-semibold mb-2.5 block">
          Metin katmanı
        </label>
        <button
          type="button"
          onClick={() => setTextOverlay(!textOverlay)}
          className={cn(
            "w-full px-4 py-3 rounded-2xl text-sm font-medium transition-all border flex items-center justify-between",
            textOverlay
              ? "bg-rose-500/20 border-rose-400/35 text-rose-100"
              : "bg-white/[0.03] border-white/[0.08] text-white/45"
          )}
        >
          <span>Metin / hook bindirmesi</span>
          <div
            className={cn(
              "relative h-5 w-9 rounded-full transition-colors",
              textOverlay ? "bg-rose-500" : "bg-white/15"
            )}
          >
            <div
              className={cn(
                "absolute top-0.5 size-4 rounded-full bg-white transition-transform",
                textOverlay ? "translate-x-4" : "translate-x-0.5"
              )}
            />
          </div>
        </button>
      </div>

      <p className="text-[11px] text-white/30 flex items-center gap-2">
        <span className="size-1.5 rounded-full bg-rose-400/70" />
        Tahmini 20 kredi · video başına
      </p>
    </div>
  );
}
