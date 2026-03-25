"use client";

import { useCallback, useRef, useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface BeforeAfterBlockProps {
  beforeSrc: string | null;
  afterSrc: string | null;
}

export function BeforeAfterBlock({ beforeSrc, afterSrc }: BeforeAfterBlockProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState(48);
  const [dragging, setDragging] = useState(false);

  const updatePosition = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = ((clientX - rect.left) / rect.width) * 100;
    setPosition(Math.min(Math.max(x, 4), 96));
  }, []);

  if (!beforeSrc || !afterSrc) {
    return (
      <div className="rounded-3xl border border-dashed border-white/[0.08] bg-white/[0.02] p-10 text-center">
        <p className="text-sm text-white/35">Önce / sonra için iki görsel gerekli</p>
        <p className="mt-1 text-xs text-white/20">Yükleyin ve üretin — karşılaştırma otomatik açılır.</p>
      </div>
    );
  }

  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="rounded-3xl border border-white/[0.08] bg-[#060606] p-6 md:p-8"
    >
      <div className="mb-6">
        <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-white/30">
          Önce / sonra
        </p>
        <h3 className="mt-2 text-lg font-semibold text-white">Amatör çekimi kampanya kalitesine taşıyın</h3>
      </div>

      <div
        ref={containerRef}
        className="relative mx-auto aspect-[16/10] max-w-3xl cursor-ew-resize select-none overflow-hidden rounded-3xl border border-white/[0.08]"
        onMouseMove={(e) => dragging && updatePosition(e.clientX)}
        onMouseUp={() => setDragging(false)}
        onMouseLeave={() => setDragging(false)}
        onTouchMove={(e) => updatePosition(e.touches[0].clientX)}
        onTouchEnd={() => setDragging(false)}
      >
        <div className="absolute inset-0">
          <img src={afterSrc} alt="" className="h-full w-full object-cover" />
          <div className="absolute bottom-3 right-3 rounded-xl border border-white/10 bg-black/50 px-2.5 py-1 text-[10px] text-emerald-200/90 backdrop-blur">
            Sonra — Studio
          </div>
        </div>

        <div className="absolute inset-0 overflow-hidden" style={{ width: `${position}%` }}>
          <div className="absolute inset-0" style={{ width: `${(100 / position) * 100}%` }}>
            <img src={beforeSrc} alt="" className="h-full w-full object-cover brightness-90 contrast-95 saturate-75" />
          </div>
          <div className="absolute bottom-3 left-3 rounded-xl border border-white/10 bg-black/50 px-2.5 py-1 text-[10px] text-white/70 backdrop-blur">
            Önce — ham
          </div>
        </div>

        <div
          className="absolute top-0 bottom-0 w-px bg-white/70 shadow-lg"
          style={{ left: `${position}%`, transform: "translateX(-50%)" }}
        />

        <button
          type="button"
          className={cn(
            "absolute top-1/2 z-10 flex size-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-white text-zinc-900 shadow-xl transition-transform",
            dragging ? "scale-110" : "hover:scale-105"
          )}
          style={{ left: `${position}%`, transform: `translateX(-50%) translateY(-50%)` }}
          onMouseDown={(e) => {
            e.preventDefault();
            setDragging(true);
          }}
          onTouchStart={(e) => {
            e.preventDefault();
            setDragging(true);
          }}
          aria-label="Sürükleyerek karşılaştır"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
            <path
              d="M5 4L2 8L5 12M11 4L14 8L11 12"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>

      <p className="mt-4 text-center text-xs text-white/30">
        Çubuğu sürükleyin — aynı ürün, farklı dünya.
      </p>
    </motion.section>
  );
}
