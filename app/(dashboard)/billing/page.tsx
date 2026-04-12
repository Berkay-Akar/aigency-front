"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Zap, CreditCard, Check, Loader2, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { billingApi } from "@/lib/api";
import { buildIyzicoCheckoutPayload } from "@/lib/billing-checkout";
import { CREDIT_PACKAGES } from "@/lib/billing-packages";
import { useAuthStore } from "@/store/auth-store";
import { IyzicoCheckoutModal } from "@/components/features/billing/iyzico-checkout-modal";
import { cn } from "@/lib/utils";

export default function BillingPage() {
  const queryClient = useQueryClient();
  const user = useAuthStore((s) => s.user);
  const [checkoutHtml, setCheckoutHtml] = useState<string | null>(null);
  const [checkoutOpen, setCheckoutOpen] = useState(false);

  const { data: balance, isLoading } = useQuery({
    queryKey: ["billing", "balance"],
    queryFn: () => billingApi.getBalance(),
  });

  const paymentMutation = useMutation({
    mutationFn: (packageId: string) => {
      const pkg = CREDIT_PACKAGES.find((p) => p.id === packageId);
      if (!pkg) throw new Error("Unknown package");
      const appOrigin =
        typeof window !== "undefined" ? window.location.origin : "";
      const callbackUrl = `${appOrigin}/billing`;
      const payload = buildIyzicoCheckoutPayload({
        creditAmount: pkg.credits,
        price: pkg.priceNum,
        buyerEmail: user?.email ?? "buyer@example.com",
        buyerDisplayName: user?.name ?? "Customer",
        callbackUrl,
      });
      return billingApi.createPayment(payload);
    },
    onSuccess: (data) => {
      setCheckoutHtml(data.checkoutFormContent);
      setCheckoutOpen(true);
    },
    onError: () => toast.error("Failed to initiate payment. Please try again."),
  });

  const handlePaymentSuccess = () => {
    setCheckoutOpen(false);
    setCheckoutHtml(null);
    queryClient.invalidateQueries({ queryKey: ["billing", "balance"] });
    toast.success("Payment successful! Your credits have been added.");
  };

  // Credit usage percentage (rough estimate)
  const totalPlan = balance?.plan === "Growth" ? 2000 : balance?.plan === "Agency" ? 10000 : 500;
  const usedCredits = (balance?.totalUsed ?? 0);
  const remainingCredits = balance?.credits ?? 0;
  const usagePercent = Math.min((usedCredits / totalPlan) * 100, 100);

  return (
    <div className="p-5 md:p-8 pb-24 md:pb-8 max-w-4xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-xl font-bold text-white mb-1">Billing</h1>
        <p className="text-sm text-white/30">Manage your credits and plan</p>
      </div>

      {/* Current balance */}
      <div className="p-6 rounded-3xl bg-indigo-500/10 border border-indigo-500/25 mb-8">
        {isLoading ? (
          <div className="space-y-3">
            <div className="skeleton h-8 w-48 rounded-xl" />
            <div className="skeleton h-4 w-32 rounded-xl" />
          </div>
        ) : (
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Zap className="w-5 h-5 text-indigo-400" />
                <span className="text-3xl font-bold text-white">
                  {remainingCredits.toLocaleString()}
                </span>
                <span className="text-white/40 text-sm">credits remaining</span>
              </div>
              <p className="text-sm text-white/40">
                {balance?.plan ?? "—"} plan
                {balance?.renewsAt && (
                  <span>
                    {" "}· renews{" "}
                    {new Date(balance.renewsAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })}
                  </span>
                )}
              </p>

              {/* Usage bar */}
              {balance?.totalUsed !== undefined && (
                <div className="mt-4 w-64">
                  <div className="flex items-center justify-between text-xs text-white/40 mb-1.5">
                    <span>{usedCredits.toLocaleString()} used</span>
                    <span>{totalPlan.toLocaleString()} plan limit</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-white/[0.08] overflow-hidden">
                    <div
                      className="h-full bg-indigo-500 rounded-full transition-all"
                      style={{ width: `${usagePercent}%` }}
                    />
                  </div>
                </div>
              )}
            </div>
            <button
              onClick={() =>
                queryClient.invalidateQueries({
                  queryKey: ["billing", "balance"],
                })
              }
              className="w-8 h-8 rounded-xl flex items-center justify-center text-white/30 hover:text-white hover:bg-white/[0.08] transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* Buy credits */}
      <div className="mb-3">
        <h2 className="text-sm font-semibold text-white/40 uppercase tracking-wider mb-4">
          Top up credits
        </h2>
        <div className="grid sm:grid-cols-3 gap-4">
          {CREDIT_PACKAGES.map((pkg) => (
            <div
              key={pkg.id}
              className={cn(
                "relative p-6 rounded-3xl border transition-all",
                pkg.popular
                  ? "border-indigo-500/40 bg-indigo-600/10"
                  : "border-white/10 bg-white/[0.04] backdrop-blur-sm hover:border-white/20"
              )}
            >
              {pkg.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-indigo-600 text-white text-[10px] font-semibold">
                  Best value
                </div>
              )}

              <div className="mb-4">
                <p className="text-xs text-white/40 font-medium mb-1">
                  {pkg.label}
                </p>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-bold text-white">
                    {pkg.price}
                  </span>
                </div>
                <div className="flex items-center gap-1 mt-1 text-sm">
                  <Zap className="w-3.5 h-3.5 text-indigo-400" />
                  <span className="text-indigo-300 font-medium">
                    {pkg.credits.toLocaleString()}
                  </span>
                  <span className="text-white/40">credits</span>
                </div>
              </div>

              <p className="text-xs text-white/30 mb-5">{pkg.desc}</p>

              <button
                onClick={() => paymentMutation.mutate(pkg.id)}
                disabled={paymentMutation.isPending}
                className={cn(
                  "w-full py-2.5 rounded-2xl text-sm font-medium transition-colors flex items-center justify-center gap-2",
                  pkg.popular
                    ? "bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-500/20"
                    : "bg-white/[0.07] hover:bg-white/[0.1] text-white border border-white/[0.08]"
                )}
              >
                {paymentMutation.isPending &&
                paymentMutation.variables === pkg.id ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <CreditCard className="w-4 h-4" />
                )}
                Buy {pkg.credits.toLocaleString()} credits
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* What credits cost */}
      <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] backdrop-blur-md">
        <h3 className="text-sm font-semibold text-white mb-4">Credit costs</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: "Image generation", cost: "10 credits" },
            { label: "Image edit / I2I", cost: "10 credits" },
            { label: "Video (I2V)", cost: "50 credits" },
            { label: "Prompt enhance", cost: "OpenAI dependent" },
          ].map(({ label, cost }) => (
            <div key={label} className="flex items-center gap-2">
              <Check className="w-3.5 h-3.5 text-indigo-400 flex-shrink-0" />
              <div>
                <p className="text-xs text-white/70 font-medium">{label}</p>
                <p className="text-xs text-indigo-400">{cost}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* iyzico checkout */}
      {checkoutHtml && (
        <IyzicoCheckoutModal
          open={checkoutOpen}
          html={checkoutHtml}
          onClose={() => setCheckoutOpen(false)}
          onSuccess={handlePaymentSuccess}
        />
      )}
    </div>
  );
}
