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
    <div className="group rounded-3xl border border-border bg-card p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] backdrop-blur-md transition-all duration-200 hover:border-border/60 hover:bg-card/80 md:p-6">
      <div className="flex items-start justify-between mb-4 md:mb-6">
        <div
          className={cn(
            "w-9 h-9 md:w-10 md:h-10 rounded-xl md:rounded-2xl flex items-center justify-center",
            bg,
          )}
        >
          <Icon className={cn("w-4 h-4 md:w-5 md:h-5", color)} />
        </div>
        <div
          className={cn(
            "flex items-center gap-1 text-[10px] md:text-xs font-medium px-2 py-1 rounded-xl",
            trend === "up"
              ? "text-emerald-400 bg-emerald-500/10"
              : "text-red-400 bg-red-500/10",
          )}
        >
          <TrendingUp
            className={cn("w-3 h-3", trend === "down" && "rotate-180")}
          />
          {change}
        </div>
      </div>

      <div>
        <p className="text-2xl md:text-3xl font-bold text-foreground mb-1 tracking-tight">
          {value}
        </p>
        <p className="text-xs md:text-sm text-muted-foreground">{label}</p>
      </div>
    </div>
  );
}
