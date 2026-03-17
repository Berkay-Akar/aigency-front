import { Upload, Wand2, CalendarDays, Send, ArrowRight } from "lucide-react";

const STEPS = [
  {
    icon: Upload,
    step: "01",
    title: "Upload",
    desc: "Drop your raw product photo",
    color: "text-indigo-400",
    bg: "bg-indigo-500/10",
  },
  {
    icon: Wand2,
    step: "02",
    title: "Generate",
    desc: "AI creates 4 premium variations",
    color: "text-violet-400",
    bg: "bg-violet-500/10",
  },
  {
    icon: CalendarDays,
    step: "03",
    title: "Schedule",
    desc: "Pick times, pick platforms",
    color: "text-amber-400",
    bg: "bg-amber-500/10",
  },
  {
    icon: Send,
    step: "04",
    title: "Publish",
    desc: "Goes live automatically",
    color: "text-emerald-400",
    bg: "bg-emerald-500/10",
  },
];

export function WorkflowStrip() {
  return (
    <section className="py-32 px-6">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-20">
          <p className="text-indigo-400 text-sm font-medium uppercase tracking-widest mb-4">
            The workflow
          </p>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight">
            Agency results in{" "}
            <span className="gradient-text">4 simple steps</span>
          </h2>
        </div>

        <div className="relative">
          {/* Connecting line */}
          <div className="absolute top-12 left-[calc(12.5%+24px)] right-[calc(12.5%+24px)] h-[1px] bg-gradient-to-r from-indigo-500/20 via-violet-500/20 to-emerald-500/20 hidden md:block" />

          <div className="grid md:grid-cols-4 gap-8">
            {STEPS.map(({ icon: Icon, step, title, desc, color, bg }, i) => (
              <div key={step} className="relative flex flex-col items-center text-center">
                {/* Step icon */}
                <div
                  className={`relative w-12 h-12 rounded-2xl ${bg} flex items-center justify-center mb-6 z-10 border border-white/[0.06]`}
                >
                  <Icon className={`w-5 h-5 ${color}`} />
                  <span className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-[#111] border border-white/10 flex items-center justify-center text-[10px] font-bold text-white/40">
                    {i + 1}
                  </span>
                </div>

                <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
                <p className="text-sm text-white/40 leading-relaxed">{desc}</p>

                {/* Arrow between steps */}
                {i < STEPS.length - 1 && (
                  <div className="hidden md:flex absolute top-12 -right-4 items-center justify-center z-20">
                    <ArrowRight className="w-4 h-4 text-white/20" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
