"use client";

import { motion } from "framer-motion";
import { Palette, Target, Zap } from "lucide-react";
import { useStudioStore } from "@/store/studio-store";
import { useAppStore } from "@/store/app-store";

export function StudioSidePanel() {
  const recent = useStudioStore((s) => s.recentGenerations);
  const platformFormats = useStudioStore((s) => s.platformFormats);
  const credits = useAppStore((s) => s.credits);

  return (
    <aside className="flex flex-col gap-4">
      <motion.div
        initial={{ opacity: 0, x: 12 }}
        animate={{ opacity: 1, x: 0 }}
        className="rounded-3xl border border-white/[0.07] bg-white/[0.03] p-5"
      >
        <div className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-wider text-white/35">
          <Zap className="size-3.5 text-amber-400/80" />
          Kredi özeti
        </div>
        <p className="mt-3 text-3xl font-semibold tabular-nums text-white">
          {credits.toLocaleString("tr-TR")}
        </p>
        <p className="mt-1 text-xs text-white/30">Bu oturumda üretimler düşük öncelikli kuyrukta işlenir.</p>
      </motion.div>

      <div className="rounded-3xl border border-white/[0.07] bg-white/[0.02] p-5">
        <div className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-wider text-white/35">
          <Target className="size-3.5" />
          Aktif formatlar
        </div>
        <div className="mt-3 flex flex-wrap gap-1.5">
          {platformFormats.map((f) => (
            <span
              key={f}
              className="rounded-lg border border-white/10 bg-white/[0.04] px-2 py-1 text-[10px] text-white/55"
            >
              {f}
            </span>
          ))}
        </div>
      </div>

      <div className="rounded-3xl border border-white/[0.07] bg-white/[0.02] p-5">
        <div className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-wider text-white/35">
          <Palette className="size-3.5" />
          Son üretimler
        </div>
        <div className="mt-3 space-y-2">
          {recent.length === 0 ? (
            <p className="text-xs text-white/25">Henüz kayıt yok.</p>
          ) : (
            recent.slice(0, 4).map((r) => (
              <div key={r.id} className="flex items-center gap-2">
                <div className="size-10 overflow-hidden rounded-xl border border-white/10">
                  <img src={r.thumb} alt="" className="h-full w-full object-cover" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-xs text-white/70">{r.label}</p>
                  <p className="text-[10px] text-white/35">{r.at}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </aside>
  );
}
