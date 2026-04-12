"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { Loader2, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

interface GenerateButtonProps {
  loading: boolean;
  disabled?: boolean;
  onClick: () => void;
  className?: string;
}

export function GenerateButton({
  loading,
  disabled,
  onClick,
  className,
}: GenerateButtonProps) {
  const t = useTranslations("generation");

  return (
    <motion.button
      type="button"
      layout
      onClick={onClick}
      disabled={disabled || loading}
      className={cn(
        "relative flex w-full items-center justify-center gap-2 overflow-hidden rounded-2xl py-3.5 text-sm font-semibold text-white transition-shadow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400/50 disabled:pointer-events-none disabled:opacity-45",
        loading
          ? "bg-indigo-600/80 shadow-lg shadow-indigo-600/20"
          : "bg-linear-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 shadow-lg shadow-indigo-900/30",
        className
      )}
    >
      {loading ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin shrink-0" aria-hidden />
          <span>{t("generating")}</span>
          <motion.span
            className="pointer-events-none absolute inset-0 bg-linear-to-r from-transparent via-white/10 to-transparent"
            animate={{ x: ["-100%", "100%"] }}
            transition={{ duration: 1.2, repeat: Infinity, ease: "linear" }}
          />
        </>
      ) : (
        <>
          <Sparkles className="h-4 w-4 shrink-0 opacity-90" aria-hidden />
          <span>{t("generate")}</span>
        </>
      )}
    </motion.button>
  );
}
