"use client";

import Link from "next/link";
import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, Check, Upload, Sparkles, Image as ImageIcon, Layers, Wand2 } from "lucide-react";
import { LandingNav } from "@/components/features/landing/landing-nav";
import { BeforeAfter } from "@/components/features/landing/before-after";
import { Pricing } from "@/components/features/landing/pricing";
import { ProductPreviewTabs } from "@/components/features/landing/product-preview-tabs";
import { SidebarWorkspaceViews } from "@/components/features/landing/sidebar-workspace-views";

// ─── Animation Variants ────────────────────────────────────────────────────

const ease = [0.22, 1, 0.36, 1] as const;

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.65, ease } },
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

const staggerFast = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.07 } },
};

// ─── Data ──────────────────────────────────────────────────────────────────

const TRUST_BRANDS = [
  "Maison Nord",
  "Céline Studio",
  "Arc Collective",
  "VEIL",
  "Lumière Co.",
  "Studio Eight",
  "Forma",
  "Blanche",
  "Fold Agency",
  "Canvas Group",
];

const PILLARS = [
  {
    num: "01",
    tag: "Core Production",
    title: "Product to Campaign",
    desc: "Upload a raw product photo and receive campaign-ready editorial visuals, styled compositions, and marketing assets — instantly.",
  },
  {
    num: "02",
    tag: "Creative Direction",
    title: "Model & Style Variations",
    desc: "Generate diverse on-model placements, styling directions, and editorial angles from a single product image.",
  },
  {
    num: "03",
    tag: "Motion Output",
    title: "Image to Ad Video",
    desc: "Transform static product images into motion-ready advertising concepts, social reels, and video assets.",
  },
];

const WORKFLOW_STEPS = [
  {
    num: "01",
    title: "Upload",
    desc: "Drop in your product image — any format, any resolution.",
  },
  {
    num: "02",
    title: "Direct",
    desc: "Choose model type, scene, mood, colour palette, and creative direction.",
  },
  {
    num: "03",
    title: "Generate",
    desc: "Receive multiple campaign-ready visual outputs in seconds.",
  },
  {
    num: "04",
    title: "Publish",
    desc: "Download, export, or push directly to your channels.",
  },
];

const SHOWCASE = [
  {
    img: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=600&h=800&fit=crop",
    tag: "Fashion Editorial",
    label: "SS25 Campaign",
  },
  {
    img: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&h=600&fit=crop",
    tag: "Product Shoot",
    label: "Watch — Campaign Visual",
  },
  {
    img: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=600&h=800&fit=crop",
    tag: "Beauty",
    label: "Editorial Composition",
  },
  {
    img: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&h=600&fit=crop",
    tag: "Footwear",
    label: "Campaign Visual",
  },
  {
    img: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600&h=800&fit=crop",
    tag: "Accessories",
    label: "Editorial Stack",
  },
  {
    img: "https://images.unsplash.com/photo-1541643600914-78b084683702?w=600&h=600&fit=crop",
    tag: "Fragrance",
    label: "Studio Output",
  },
];

const USE_CASES = [
  {
    audience: "Fashion Brands",
    desc: "Editorial compositions and model placements for collections, lookbooks, and seasonal campaigns.",
  },
  {
    audience: "Beauty Labels",
    desc: "Studio-quality product stills and editorial beauty visuals without booking a production crew.",
  },
  {
    audience: "E-commerce Teams",
    desc: "Consistent, on-brand product imagery across thousands of SKUs — generated at scale.",
  },
  {
    audience: "Creative Agencies",
    desc: "Rapid concept exploration and client-facing campaign previews from brief to visual in hours.",
  },
  {
    audience: "DTC Brands",
    desc: "Performance-ready creatives, ad variations, and social content without heavy production budgets.",
  },
  {
    audience: "Marketplace Sellers",
    desc: "Standardised, high-quality product imagery that meets platform requirements and drives conversion.",
  },
];

const METRICS = [
  { value: "80%", label: "Faster campaign production" },
  { value: "0", label: "Reshoots required" },
  { value: "10×", label: "More creative variations" },
  { value: "$0", label: "Studio overhead" },
];

const TESTIMONIALS = [
  {
    quote:
      "We cut our content production cycle from three weeks to 48 hours. The quality is indistinguishable from a full campaign shoot.",
    name: "Isabelle Laurent",
    title: "Creative Director",
    company: "Maison Nord",
  },
  {
    quote:
      "Finally a tool that matches the visual standard our brand expects. We generate full campaign sets in an afternoon.",
    name: "Marcus Chen",
    title: "Head of Marketing",
    company: "Arc Collective",
  },
  {
    quote:
      "The editorial quality is exceptional. Our social performance increased 3× in the first month after switching.",
    name: "Sara Holmberg",
    title: "Brand Manager",
    company: "Studio Eight",
  },
];

// ─── Page ──────────────────────────────────────────────────────────────────

export default function LandingPage() {
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const heroVisualY = useTransform(scrollYProgress, [0, 1], ["0%", "12%"]);

  return (
    <div className="bg-[#080808] min-h-screen overflow-x-hidden">
      <LandingNav />

      {/* ─── HERO ─────────────────────────────────────────────────────────── */}
      <section
        ref={heroRef}
        className="relative min-h-[85vh] flex items-center pt-24 pb-16 px-6 overflow-hidden"
      >
        {/* Ambient light — refined */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-[-15%] left-[15%] w-[600px] h-[600px] rounded-full bg-white/[0.02] blur-[200px]" />
          <div className="absolute bottom-[5%] right-[20%] w-[500px] h-[500px] rounded-full bg-zinc-400/[0.015] blur-[180px]" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto w-full grid md:grid-cols-2 gap-10 lg:gap-16 items-center">
          {/* Left — Text */}
          <motion.div initial="hidden" animate="visible" variants={stagger}>
            <motion.span
              variants={fadeUp}
              className="inline-flex items-center gap-2.5 text-[10.5px] font-[500] tracking-[0.2em] uppercase text-white/[0.28] mb-9 letterspacing-wider"
            >
              <span className="w-6 h-[1px] bg-white/[0.16]" />
              AI Creative Platform
            </motion.span>

            <motion.h1
              variants={fadeUp}
              className="text-[clamp(3.2rem,6.2vw,5.4rem)] font-[350] tracking-[-0.04em] leading-[1.02] text-white mb-8"
            >
              Product images to
              <br />
              <span className="font-[550]">campaign creative.</span>
            </motion.h1>

            <motion.p
              variants={fadeUp}
              className="text-[18px] leading-[1.65] text-white/[0.48] mb-11 max-w-[480px] font-[400]"
            >
              AI-powered creative production for brands that need editorial-quality visuals without the studio overhead.
            </motion.p>

            <motion.div
              variants={fadeUp}
              className="flex flex-wrap items-center gap-3"
            >
              <Link
                href="/register"
                className="inline-flex items-center gap-2.5 h-[52px] px-8 bg-white text-[#080808] rounded-[14px] text-[14px] font-[550] tracking-[-0.01em] hover:bg-white/95 transition-all hover:scale-[1.02] shadow-[0_8px_32px_rgba(255,255,255,0.12)]"
              >
                Get Started
                <ArrowRight className="w-4 h-4" strokeWidth={2.5} />
              </Link>
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-2 h-[52px] px-8 border border-white/[0.12] text-white/[0.65] hover:text-white hover:border-white/[0.24] hover:bg-white/[0.03] rounded-[14px] text-[14px] font-[500] tracking-[-0.01em] transition-all"
              >
                View Examples
              </Link>
            </motion.div>

            {/* Metrics — refined */}
            <motion.div
              variants={fadeUp}
              className="flex items-center gap-10 mt-16 pt-16 border-t border-white/[0.055]"
            >
              {[
                { value: "800+", label: "Brands" },
                { value: "6.8M", label: "Assets generated" },
                { value: "36h", label: "Avg. production time" },
              ].map(({ value, label }) => (
                <div key={label}>
                  <div className="text-[22px] font-[550] text-white tracking-[-0.02em]">
                    {value}
                  </div>
                  <div className="text-[11px] text-white/[0.24] mt-1 tracking-[0.02em] font-[450]">
                    {label}
                  </div>
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* Right — Organized Dashboard Frame Preview */}
          <motion.div
            initial={{ opacity: 0, x: 48 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.9, delay: 0.25, ease }}
            style={{ y: heroVisualY }}
            className="relative hidden md:block"
          >
            {/* Dashboard Frame Container */}
            <div className="relative bg-[#0a0a0a] border border-white/[0.06] rounded-[16px] overflow-hidden shadow-2xl">
              {/* Top Tab Bar */}
              <div className="flex items-center gap-2 px-4 py-3 border-b border-white/[0.04] bg-[#0c0c0c]">
                {["Generate", "Variations", "Brand Styles"].map((tab, i) => (
                  <motion.div
                    key={tab}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: 0.3 + i * 0.05 }}
                    className={`px-3 py-1.5 rounded-[8px] text-[11px] font-[500] tracking-[-0.01em] ${
                      i === 0
                        ? "bg-white text-[#0a0a0a]"
                        : "text-white/[0.35] bg-white/[0.02]"
                    }`}
                  >
                    {tab}
                  </motion.div>
                ))}
              </div>

              {/* Main Preview Area */}
              <div className="p-4 grid grid-cols-2 gap-3">
                {/* Left: Source Input */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.5 }}
                  className="space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-[500] tracking-[0.08em] uppercase text-white/[0.28]">
                      Input
                    </span>
                    <span className="px-2 py-0.5 rounded-[6px] bg-white/[0.04] border border-white/[0.04] text-[9px] text-white/[0.30] font-[500]">
                      Source
                    </span>
                  </div>
                  <div className="aspect-[3/4] rounded-[12px] bg-white/[0.02] border border-white/[0.05] overflow-hidden">
                    <img
                      src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=300&h=400&fit=crop&q=90"
                      alt="Source"
                      className="w-full h-full object-cover grayscale brightness-[0.70] contrast-[0.90]"
                    />
                  </div>
                </motion.div>

                {/* Right: Generated Output */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.6 }}
                  className="space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-[500] tracking-[0.08em] uppercase text-white/[0.28]">
                      Output
                    </span>
                    <span className="px-2 py-0.5 rounded-[6px] bg-emerald-500/15 border border-emerald-400/20 text-[9px] text-emerald-400 font-[500] inline-flex items-center gap-1">
                      <Sparkles className="w-2.5 h-2.5" strokeWidth={2.5} />
                      Ready
                    </span>
                  </div>
                  <div className="aspect-[3/4] rounded-[12px] bg-white/[0.02] border border-white/[0.05] overflow-hidden group cursor-pointer hover:border-white/[0.08] transition-all">
                    <img
                      src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=300&h=400&fit=crop&q=90"
                      alt="Generated"
                      className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                  </div>
                </motion.div>
              </div>

              {/* Bottom: Small Outputs Grid */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.7 }}
                className="px-4 pb-4"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-[500] tracking-[0.08em] uppercase text-white/[0.28]">
                    Variations
                  </span>
                  <span className="text-[9px] text-white/[0.30] font-[450]">4 results</span>
                </div>
                <div className="grid grid-cols-4 gap-2">
                  {[
                    { label: "Editorial", color: "from-amber-500 to-rose-500" },
                    { label: "Minimal", color: "from-zinc-400 to-zinc-600" },
                    { label: "Bold", color: "from-purple-500 to-pink-500" },
                    { label: "Lifestyle", color: "from-emerald-500 to-teal-600" },
                  ].map((variant, i) => (
                    <motion.div
                      key={variant.label}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.4, delay: 0.8 + i * 0.05 }}
                      className="group cursor-pointer"
                    >
                      <div className="aspect-[3/4] rounded-[8px] overflow-hidden border border-white/[0.05] hover:border-white/[0.12] transition-all mb-1.5">
                        <div className={`w-full h-full bg-gradient-to-br ${variant.color} opacity-90 group-hover:scale-105 transition-transform duration-500`} />
                      </div>
                      <p className="text-[9px] text-white/[0.35] font-[450] text-center tracking-[-0.01em]">
                        {variant.label}
                      </p>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* Control Bar */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.9 }}
                className="flex items-center justify-between px-4 py-3 border-t border-white/[0.04] bg-[#0c0c0c]"
              >
                <div className="flex items-center gap-2">
                  <div className="text-[10px] text-white/[0.30] font-[450]">Style: Editorial</div>
                  <div className="w-[1px] h-3 bg-white/[0.06]" />
                  <div className="text-[10px] text-white/[0.30] font-[450]">Model: Pro</div>
                </div>
                <button className="px-3 py-1.5 rounded-[8px] bg-white text-[#0a0a0a] text-[10px] font-[550] tracking-[-0.01em] hover:bg-white/95 transition-all inline-flex items-center gap-1.5">
                  <Sparkles className="w-3 h-3" strokeWidth={2.5} />
                  Generate
                </button>
              </motion.div>
            </div>

            {/* Ambient Glow */}
            <div className="absolute inset-0 -z-10 blur-[100px] opacity-15">
              <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-white/10 rounded-full" />
            </div>
          </motion.div>
        </div>
      </section>

      {/* ─── PRODUCT PREVIEW ──────────────────────────────────────────────────── */}
      <section className="py-20 px-6 border-t border-white/[0.04]">
        <div className="max-w-[1400px] mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={stagger}
            className="text-center mb-16"
          >
            <motion.span
              variants={fadeUp}
              className="inline-flex items-center gap-2.5 text-[10.5px] font-[500] tracking-[0.2em] uppercase text-white/[0.28] mb-6"
            >
              <span className="w-6 h-[1px] bg-white/[0.16]" />
              Inside the Product
              <span className="w-6 h-[1px] bg-white/[0.16]" />
            </motion.span>
            <motion.h2
              variants={fadeUp}
              className="text-[clamp(2rem,4vw,2.8rem)] font-[350] tracking-[-0.03em] text-white leading-[1.08] mb-5"
            >
              Professional workspace.
              <br />
              <span className="font-[550]">Campaign-ready results.</span>
            </motion.h2>
            <motion.p
              variants={fadeUp}
              className="text-[15px] text-white/[0.32] max-w-xl mx-auto leading-[1.65] font-[400]"
            >
              A creative production platform designed for speed and quality. Upload, direct, generate, publish.
            </motion.p>
          </motion.div>

          {/* Dashboard Preview Container */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.8, ease }}
            className="relative"
          >
            {/* Main Dashboard Frame */}
            <div className="relative bg-[#0a0a0a] border border-white/[0.06] rounded-[24px] overflow-hidden shadow-2xl">
              {/* Top Bar */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.04] bg-[#0c0c0c]">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-red-500/60" />
                    <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/60" />
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/60" />
                  </div>
                  <span className="text-[13px] text-white/[0.40] font-[450] tracking-[-0.01em] ml-2">
                    Studio / Campaign Production
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="px-3 py-1.5 rounded-[10px] bg-white/[0.04] border border-white/[0.05] text-[12px] text-white/[0.45] font-[500] tracking-[-0.01em]">
                    4 generations ready
                  </div>
                  <button className="px-4 py-1.5 rounded-[10px] bg-white text-[#0a0a0a] text-[12px] font-[550] tracking-[-0.01em] hover:bg-white/95 transition-all">
                    Export All
                  </button>
                </div>
              </div>

              {/* Main Workspace */}
              <SidebarWorkspaceViews />

              {/* Bottom Control Bar */}
              <div className="flex items-center justify-between px-6 py-4 border-t border-white/[0.04] bg-[#0c0c0c]">
                <div className="flex items-center gap-3">
                  <button className="flex items-center gap-2 px-4 py-2 rounded-[10px] bg-white text-[#0a0a0a] text-[13px] font-[550] tracking-[-0.01em] hover:bg-white/95 transition-all">
                    <Wand2 className="w-3.5 h-3.5" />
                    Generate More
                  </button>
                  <button className="px-4 py-2 rounded-[10px] border border-white/[0.08] text-[13px] text-white/[0.60] hover:text-white hover:border-white/[0.14] font-[500] tracking-[-0.01em] transition-all">
                    Edit Settings
                  </button>
                </div>
                <div className="text-[12px] text-white/[0.35] font-[450] tracking-[-0.01em]">
                  Credits: <span className="text-white/[0.65] font-[550]">142 remaining</span>
                </div>
              </div>
            </div>

            {/* Ambient Glow */}
            <div className="absolute inset-0 -z-10 blur-[100px] opacity-20">
              <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-white/10 rounded-full" />
              <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-zinc-400/10 rounded-full" />
            </div>
          </motion.div>

          {/* Feature Pills Below */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-wrap items-center justify-center gap-3 mt-12"
          >
            {[
              "Real-time generation",
              "Unlimited variations",
              "Brand consistency",
              "Export in any format",
            ].map((feature) => (
              <div
                key={feature}
                className="px-4 py-2 rounded-[12px] bg-white/[0.03] border border-white/[0.05] text-[13px] text-white/[0.40] font-[450] tracking-[-0.01em]"
              >
                {feature}
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ─── TRUST STRIP ──────────────────────────────────────────────────── */}
      <section className="py-14 border-y border-white/[0.04] overflow-hidden">
        <p className="text-center text-[10px] tracking-[0.24em] uppercase text-white/[0.16] mb-10 font-[500]">
          Trusted by creative teams worldwide
        </p>
        <div className="relative">
          <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-[#080808] to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-[#080808] to-transparent z-10 pointer-events-none" />
          <div
            className="flex gap-16 animate-ticker items-center"
            style={{ width: "max-content" }}
          >
            {[...TRUST_BRANDS, ...TRUST_BRANDS].map((brand, i) => (
              <span
                key={i}
                className="text-[13px] font-[500] text-white/[0.14] tracking-[0.03em] whitespace-nowrap flex-shrink-0"
              >
                {brand}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CORE VALUE PILLARS ───────────────────────────────────────────── */}
      <section className="py-32 px-6" id="platform">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={stagger}
            className="mb-20"
          >
            <motion.span
              variants={fadeUp}
              className="block text-[10.5px] font-[500] tracking-[0.2em] uppercase text-white/[0.22] mb-6"
            >
              Platform Capabilities
            </motion.span>
            <motion.h2
              variants={fadeUp}
              className="text-[clamp(2.4rem,4.5vw,3.6rem)] font-[350] tracking-[-0.03em] text-white max-w-2xl leading-[1.08]"
            >
              Complete creative production.
              <br />
              <span className="font-[550]">Zero studio overhead.</span>
            </motion.h2>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            variants={stagger}
            className="grid md:grid-cols-3 gap-[1px] bg-white/[0.035]"
          >
            {PILLARS.map((pillar) => (
              <motion.div
                key={pillar.num}
                variants={fadeUp}
                className="bg-[#080808] p-10 md:p-12 hover:bg-[#0d0d0d] transition-all duration-500 group"
              >
                <div className="flex items-start justify-between mb-12">
                  <span className="text-[11px] tracking-[0.16em] uppercase text-white/[0.16] font-[500]">
                    {pillar.num}
                  </span>
                  <span className="text-[9.5px] tracking-[0.14em] uppercase text-white/[0.18] border border-white/[0.06] px-3 py-1.5 rounded-[10px] font-[500]">
                    {pillar.tag}
                  </span>
                </div>
                <h3 className="text-[21px] font-[550] text-white tracking-[-0.02em] mb-5 leading-[1.25] group-hover:text-white/90 transition-colors">
                  {pillar.title}
                </h3>
                <p className="text-[15px] text-white/[0.32] leading-[1.7] font-[400]">
                  {pillar.desc}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ─── WORKFLOW ─────────────────────────────────────────────────────── */}
      <section
        className="py-32 px-6 border-t border-white/[0.04]"
        id="workflow"
      >
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-20 lg:gap-32 items-start">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-80px" }}
              variants={stagger}
              className="md:sticky md:top-32"
            >
              <motion.span
                variants={fadeUp}
                className="block text-[10.5px] font-[500] tracking-[0.2em] uppercase text-white/[0.22] mb-6"
              >
                How It Works
              </motion.span>
              <motion.h2
                variants={fadeUp}
                className="text-[clamp(2.4rem,4.5vw,3.6rem)] font-[350] tracking-[-0.03em] text-white leading-[1.08] mb-7"
              >
                Brief to asset.
                <br />
                <span className="font-[550]">Four steps.</span>
              </motion.h2>
              <motion.p
                variants={fadeUp}
                className="text-[16px] text-white/[0.32] leading-[1.65] max-w-md font-[400]"
              >
                Production workflow designed for creative speed and commercial quality. No studio, no crew, no overhead.
              </motion.p>
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-60px" }}
              variants={stagger}
            >
              {WORKFLOW_STEPS.map((step) => (
                <motion.div
                  key={step.num}
                  variants={fadeUp}
                  className="flex gap-10 py-10 border-b border-white/[0.045] group last:border-0"
                >
                  <span className="text-[11px] font-[500] text-white/[0.18] tracking-[0.08em] pt-1 flex-shrink-0 w-7">
                    {step.num}
                  </span>
                  <div>
                    <h3 className="text-[19px] font-[550] text-white mb-3 group-hover:text-white/85 transition-colors leading-[1.3] tracking-[-0.01em]">
                      {step.title}
                    </h3>
                    <p className="text-[15px] text-white/[0.32] leading-[1.65] font-[400]">
                      {step.desc}
                    </p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* ─── SHOWCASE ─────────────────────────────────────────────────────── */}
      <section
        className="py-32 px-6 border-t border-white/[0.04]"
        id="showcase"
      >
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={stagger}
            className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8"
          >
            <div>
              <motion.span
                variants={fadeUp}
                className="block text-[10.5px] font-[500] tracking-[0.2em] uppercase text-white/[0.22] mb-6"
              >
                Creative Showcase
              </motion.span>
              <motion.h2
                variants={fadeUp}
                className="text-[clamp(2.4rem,4.5vw,3.6rem)] font-[350] tracking-[-0.03em] text-white leading-[1.08]"
              >
                What you can create.
              </motion.h2>
            </div>
            <motion.p
              variants={fadeUp}
              className="text-[16px] text-white/[0.32] max-w-md leading-[1.65] md:text-right font-[400]"
            >
              Each output generated from a single product photograph. Real production work from real brands.
            </motion.p>
          </motion.div>

          {/* Editorial masonry grid — refined */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            variants={staggerFast}
            className="grid grid-cols-2 md:grid-cols-3 gap-4"
          >
            {/* Column 1 */}
            <div className="space-y-4">
              <motion.div
                variants={fadeUp}
                className="group relative aspect-[3/4] rounded-[20px] overflow-hidden cursor-pointer"
              >
                <img
                  src={SHOWCASE[0].img}
                  alt={SHOWCASE[0].label}
                  className="w-full h-full object-cover group-hover:scale-[1.05] transition-transform duration-[800ms] ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-80 group-hover:opacity-60 transition-opacity duration-500" />
                <ShowcaseLabel tag={SHOWCASE[0].tag} label={SHOWCASE[0].label} />
              </motion.div>
              <motion.div
                variants={fadeUp}
                className="group relative aspect-square rounded-[20px] overflow-hidden cursor-pointer"
              >
                <img
                  src={SHOWCASE[1].img}
                  alt={SHOWCASE[1].label}
                  className="w-full h-full object-cover group-hover:scale-[1.05] transition-transform duration-[800ms] ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-80 group-hover:opacity-60 transition-opacity duration-500" />
                <ShowcaseLabel tag={SHOWCASE[1].tag} label={SHOWCASE[1].label} />
              </motion.div>
            </div>

            {/* Column 2 — offset down */}
            <div className="space-y-4 mt-10">
              <motion.div
                variants={fadeUp}
                className="group relative aspect-square rounded-[20px] overflow-hidden cursor-pointer"
              >
                <img
                  src={SHOWCASE[2].img}
                  alt={SHOWCASE[2].label}
                  className="w-full h-full object-cover group-hover:scale-[1.05] transition-transform duration-[800ms] ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-80 group-hover:opacity-60 transition-opacity duration-500" />
                <ShowcaseLabel tag={SHOWCASE[2].tag} label={SHOWCASE[2].label} />
              </motion.div>
              <motion.div
                variants={fadeUp}
                className="group relative aspect-[3/4] rounded-[20px] overflow-hidden cursor-pointer"
              >
                <img
                  src={SHOWCASE[3].img}
                  alt={SHOWCASE[3].label}
                  className="w-full h-full object-cover group-hover:scale-[1.05] transition-transform duration-[800ms] ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-80 group-hover:opacity-60 transition-opacity duration-500" />
                <ShowcaseLabel tag={SHOWCASE[3].tag} label={SHOWCASE[3].label} />
              </motion.div>
            </div>

            {/* Column 3 — desktop only */}
            <div className="space-y-4 hidden md:block">
              <motion.div
                variants={fadeUp}
                className="group relative aspect-[3/4] rounded-[20px] overflow-hidden cursor-pointer"
              >
                <img
                  src={SHOWCASE[4].img}
                  alt={SHOWCASE[4].label}
                  className="w-full h-full object-cover group-hover:scale-[1.05] transition-transform duration-[800ms] ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-80 group-hover:opacity-60 transition-opacity duration-500" />
                <ShowcaseLabel tag={SHOWCASE[4].tag} label={SHOWCASE[4].label} />
              </motion.div>
              <motion.div
                variants={fadeUp}
                className="group relative aspect-square rounded-[20px] overflow-hidden cursor-pointer"
              >
                <img
                  src={SHOWCASE[5].img}
                  alt={SHOWCASE[5].label}
                  className="w-full h-full object-cover group-hover:scale-[1.05] transition-transform duration-[800ms] ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-80 group-hover:opacity-60 transition-opacity duration-500" />
                <ShowcaseLabel tag={SHOWCASE[5].tag} label={SHOWCASE[5].label} />
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ─── BEFORE / AFTER ───────────────────────────────────────────────── */}
      <BeforeAfter />

      {/* ─── USE CASES ────────────────────────────────────────────────────── */}
      <section className="py-32 px-6 border-t border-white/[0.04]">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={stagger}
            className="mb-20"
          >
            <motion.span
              variants={fadeUp}
              className="block text-[10.5px] font-[500] tracking-[0.2em] uppercase text-white/[0.22] mb-6"
            >
              Use Cases
            </motion.span>
            <motion.h2
              variants={fadeUp}
              className="text-[clamp(2.4rem,4.5vw,3.6rem)] font-[350] tracking-[-0.03em] text-white max-w-2xl leading-[1.08]"
            >
              Built for the
              <br />
              <span className="font-[550]">creative economy.</span>
            </motion.h2>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            variants={stagger}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-[1px] bg-white/[0.035]"
          >
            {USE_CASES.map((uc) => (
              <motion.div
                key={uc.audience}
                variants={fadeUp}
                className="bg-[#080808] p-8 md:p-10 hover:bg-[#0d0d0d] transition-all duration-500 group"
              >
                <h3 className="text-[18px] font-[550] text-white mb-4 group-hover:text-white/85 transition-colors tracking-[-0.01em]">
                  {uc.audience}
                </h3>
                <p className="text-[15px] text-white/[0.30] leading-[1.7] font-[400]">
                  {uc.desc}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ─── OPERATIONAL VALUE ────────────────────────────────────────────── */}
      <section className="py-32 px-6 border-t border-white/[0.04]">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={stagger}
            className="mb-24"
          >
            <motion.span
              variants={fadeUp}
              className="block text-[10.5px] font-[500] tracking-[0.2em] uppercase text-white/[0.22] mb-6"
            >
              Business Impact
            </motion.span>
            <motion.h2
              variants={fadeUp}
              className="text-[clamp(2.4rem,4.5vw,3.6rem)] font-[350] tracking-[-0.03em] text-white max-w-2xl leading-[1.08]"
            >
              Production gains.
              <br />
              <span className="font-[550]">Not just creative ones.</span>
            </motion.h2>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            variants={stagger}
            className="grid grid-cols-2 md:grid-cols-4 gap-[1px] bg-white/[0.035]"
          >
            {METRICS.map((m) => (
              <motion.div
                key={m.label}
                variants={fadeUp}
                className="bg-[#080808] p-10 md:p-14 hover:bg-[#0d0d0d] transition-all duration-500"
              >
                <div className="text-[clamp(2.8rem,5vw,4.2rem)] font-[350] tracking-[-0.04em] text-white mb-5">
                  {m.value}
                </div>
                <div className="text-[14px] text-white/[0.30] leading-[1.5] font-[450]">
                  {m.label}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ─── TESTIMONIALS ─────────────────────────────────────────────────── */}
      <section className="py-32 px-6 border-t border-white/[0.04]">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={stagger}
            className="mb-20"
          >
            <motion.span
              variants={fadeUp}
              className="block text-[10.5px] font-[500] tracking-[0.2em] uppercase text-white/[0.22] mb-6"
            >
              Client Results
            </motion.span>
            <motion.h2
              variants={fadeUp}
              className="text-[clamp(2.4rem,4.5vw,3.6rem)] font-[350] tracking-[-0.03em] text-white leading-[1.08]"
            >
              Built on <span className="font-[550]">real results.</span>
            </motion.h2>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            variants={stagger}
            className="grid md:grid-cols-3 gap-5"
          >
            {TESTIMONIALS.map((t) => (
              <motion.div
                key={t.name}
                variants={fadeUp}
                className="bg-[#0a0a0a] border border-white/[0.05] rounded-[20px] p-8 hover:border-white/[0.08] hover:bg-[#0d0d0d] transition-all duration-500 flex flex-col"
              >
                <p className="text-[16px] text-white/[0.48] leading-[1.7] mb-10 flex-1 font-[400]">
                  &ldquo;{t.quote}&rdquo;
                </p>
                <div className="border-t border-white/[0.05] pt-6">
                  <p className="text-[15px] font-[550] text-white tracking-[-0.01em]">
                    {t.name}
                  </p>
                  <p className="text-[13px] text-white/[0.28] mt-1.5 font-[450]">
                    {t.title}, {t.company}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ─── PRICING ──────────────────────────────────────────────────────── */}
      <Pricing />

      {/* ─── FINAL CTA ────────────────────────────────────────────────────── */}
      <section className="py-36 px-6 border-t border-white/[0.04]">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            variants={stagger}
          >
            <motion.h2
              variants={fadeUp}
              className="text-[clamp(2.8rem,5.5vw,4.8rem)] font-[350] tracking-[-0.04em] text-white leading-[1.05] mb-8"
            >
              Start creating
              <br />
              <span className="font-[550]">campaign-ready content.</span>
            </motion.h2>

            <motion.p
              variants={fadeUp}
              className="text-[17px] text-white/[0.34] mb-11 max-w-lg mx-auto leading-[1.65] font-[400]"
            >
              Upload your first product image. Receive editorial creative in under a minute.
            </motion.p>

            <motion.div
              variants={fadeUp}
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <Link
                href="/register"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 h-[56px] px-9 bg-white text-[#080808] rounded-[16px] text-[15px] font-[550] tracking-[-0.01em] hover:bg-white/95 transition-all hover:scale-[1.02] shadow-[0_12px_48px_rgba(255,255,255,0.14)]"
              >
                Get Started
                <ArrowRight className="w-4 h-4" strokeWidth={2.5} />
              </Link>
              <Link
                href="/dashboard"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 h-[56px] px-9 border border-white/[0.12] text-white/[0.60] hover:text-white hover:border-white/[0.22] hover:bg-white/[0.03] rounded-[16px] text-[15px] font-[500] tracking-[-0.01em] transition-all"
              >
                View Examples
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ─── FOOTER ───────────────────────────────────────────────────────── */}
      <footer className="border-t border-white/[0.04] py-14 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-10">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-7 h-7 rounded-[10px] bg-gradient-to-br from-zinc-100 to-zinc-300 flex items-center justify-center flex-shrink-0">
                <svg width="14" height="14" viewBox="0 0 18 18" fill="none">
                  <path
                    d="M9 2L14.196 5.25V11.75L9 15L3.804 11.75V5.25L9 2Z"
                    stroke="#080808"
                    strokeWidth="1.5"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M9 6L11.598 7.5V10.5L9 12L6.402 10.5V7.5L9 6Z"
                    fill="#080808"
                    fillOpacity="0.9"
                  />
                </svg>
              </div>
              <span className="text-[14px] font-[550] text-white tracking-[-0.01em]">
                Aigencys
              </span>
            </div>
            <p className="text-[12px] text-white/[0.16] font-[450]">
              © 2025 Aigencys. All rights reserved.
            </p>
          </div>

          <div className="flex items-center gap-10">
            {["Privacy", "Terms", "Contact"].map((item) => (
              <span
                key={item}
                className="text-[14px] text-white/[0.20] hover:text-white/[0.50] cursor-pointer transition-colors tracking-[-0.01em] font-[450]"
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

// ─── Showcase Card Label ────────────────────────────────────────────────────

function ShowcaseLabel({ tag, label }: { tag: string; label: string }) {
  return (
    <div className="absolute bottom-5 left-5 right-5">
      <div className="bg-black/45 backdrop-blur-xl border border-white/[0.07] rounded-[14px] px-4 py-3">
        <p className="text-[9.5px] tracking-[0.18em] uppercase text-white/[0.32] mb-1 font-[500]">
          {tag}
        </p>
        <p className="text-[13px] font-[500] text-white/[0.85] tracking-[-0.01em]">{label}</p>
      </div>
    </div>
  );
}
