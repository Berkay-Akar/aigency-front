import { TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";

interface AnalyticsCardProps {
  label: string;
  value: string;
  change: string;
  trend: "up" | "down";
  icon: React.ElementType;
  color: string;
  bg: string;
}

export function AnalyticsCard({
  label,
  value,
  change,
  trend,
  icon: Icon,
  color,
  bg,
}: AnalyticsCardProps) {
  return (
    <div className="p-6 rounded-3xl bg-white/[0.02] border border-white/[0.06] hover:bg-white/[0.04] hover:border-white/[0.09] transition-all duration-200 group">
      <div className="flex items-start justify-between mb-6">
        <div
          className={cn(
            "w-10 h-10 rounded-2xl flex items-center justify-center",
            bg
          )}
        >
          <Icon className={cn("w-5 h-5", color)} />
        </div>
        <div
          className={cn(
            "flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-xl",
            trend === "up"
              ? "text-emerald-400 bg-emerald-500/10"
              : "text-red-400 bg-red-500/10"
          )}
        >
          <TrendingUp
            className={cn(
              "w-3 h-3",
              trend === "down" && "rotate-180"
            )}
          />
          {change}
        </div>
      </div>

      <div>
        <p className="text-3xl font-bold text-white mb-1 tracking-tight">
          {value}
        </p>
        <p className="text-sm text-white/40">{label}</p>
      </div>
    </div>
  );
}
