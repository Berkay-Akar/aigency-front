import { Wand2, CalendarDays, Zap, Palette } from "lucide-react";

const FEATURES = [
  {
    icon: Wand2,
    color: "text-indigo-400",
    bg: "bg-indigo-500/10",
    border: "border-indigo-500/20",
    title: "AI Generation",
    desc: "Upload a product photo. Get 4 studio-quality variations in under 30 seconds. Fashion models, backgrounds, lighting — all AI.",
  },
  {
    icon: CalendarDays,
    color: "text-violet-400",
    bg: "bg-violet-500/10",
    border: "border-violet-500/20",
    title: "Content Calendar",
    desc: "Plan your entire month in minutes. Drag & drop posts, set optimal times, and publish across all platforms simultaneously.",
  },
  {
    icon: Zap,
    color: "text-amber-400",
    bg: "bg-amber-500/10",
    border: "border-amber-500/20",
    title: "Auto Publishing",
    desc: "Set it and forget it. Aigencys auto-posts to Instagram, TikTok, Facebook and X at exactly the right time for maximum reach.",
  },
  {
    icon: Palette,
    color: "text-emerald-400",
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/20",
    title: "Brand Consistency",
    desc: "Upload your logo, colors, and tone once. Every caption, every image, every post — always 100% on-brand.",
  },
];

export function FeaturesGrid() {
  return (
    <section className="py-32 px-6">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-20">
          <p className="text-indigo-400 text-sm font-medium uppercase tracking-widest mb-4">
            Everything you need
          </p>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">
            One platform.{" "}
            <span className="gradient-text">Infinite content.</span>
          </h2>
          <p className="text-white/40 text-lg max-w-xl mx-auto">
            Aigencys replaces your entire content team — designer, copywriter,
            scheduler, and analyst.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {FEATURES.map(({ icon: Icon, color, bg, border, title, desc }) => (
            <div
              key={title}
              className="group p-8 rounded-3xl bg-white/[0.02] border border-white/[0.06] hover:bg-white/[0.04] hover:border-white/[0.1] transition-all duration-300"
            >
              <div
                className={`inline-flex p-3 rounded-2xl ${bg} border ${border} mb-6`}
              >
                <Icon className={`w-5 h-5 ${color}`} />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">{title}</h3>
              <p className="text-white/40 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
