import type { CreatePaymentPayload } from "@/lib/api";

/**
 * Builds POST /billing/payment body for iyzico.
 * Buyer identity fields use safe defaults for development; replace with collected billing profile in production.
 */
export function buildIyzicoCheckoutPayload(opts: {
  creditAmount: number;
  price: number;
  buyerEmail: string;
  buyerDisplayName: string;
  callbackUrl: string;
  currency?: string;
}): CreatePaymentPayload {
  const parts = opts.buyerDisplayName.trim().split(/\s+/).filter(Boolean);
  const buyerName = parts[0] ?? "Customer";
  const buyerSurname = parts.length > 1 ? parts.slice(1).join(" ") : "Account";

  return {
    creditAmount: opts.creditAmount,
    price: opts.price,
    currency: opts.currency ?? "TRY",
    callbackUrl: opts.callbackUrl,
    buyerName,
    buyerSurname,
    buyerEmail: opts.buyerEmail,
    buyerIp: "127.0.0.1",
    buyerCity: "Istanbul",
    buyerCountry: "Turkey",
    buyerAddress: "Billing address — update in settings",
    buyerZip: "34000",
    buyerPhone: "+905551234567",
    buyerIdentityNumber: "10000000146",
  };
}
