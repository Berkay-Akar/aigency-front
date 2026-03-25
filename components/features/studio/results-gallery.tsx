"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { CalendarPlus, Download, Eye, GitCompare, Layers, Video } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useStudioStore } from "@/store/studio-store";
import { ScheduleModal } from "./schedule-modal";

const STEP_LABEL: Record<string, string> = {
  professionalize: "Profesyonel",
  campaign: "Kampanya",
  video: "Video",
};

function creditForStep(activeStep: string) {
  if (activeStep === "professionalize") return 8;
  if (activeStep === "campaign") return 6;
  return 20;
}

export function ResultsGallery() {
  const {
    results,
    isGenerating,
    activeStep,
    useResultAsNextStepInput,
    startGeneration,
    platformFormats,
    caption,
    hashtags,
    uploadedImage,
  } = useStudioStore();

  const [preview, setPreview] = useState<string | null>(null);
  const [comparePair, setComparePair] = useState<[string, string] | null>(null);
  const [scheduleUrl, setScheduleUrl] = useState<string | null>(null);

  const fmt = platformFormats[0] ?? "1:1";

  const handleDownload = (url: string, i: number) => {
    const a = document.createElement("a");
    a.href = url;
    a.download = `aigencys-${i + 1}.jpg`;
    a.click();
  };

  const handleDownloadAll = () => {
    results.forEach((url, i) => {
      setTimeout(() => handleDownload(url, i), i * 120);
    });
    toast.message("İndirme başlatıldı", {
      description: "ZIP yerine dosyalar sırayla indiriliyor.",
    });
  };

  if (isGenerating && results.length === 0) {
    return (
      <div className="columns-1 gap-4 sm:columns-2">
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            className="mb-4 break-inside-avoid"
          >
            <div
              className="aspect-[4/5] animate-pulse rounded-3xl bg-white/[0.04]"
              style={{ animationDelay: `${i * 0.1}s` }}
            />
          </div>
        ))}
      </div>
    );
  }

  if (results.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-white/[0.08] bg-white/[0.02] py-20 text-center">
        <Layers className="mb-3 size-10 text-white/15" />
        <p className="text-sm font-medium text-white/40">Henüz çıktı yok</p>
        <p className="mt-1 max-w-xs text-xs text-white/25">
          Görsel yükleyip üretin — sonuçlar burada sergilenecek.
        </p>
      </div>
    );
  }

  const hero = results[0];
  const rest = results.slice(1);

  return (
    <>
      <div className="space-y-6">
        <div className="grid gap-4 lg:grid-cols-12">
          <motion.div
            layout
            className="relative lg:col-span-7"
          >
            <div className="overflow-hidden rounded-3xl border border-white/[0.08] bg-black/40 shadow-2xl">
              <img src={hero} alt="" className="aspect-[4/5] w-full object-cover lg:aspect-auto lg:max-h-[520px]" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-80" />
              <div className="absolute bottom-0 left-0 right-0 flex flex-wrap items-end justify-between gap-3 p-5">
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-white/45">
                    Hero çıktı
                  </p>
                  <p className="text-sm text-white/90">{STEP_LABEL[activeStep]}</p>
                  <p className="text-xs text-white/40">
                    {fmt} · {creditForStep(activeStep)} kr
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => setPreview(hero)}
                    className="rounded-xl border border-white/15 bg-white/10 px-3 py-2 text-xs font-medium text-white backdrop-blur"
                  >
                    <Eye className="mr-1.5 inline size-3.5" />
                    Önizle
                  </button>
                  <button
                    type="button"
                    onClick={() => setComparePair([uploadedImage ?? hero, hero])}
                    className="rounded-xl border border-white/15 bg-white/10 px-3 py-2 text-xs font-medium text-white backdrop-blur"
                  >
                    <GitCompare className="mr-1.5 inline size-3.5" />
                    Kıyasla
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDownload(hero, 0)}
                    className="rounded-xl border border-white/15 bg-white/10 px-3 py-2 text-xs font-medium text-white backdrop-blur"
                  >
                    <Download className="mr-1.5 inline size-3.5" />
                    İndir
                  </button>
                </div>
              </div>
            </div>
          </motion.div>

          <div className="flex flex-col gap-3 lg:col-span-5">
            {rest.map((url, idx) => {
              const i = idx + 1;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: 12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="group relative overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.02]"
                >
                  <img src={url} alt="" className="aspect-video w-full object-cover transition duration-500 group-hover:scale-[1.02]" />
                  <div className="absolute inset-0 flex items-end justify-between gap-2 bg-gradient-to-t from-black/70 to-transparent p-3 opacity-0 transition group-hover:opacity-100">
                    <span className="text-[10px] text-white/60">
                      V{i + 1} · {fmt}
                    </span>
                    <div className="flex gap-1">
                      <button
                        type="button"
                        onClick={() => handleDownload(url, i)}
                        className="rounded-lg bg-white/15 px-2 py-1 text-[10px] text-white"
                      >
                        İndir
                      </button>
                      {activeStep !== "video" && (
                        <button
                          type="button"
                          onClick={() => startGeneration()}
                          className="rounded-lg bg-violet-500/30 px-2 py-1 text-[10px] text-violet-100"
                        >
                          Çoğalt
                        </button>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-4">
          <p className="mb-3 text-[10px] font-semibold uppercase tracking-wider text-white/35">
            Varyasyon keşfi
          </p>
          <div className="grid grid-cols-3 gap-2">
            {results.slice(0, 3).map((url, i) => (
              <div key={i} className="overflow-hidden rounded-xl border border-white/[0.06]">
                <img src={url} alt="" className="aspect-square w-full object-cover" />
                <p className="px-2 py-1 text-center text-[9px] text-white/40">
                  #{i + 1} · {STEP_LABEL[activeStep]}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={handleDownloadAll}
            className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-2 text-xs font-medium text-white/80"
          >
            Tümünü indir
          </button>
          {activeStep === "professionalize" && (
            <button
              type="button"
              onClick={() => useResultAsNextStepInput(hero, 1)}
              className="rounded-2xl border border-cyan-500/30 bg-cyan-500/10 px-4 py-2 text-xs font-medium text-cyan-200"
            >
              Kampanyada kullan
            </button>
          )}
          {activeStep === "campaign" && (
            <button
              type="button"
              onClick={() => useResultAsNextStepInput(hero, 2)}
              className="rounded-2xl border border-rose-500/30 bg-rose-500/10 px-4 py-2 text-xs font-medium text-rose-200"
            >
              <Video className="mr-1.5 inline size-3.5" />
              Video reklama aktar
            </button>
          )}
          <button
            type="button"
            onClick={() => setScheduleUrl(hero)}
            className="rounded-2xl border border-indigo-500/30 bg-indigo-500/10 px-4 py-2 text-xs font-medium text-indigo-200"
          >
            <CalendarPlus className="mr-1.5 inline size-3.5" />
            Planla
          </button>
        </div>
      </div>

      {preview && (
        <button
          type="button"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-6 backdrop-blur-sm"
          onClick={() => setPreview(null)}
        >
          <img src={preview} alt="" className="max-h-[90vh] max-w-full rounded-2xl object-contain" />
        </button>
      )}

      {comparePair && (
        <button
          type="button"
          className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-4 bg-black/90 p-6"
          onClick={() => setComparePair(null)}
        >
          <div className="grid max-w-4xl grid-cols-2 gap-3" onClick={(e) => e.stopPropagation()}>
            <div className="overflow-hidden rounded-2xl border border-white/10">
              <p className="bg-black/60 px-2 py-1 text-center text-[10px] text-white/50">Önce</p>
              <img src={comparePair[0]} alt="" className="max-h-[50vh] w-full object-contain" />
            </div>
            <div className="overflow-hidden rounded-2xl border border-white/10">
              <p className="bg-black/60 px-2 py-1 text-center text-[10px] text-white/50">Sonra</p>
              <img src={comparePair[1]} alt="" className="max-h-[50vh] w-full object-contain" />
            </div>
          </div>
          <p className="text-xs text-white/40">Kapatmak için boş alana tıklayın</p>
        </button>
      )}

      <ScheduleModal
        open={!!scheduleUrl}
        onClose={() => setScheduleUrl(null)}
        imageUrl={scheduleUrl ?? undefined}
        defaultCaption={caption}
        defaultHashtags={hashtags}
      />
    </>
  );
}
