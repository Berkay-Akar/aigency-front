"use client";

import { useEffect } from "react";
import { CreditCard } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export function IyzicoCheckoutModal({
  open,
  html,
  onClose,
  onSuccess,
}: {
  open: boolean;
  html: string;
  onClose: () => void;
  onSuccess: () => void;
}) {
  useEffect(() => {
    if (!open || !html) return;

    const handleMessage = (event: MessageEvent) => {
      if (
        event.data?.type === "payment_success" ||
        event.data === "payment_success"
      ) {
        onSuccess();
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [open, html, onSuccess]);

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-lg overflow-hidden rounded-3xl border border-white/[0.08] bg-[rgb(10_10_12/0.95)] p-0 shadow-2xl backdrop-blur-xl">
        <DialogHeader className="px-6 pb-0 pt-5">
          <DialogTitle className="flex items-center gap-2 text-base font-semibold text-white">
            <CreditCard className="h-4 w-4 text-indigo-400" />
            Complete payment
          </DialogTitle>
        </DialogHeader>
        <div
          className="p-4"
          dangerouslySetInnerHTML={{ __html: html }}
        />
      </DialogContent>
    </Dialog>
  );
}
