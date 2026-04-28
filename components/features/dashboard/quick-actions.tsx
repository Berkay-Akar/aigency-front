import Link from "next/link";
import { Wand2, CalendarPlus, Upload, BarChart3 } from "lucide-react";
import { useTranslations } from "next-intl";

const ACTIONS = [
  {
    href: "/studio",
    icon: Wand2,
    labelKey: "generateContent",
    descKey: "generateDesc",
    color: "text-indigo-400",
    bg: "bg-indigo-500/10",
    border: "border-indigo-500/20",
    hover: "hover:bg-indigo-500/15 hover:border-indigo-500/30",
  },
  {
    href: "/calendar",
    icon: CalendarPlus,
    labelKey: "schedulePost",
    descKey: "scheduleDesc",
    color: "text-violet-400",
    bg: "bg-violet-500/10",
    border: "border-violet-500/20",
    hover: "hover:bg-violet-500/15 hover:border-violet-500/30",
  },
  {
    href: "/assets",
    icon: Upload,
    labelKey: "uploadAsset",
    descKey: "uploadDesc",
    color: "text-amber-400",
    bg: "bg-amber-500/10",
    border: "border-amber-500/20",
    hover: "hover:bg-amber-500/15 hover:border-amber-500/30",
  },
  {
    href: "/dashboard",
    icon: BarChart3,
    labelKey: "viewAnalytics",
    descKey: "analyticsDesc",
    color: "text-emerald-400",
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/20",
    hover: "hover:bg-emerald-500/15 hover:border-emerald-500/30",
  },
];

export function QuickActions() {
  const t = useTranslations("quickActions");
  return (
    <div>
      <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">
        {t("sectionTitle")}
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {ACTIONS.map(
          ({
            href,
            icon: Icon,
            labelKey,
            descKey,
            color,
            bg,
            border,
            hover,
          }) => (
            <Link
              key={href + labelKey}
              href={href}
              className={`p-5 rounded-2xl border transition-all duration-200 group ${bg} ${border} ${hover}`}
            >
              <div
                className={`w-9 h-9 rounded-xl bg-black/20 flex items-center justify-center mb-3`}
              >
                <Icon className={`w-4.5 h-4.5 ${color}`} />
              </div>
              <p className="text-sm font-semibold text-foreground mb-0.5">
                {t(labelKey as Parameters<typeof t>[0])}
              </p>
              <p className="text-xs text-muted-foreground">
                {t(descKey as Parameters<typeof t>[0])}
              </p>
            </Link>
          ),
        )}
      </div>
    </div>
  );
}
