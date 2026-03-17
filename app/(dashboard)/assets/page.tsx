"use client";

import { useState } from "react";
import { Download, ExternalLink, CalendarPlus, Plus, Search } from "lucide-react";
import { FilterBar } from "@/components/features/assets/filter-bar";
import { MOCK_ASSETS } from "@/lib/mock-data";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";

export default function AssetsPage() {
  const [activeType, setActiveType] = useState("All");
  const [activePlatform, setActivePlatform] = useState("All");
  const [search, setSearch] = useState("");

  const filtered = MOCK_ASSETS.filter((asset) => {
    const typeMatch =
      activeType === "All" ||
      (activeType === "Images" && asset.type === "image") ||
      (activeType === "Videos" && asset.type === "video");
    const platformMatch =
      activePlatform === "All" ||
      asset.platform.toLowerCase() === activePlatform.toLowerCase();
    const searchMatch =
      search === "" ||
      asset.caption.toLowerCase().includes(search.toLowerCase());
    return typeMatch && platformMatch && searchMatch;
  });

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-xl font-bold text-white mb-1">Assets</h1>
          <p className="text-sm text-white/30">
            {MOCK_ASSETS.length} assets in your library
          </p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium transition-colors shadow-lg shadow-indigo-500/20">
          <Plus className="w-4 h-4" />
          Upload asset
        </button>
      </div>

      {/* Search + Filters */}
      <div className="flex items-center gap-4 mb-8">
        <div className="relative w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
          <Input
            placeholder="Search assets…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 bg-white/[0.04] border-white/[0.08] rounded-xl text-white placeholder:text-white/20 focus-visible:ring-indigo-500/30 focus-visible:border-indigo-500/30"
          />
        </div>
        <FilterBar
          activeType={activeType}
          setActiveType={setActiveType}
          activePlatform={activePlatform}
          setActivePlatform={setActivePlatform}
        />
      </div>

      {/* Grid */}
      <div className="columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
        {filtered.map((asset) => (
          <div
            key={asset.id}
            className="group relative rounded-2xl overflow-hidden break-inside-avoid"
          >
            <img
              src={asset.url}
              alt={asset.caption}
              className="w-full object-cover group-hover:scale-105 transition-transform duration-500"
            />

            {/* Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
              {/* Bottom actions */}
              <div className="absolute bottom-0 left-0 right-0 p-3">
                <p className="text-xs text-white/80 mb-2 line-clamp-2 leading-relaxed">
                  {asset.caption}
                </p>
                <div className="flex gap-2">
                  <button className="flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-xl bg-white/10 backdrop-blur-sm border border-white/10 text-white text-xs font-medium hover:bg-white/20 transition-colors">
                    <Download className="w-3 h-3" />
                    Download
                  </button>
                  <button className="flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-xl bg-indigo-500/20 backdrop-blur-sm border border-indigo-500/30 text-indigo-300 text-xs font-medium hover:bg-indigo-500/30 transition-colors">
                    <CalendarPlus className="w-3 h-3" />
                    Schedule
                  </button>
                </div>
              </div>

              {/* Top: Use in studio */}
              <div className="absolute top-3 right-3">
                <button className="w-7 h-7 rounded-xl bg-white/10 backdrop-blur-sm border border-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-colors">
                  <ExternalLink className="w-3 h-3" />
                </button>
              </div>
            </div>

            {/* Platform badge */}
            <div className="absolute top-3 left-3 px-2 py-1 rounded-lg bg-black/50 backdrop-blur-sm text-white/60 text-[10px] font-medium capitalize">
              {asset.platform}
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="w-14 h-14 rounded-2xl bg-white/[0.04] flex items-center justify-center mb-4">
            <Search className="w-6 h-6 text-white/20" />
          </div>
          <p className="text-white/30 text-sm font-medium mb-1">No assets found</p>
          <p className="text-white/20 text-xs">Try adjusting your filters</p>
        </div>
      )}
    </div>
  );
}
