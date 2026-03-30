"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, Sparkles, Layers, Image as ImageIcon, ArrowRight, Check } from "lucide-react";
import { ProductPreviewTabs } from "./product-preview-tabs";

type WorkspaceView = "upload" | "generate" | "variations" | "gallery";

interface SidebarWorkspaceViewsProps {
  className?: string;
}

export function SidebarWorkspaceViews({ className = "" }: SidebarWorkspaceViewsProps) {
  const [activeView, setActiveView] = useState<WorkspaceView>("generate");

  const navItems = [
    { id: "upload" as WorkspaceView, icon: Upload, label: "Upload" },
    { id: "generate" as WorkspaceView, icon: Sparkles, label: "Generate" },
    { id: "variations" as WorkspaceView, icon: Layers, label: "Variations" },
    { id: "gallery" as WorkspaceView, icon: ImageIcon, label: "Gallery" },
  ];

  return (
    <div className={`flex ${className}`}>
      {/* Sidebar Navigation */}
      <div className="w-56 border-r border-white/[0.04] bg-[#0c0c0c] p-4">
        <div className="space-y-1">
          {navItems.map((item, i) => (
            <motion.button
              key={item.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
              onClick={() => setActiveView(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-[10px] transition-all ${
                activeView === item.id
                  ? "bg-white/[0.06] text-white border border-white/[0.08]"
                  : "text-white/[0.35] hover:text-white/[0.60] hover:bg-white/[0.03]"
              }`}
            >
              <item.icon className="w-4 h-4" strokeWidth={2} />
              <span className="text-[13px] font-[500] tracking-[-0.01em]">
                {item.label}
              </span>
            </motion.button>
          ))}
        </div>

        <div className="mt-6 pt-6 border-t border-white/[0.04]">
          <p className="text-[10px] tracking-[0.12em] uppercase text-white/[0.25] mb-3 font-[500]">
            Quick Actions
          </p>
          <div className="space-y-2">
            {["New Project", "Templates", "Brand Kit", "Settings"].map((action, i) => (
              <motion.button
                key={action}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.2 + i * 0.05 }}
                className="w-full px-3 py-2 rounded-[8px] bg-white/[0.02] border border-white/[0.04] text-[12px] text-white/[0.40] hover:text-white/[0.70] hover:border-white/[0.08] transition-all font-[450] text-left"
              >
                {action}
              </motion.button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Workspace Content */}
      <div className="flex-1 bg-[#0a0a0a] p-6">
        <AnimatePresence mode="wait">
          {activeView === "upload" && (
            <motion.div
              key="upload"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="h-full"
            >
              {/* Upload View */}
              <div className="flex flex-col items-center justify-center h-full min-h-[500px] border-2 border-dashed border-white/[0.08] rounded-[16px] bg-white/[0.01]">
                <Upload className="w-12 h-12 text-white/[0.20] mb-4" strokeWidth={1.5} />
                <h3 className="text-[18px] font-[500] text-white mb-2 tracking-[-0.01em]">
                  Upload Product Images
                </h3>
                <p className="text-[13px] text-white/[0.40] mb-6 max-w-xs text-center leading-[1.6]">
                  Drop your product photos here or click to browse. Supports JPG, PNG, WEBP up to 50MB.
                </p>
                <button className="px-6 py-3 rounded-[12px] bg-white text-[#0a0a0a] text-[14px] font-[550] tracking-[-0.01em] hover:bg-white/95 transition-all inline-flex items-center gap-2">
                  Choose Files
                  <ArrowRight className="w-4 h-4" strokeWidth={2.5} />
                </button>
                
                {/* Recent Uploads */}
                <div className="mt-12 w-full max-w-2xl">
                  <p className="text-[12px] font-[500] text-white/[0.30] mb-4 tracking-[-0.01em]">
                    Recent uploads
                  </p>
                  <div className="grid grid-cols-4 gap-3">
                    {[1, 2, 3, 4].map((i) => (
                      <div
                        key={i}
                        className="aspect-square rounded-[10px] bg-white/[0.03] border border-white/[0.04] relative overflow-hidden group cursor-pointer hover:border-white/[0.12] transition-all"
                      >
                        <div className="absolute inset-0 bg-gradient-to-br from-white/[0.08] to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                        <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <Check className="w-3 h-3 text-emerald-400" strokeWidth={3} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeView === "generate" && (
            <motion.div
              key="generate"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="h-full"
            >
              {/* Generate View with ProductPreviewTabs */}
              <ProductPreviewTabs />
            </motion.div>
          )}

          {activeView === "variations" && (
            <motion.div
              key="variations"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="h-full"
            >
              {/* Variations View */}
              <div className="mb-5">
                <h3 className="text-[16px] font-[500] text-white mb-2 tracking-[-0.01em]">
                  Style Variations
                </h3>
                <p className="text-[13px] text-white/[0.40] tracking-[-0.01em]">
                  Explore different creative directions for your campaign
                </p>
              </div>

              <div className="grid grid-cols-3 gap-4">
                {[
                  { title: "Editorial V1", tag: "High Fashion" },
                  { title: "Product Focus", tag: "E-commerce" },
                  { title: "Lifestyle", tag: "Casual" },
                  { title: "Minimalist", tag: "Clean" },
                  { title: "Campaign V2", tag: "Bold" },
                  { title: "Studio", tag: "Professional" },
                ].map((variation, i) => (
                  <motion.div
                    key={variation.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: i * 0.08 }}
                    className="group cursor-pointer"
                  >
                    <div className="aspect-[3/4] rounded-[14px] bg-white/[0.02] border border-white/[0.05] overflow-hidden relative mb-3 hover:border-white/[0.12] transition-all hover:scale-[1.02] duration-500">
                      <div
                        className="absolute inset-0 bg-gradient-to-br opacity-90"
                        style={{
                          backgroundImage: `linear-gradient(135deg, 
                            hsl(${i * 60}, 60%, 50%), 
                            hsl(${i * 60 + 120}, 50%, 40%)
                          )`,
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                      <div className="absolute top-3 right-3">
                        <span className="px-2.5 py-1 rounded-[6px] bg-black/40 backdrop-blur-sm border border-white/[0.12] text-[10px] text-white/90 font-[500] tracking-[-0.01em]">
                          {variation.tag}
                        </span>
                      </div>
                    </div>
                    <h4 className="text-[13px] font-[500] text-white/[0.75] tracking-[-0.01em]">
                      {variation.title}
                    </h4>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {activeView === "gallery" && (
            <motion.div
              key="gallery"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="h-full"
            >
              {/* Gallery View */}
              <div className="mb-5 flex items-center justify-between">
                <div>
                  <h3 className="text-[16px] font-[500] text-white mb-2 tracking-[-0.01em]">
                    Campaign Gallery
                  </h3>
                  <p className="text-[13px] text-white/[0.40] tracking-[-0.01em]">
                    24 campaign-ready assets
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button className="px-3 py-2 rounded-[8px] bg-white/[0.04] border border-white/[0.05] text-[12px] text-white/[0.55] font-[500] tracking-[-0.01em] hover:bg-white/[0.06] transition-all">
                    Filter
                  </button>
                  <button className="px-3 py-2 rounded-[8px] bg-white/[0.04] border border-white/[0.05] text-[12px] text-white/[0.55] font-[500] tracking-[-0.01em] hover:bg-white/[0.06] transition-all">
                    Sort
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-4 gap-3">
                {Array.from({ length: 12 }).map((_, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4, delay: i * 0.04 }}
                    className="aspect-square rounded-[12px] bg-white/[0.02] border border-white/[0.05] overflow-hidden relative group cursor-pointer hover:border-white/[0.12] transition-all hover:scale-[1.03] duration-500"
                  >
                    <div
                      className="absolute inset-0 bg-gradient-to-br opacity-80"
                      style={{
                        backgroundImage: `linear-gradient(${135 + i * 25}deg, 
                          hsl(${i * 30}, 55%, 45%), 
                          hsl(${i * 30 + 90}, 50%, 35%)
                        )`,
                      }}
                    />
                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-black/40 backdrop-blur-sm border border-white/[0.12] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <Check className="w-3.5 h-3.5 text-white" strokeWidth={3} />
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
