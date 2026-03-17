"use client";

import { Zap } from "lucide-react";
import { useAppStore } from "@/store/app-store";
import { cn } from "@/lib/utils";

interface CreditBadgeProps {
  className?: string;
}

export function CreditBadge({ className }: CreditBadgeProps) {
  const credits = useAppStore((s) => s.credits);

  return (
    <div
      className={cn(
        "flex items-center gap-1.5 px-3 py-1.5 rounded-xl",
        "bg-indigo-500/10 border border-indigo-500/20",
        "text-indigo-300 text-sm font-medium",
        className
      )}
    >
      <Zap className="w-3.5 h-3.5 text-indigo-400" />
      <span>{credits.toLocaleString()}</span>
      <span className="hidden sm:inline text-indigo-400/60 text-xs">credits</span>
    </div>
  );
}
