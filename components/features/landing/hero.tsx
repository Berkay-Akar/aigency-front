"use client";

import Link from "next/link";
import { ArrowRight, Play, Sparkles } from "lucide-react";

export function Hero() {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden px-6">
      {/* Background mesh */}
      <div className="absolute inset-0 mesh-gradient pointer-events-none" />

      {/* Grid overlay */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      {/* Glow orbs */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-indigo-500/[0.08] blur-[120px] pointer-events-none" />
      <div className="absolute top-1/2 left-1/4 w-[300px] h-[300px] rounded-full bg-violet-600/[0.06] blur-[100px] pointer-events-none" />

      <div className="relative z-10 max-w-5xl mx-auto text-center">
        {/* Badge */}
        <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-indigo-500/25 bg-indigo-500/10 px-4 py-2 text-sm font-medium text-indigo-300 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] backdrop-blur-md animate-fade-in-up">
          <Sparkles className="w-3.5 h-3.5" />
          The future of content creation is here
        </div>

        {/* Headline */}
        <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight leading-[1.05] mb-8 animate-fade-in-up animate-delay-100">
          Replace your
          <br />
          <span className="gradient-text">social media agency</span>
          <br />
          with AI
        </h1>

        {/* Subtext */}
        <p className="text-xl text-white/50 max-w-2xl mx-auto mb-12 leading-relaxed animate-fade-in-up animate-delay-200">
          Generate studio-quality content, write captions, schedule posts, and
          grow your brand — all from one intelligent platform.
        </p>

        {/* CTAs */}
        <div className="flex items-center justify-center gap-4 mb-20 animate-fade-in-up animate-delay-300">
          <Link
            href="/studio"
            className="inline-flex items-center h-12 px-8 bg-linear-to-r from-indigo-500 to-violet-600 hover:from-indigo-400 hover:to-violet-500 text-white rounded-2xl text-base font-semibold shadow-lg shadow-indigo-500/25 transition-all duration-200 hover:shadow-indigo-500/40 hover:-translate-y-0.5"
          >
            Start creating free
            <ArrowRight className="ml-2 w-4 h-4" />
          </Link>
          <button className="flex items-center gap-3 text-white/50 hover:text-white/80 transition-colors group text-base">
            <div className="flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/[0.08] backdrop-blur-md transition-colors group-hover:bg-white/[0.12]">
              <Play className="w-4 h-4 fill-current ml-0.5" />
            </div>
            Watch demo
          </button>
        </div>

        {/* Stats */}
        <div className="flex items-center justify-center gap-12 text-center animate-fade-in-up animate-delay-400">
          {[
            { value: "10,000+", label: "Brands powered" },
            { value: "4.2M", label: "Posts generated" },
            { value: "96h", label: "Avg. saved per month" },
          ].map(({ value, label }) => (
            <div key={label}>
              <div className="text-2xl font-bold text-white mb-1">{value}</div>
              <div className="text-sm text-white/40">{label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/20 animate-fade-in-up animate-delay-500">
        <div className="w-[1px] h-12 bg-gradient-to-b from-white/20 to-transparent" />
        <span className="text-xs uppercase tracking-widest">Scroll</span>
      </div>
    </section>
  );
}
