"use client";

import { motion } from "framer-motion";
import type { StudioCreativeModeId } from "@/lib/studio-creative-modes";
import { STUDIO_TEMPLATES } from "@/lib/studio-templates";
import { useStudioStore } from "@/store/studio-store";
import { cn } from "@/lib/utils";

function applyTemplate(
  id: string,
  setStudioMode: (m: StudioCreativeModeId) => void,
  setStylePreset: (s: string) => void,
  setVariantType: (v: string) => void
) {
  switch (id) {
    case "fashion":
      setStudioMode("same_product_models");
      setVariantType("scenario");
      setStylePreset("editorial");
      break;
    case "beauty":
      setStudioMode("image_to_professional");
      setStylePreset("beauty");
      break;
    case "jewelry":
      setStudioMode("lighting_variations");
      setVariantType("lighting");
      break;
    case "footwear":
      setStudioMode("multi_angle");
      setVariantType("angle");
      break;
    case "furniture":
      setStudioMode("image_to_professional");
      setStylePreset("minimal");
      break;
    case "food":
      setStudioMode("image_to_professional");
      setStylePreset("editorial");
      break;
    case "pdp":
      setStudioMode("image_to_professional");
      setStylePreset("e-commerce");
      break;
    case "social":
      setStudioMode("lighting_variations");
      setVariantType("platform");
      break;
    default:
      setStudioMode("image_to_professional");
  }
}

export function TemplateGrid() {
  const setStudioMode = useStudioStore((s) => s.setStudioMode);
  const setStylePreset = useStudioStore((s) => s.setStylePreset);
  const setVariantType = useStudioStore((s) => s.setVariantType);

  return (
    <section className="space-y-4">
      <div>
        <h2 className="text-lg font-medium text-white">Hazır şablonlar</h2>
        <p className="mt-1 text-sm text-white/35">
          Tek tıkla mod ve stil ön ayarı — brief ile birleştirin.
        </p>
      </div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {STUDIO_TEMPLATES.map((t, i) => (
          <motion.button
            key={t.id}
            type="button"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.03 }}
            onClick={() => applyTemplate(t.id, setStudioMode, setStylePreset, setVariantType)}
            className={cn(
              "group relative overflow-hidden rounded-3xl border border-white/[0.06] bg-white/[0.02] p-5 text-left transition hover:border-white/15"
            )}
          >
            <div
              className={cn(
                "pointer-events-none absolute inset-0 bg-gradient-to-br opacity-70 transition group-hover:opacity-100",
                t.accent
              )}
            />
            <div className="relative">
              <h3 className="text-sm font-semibold text-white">{t.title}</h3>
              <p className="mt-1 text-xs text-white/40">{t.subtitle}</p>
            </div>
          </motion.button>
        ))}
      </div>
    </section>
  );
}
