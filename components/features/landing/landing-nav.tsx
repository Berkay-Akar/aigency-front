import Link from "next/link";
import { Logo } from "@/components/shared/logo";

export function LandingNav() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 h-16 border-b border-white/[0.04] bg-[#080808]/80 backdrop-blur-md">
      <Logo />

      <div className="hidden md:flex items-center gap-8">
        {["Features", "Workflow", "Pricing"].map((item) => (
          <Link
            key={item}
            href={`#${item.toLowerCase()}`}
            className="text-sm text-white/40 hover:text-white/70 transition-colors"
          >
            {item}
          </Link>
        ))}
      </div>

      <div className="flex items-center gap-3">
        <Link
          href="/dashboard"
          className="inline-flex items-center px-4 py-2 text-sm text-white/50 hover:text-white hover:bg-white/[0.05] rounded-xl transition-colors"
        >
          Sign in
        </Link>
        <Link
          href="/studio"
          className="inline-flex items-center px-4 py-2 text-sm bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-medium shadow-lg shadow-indigo-500/20 transition-colors"
        >
          Start free
        </Link>
      </div>
    </nav>
  );
}
