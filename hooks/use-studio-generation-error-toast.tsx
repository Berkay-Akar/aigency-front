"use client";

import { useEffect } from "react";
import { useTranslations } from "next-intl";
import { AlertCircle, X, Zap } from "lucide-react";
import { toast } from "sonner";
import { formatGenerationErrorMessage } from "@/lib/generation-error-message";
import { useStudioStore } from "@/store/studio-store";
import { cn } from "@/lib/utils";

const TOAST_ID = "studio-generation-error";

type GenKey = Parameters<
  ReturnType<typeof useTranslations<"generation">>
>[0];

export function useStudioGenerationErrorToast(opts: {
  onBuyCredits: () => void;
}) {
  const tg = useTranslations("generation");
  const tc = useTranslations("common");
  const generationError = useStudioStore((s) => s.generationError);
  const setGenerationError = useStudioStore((s) => s.setGenerationError);

  useEffect(() => {
    if (!generationError) return;

    const msg =
      formatGenerationErrorMessage(generationError, (k) =>
        tg(k as GenKey)
      ) ?? generationError;
    const isCredits = generationError === "INSUFFICIENT_CREDITS";

    toast.custom(
      () => (
        <div
          className={cn(
            "pointer-events-auto flex w-[min(100vw-2rem,380px)] flex-col gap-3 rounded-2xl border p-4",
            isCredits
              ? "border-amber-500/35 bg-[rgb(14_12_10/0.94)]"
              : "border-red-500/30 bg-[rgb(12_10_10/0.94)]"
          )}
          style={{
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
            boxShadow:
              "inset 0 1px 0 rgba(255,255,255,0.09), 0 20px 48px rgba(0,0,0,0.55)",
          }}
        >
          <div className="flex gap-3">
            <div
              className={cn(
                "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border",
                isCredits
                  ? "border-amber-500/35 bg-amber-500/[0.14]"
                  : "border-red-500/30 bg-red-500/[0.12]"
              )}
            >
              {isCredits ? (
                <Zap className="h-5 w-5 text-amber-300" aria-hidden />
              ) : (
                <AlertCircle className="h-5 w-5 text-red-400" aria-hidden />
              )}
            </div>
            <div className="min-w-0 flex-1 pt-0.5">
              <p className="text-sm font-semibold tracking-tight text-white">
                {isCredits
                  ? tg("insufficientCreditsTitle")
                  : tg("errorToastTitle")}
              </p>
              <p className="mt-1 text-xs leading-relaxed text-white/[0.55]">
                {msg}
              </p>
            </div>
            <button
              type="button"
              className="shrink-0 rounded-lg p-1 text-white/45 transition hover:bg-white/[0.08] hover:text-white"
              aria-label={tc("close")}
              onClick={() => {
                toast.dismiss(TOAST_ID);
                setGenerationError(null);
              }}
            >
              <X className="h-4 w-4" aria-hidden />
            </button>
          </div>
          <div className="flex flex-wrap gap-2 pl-[52px]">
            {isCredits ? (
              <button
                type="button"
                className="rounded-xl bg-gradient-to-r from-indigo-500 to-violet-600 px-4 py-2 text-xs font-semibold text-white shadow-lg shadow-indigo-900/35 transition hover:from-indigo-500 hover:to-violet-500"
                onClick={() => {
                  toast.dismiss(TOAST_ID);
                  setGenerationError(null);
                  opts.onBuyCredits();
                }}
              >
                {tg("buyCreditsCta")}
              </button>
            ) : null}
            <button
              type="button"
              className="rounded-xl border border-white/12 bg-white/[0.06] px-4 py-2 text-xs font-medium text-white/80 transition hover:bg-white/[0.1]"
              onClick={() => {
                toast.dismiss(TOAST_ID);
                setGenerationError(null);
              }}
            >
              {tc("close")}
            </button>
          </div>
        </div>
      ),
      {
        id: TOAST_ID,
        duration: isCredits ? 14_000 : 8000,
        unstyled: true,
      }
    );

    queueMicrotask(() => setGenerationError(null));
  }, [generationError, opts.onBuyCredits, setGenerationError, tg, tc]);
}
