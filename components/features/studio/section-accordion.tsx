"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface SectionAccordionProps {
  title: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
  className?: string;
}

export function SectionAccordion({
  title,
  defaultOpen = false,
  children,
  className,
}: SectionAccordionProps) {
  const [open, setOpen] = useState(defaultOpen);
  const panelId = `acc-${title.replace(/\s+/g, "-").slice(0, 24)}`;

  return (
    <div
      className={cn(
        "rounded-2xl border border-white/[0.07] bg-white/[0.02] shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]",
        className
      )}
    >
      <button
        type="button"
        id={`${panelId}-trigger`}
        aria-expanded={open}
        aria-controls={`${panelId}-panel`}
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between gap-3 rounded-2xl px-4 py-3.5 text-left transition-colors hover:bg-white/[0.03] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/40"
      >
        <span className="text-sm font-medium text-white/90">{title}</span>
        <ChevronDown
          className={cn(
            "h-4 w-4 shrink-0 text-white/35 transition-transform duration-200",
            open && "rotate-180"
          )}
          aria-hidden
        />
      </button>
      <AnimatePresence initial={false}>
        {open ? (
          <motion.div
            id={`${panelId}-panel`}
            role="region"
            aria-labelledby={`${panelId}-trigger`}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22, ease: [0.4, 0, 0.2, 1] }}
            className="overflow-hidden"
          >
            <div className="border-t border-white/[0.06] px-4 pb-4 pt-3">{children}</div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
