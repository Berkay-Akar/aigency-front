"use client";

import { cn } from "@/lib/utils";

interface FilterBarProps {
  activeType: string;
  setActiveType: (type: string) => void;
  activePlatform: string;
  setActivePlatform: (platform: string) => void;
}

const TYPES = ["All", "Images", "Videos"];
const PLATFORMS = ["All", "Instagram", "TikTok", "Facebook"];

export function FilterBar({
  activeType,
  setActiveType,
  activePlatform,
  setActivePlatform,
}: FilterBarProps) {
  return (
    <div className="flex items-center gap-4">
      {/* Type filter */}
      <div className="flex items-center gap-1 p-1 rounded-xl bg-white/[0.04] border border-white/[0.07]">
        {TYPES.map((type) => (
          <button
            key={type}
            onClick={() => setActiveType(type)}
            className={cn(
              "px-3 py-1.5 rounded-lg text-xs font-medium transition-all",
              activeType === type
                ? "bg-white/10 text-white"
                : "text-white/30 hover:text-white/60"
            )}
          >
            {type}
          </button>
        ))}
      </div>

      {/* Platform filter */}
      <div className="flex items-center gap-1.5">
        {PLATFORMS.map((platform) => (
          <button
            key={platform}
            onClick={() => setActivePlatform(platform)}
            className={cn(
              "px-3 py-1.5 rounded-xl border text-xs font-medium transition-all",
              activePlatform === platform
                ? "bg-indigo-500/15 border-indigo-500/30 text-indigo-300"
                : "border-white/[0.07] bg-transparent text-white/30 hover:text-white/60 hover:border-white/[0.12]"
            )}
          >
            {platform}
          </button>
        ))}
      </div>
    </div>
  );
}
