"use client";

import { useRef, useState, useCallback } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] as const },
  },
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

export function BeforeAfter() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState(50);
  const [dragging, setDragging] = useState(false);

  const updatePosition = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = ((clientX - rect.left) / rect.width) * 100;
    setPosition(Math.min(Math.max(x, 5), 95));
  }, []);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setDragging(true);
  }, []);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!dragging) return;
      updatePosition(e.clientX);
    },
    [dragging, updatePosition]
  );

  const handleMouseUp = useCallback(() => setDragging(false), []);

  const handleTouchMove = useCallback(
    (e: React.TouchEvent) => {
      updatePosition(e.touches[0].clientX);
    },
    [updatePosition]
  );

  return (
    <section className="py-32 px-6 border-t border-white/[0.04]">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          variants={stagger}
          className="text-center mb-20"
        >
          <motion.span
            variants={fadeUp}
            className="block text-[10.5px] font-[500] tracking-[0.2em] uppercase text-white/[0.22] mb-6"
          >
            Before / After
          </motion.span>
          <motion.h2
            variants={fadeUp}
            className="text-[clamp(2.4rem,4.5vw,3.6rem)] font-[350] tracking-[-0.03em] text-white leading-[1.08] mb-7"
          >
            <span className="font-[550]">Product image</span> to campaign asset.
          </motion.h2>
          <motion.p
            variants={fadeUp}
            className="text-[16px] text-white/[0.32] max-w-xl mx-auto leading-[1.65] font-[400]"
          >
            Upload a product photo. Receive editorial-quality creative in under a minute. Drag to compare transformation.
          </motion.p>
        </motion.div>

        {/* Slider — refined */}
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="relative max-w-4xl mx-auto"
        >
          <div
            ref={containerRef}
            className="relative aspect-[16/10] rounded-[24px] overflow-hidden cursor-col-resize select-none border border-white/[0.06] shadow-2xl"
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleMouseUp}
          >
            {/* After (right, full) */}
            <div className="absolute inset-0">
              <img
                src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=1000&h=700&fit=crop&q=90"
                alt="After AI enhancement"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
              <div className="absolute bottom-6 right-6 px-4 py-2.5 rounded-[14px] bg-black/50 backdrop-blur-xl border border-white/[0.08] text-white text-[13px] font-[500] tracking-[-0.01em]">
                Campaign Ready
              </div>
            </div>

            {/* Before (left, clipped) */}
            <div
              className="absolute inset-0 overflow-hidden"
              style={{ width: `${position}%` }}
            >
              <div
                className="absolute inset-0"
                style={{ width: `${(100 / position) * 100}%` }}
              >
                <img
                  src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=1000&h=700&fit=crop&sat=-100&q=90"
                  alt="Before raw product"
                  className="w-full h-full object-cover grayscale brightness-[0.7] contrast-[0.9]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
              </div>
              <div className="absolute bottom-6 left-6 px-4 py-2.5 rounded-[14px] bg-white/[0.06] backdrop-blur-xl border border-white/[0.08] text-white/[0.65] text-[13px] font-[500] tracking-[-0.01em]">
                Original Product
              </div>
            </div>

            {/* Divider */}
            <div
              className="absolute top-0 bottom-0 w-[1.5px] bg-white/70 shadow-2xl"
              style={{ left: `${position}%`, transform: "translateX(-50%)" }}
            />

            {/* Handle */}
            <div
              className={cn(
                "absolute top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white shadow-2xl flex items-center justify-center cursor-col-resize z-10 transition-transform duration-200",
                dragging ? "scale-110" : "hover:scale-105"
              )}
              style={{ left: `${position}%`, transform: `translateX(-50%) translateY(-50%)` }}
              onMouseDown={handleMouseDown}
              onTouchStart={(e) => {
                e.preventDefault();
                setDragging(true);
              }}
            >
              <svg width="18" height="18" viewBox="0 0 16 16" fill="none">
                <path
                  d="M5 4L2 8L5 12M11 4L14 8L11 12"
                  stroke="#080808"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </div>

          {/* Hint */}
          <p className="text-center text-white/[0.24] text-[13px] mt-6 font-[450]">
            Drag to compare transformation
          </p>
        </motion.div>
      </div>
    </section>
  );
}
