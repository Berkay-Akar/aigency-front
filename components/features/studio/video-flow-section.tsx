"use client";

import { motion } from "framer-motion";
import { ArrowRight, Film, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useStudioStore } from "@/store/studio-store";

export function VideoFlowSection() {
  const setStudioMode = useStudioStore((s) => s.setStudioMode);

  return (
    <section className="space-y-6">
      <div>
        <h2 className="text-lg font-medium text-white">Video reklam akışı</h2>
        <p className="mt-1 text-sm text-white/35">
          Profesyonel görselden reklama hazır video. Çoklu varyasyon, tek akış.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {[
          {
            step: "1",
            title: "Görseli profesyonelleştir",
            body: "Işık, fon ve renk — telefon çekiminden çıkın.",
            Icon: Sparkles,
            accent: "from-violet-500/20 to-transparent",
          },
          {
            step: "2",
            title: "Kampanya varyantları",
            body: "A/B için çoklu kırılım: ışık, fon, oran.",
            Icon: ArrowRight,
            accent: "from-cyan-500/15 to-transparent",
          },
          {
            step: "3",
            title: "Video reklam",
            body: "6–15 sn · Story / Reel / Feed uyumu.",
            Icon: Film,
            accent: "from-rose-500/20 to-transparent",
          },
        ].map((card, i) => (
          <motion.div
            key={card.step}
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.08 }}
            className="relative overflow-hidden rounded-3xl border border-white/[0.07] bg-white/[0.03] p-6"
          >
            <div
              className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${card.accent}`}
            />
            <div className="relative">
              <span className="text-[10px] font-bold text-white/30">{card.step}</span>
              <card.Icon className="mt-3 size-6 text-white/50" />
              <h3 className="mt-4 text-sm font-semibold text-white">{card.title}</h3>
              <p className="mt-2 text-xs leading-relaxed text-white/38">{card.body}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="flex flex-wrap items-center justify-between gap-4 rounded-3xl border border-white/[0.06] bg-black/30 p-6">
        <div>
          <p className="text-sm text-white/55">Story · Reel · TikTok kırılımları</p>
          <p className="text-xs text-white/30">6 sn · 10 sn · 15 sn</p>
        </div>
        <Button
          type="button"
          onClick={() => setStudioMode("image_to_video_ads")}
          className="h-11 rounded-2xl bg-gradient-to-r from-rose-600 to-orange-500 px-6 text-white"
        >
          Video varyantları oluştur
        </Button>
      </div>
    </section>
  );
}
