"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Layers, ArrowLeftRight, Palette, Megaphone } from "lucide-react";

export function ProductPreviewTabs() {
  const [activeTab, setActiveTab] = useState<"generate" | "variations" | "comparison" | "styles" | "campaigns">("generate");

  return (
    <>
      {/* Premium Tab Navigation */}
      <div className="border-b border-white/[0.04] px-6 pt-5 pb-0">
        <div className="flex items-center gap-1 bg-white/[0.02] p-1 rounded-[12px] border border-white/[0.04] w-fit">
          {[
            { id: "generate" as const, label: "Generate", icon: Sparkles },
            { id: "variations" as const, label: "Variations", icon: Layers },
            { id: "comparison" as const, label: "Before / After", icon: ArrowLeftRight },
            { id: "styles" as const, label: "Brand Styles", icon: Palette },
            { id: "campaigns" as const, label: "Campaign Outputs", icon: Megaphone },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-[10px] text-[13px] font-[500] tracking-[-0.01em] transition-all ${
                activeTab === tab.id
                  ? "bg-white text-[#0a0a0a] shadow-sm"
                  : "text-white/[0.40] hover:text-white/[0.65] hover:bg-white/[0.03]"
              }`}
            >
              <tab.icon className="w-3.5 h-3.5" strokeWidth={2.5} />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="p-6">
        <AnimatePresence mode="wait">
          {activeTab === "generate" && (
            <motion.div
              key="generate"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="relative">
                  <div className="absolute -top-3 left-3 z-10">
                    <span className="px-2.5 py-1 rounded-[8px] bg-[#0c0c0c] border border-white/[0.08] text-[10px] text-white/[0.45] font-[500] tracking-[0.02em] uppercase">
                      Source
                    </span>
                  </div>
                  <div className="aspect-[4/5] rounded-[16px] overflow-hidden border border-white/[0.06] bg-[#0c0c0c]">
                    <img
                      src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=500&fit=crop&q=90"
                      alt="Source"
                      className="w-full h-full object-cover grayscale brightness-[0.65]"
                    />
                  </div>
                </div>
                <div className="relative group">
                  <div className="absolute -top-3 left-3 z-10">
                    <span className="px-2.5 py-1 rounded-[8px] bg-emerald-500/10 border border-emerald-500/20 text-[10px] text-emerald-400 font-[500] tracking-[0.02em] uppercase flex items-center gap-1.5">
                      <Sparkles className="w-3 h-3" />
                      Generated
                    </span>
                  </div>
                  <div className="aspect-[4/5] rounded-[16px] overflow-hidden border border-white/[0.08] bg-[#0c0c0c] cursor-pointer hover:border-white/[0.12] transition-all">
                    <img
                      src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=500&fit=crop&q=90"
                      alt="Generated"
                      className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-700"
                    />
                    <div className="absolute bottom-3 left-3 right-3">
                      <div className="bg-black/60 backdrop-blur-xl border border-white/[0.1] rounded-[12px] px-3 py-2">
                        <p className="text-[11px] text-white/[0.85] font-[500]">Campaign Editorial — V1</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-4 gap-3">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="aspect-[3/4] rounded-[12px] overflow-hidden border border-white/[0.05] bg-[#0c0c0c] cursor-pointer hover:border-white/[0.12] transition-all group">
                    <img
                      src={`https://images.unsplash.com/photo-${["1469334031218-e382a71b716b", "1523275335684-37898b6baf30", "1596462502278-27bfdc403348", "1548036328-c9fa89d128fa"][i - 1]}?w=200&h=240&fit=crop&q=80`}
                      alt=""
                      className="w-full h-full object-cover opacity-85 group-hover:opacity-100 group-hover:scale-[1.05] transition-all duration-500"
                    />
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === "variations" && (
            <motion.div
              key="variations"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              <div className="grid grid-cols-3 gap-4">
                {[
                  { title: "Editorial V1", style: "Classic" },
                  { title: "Editorial V2", style: "Modern" },
                  { title: "Campaign V1", style: "Bold" },
                  { title: "Campaign V2", style: "Minimal" },
                  { title: "Product Focus", style: "Clean" },
                  { title: "Lifestyle", style: "Natural" },
                ].map((variant, i) => (
                  <div key={i} className="relative aspect-[3/4] rounded-[16px] overflow-hidden border border-white/[0.06] bg-[#0c0c0c] cursor-pointer hover:border-white/[0.1] transition-all group">
                    <img
                      src={`https://images.unsplash.com/photo-${["1469334031218-e382a71b716b", "1542291026-7eec264c27ff", "1523275335684-37898b6baf30", "1596462502278-27bfdc403348", "1548036328-c9fa89d128fa", "1441986300917-64674bd600d8"][i]}?w=300&h=400&fit=crop&q=85`}
                      alt={variant.title}
                      className="w-full h-full object-cover group-hover:scale-[1.04] transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                    <div className="absolute bottom-3 left-3 right-3">
                      <div className="bg-black/60 backdrop-blur-xl border border-white/[0.1] rounded-[12px] px-3 py-2">
                        <p className="text-[11px] text-white/[0.85] font-[550] tracking-[-0.01em] mb-0.5">{variant.title}</p>
                        <p className="text-[9px] text-white/[0.45] font-[450]">Style: {variant.style}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === "comparison" && (
            <motion.div
              key="comparison"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <p className="text-[11px] tracking-[0.12em] uppercase text-white/[0.35] mb-3 font-[500]">Before — Original</p>
                  <div className="aspect-[4/5] rounded-[16px] overflow-hidden border border-white/[0.06] bg-[#0c0c0c]">
                    <img
                      src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=500&fit=crop&sat=-100&q=90"
                      alt="Before"
                      className="w-full h-full object-cover grayscale brightness-[0.65]"
                    />
                  </div>
                </div>
                <div>
                  <p className="text-[11px] tracking-[0.12em] uppercase text-emerald-400/70 mb-3 font-[500] flex items-center gap-1.5">
                    <Sparkles className="w-3 h-3" />
                    After — Generated
                  </p>
                  <div className="aspect-[4/5] rounded-[16px] overflow-hidden border border-white/[0.08] bg-[#0c0c0c]">
                    <img
                      src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=500&fit=crop&q=90"
                      alt="After"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-3 mt-6">
                {[
                  { label: "Quality Boost", value: "+340%" },
                  { label: "Production Time", value: "< 1 min" },
                  { label: "Cost Savings", value: "$0" },
                ].map((stat, i) => (
                  <div key={i} className="px-4 py-3 rounded-[12px] bg-white/[0.02] border border-white/[0.05]">
                    <p className="text-[10px] tracking-[0.08em] uppercase text-white/[0.35] mb-1 font-[500]">{stat.label}</p>
                    <p className="text-[16px] font-[550] text-white tracking-[-0.01em]">{stat.value}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === "campaigns" && (
            <motion.div
              key="campaigns"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              {/* Campaign Outputs - Social Ad / Campaign-Ready Assets */}
              <div className="space-y-3">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-[15px] font-[550] text-white tracking-[-0.01em] mb-1">
                      Campaign-Ready Assets
                    </h3>
                    <p className="text-[12px] text-white/[0.35] font-[450]">
                      Social ads, stories, and marketing materials
                    </p>
                  </div>
                  <button className="px-3 py-1.5 rounded-[8px] bg-white/[0.04] border border-white/[0.05] text-[11px] text-white/[0.55] font-[500] tracking-[-0.01em] hover:bg-white/[0.06] transition-all">
                    Export All
                  </button>
                </div>

                {/* Format Categories */}
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { format: "Instagram Story", size: "1080×1920", count: 4 },
                    { format: "Instagram Feed", size: "1080×1080", count: 6 },
                    { format: "Facebook Ad", size: "1200×628", count: 3 },
                  ].map((category) => (
                    <div key={category.format} className="p-3 rounded-[12px] bg-white/[0.02] border border-white/[0.04]">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <p className="text-[12px] font-[550] text-white tracking-[-0.01em]">{category.format}</p>
                          <p className="text-[10px] text-white/[0.30] font-[450] mt-0.5">{category.size}</p>
                        </div>
                        <span className="px-2 py-1 rounded-[6px] bg-emerald-500/15 border border-emerald-400/20 text-[10px] text-emerald-400 font-[550]">
                          {category.count}
                        </span>
                      </div>
                      <div className="aspect-[9/16] rounded-[8px] bg-white/[0.03] border border-white/[0.04] overflow-hidden">
                        <img
                          src={`https://images.unsplash.com/photo-${["1542291026-7eec264c27ff", "1523275335684-37898b6baf30", "1596462502278-27bfdc403348"][["Instagram Story", "Instagram Feed", "Facebook Ad"].indexOf(category.format)]}?w=200&h=300&fit=crop&q=80`}
                          alt={category.format}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>
                  ))}
                </div>

                {/* Recent Exports */}
                <div className="mt-4 pt-4 border-t border-white/[0.04]">
                  <p className="text-[11px] font-[500] text-white/[0.30] mb-3 tracking-[-0.01em]">
                    Recent exports
                  </p>
                  <div className="grid grid-cols-6 gap-2">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                      <div
                        key={i}
                        className="aspect-square rounded-[8px] bg-white/[0.03] border border-white/[0.04] overflow-hidden relative group cursor-pointer hover:border-white/[0.08] transition-all"
                      >
                        <img
                          src={`https://images.unsplash.com/photo-${["1542291026-7eec264c27ff", "1523275335684-37898b6baf30", "1596462502278-27bfdc403348", "1469334031218-e382a71b716b", "1515886657613-9d3515b258bd", "1491553895911-0055eca6402d"][i - 1]}?w=120&h=120&fit=crop&q=80`}
                          alt=""
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === "styles" && (
            <motion.div
              key="styles"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              <div className="space-y-4">
                {[
                  { name: "Summer Campaign 2025", colors: ["#FF6B6B", "#FFD93D", "#6BCB77"] },
                  { name: "Winter Collection", colors: ["#2D3561", "#C8D3F5", "#E5E7EB"] },
                  { name: "Editorial Monochrome", colors: ["#1A1A1A", "#808080", "#F5F5F5"] },
                ].map((brand, i) => (
                  <div key={i} className="p-4 rounded-[16px] bg-white/[0.02] border border-white/[0.05] hover:border-white/[0.08] transition-all cursor-pointer">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <p className="text-[13px] font-[550] text-white tracking-[-0.01em] mb-1">{brand.name}</p>
                        <p className="text-[11px] text-white/[0.35] font-[450]">{brand.colors.length} colors · Active</p>
                      </div>
                      <div className="flex gap-2">
                        {brand.colors.map((color, j) => (
                          <div key={j} className="w-8 h-8 rounded-[8px] border border-white/[0.1]" style={{ backgroundColor: color }} />
                        ))}
                      </div>
                    </div>
                    <div className="grid grid-cols-4 gap-2">
                      {[1, 2, 3, 4].map((n) => (
                        <div key={n} className="aspect-square rounded-[10px] bg-white/[0.03] border border-white/[0.04]">
                          <img
                            src={`https://images.unsplash.com/photo-${["1469334031218-e382a71b716b", "1542291026-7eec264c27ff", "1523275335684-37898b6baf30", "1596462502278-27bfdc403348"][n - 1]}?w=100&h=100&fit=crop&q=80`}
                            alt=""
                            className="w-full h-full object-cover rounded-[10px] opacity-80"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}
