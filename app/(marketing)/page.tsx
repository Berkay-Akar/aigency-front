import Link from "next/link";
import { ArrowRight, Sparkles, Upload, Wand2, CalendarDays, Send } from "lucide-react";
import { LandingNav } from "@/components/features/landing/landing-nav";
import { BeforeAfter } from "@/components/features/landing/before-after";
import { Pricing } from "@/components/features/landing/pricing";

// Visual example grid images
const EXAMPLES = [
  "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=500&fit=crop",
  "https://images.unsplash.com/photo-1585386959984-a4155224a1ad?w=400&h=300&fit=crop",
  "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop",
  "https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=400&h=500&fit=crop",
  "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=300&fit=crop",
  "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop",
];

const TICKER_IMAGES = [
  ...EXAMPLES,
  "https://images.unsplash.com/photo-1585386959984-a4155224a1ad?w=300&h=300&fit=crop",
  "https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=300&h=300&fit=crop",
  "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=300&h=300&fit=crop",
  "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=300&h=300&fit=crop",
];

const WORKFLOW = [
  { icon: Upload, label: "Upload", desc: "Your product photo" },
  { icon: Wand2, label: "Generate", desc: "4 AI variations in 30s" },
  { icon: CalendarDays, label: "Schedule", desc: "Pick time & platform" },
  { icon: Send, label: "Publish", desc: "Goes live automatically" },
];

const FEATURES = [
  {
    img: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&h=400&fit=crop",
    label: "AI Generation",
    title: "Studio-quality images in seconds",
  },
  {
    img: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&h=400&fit=crop",
    label: "Content Calendar",
    title: "Plan a month of content in minutes",
  },
  {
    img: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=600&h=400&fit=crop",
    label: "Auto Publish",
    title: "Set it once. Post everywhere.",
  },
  {
    img: "https://images.unsplash.com/photo-1585386959984-a4155224a1ad?w=600&h=400&fit=crop",
    label: "Brand Kit",
    title: "Every post, perfectly on-brand",
  },
];

export default function LandingPage() {
  return (
    <div className="bg-[#080808] min-h-screen">
      <LandingNav />

      {/* ─── Hero ─────────────────────────────────────────────────────── */}
      <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden px-4 pt-16">
        {/* Background */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 mesh-gradient" />
          <div
            className="absolute inset-0 opacity-[0.025]"
            style={{
              backgroundImage:
                "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
              backgroundSize: "60px 60px",
            }}
          />
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[500px] rounded-full bg-indigo-600/[0.1] blur-[120px]" />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-medium mb-8">
            <Sparkles className="w-3 h-3" />
            AI-powered social media
          </div>

          {/* Headline — short and punchy */}
          <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-[80px] font-bold tracking-tight leading-[1.06] mb-6">
            Replace your
            <br />
            <span className="gradient-text">social media agency</span>
            <br />
            with AI
          </h1>

          {/* One-line subtext */}
          <p className="text-lg md:text-xl text-white/45 mb-10">
            Generate → Schedule → Publish. All automated.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/register"
              className="w-full sm:w-auto inline-flex items-center justify-center h-12 px-8 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl text-base font-semibold shadow-lg shadow-indigo-500/25 transition-all hover:-translate-y-0.5"
            >
              Start free
              <ArrowRight className="ml-2 w-4 h-4" />
            </Link>
            <Link
              href="/dashboard"
              className="w-full sm:w-auto inline-flex items-center justify-center h-12 px-8 bg-white/[0.06] hover:bg-white/[0.09] border border-white/[0.09] text-white rounded-2xl text-base font-medium transition-all"
            >
              See demo
            </Link>
          </div>

          {/* Social proof numbers */}
          <div className="flex items-center justify-center gap-8 md:gap-12 mt-16 text-center">
            {[
              { value: "10K+", label: "Brands" },
              { value: "4.2M", label: "Posts" },
              { value: "96h", label: "Saved / month" },
            ].map(({ value, label }) => (
              <div key={label}>
                <div className="text-2xl font-bold text-white">{value}</div>
                <div className="text-xs text-white/30 mt-0.5">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Before / After ───────────────────────────────────────────── */}
      <BeforeAfter />

      {/* ─── Examples grid ────────────────────────────────────────────── */}
      <section className="py-20 overflow-hidden">
        <p className="text-center text-white/25 text-xs uppercase tracking-widest font-medium mb-10">
          Generated by Aigencys — real results
        </p>

        {/* Ticker */}
        <div className="relative">
          <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-[#080808] to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-[#080808] to-transparent z-10 pointer-events-none" />
          <div
            className="flex gap-3 animate-ticker"
            style={{ width: "max-content" }}
          >
            {[...TICKER_IMAGES, ...TICKER_IMAGES].map((url, i) => (
              <div
                key={i}
                className="flex-shrink-0 w-44 h-44 rounded-2xl overflow-hidden"
              >
                <img
                  src={url}
                  alt=""
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Features (image-first cards) ─────────────────────────────── */}
      <section className="py-20 px-4" id="features">
        <div className="max-w-5xl mx-auto">
          <div className="grid sm:grid-cols-2 gap-4">
            {FEATURES.map(({ img, label, title }) => (
              <div
                key={label}
                className="group relative rounded-3xl overflow-hidden aspect-[4/3] border border-white/[0.06]"
              >
                <img
                  src={img}
                  alt={title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <div className="absolute bottom-5 left-5">
                  <p className="text-xs text-indigo-300 font-medium mb-1">
                    {label}
                  </p>
                  <p className="text-lg font-bold text-white leading-tight">
                    {title}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Workflow ─────────────────────────────────────────────────── */}
      <section className="py-20 px-4" id="workflow">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-14">
            Four steps. Zero agency.
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {WORKFLOW.map(({ icon: Icon, label, desc }, i) => (
              <div key={label} className="flex flex-col items-center">
                <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center mb-4 relative">
                  <Icon className="w-5 h-5 text-indigo-400" />
                  <span className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-[#111] border border-white/10 flex items-center justify-center text-[10px] font-bold text-white/40">
                    {i + 1}
                  </span>
                </div>
                <p className="text-sm font-semibold text-white mb-1">{label}</p>
                <p className="text-xs text-white/35">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Pricing ──────────────────────────────────────────────────── */}
      <Pricing />

      {/* ─── Footer ───────────────────────────────────────────────────── */}
      <footer className="border-t border-white/[0.06] py-10 px-6">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <span className="text-white/20 text-sm">
            © 2024 Aigencys. All rights reserved.
          </span>
          <div className="flex items-center gap-6">
            {["Privacy", "Terms", "Contact"].map((item) => (
              <span
                key={item}
                className="text-sm text-white/20 hover:text-white/40 cursor-pointer transition-colors"
              >
                {item}
              </span>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}
