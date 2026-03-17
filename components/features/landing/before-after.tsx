"use client";

import { useRef, useState, useCallback } from "react";
import { cn } from "@/lib/utils";

export function BeforeAfter() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState(45);
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
    <section className="py-32 px-6">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <p className="text-indigo-400 text-sm font-medium uppercase tracking-widest mb-4">
            Before / After
          </p>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">
            From ordinary to
            <span className="gradient-text"> extraordinary</span>
          </h2>
          <p className="text-white/40 text-lg max-w-xl mx-auto">
            Upload your product photo. Our AI transforms it into studio-quality
            content in seconds.
          </p>
        </div>

        {/* Slider */}
        <div className="relative max-w-3xl mx-auto">
          <div
            ref={containerRef}
            className="relative aspect-[4/3] rounded-3xl overflow-hidden cursor-col-resize select-none"
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleMouseUp}
          >
            {/* After (right, full) */}
            <div className="absolute inset-0">
              <img
                src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&h=600&fit=crop"
                alt="After AI enhancement"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
              <div className="absolute bottom-4 right-4 px-3 py-1.5 rounded-xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs font-medium backdrop-blur-sm">
                After — AI Enhanced ✨
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
                  src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&h=600&fit=crop&sat=-100&con=-10"
                  alt="Before raw product"
                  className="w-full h-full object-cover grayscale brightness-75"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
              </div>
              <div className="absolute bottom-4 left-4 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-white/60 text-xs font-medium backdrop-blur-sm">
                Before — Raw photo
              </div>
            </div>

            {/* Divider */}
            <div
              className="absolute top-0 bottom-0 w-[2px] bg-white/80 shadow-lg"
              style={{ left: `${position}%`, transform: "translateX(-50%)" }}
            />

            {/* Handle */}
            <div
              className={cn(
                "absolute top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white shadow-2xl flex items-center justify-center cursor-col-resize z-10 transition-transform",
                dragging ? "scale-110" : "hover:scale-105"
              )}
              style={{ left: `${position}%`, transform: `translateX(-50%) translateY(-50%)` }}
              onMouseDown={handleMouseDown}
              onTouchStart={(e) => {
                e.preventDefault();
                setDragging(true);
              }}
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path
                  d="M5 4L2 8L5 12M11 4L14 8L11 12"
                  stroke="#1a1a2e"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </div>

          {/* Hint */}
          <p className="text-center text-white/30 text-sm mt-4">
            Drag the slider to compare
          </p>
        </div>
      </div>
    </section>
  );
}
