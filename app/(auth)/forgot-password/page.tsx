"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2, ArrowLeft, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { useTranslations } from "next-intl";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const schema = z.object({
  email: z.string().email(),
});

type FormData = z.infer<typeof schema>;

export default function ForgotPasswordPage() {
  const t = useTranslations("auth");
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const onSubmit = async (_data: FormData) => {
    try {
      // TODO: connect POST /auth/forgot-password
      setSuccess(true);
    } catch {
      toast.error(t("forgotPasswordSubmit"));
    }
  };

  return (
    <div className="w-full max-w-md">
      <div className="glass-panel rounded-3xl p-8 shadow-2xl">
        {success ? (
          <div className="text-center space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-emerald-500/15 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-7 h-7 text-emerald-400" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white mb-2">
                {t("forgotPasswordSuccess")}
              </h1>
              <p className="text-sm text-white/40">
                {t("forgotPasswordSuccessDesc")}
              </p>
            </div>
            <Link
              href="/login"
              className="inline-flex items-center gap-2 text-sm text-indigo-400 hover:text-indigo-300 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              {t("backToLogin")}
            </Link>
          </div>
        ) : (
          <>
            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold text-white mb-2">
                {t("forgotPasswordPageTitle")}
              </h1>
              <p className="text-sm text-white/40">
                {t("forgotPasswordPageDesc")}
              </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <Label
                  htmlFor="email"
                  className="text-xs text-white/40 font-medium uppercase tracking-wider mb-1.5 block"
                >
                  {t("email")}
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@company.com"
                  autoComplete="email"
                  {...register("email")}
                  className="bg-white/[0.05] border-white/[0.08] rounded-xl text-white placeholder:text-white/20 focus-visible:ring-indigo-500/40 focus-visible:border-indigo-500/40 h-11"
                />
                {errors.email && (
                  <p className="text-xs text-red-400 mt-1.5">
                    {errors.email.message}
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full h-11 rounded-2xl bg-linear-to-r from-indigo-500 to-violet-600 hover:from-indigo-400 hover:to-violet-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold text-sm transition-colors shadow-lg shadow-indigo-500/20 flex items-center justify-center gap-2"
              >
                {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
                {isSubmitting
                  ? t("forgotPasswordSubmitting")
                  : t("forgotPasswordSubmit")}
              </button>
            </form>

            <p className="text-center text-sm text-white/30 mt-6">
              <Link
                href="/login"
                className="inline-flex items-center gap-1.5 text-indigo-400 hover:text-indigo-300 font-medium transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                {t("backToLogin")}
              </Link>
            </p>
          </>
        )}
      </div>
    </div>
  );
}
