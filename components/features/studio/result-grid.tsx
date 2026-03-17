"use client";

import { useState } from "react";
import { Download, RefreshCw, CalendarPlus, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { useStudioStore } from "@/store/studio-store";
import { ScheduleModal } from "./schedule-modal";

export function ResultGrid() {
  const { results, isGenerating, caption, hashtags, startGeneration } =
    useStudioStore();
  const [selected, setSelected] = useState<number | null>(null);
  const [downloaded, setDownloaded] = useState<number | null>(null);
  const [scheduleImage, setScheduleImage] = useState<string | null>(null);

  const handleDownload = (url: string, index: number) => {
    const a = document.createElement("a");
    a.href = url;
    a.download = `aigencys-result-${index + 1}.jpg`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setDownloaded(index);
    setTimeout(() => setDownloaded(null), 2000);
  };

  const handleRegenerate = async () => {
    await startGeneration();
  };

  if (isGenerating && results.length === 0) {
    return (
      <div className="grid grid-cols-2 gap-3">
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            className="skeleton aspect-square rounded-2xl"
            style={{ animationDelay: `${i * 0.15}s` }}
          />
        ))}
      </div>
    );
  }

  if (results.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-center">
        <div className="w-14 h-14 rounded-2xl bg-white/[0.04] flex items-center justify-center mb-4">
          <svg
            className="w-7 h-7 text-white/20"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
        </div>
        <p className="text-white/30 text-sm font-medium mb-1">No results yet</p>
        <p className="text-white/20 text-xs">Upload a photo and hit Generate</p>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-xs text-white/30 font-medium">
            {results.length} variations generated
          </span>
          <button
            onClick={handleRegenerate}
            className="flex items-center gap-1.5 text-xs text-indigo-400 hover:text-indigo-300 transition-colors"
          >
            <RefreshCw className="w-3 h-3" />
            Regenerate
          </button>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {results.map((url, i) => (
            <div
              key={i}
              className={cn(
                "group relative aspect-square rounded-2xl overflow-hidden cursor-pointer ring-2 transition-all duration-200",
                selected === i
                  ? "ring-indigo-500 shadow-lg shadow-indigo-500/20"
                  : "ring-transparent hover:ring-white/20"
              )}
              onClick={() => setSelected(i === selected ? null : i)}
            >
              <img
                src={url}
                alt={`Result ${i + 1}`}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />

              {/* Overlay actions */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="absolute bottom-3 left-3 right-3 flex gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDownload(url, i);
                    }}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl bg-white/10 backdrop-blur-sm border border-white/10 text-white text-xs font-medium hover:bg-white/20 transition-colors"
                  >
                    {downloaded === i ? (
                      <Check className="w-3 h-3 text-emerald-400" />
                    ) : (
                      <Download className="w-3 h-3" />
                    )}
                    {downloaded === i ? "Saved" : "Save"}
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setScheduleImage(url);
                    }}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl bg-indigo-500/20 backdrop-blur-sm border border-indigo-500/30 text-indigo-300 text-xs font-medium hover:bg-indigo-500/30 transition-colors"
                  >
                    <CalendarPlus className="w-3 h-3" />
                    Schedule
                  </button>
                </div>
              </div>

              {/* Selected indicator */}
              {selected === i && (
                <div className="absolute top-2.5 right-2.5 w-5 h-5 rounded-full bg-indigo-500 flex items-center justify-center">
                  <Check className="w-3 h-3 text-white" />
                </div>
              )}

              {/* Number badge */}
              <div className="absolute top-2.5 left-2.5 w-5 h-5 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center text-[10px] font-bold text-white/70">
                {i + 1}
              </div>
            </div>
          ))}
        </div>

        {/* Variation dots */}
        <div className="flex items-center justify-center gap-1.5 pt-2">
          {results.map((_, i) => (
            <button
              key={i}
              onClick={() => setSelected(i)}
              className={cn(
                "rounded-full transition-all duration-200",
                selected === i
                  ? "w-4 h-1.5 bg-indigo-500"
                  : "w-1.5 h-1.5 bg-white/20 hover:bg-white/40"
              )}
            />
          ))}
        </div>
      </div>

      {/* Schedule modal */}
      <ScheduleModal
        open={!!scheduleImage}
        onClose={() => setScheduleImage(null)}
        imageUrl={scheduleImage ?? undefined}
        defaultCaption={caption}
        defaultHashtags={hashtags}
      />
    </>
  );
}
