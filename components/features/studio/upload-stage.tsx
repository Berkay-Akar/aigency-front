"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { FolderOpen, Sparkles } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { UploadZone } from "./upload-zone";
import { useStudioStore } from "@/store/studio-store";
import { STUDIO_LIBRARY_ITEMS } from "@/lib/studio-library-mock";
import { cn } from "@/lib/utils";

export function UploadStage() {
  const [libraryOpen, setLibraryOpen] = useState(false);
  const uploadedImage = useStudioStore((s) => s.uploadedImage);
  const setUploadedImage = useStudioStore((s) => s.setUploadedImage);

  return (
    <section className="grid gap-6 lg:grid-cols-2 lg:gap-10">
      <div className="flex flex-col gap-4">
        <div>
          <h2 className="text-lg font-medium text-white">Görsel yükle</h2>
          <p className="mt-1 text-sm text-white/35">
            Ürün, model veya referans görsel yükleyin. Tek görsel ile çoklu kampanya çıktısı üretin.
          </p>
        </div>
        <UploadZone />
        <div className="flex flex-wrap gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => document.getElementById("upload-input")?.click()}
            className="h-10 rounded-2xl border-white/10 bg-white/[0.04] text-white/80 hover:bg-white/[0.08]"
          >
            Görsel yükle
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => setLibraryOpen(true)}
            className="h-10 rounded-2xl border-white/10 bg-transparent text-white/70 hover:bg-white/[0.06]"
          >
            <FolderOpen className="mr-2 size-4" />
            Kütüphaneden seç
          </Button>
        </div>
        <p className="text-[11px] text-white/25">PNG, JPG veya WEBP · max 20MB önerilir</p>
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="relative min-h-[320px] overflow-hidden rounded-3xl border border-white/[0.08] bg-gradient-to-br from-[#0a0a0c] via-[#0f0f12] to-[#0a0a0c] p-6 shadow-[0_0_80px_-20px_rgba(120,90,255,0.35)]"
      >
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_30%_20%,rgba(120,90,255,0.12),transparent_50%)]" />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_80%_80%,rgba(56,189,248,0.08),transparent_45%)]" />

        <div className="relative flex h-full flex-col">
          <div className="mb-4 flex items-center justify-between">
            <span className="text-[10px] font-semibold uppercase tracking-[0.25em] text-white/35">
              Canlı önizleme
            </span>
            <span className="flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-1 text-[10px] text-white/50">
              <Sparkles className="size-3 text-violet-300/80" />
              Pipeline
            </span>
          </div>

          <div className="relative flex flex-1 flex-col items-center justify-center gap-4">
            <motion.div
              className="relative z-[3] w-[85%] max-w-sm overflow-hidden rounded-2xl border border-white/10 shadow-2xl"
              style={{ rotate: -2 }}
              whileHover={{ rotate: 0, scale: 1.02 }}
              transition={{ type: "spring", stiffness: 260, damping: 22 }}
            >
              {uploadedImage ? (
                <img src={uploadedImage} alt="" className="aspect-[4/5] w-full object-cover" />
              ) : (
                <div className="flex aspect-[4/5] w-full flex-col items-center justify-center bg-white/[0.04] text-center">
                  <p className="text-xs text-white/30">Ham görsel</p>
                  <p className="mt-1 px-6 text-[11px] text-white/20">
                    Yükleyin — Studio ışığı ve sahneyi düzenlesin.
                  </p>
                </div>
              )}
              <div className="absolute bottom-2 left-2 rounded-lg bg-black/55 px-2 py-1 text-[10px] text-white/70 backdrop-blur">
                Önce
              </div>
            </motion.div>

            <motion.div
              className="absolute top-[18%] right-[6%] z-[2] w-[55%] max-w-[200px] overflow-hidden rounded-xl border border-white/15 shadow-xl"
              style={{ rotate: 4 }}
              animate={{ y: [0, -6, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            >
              <div
                className={cn(
                  "aspect-square w-full bg-gradient-to-br from-violet-500/30 via-fuchsia-500/10 to-transparent",
                  uploadedImage && "opacity-90"
                )}
              >
                {uploadedImage && (
                  <img src={uploadedImage} alt="" className="h-full w-full object-cover opacity-80 mix-blend-screen" />
                )}
              </div>
              <div className="absolute bottom-1.5 left-1.5 rounded-lg bg-black/50 px-2 py-0.5 text-[9px] text-emerald-200/90">
                Profesyonel
              </div>
            </motion.div>

            <motion.div
              className="absolute bottom-[10%] left-[4%] z-[1] w-[48%] max-w-[180px] overflow-hidden rounded-xl border border-cyan-500/20 bg-black/40 shadow-lg backdrop-blur-sm"
              style={{ rotate: -3 }}
              animate={{ y: [0, 5, 0] }}
              transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
            >
              <div className="aspect-[9/16] w-full bg-gradient-to-t from-cyan-500/20 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-2 text-[9px] text-white/50">
                Kampanya varyantı
              </div>
            </motion.div>
          </div>

          <p className="relative mt-4 text-center text-[11px] text-white/30">
            Tek görsel yükleyin. Geri kalanını Studio halletsin.
          </p>
        </div>
      </motion.div>

      <Dialog open={libraryOpen} onOpenChange={setLibraryOpen}>
        <DialogContent className="max-w-lg rounded-3xl border-white/[0.08] bg-[#0a0a0a] p-0">
          <DialogHeader className="border-b border-white/[0.06] px-6 py-4">
            <DialogTitle className="text-base text-white">Kütüphane</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-3 gap-2 p-4">
            {STUDIO_LIBRARY_ITEMS.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  setUploadedImage(item.src);
                  setLibraryOpen(false);
                }}
                className="group overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.02] text-left transition hover:border-white/20"
              >
                <img src={item.src} alt="" className="aspect-square w-full object-cover opacity-80 group-hover:opacity-100" />
                <p className="truncate px-2 py-1.5 text-[10px] text-white/45">{item.name}</p>
              </button>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
}
