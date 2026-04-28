"use client";

import Link from "next/link";
import { Check, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

const PLANS = [
  {
    name: "Starter",
    price: "$29",
    credits: "500",
    period: "/month",
    desc: "Perfect for solo creators",
    popular: false,
    features: [
      "500 credits / month",
      "AI image generation",
      "Caption generator",
      "Schedule up to 30 posts",
      "1 brand kit",
      "Instagram & TikTok",
    ],
  },
  {
    name: "Growth",
    price: "$79",
    credits: "2,000",
    period: "/month",
    desc: "For growing brands",
    popular: true,
    features: [
      "2,000 credits / month",
      "Everything in Starter",
      "Fashion model placement",
      "Unlimited scheduling",
      "3 brand kits",
      "All platforms",
      "Priority generation",
      "Analytics dashboard",
    ],
  },
  {
    name: "Agency",
    price: "$249",
    credits: "10,000",
    period: "/month",
    desc: "For agencies & teams",
    popular: false,
    features: [
      "10,000 credits / month",
      "Everything in Growth",
      "Unlimited brand kits",
      "Team collaboration",
      "White-label export",
      "API access",
      "Dedicated support",
      "Custom integrations",
    ],
  },
];

export function Pricing() {
  return (
    <section className="py-32 px-6" id="pricing">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-20">
          <p className="text-indigo-400 text-sm font-medium uppercase tracking-widest mb-4">
            Pricing
          </p>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">
            Pay for what you use.{" "}
            <span className="gradient-text">Cancel anytime.</span>
          </h2>
          <p className="text-white/40 text-lg max-w-xl mx-auto">
            Credit-based pricing. Each AI generation costs credits. No hidden
            fees, no contracts.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {PLANS.map((plan) => (
            <div
              key={plan.name}
              className={cn(
                "relative p-8 rounded-3xl border transition-all duration-300",
                plan.popular
                  ? "bg-indigo-500/10 border-indigo-500/40 glow-indigo"
                  : "bg-white/[0.02] border-white/[0.06] hover:border-white/[0.12]"
              )}
            >
              {plan.popular && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full bg-indigo-500 text-white text-xs font-semibold shadow-lg shadow-indigo-500/30">
                  Most popular
                </div>
              )}

              <div className="mb-6">
                <p className="text-sm font-medium text-white/50 mb-1">
                  {plan.name}
                </p>
                <div className="flex items-baseline gap-1 mb-2">
                  <span className="text-4xl font-bold text-white">
                    {plan.price}
                  </span>
                  <span className="text-white/40">{plan.period}</span>
                </div>
                <div className="flex items-center gap-1.5 text-sm text-white/40">
                  <Zap className="w-3.5 h-3.5 text-indigo-400" />
                  <span className="text-indigo-300 font-medium">
                    {plan.credits}
                  </span>{" "}
                  credits included
                </div>
              </div>

              <Link
                href="/studio"
                className={cn(
                  "w-full rounded-2xl mb-8 font-medium py-2.5 inline-flex items-center justify-center text-sm transition-colors",
                  plan.popular
                    ? "bg-linear-to-r from-indigo-500 to-violet-600 hover:from-indigo-400 hover:to-violet-500 text-white shadow-lg shadow-indigo-500/25"
                    : "bg-white/[0.07] hover:bg-white/[0.1] text-white border border-white/[0.08]"
                )}
              >
                Get started
              </Link>

              <ul className="space-y-3">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-3 text-sm">
                    <Check
                      className={cn(
                        "w-4 h-4 flex-shrink-0",
                        plan.popular ? "text-indigo-400" : "text-white/30"
                      )}
                    />
                    <span
                      className={plan.popular ? "text-white/70" : "text-white/40"}
                    >
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom note */}
        <p className="text-center text-white/30 text-sm mt-10">
          Need more credits?{" "}
          <span className="text-indigo-400 cursor-pointer hover:text-indigo-300">
            Buy credit top-ups
          </span>{" "}
          anytime — starting at $9 for 200 credits.
        </p>
      </div>
    </section>
  );
}
