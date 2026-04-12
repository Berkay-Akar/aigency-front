"use client";

import { motion } from "framer-motion";
import {
  Camera,
  LayoutGrid,
  Layers,
  ArrowLeftRight,
  User2,
  Film,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import { useStudioStore, type ProductFlow } from "@/store/studio-store";

type FlowLabelKey =
  | "flowManken"
  | "flowAngles"
  | "flowReference"
  | "flowSwap"
  | "flowGhost"
  | "flowVideo";

const FLOW_IDS: {
  id: ProductFlow;
  labelKey: FlowLabelKey;
  icon: React.ComponentType<{ className?: string }>;
}[] = [
  { id: "model-photo", labelKey: "flowManken", icon: Camera },
  { id: "product-angles", labelKey: "flowAngles", icon: LayoutGrid },
  { id: "product-reference", labelKey: "flowReference", icon: Layers },
  { id: "product-swap", labelKey: "flowSwap", icon: ArrowLeftRight },
  { id: "ghost-mannequin", labelKey: "flowGhost", icon: User2 },
  { id: "photo-to-video", labelKey: "flowVideo", icon: Film },
];

export function FlowTabBar({ compact = false }: { compact?: boolean }) {
  const t = useTranslations("productStudio");
  const activeProductFlow = useStudioStore((s) => s.activeProductFlow);
  const setActiveProductFlow = useStudioStore((s) => s.setActiveProductFlow);

  return (
    <div className="flex gap-0.5 overflow-x-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
      {FLOW_IDS.map(({ id, labelKey, icon: Icon }) => (
        <button
          key={id}
          type="button"
          onClick={() => setActiveProductFlow(id)}
          className={cn(
            "relative flex shrink-0 items-center gap-1.5 rounded-lg transition-colors select-none",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/40",
            compact
              ? "px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wider"
              : "flex-col px-3 py-2.5 text-[10px] font-semibold uppercase tracking-wider",
            activeProductFlow === id
              ? "text-indigo-200"
              : "text-white/40 hover:text-white/65",
          )}
        >
          {activeProductFlow === id && (
            <motion.div
              layoutId="product-flow-pill"
              className="absolute inset-0 rounded-lg border border-indigo-500/30 bg-indigo-500/[0.14]"
              transition={{ type: "spring", bounce: 0.18, duration: 0.38 }}
            />
          )}
          <Icon
            className={cn(
              "relative z-10 shrink-0",
              compact ? "h-4 w-4" : "h-4 w-4",
            )}
          />
          <span className="relative z-10 whitespace-nowrap">{t(labelKey)}</span>
        </button>
      ))}
    </div>
  );
}
