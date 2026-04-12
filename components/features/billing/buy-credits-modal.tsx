"use client";

import { useEffect, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CreditCard, Loader2, Zap } from "lucide-react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { billingApi } from "@/lib/api";
import { buildIyzicoCheckoutPayload } from "@/lib/billing-checkout";
import { CREDIT_PACKAGES } from "@/lib/billing-packages";
import { useAuthStore } from "@/store/auth-store";
import { cn } from "@/lib/utils";
import { IyzicoCheckoutModal } from "./iyzico-checkout-modal";

export function BuyCreditsModal({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const t = useTranslations("billingModal");
  const queryClient = useQueryClient();
  const user = useAuthStore((s) => s.user);
  const [checkoutHtml, setCheckoutHtml] = useState<string | null>(null);
  const [checkoutOpen, setCheckoutOpen] = useState(false);

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
    onError: () => toast.error(t("paymentStartFailed")),
  });

  const handlePaymentSuccess = () => {
    setCheckoutOpen(false);
    setCheckoutHtml(null);
    queryClient.invalidateQueries({ queryKey: ["billing", "balance"] });
    toast.success(t("paymentSuccess"));
    onOpenChange(false);
  };

  useEffect(() => {
    if (!open) {
      setCheckoutHtml(null);
      setCheckoutOpen(false);
    }
  }, [open]);

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-h-[90vh] max-w-lg overflow-y-auto rounded-3xl border border-white/10 bg-[rgb(10_10_12/0.92)] p-0 shadow-[inset_0_1px_0_rgba(255,255,255,0.06),0_24px_64px_rgba(0,0,0,0.5)] backdrop-blur-xl">
          <DialogHeader className="border-b border-white/[0.06] px-6 pb-4 pt-6">
            <DialogTitle className="text-lg font-semibold text-white">
              {t("title")}
            </DialogTitle>
            <DialogDescription className="text-sm text-white/45">
              {t("description")}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3 px-6 py-5">
            {CREDIT_PACKAGES.map((pkg) => (
              <div
                key={pkg.id}
                className={cn(
                  "relative rounded-2xl border p-4 transition-colors",
                  pkg.popular
                    ? "border-indigo-500/40 bg-indigo-600/[0.12]"
                    : "border-white/[0.08] bg-white/[0.04] hover:border-white/15"
                )}
              >
                {pkg.popular ? (
                  <div className="absolute -top-2.5 left-4 rounded-full bg-indigo-600 px-2.5 py-0.5 text-[10px] font-semibold text-white">
                    {t("bestValue")}
                  </div>
                ) : null}
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-xs font-medium text-white/40">
                      {pkg.label}
                    </p>
                    <p className="text-xl font-bold text-white">{pkg.price}</p>
                    <p className="mt-0.5 flex items-center gap-1 text-xs text-indigo-300/90">
                      <Zap className="h-3 w-3" aria-hidden />
                      {pkg.credits.toLocaleString()} {t("credits")}
                    </p>
                    <p className="mt-1 text-[11px] text-white/30">{pkg.desc}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => paymentMutation.mutate(pkg.id)}
                    disabled={paymentMutation.isPending}
                    className={cn(
                      "shrink-0 rounded-xl px-4 py-2.5 text-sm font-medium transition-colors",
                      pkg.popular
                        ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/25 hover:bg-indigo-500"
                        : "border border-white/10 bg-white/[0.08] text-white hover:bg-white/[0.12]"
                    )}
                  >
                    {paymentMutation.isPending &&
                    paymentMutation.variables === pkg.id ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <span className="inline-flex items-center gap-1.5">
                        <CreditCard className="h-3.5 w-3.5" aria-hidden />
                        {t("buy")}
                      </span>
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      {checkoutHtml ? (
        <IyzicoCheckoutModal
          open={checkoutOpen}
          html={checkoutHtml}
          onClose={() => setCheckoutOpen(false)}
          onSuccess={handlePaymentSuccess}
        />
      ) : null}
    </>
  );
}
