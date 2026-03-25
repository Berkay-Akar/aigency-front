"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import {
  STUDIO_CREATIVE_MODES,
  type StudioCreativeModeId,
} from "@/lib/studio-creative-modes";
import { useStudioStore } from "@/store/studio-store";
import { Sparkles, Users, Shirt, Camera, Sun, Clapperboard } from "lucide-react";

const ICONS = {
  image_to_professional: Sparkles,
  same_product_models: Users,
  same_model_products: Shirt,
  multi_angle: Camera,
  lighting_variations: Sun,
  image_to_video_ads: Clapperboard,
};

export function ModeSelector() {
  const studioModeId = useStudioStore((s) => s.studioModeId);
  const setStudioMode = useStudioStore((s) => s.setStudioMode);

  return (
    <section className="space-y-4">
      <div>
        <h2 className="text-lg font-medium text-white">Üretim modları</h2>
        <p className="mt-1 text-sm text-white/35">
          Mod seçin — alttaki ayarlar buna göre güncellenir.
        </p>
      </div>
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {STUDIO_CREATIVE_MODES.map((mode, i) => {
          const Icon = ICONS[mode.id as keyof typeof ICONS] ?? Sparkles;
          const active = studioModeId === mode.id;
          return (
            <motion.button
              key={mode.id}
              type="button"
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.04, duration: 0.35 }}
              whileHover={{ y: -3 }}
              onClick={() => setStudioMode(mode.id as StudioCreativeModeId)}
              className={cn(
                "group relative flex flex-col overflow-hidden rounded-3xl border p-5 text-left transition-colors",
                active
                  ? "border-white/20 bg-white/[0.07] shadow-[0_0_40px_-12px_rgba(139,92,246,0.45)]"
                  : "border-white/[0.06] bg-white/[0.02] hover:border-white/12 hover:bg-white/[0.04]"
              )}
            >
              <div className="mb-3 flex items-start justify-between gap-2">
                <div
                  className={cn(
                    "flex size-10 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] transition-colors",
                    active && "border-violet-500/30 bg-violet-500/15"
                  )}
                >
                  <Icon className="size-4 text-white/70" />
                </div>
                <span
                  className={cn(
                    "rounded-full border px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide",
                    active
                      ? "border-violet-400/40 text-violet-200"
                      : "border-white/10 text-white/35"
                  )}
                >
                  {mode.badge}
                </span>
              </div>
              <h3 className="text-sm font-semibold text-white">{mode.title}</h3>
              <p className="mt-1.5 text-xs leading-relaxed text-white/40">{mode.description}</p>
              <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity group-hover:opacity-100">
                <div className="absolute inset-0 bg-gradient-to-br from-violet-500/5 via-transparent to-cyan-500/5" />
              </div>
            </motion.button>
          );
        })}
      </div>
    </section>
  );
}
