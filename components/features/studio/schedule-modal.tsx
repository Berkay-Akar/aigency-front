"use client";

import { useState, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { Loader2, X, CalendarPlus, Hash, Instagram } from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { postsApi } from "@/lib/api";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";

// Base schema used only for type inference — messages are injected at runtime.
const _baseSchema = z.object({
  caption: z.string().min(1),
  hashtags: z.string(),
  platform: z.enum(["instagram", "tiktok"]),
  scheduledAt: z.string().min(1),
});
type FormData = z.infer<typeof _baseSchema>;

const PLATFORMS = [
  { id: "instagram" as const, label: "Instagram" },
  { id: "tiktok" as const, label: "TikTok" },
];

interface ScheduleModalProps {
  open: boolean;
  onClose: () => void;
  /** Required by API — generated asset id from Studio. */
  assetId?: string;
  imageUrl?: string;
  defaultCaption?: string;
  defaultHashtags?: string[];
  defaultPlatform?: "instagram" | "tiktok";
}

export function ScheduleModal({
  open,
  onClose,
  assetId,
  imageUrl,
  defaultCaption = "",
  defaultHashtags = [],
  defaultPlatform = "instagram",
}: ScheduleModalProps) {
  const queryClient = useQueryClient();
  const t = useTranslations("scheduleModal");
  const tStudio = useTranslations("studio");
  const tCommon = useTranslations("common");
  const [selectedPlatform, setSelectedPlatform] = useState<
    "instagram" | "tiktok"
  >("instagram");

  // Schema is built inside the component so zod validation messages are i18n-aware.
  const schema = useMemo(
    () =>
      z.object({
        caption: z.string().min(1, t("captionRequired")),
        hashtags: z.string(),
        platform: z.enum(["instagram", "tiktok"]),
        scheduledAt: z.string().min(1, t("dateRequired")),
      }),
    [t],
  );

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      caption: defaultCaption,
      hashtags: defaultHashtags.join(" "),
      platform: "instagram",
      scheduledAt: "",
    },
  });

  const mutation = useMutation({
    mutationFn: (data: FormData) => {
      if (!assetId) {
        toast.error(t("missingAssetError"));
        return Promise.reject(new Error("Missing assetId"));
      }
      const hashtags = data.hashtags
        .split(/\s+/)
        .filter((h) => h.startsWith("#"))
        .concat(
          data.hashtags
            .split(/\s+/)
            .filter((h) => !h.startsWith("#") && h.length > 0)
            .map((h) => `#${h}`),
        );
      return postsApi.schedule({
        assetId,
        caption: data.caption,
        hashtags,
        platform: data.platform === "instagram" ? "INSTAGRAM" : "TIKTOK",
        scheduledAt: new Date(data.scheduledAt).toISOString(),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      queryClient.invalidateQueries({ queryKey: ["calendar"] });
      toast.success(t("success"));
      reset();
      onClose();
    },
    onError: () => {
      toast.error(t("error"));
    },
  });

  const handlePlatformSelect = (p: "instagram" | "tiktok") => {
    setSelectedPlatform(p);
    setValue("platform", p);
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="dark:bg-[#111] bg-background border-border rounded-3xl max-w-md p-0 overflow-hidden shadow-2xl">
        <DialogHeader className="px-6 pt-6 pb-0">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-base font-semibold text-foreground flex items-center gap-2">
              <CalendarPlus className="w-4 h-4 text-indigo-400" />
              {tStudio("schedulePost")}
            </DialogTitle>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit((d) => mutation.mutate(d))}>
          <div className="px-6 pb-6 space-y-4 mt-4">
            {/* Preview */}
            {!assetId && (
              <p className="text-xs text-amber-400/90 rounded-2xl border border-amber-500/25 bg-amber-500/10 px-3 py-2">
                {t("noAssetWarning")}
              </p>
            )}
            {imageUrl && (
              <div className="flex items-center gap-3 p-3 rounded-2xl bg-muted/30 border border-border">
                <img
                  src={imageUrl}
                  alt=""
                  className="w-14 h-14 rounded-xl object-cover shrink-0"
                />
                <p className="text-xs text-muted-foreground">
                  {t("imageAttached")}
                </p>
              </div>
            )}

            {/* Caption */}
            <div>
              <label className="text-xs text-muted-foreground font-medium uppercase tracking-wider mb-1.5 block">
                {t("captionLabel")}
              </label>
              <Textarea
                {...register("caption")}
                rows={3}
                placeholder={t("captionPlaceholder")}
                className="bg-foreground/4 border-border rounded-xl text-foreground text-sm resize-none placeholder:text-foreground/30 focus-visible:ring-indigo-500/30 focus-visible:border-indigo-500/30"
              />
              {errors.caption && (
                <p className="text-xs text-red-400 mt-1">
                  {errors.caption.message}
                </p>
              )}
            </div>

            {/* Hashtags */}
            <div>
              <label className="text-xs text-muted-foreground font-medium uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                <Hash className="w-3 h-3" />
                {t("hashtagsLabel")}
              </label>
              <Input
                {...register("hashtags")}
                placeholder={t("hashtagsPlaceholder")}
                className="bg-foreground/4 border-border rounded-xl text-foreground placeholder:text-foreground/30 focus-visible:ring-indigo-500/30 focus-visible:border-indigo-500/30"
              />
            </div>

            {/* Platform */}
            <div>
              <label className="text-xs text-muted-foreground font-medium uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Instagram className="w-3 h-3" />
                {t("platformLabel")}
              </label>
              <div className="grid grid-cols-2 gap-2">
                {PLATFORMS.map(({ id, label }) => (
                  <button
                    key={id}
                    type="button"
                    onClick={() => handlePlatformSelect(id)}
                    className={cn(
                      "py-2 px-3 rounded-xl border text-xs font-medium transition-all",
                      selectedPlatform === id
                        ? "bg-indigo-500/20 border-indigo-500/40 text-indigo-300"
                        : "border-border bg-foreground/3 text-foreground/40 hover:text-foreground/70",
                    )}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* Schedule time */}
            <div>
              <label className="text-xs text-muted-foreground font-medium uppercase tracking-wider mb-1.5 block">
                {t("dateLabel")}
              </label>
              <Input
                type="datetime-local"
                {...register("scheduledAt")}
                className="bg-foreground/4 border-border rounded-xl text-foreground focus-visible:ring-indigo-500/30 focus-visible:border-indigo-500/30"
              />
              {errors.scheduledAt && (
                <p className="text-xs text-red-400 mt-1">
                  {errors.scheduledAt.message}
                </p>
              )}
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-2.5 rounded-2xl border border-border text-foreground/50 hover:text-foreground text-sm font-medium transition-colors"
              >
                {tCommon("cancel")}
              </button>
              <button
                type="submit"
                disabled={mutation.isPending || !assetId}
                className="flex-1 py-2.5 rounded-2xl bg-linear-to-r from-indigo-500 to-violet-600 hover:from-indigo-400 hover:to-violet-500 disabled:opacity-50 text-white text-sm font-medium transition-colors flex items-center justify-center gap-2"
              >
                {mutation.isPending && (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                )}
                {mutation.isPending ? t("scheduling") : t("submit")}
              </button>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
