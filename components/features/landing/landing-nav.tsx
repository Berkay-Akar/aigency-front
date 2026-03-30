import Link from "next/link";
import { Logo } from "@/components/shared/logo";

export function LandingNav() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 h-[72px] border-b border-white/[0.035] bg-[#080808]/90 backdrop-blur-xl">
      <Logo />

      <div className="hidden md:flex items-center gap-10">
        {["Features", "Workflow", "Pricing"].map((item) => (
          <Link
            key={item}
            href={`#${item.toLowerCase()}`}
            className="text-[14px] text-white/[0.40] hover:text-white/[0.75] transition-colors font-[450] tracking-[-0.01em]"
          >
            {item}
          </Link>
        ))}
      </div>

      <div className="flex items-center gap-3">
        <Link
          href="/dashboard"
          className="inline-flex items-center px-5 py-2.5 text-[14px] text-white/[0.50] hover:text-white hover:bg-white/[0.04] rounded-[12px] transition-all font-[500] tracking-[-0.01em]"
        >
          Sign in
        </Link>
        <Link
          href="/studio"
          className="inline-flex items-center px-5 py-2.5 text-[14px] bg-white hover:bg-white/95 text-[#080808] rounded-[12px] font-[550] shadow-lg shadow-white/[0.08] transition-all hover:scale-[1.02] tracking-[-0.01em]"
        >
          Get Started
        </Link>
      </div>
    </nav>
  );
}
