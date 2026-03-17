import { MessageCircle, BookOpen, Video, Zap } from "lucide-react";
import Link from "next/link";

const RESOURCES = [
  {
    icon: Video,
    color: "text-indigo-400",
    bg: "bg-indigo-500/10",
    title: "Video tutorials",
    desc: "Step-by-step walkthroughs for every feature",
    href: "#",
  },
  {
    icon: BookOpen,
    color: "text-violet-400",
    bg: "bg-violet-500/10",
    title: "Documentation",
    desc: "Complete API reference and guides",
    href: "#",
  },
  {
    icon: MessageCircle,
    color: "text-emerald-400",
    bg: "bg-emerald-500/10",
    title: "Live chat",
    desc: "Talk to our team in real-time",
    href: "#",
  },
  {
    icon: Zap,
    color: "text-amber-400",
    bg: "bg-amber-500/10",
    title: "Quick start",
    desc: "Get your first post live in 5 minutes",
    href: "/studio",
  },
];

const FAQS = [
  { q: "How many credits does each generation use?", a: "Product Enhance: 4 credits per image. Fashion Model: 8 credits. Background Replace: 3 credits. Video: 20 credits." },
  { q: "Can I publish directly from Aigencys?", a: "Yes! Connect your Instagram, TikTok, Facebook, and X accounts in Settings → Integrations." },
  { q: "What file formats can I upload?", a: "JPG, PNG, WebP, and HEIC for images. MP4 and MOV for video (coming soon)." },
  { q: "How do I get more credits?", a: "Credits reset monthly on your plan. You can also purchase credit top-ups starting at $9 for 200 credits." },
];

export default function HelpPage() {
  return (
    <div className="p-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-xl font-bold text-white mb-1">Help Center</h1>
        <p className="text-sm text-white/30">Everything you need to get the most out of Aigencys</p>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-12">
        {RESOURCES.map(({ icon: Icon, color, bg, title, desc, href }) => (
          <Link
            key={title}
            href={href}
            className="p-6 rounded-3xl bg-white/[0.02] border border-white/[0.06] hover:bg-white/[0.04] hover:border-white/[0.1] transition-all group"
          >
            <div className={`inline-flex p-3 rounded-2xl ${bg} mb-4`}>
              <Icon className={`w-5 h-5 ${color}`} />
            </div>
            <h3 className="text-sm font-semibold text-white mb-1">{title}</h3>
            <p className="text-sm text-white/40">{desc}</p>
          </Link>
        ))}
      </div>

      <div>
        <h2 className="text-base font-semibold text-white mb-6">Frequently asked questions</h2>
        <div className="space-y-3">
          {FAQS.map(({ q, a }, i) => (
            <details key={i} className="group p-5 rounded-2xl bg-white/[0.02] border border-white/[0.06] hover:border-white/[0.1] transition-colors cursor-pointer">
              <summary className="text-sm font-medium text-white/70 group-hover:text-white transition-colors list-none flex items-center justify-between">
                {q}
                <span className="text-white/30 group-open:rotate-45 transition-transform text-lg leading-none">+</span>
              </summary>
              <p className="mt-3 text-sm text-white/40 leading-relaxed">{a}</p>
            </details>
          ))}
        </div>
      </div>
    </div>
  );
}
