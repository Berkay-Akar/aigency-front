import Link from "next/link";
import { Wand2, CalendarPlus, Upload, BarChart3 } from "lucide-react";

const ACTIONS = [
  {
    href: "/studio",
    icon: Wand2,
    label: "Generate Content",
    desc: "Create AI visuals",
    color: "text-indigo-400",
    bg: "bg-indigo-500/10",
    border: "border-indigo-500/20",
    hover: "hover:bg-indigo-500/15 hover:border-indigo-500/30",
  },
  {
    href: "/calendar",
    icon: CalendarPlus,
    label: "Schedule Post",
    desc: "Plan your calendar",
    color: "text-violet-400",
    bg: "bg-violet-500/10",
    border: "border-violet-500/20",
    hover: "hover:bg-violet-500/15 hover:border-violet-500/30",
  },
  {
    href: "/assets",
    icon: Upload,
    label: "Upload Asset",
    desc: "Add to your library",
    color: "text-amber-400",
    bg: "bg-amber-500/10",
    border: "border-amber-500/20",
    hover: "hover:bg-amber-500/15 hover:border-amber-500/30",
  },
  {
    href: "/dashboard",
    icon: BarChart3,
    label: "View Analytics",
    desc: "Track performance",
    color: "text-emerald-400",
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/20",
    hover: "hover:bg-emerald-500/15 hover:border-emerald-500/30",
  },
];

export function QuickActions() {
  return (
    <div>
      <h2 className="text-sm font-semibold text-white/40 uppercase tracking-wider mb-4">
        Quick Actions
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {ACTIONS.map(({ href, icon: Icon, label, desc, color, bg, border, hover }) => (
          <Link
            key={href + label}
            href={href}
            className={`p-5 rounded-2xl border transition-all duration-200 group ${bg} ${border} ${hover}`}
          >
            <div
              className={`w-9 h-9 rounded-xl bg-black/20 flex items-center justify-center mb-3`}
            >
              <Icon className={`w-4.5 h-4.5 ${color}`} />
            </div>
            <p className="text-sm font-semibold text-white mb-0.5">{label}</p>
            <p className="text-xs text-white/30">{desc}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
