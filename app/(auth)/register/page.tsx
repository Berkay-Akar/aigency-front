"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import { useTranslations } from "next-intl";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { authApi } from "@/lib/api";
import { useAuthStore } from "@/store/auth-store";

const schema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Enter a valid email"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Must contain at least one uppercase letter")
    .regex(/[0-9]/, "Must contain at least one number"),
  workspaceName: z
    .string()
    .min(2, "Workspace name must be at least 2 characters"),
});

type FormData = z.infer<typeof schema>;

export default function RegisterPage() {
  const router = useRouter();
  const login = useAuthStore((s) => s.login);
  const [showPw, setShowPw] = useState(false);
  const t = useTranslations("auth");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: FormData) => {
    try {
      const auth = await authApi.register(data);
      login(auth.token, auth.user, auth.refreshToken);
      toast.success(t("createTitle"));
      router.push("/dashboard");
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message ?? "Registration failed. Please try again.";
      toast.error(msg);
    }
  };

  return (
    <div className="w-full max-w-md">
      <div className="glass-panel rounded-3xl p-8 shadow-2xl">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-white mb-2">
            {t("createTitle")}
          </h1>
          <p className="text-sm text-white/40">{t("createSubtitle")}</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Name */}
          <div>
            <Label
              htmlFor="name"
              className="text-xs text-white/40 font-medium uppercase tracking-wider mb-1.5 block"
            >
              {t("fullName")}
            </Label>
            <Input
              id="name"
              type="text"
              placeholder={t("fullNamePlaceholder")}
              autoComplete="name"
              {...register("name")}
              className="bg-white/[0.05] border-white/[0.08] rounded-xl text-white placeholder:text-white/20 focus-visible:ring-indigo-500/40 focus-visible:border-indigo-500/40 h-11"
            />
            {errors.name && (
              <p className="text-xs text-red-400 mt-1.5">
                {errors.name.message}
              </p>
            )}
          </div>

          {/* Workspace name */}
          <div>
            <Label
              htmlFor="workspaceName"
              className="text-xs text-white/40 font-medium uppercase tracking-wider mb-1.5 block"
            >
              {t("workspaceName")}
            </Label>
            <Input
              id="workspaceName"
              type="text"
              placeholder={t("workspaceNamePlaceholder")}
              autoComplete="organization"
              {...register("workspaceName")}
              className="bg-white/[0.05] border-white/[0.08] rounded-xl text-white placeholder:text-white/20 focus-visible:ring-indigo-500/40 focus-visible:border-indigo-500/40 h-11"
            />
            {errors.workspaceName && (
              <p className="text-xs text-red-400 mt-1.5">
                {errors.workspaceName.message}
              </p>
            )}
          </div>

          {/* Email */}
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

          {/* Password */}
          <div>
            <Label
              htmlFor="password"
              className="text-xs text-white/40 font-medium uppercase tracking-wider mb-1.5 block"
            >
              {t("password")}
            </Label>
            <div className="relative">
              <Input
                id="password"
                type={showPw ? "text" : "password"}
                placeholder="Min. 8 chars, 1 uppercase, 1 number"
                autoComplete="new-password"
                {...register("password")}
                className="bg-white/[0.05] border-white/[0.08] rounded-xl text-white placeholder:text-white/20 focus-visible:ring-indigo-500/40 focus-visible:border-indigo-500/40 h-11 pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPw((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors"
              >
                {showPw ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
            {errors.password && (
              <p className="text-xs text-red-400 mt-1.5">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full h-11 rounded-2xl bg-linear-to-r from-indigo-500 to-violet-600 hover:from-indigo-400 hover:to-violet-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold text-sm transition-colors shadow-lg shadow-indigo-500/20 flex items-center justify-center gap-2 mt-2"
          >
            {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
            {isSubmitting ? t("registering") : t("register")}
          </button>
        </form>

        <p className="text-center text-xs text-white/20 mt-4">
          {t("registerAgree")}{" "}
          <span className="text-white/40 cursor-pointer hover:text-white/60">
            {t("terms")}
          </span>{" "}
          {t("and")}{" "}
          <span className="text-white/40 cursor-pointer hover:text-white/60">
            {t("privacy")}
          </span>
        </p>

        <p className="text-center text-sm text-white/30 mt-4">
          {t("haveAccount")}{" "}
          <Link
            href="/login"
            className="text-indigo-400 hover:text-indigo-300 font-medium transition-colors"
          >
            {t("signInLink")}
          </Link>
        </p>
      </div>
    </div>
  );
}
