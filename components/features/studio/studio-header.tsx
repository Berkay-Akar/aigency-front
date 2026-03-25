"use client";

import { Plus } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useStudioStore } from "@/store/studio-store";

export function StudioHeader() {
  const resetProject = useStudioStore((s) => s.resetProject);

  return (
    <motion.header
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      className="sticky top-0 z-20 flex flex-wrap items-center justify-between gap-4 border-b border-white/[0.06] bg-[#050505]/90 px-4 py-5 backdrop-blur-xl md:px-8"
    >
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-white md:text-3xl">
          Studio
        </h1>
        <p className="mt-1 max-w-xl text-sm text-white/40">
          Tek görselden kampanya üret.
        </p>
      </div>

      <Button
        type="button"
        onClick={() => resetProject()}
        className="h-11 rounded-2xl border border-white/10 bg-white/[0.06] px-5 text-sm font-medium text-white shadow-none hover:bg-white/10"
      >
        <Plus className="mr-2 size-4" />
        Yeni proje
      </Button>
    </motion.header>
  );
}
