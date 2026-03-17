import { LandingNav } from "@/components/features/landing/landing-nav";
import { Hero } from "@/components/features/landing/hero";
import { BeforeAfter } from "@/components/features/landing/before-after";
import { SocialProof } from "@/components/features/landing/social-proof";
import { FeaturesGrid } from "@/components/features/landing/features-grid";
import { WorkflowStrip } from "@/components/features/landing/workflow-strip";
import { Pricing } from "@/components/features/landing/pricing";

export default function LandingPage() {
  return (
    <div className="bg-[#080808] min-h-screen">
      <LandingNav />
      <Hero />
      <BeforeAfter />
      <SocialProof />
      <FeaturesGrid />
      <WorkflowStrip />
      <Pricing />

      {/* Footer */}
      <footer className="border-t border-white/[0.06] py-12 px-8 mt-8">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <span className="text-white/20 text-sm">
              © 2024 Aigencys. All rights reserved.
            </span>
          </div>
          <div className="flex items-center gap-8">
            {["Privacy", "Terms", "Contact"].map((item) => (
              <span
                key={item}
                className="text-sm text-white/20 hover:text-white/40 cursor-pointer transition-colors"
              >
                {item}
              </span>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}
