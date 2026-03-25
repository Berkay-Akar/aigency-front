"use client";

import Link from "next/link";
import { Download, Library, Share2 } from "lucide-react";
import { toast } from "sonner";
import { useStudioStore } from "@/store/studio-store";
import { ScheduleModal } from "./schedule-modal";
import { useState } from "react";

type Platform = "instagram" | "tiktok" | "facebook" | "twitter";

const ITEMS: { id: string; label: string; platform: Platform }[] = [
  { id: "ig-post", label: "Instagram Post", platform: "instagram" },
  { id: "story", label: "Story", platform: "instagram" },
  { id: "reel", label: "Reel kapak", platform: "instagram" },
  { id: "tiktok", label: "TikTok", platform: "tiktok" },
  { id: "meta", label: "Meta reklam", platform: "facebook" },
  { id: "banner", label: "Web banner", platform: "twitter" },
];

export function ExportStrip() {
  const results = useStudioStore((s) => s.results);
  const caption = useStudioStore((s) => s.caption);
  const hashtags = useStudioStore((s) => s.hashtags);

  const [schedule, setSchedule] = useState<{
    open: boolean;
    platform: Platform;
  }>({ open: false, platform: "instagram" });

  const hero = results[0];

  const downloadAll = () => {
    if (results.length === 0) {
      toast.error("Önce çıktı üretin.");
      return;
    }
    results.forEach((url, i) => {
      setTimeout(() => {
        const a = document.createElement("a");
        a.href = url;
        a.download = `aigencys-${i + 1}.jpg`;
        a.click();
      }, i * 120);
    });
    toast.message("İndirme başlatıldı", {
      description: "Dosyalar sırayla indiriliyor.",
    });
  };

  return (
    <>
      <div className="rounded-3xl border border-white/[0.07] bg-gradient-to-r from-white/[0.04] to-transparent p-4 md:p-5">
        <div className="mb-3 flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-white/35">
          <Share2 className="size-3.5" />
          Dışa aktar ve yayınla
        </div>
        <div className="flex flex-wrap gap-2">
          {ITEMS.map((item) => (
            <button
              key={item.id}
              type="button"
              disabled={!hero}
              onClick={() =>
                setSchedule({ open: true, platform: item.platform })
              }
              className="rounded-2xl border border-white/10 bg-white/[0.05] px-3 py-2 text-xs font-medium text-white/75 transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-40"
            >
              {item.label}
            </button>
          ))}
          <button
            type="button"
            onClick={downloadAll}
            disabled={results.length === 0}
            className="inline-flex items-center gap-1.5 rounded-2xl border border-violet-500/30 bg-violet-500/10 px-3 py-2 text-xs font-medium text-violet-200 disabled:opacity-40"
          >
            <Download className="size-3.5" />
            Tümünü indir
          </button>
          <Link
            href="/assets"
            className="inline-flex items-center gap-1.5 rounded-2xl border border-white/10 px-3 py-2 text-xs font-medium text-white/60 transition hover:bg-white/[0.06]"
          >
            <Library className="size-3.5" />
            Kütüphaneye gönder
          </Link>
        </div>
      </div>

      <ScheduleModal
        open={schedule.open}
        onClose={() => setSchedule((s) => ({ ...s, open: false }))}
        imageUrl={hero}
        defaultCaption={caption}
        defaultHashtags={hashtags}
        defaultPlatform={schedule.platform}
      />
    </>
  );
}
