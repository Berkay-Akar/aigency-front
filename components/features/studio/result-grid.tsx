"use client";

import { useState } from "react";
import { Download, RefreshCw, CalendarPlus, Check, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { useStudioStore } from "@/store/studio-store";
import { ScheduleModal } from "./schedule-modal";

const STEP_NEXT_LABEL: Record<string, string | null> = {
  professionalize: "Use as Campaign Input",
  campaign: "Use as Video Input",
  video: null,
};

const STEP_NEXT_COLORS: Record<string, string> = {
  professionalize: "bg-sky-500/15 border-sky-500/30 text-sky-300 hover:bg-sky-500/25",
  campaign: "bg-rose-500/15 border-rose-500/30 text-rose-300 hover:bg-rose-500/25",
  video: "",
};

const STEP_NUMBER: Record<string, number> = {
  professionalize: 1,
  campaign: 2,
  video: 3,
};

export function ResultGrid() {
  const {
    results,
    isGenerating,
    caption,
    hashtags,
    startGeneration,
    activeStep,
    useResultAsNextStepInput,
    outputTypes,
  } = useStudioStore();

  const [selected, setSelected] = useState<number | null>(null);
  const [downloaded, setDownloaded] = useState<number | null>(null);
  const [scheduleImage, setScheduleImage] = useState<string | null>(null);

  const nextLabel = STEP_NEXT_LABEL[activeStep];
  const nextColor = STEP_NEXT_COLORS[activeStep] ?? "";
  const currentStepNum = STEP_NUMBER[activeStep] ?? 1;

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

  const handleUseAsInput = (url: string) => {
    useResultAsNextStepInput(url, currentStepNum);
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
        <div className="w-14 h-14 rounded-2xl bg-white/4 flex items-center justify-center mb-4">
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
        <p className="text-white/20 text-xs">Configure and hit Generate</p>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-xs text-white/30 font-medium">
            {results.length} result{results.length !== 1 ? "s" : ""} generated
          </span>
          <button
            onClick={() => startGeneration()}
            className="flex items-center gap-1.5 text-xs text-indigo-400 hover:text-indigo-300 transition-colors"
          >
            <RefreshCw className="w-3 h-3" />
            Regenerate
          </button>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {results.map((url, i) => {
            const outputLabel =
              activeStep === "professionalize" && outputTypes[i]
                ? outputTypes[i]
                : null;

            return (
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

                {/* Output type label badge */}
                {outputLabel && (
                  <div className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-sm text-[10px] font-medium text-white/70 capitalize">
                    {outputLabel}
                  </div>
                )}

                {/* Overlay actions */}
                <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="absolute bottom-2 left-2 right-2 flex flex-col gap-1.5">
                    {/* Next step CTA */}
                    {nextLabel && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleUseAsInput(url);
                        }}
                        className={cn(
                          "w-full flex items-center justify-center gap-1.5 py-1.5 rounded-lg backdrop-blur-sm border text-[10px] font-semibold transition-colors",
                          nextColor
                        )}
                      >
                        <ArrowRight className="w-2.5 h-2.5" />
                        {nextLabel}
                      </button>
                    )}

                    <div className="flex gap-1.5">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDownload(url, i);
                        }}
                        className="flex-1 flex items-center justify-center gap-1 py-1.5 rounded-lg bg-white/10 backdrop-blur-sm border border-white/10 text-white text-[10px] font-medium hover:bg-white/20 transition-colors"
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
                        className="flex-1 flex items-center justify-center gap-1 py-1.5 rounded-lg bg-indigo-500/20 backdrop-blur-sm border border-indigo-500/30 text-indigo-300 text-[10px] font-medium hover:bg-indigo-500/30 transition-colors"
                      >
                        <CalendarPlus className="w-3 h-3" />
                        Schedule
                      </button>
                    </div>
                  </div>
                </div>

                {/* Selected indicator */}
                {selected === i && (
                  <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-indigo-500 flex items-center justify-center">
                    <Check className="w-3 h-3 text-white" />
                  </div>
                )}

                {/* Number badge (when no label) */}
                {!outputLabel && (
                  <div className="absolute top-2 left-2 w-5 h-5 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center text-[10px] font-bold text-white/70">
                    {i + 1}
                  </div>
                )}
              </div>
            );
          })}
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
