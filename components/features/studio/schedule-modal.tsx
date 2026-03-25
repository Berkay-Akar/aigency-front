"use client";

import { useState, useEffect } from "react";
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

const schema = z.object({
  caption: z.string().min(1, "Açıklama gerekli"),
  hashtags: z.string(),
  platform: z.enum(["instagram", "tiktok", "facebook", "twitter"]),
  scheduledAt: z.string().min(1, "Tarih ve saat gerekli"),
});

type FormData = z.infer<typeof schema>;

const PLATFORMS = [
  { id: "instagram" as const, label: "Instagram" },
  { id: "tiktok" as const, label: "TikTok" },
  { id: "facebook" as const, label: "Facebook" },
  { id: "twitter" as const, label: "X / Twitter" },
];

interface ScheduleModalProps {
  open: boolean;
  onClose: () => void;
  imageUrl?: string;
  defaultCaption?: string;
  defaultHashtags?: string[];
  defaultPlatform?: "instagram" | "tiktok" | "facebook" | "twitter";
}

export function ScheduleModal({
  open,
  onClose,
  imageUrl,
  defaultCaption = "",
  defaultHashtags = [],
  defaultPlatform = "instagram",
}: ScheduleModalProps) {
  const queryClient = useQueryClient();
  const [selectedPlatform, setSelectedPlatform] = useState<
    "instagram" | "tiktok" | "facebook" | "twitter"
  >("instagram");

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
    mutationFn: (data: FormData) =>
      postsApi.schedule({
        caption: data.caption,
        hashtags: data.hashtags
          .split(/\s+/)
          .filter((h) => h.startsWith("#"))
          .concat(
            data.hashtags
              .split(/\s+/)
              .filter((h) => !h.startsWith("#") && h.length > 0)
              .map((h) => `#${h}`)
          ),
        platform: data.platform,
        scheduledAt: new Date(data.scheduledAt).toISOString(),
        imageUrl,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      queryClient.invalidateQueries({ queryKey: ["calendar"] });
      toast.success("Gönderi planlandı.");
      reset();
      onClose();
    },
    onError: () => {
      toast.error("Planlama başarısız. Tekrar deneyin.");
    },
  });

  const handlePlatformSelect = (
    p: "instagram" | "tiktok" | "facebook" | "twitter"
  ) => {
    setSelectedPlatform(p);
    setValue("platform", p);
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="bg-[#111] border-white/[0.08] rounded-3xl max-w-md p-0 overflow-hidden shadow-2xl">
        <DialogHeader className="px-6 pt-6 pb-0">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-base font-semibold text-white flex items-center gap-2">
              <CalendarPlus className="w-4 h-4 text-indigo-400" />
              Gönderi planla
            </DialogTitle>
            <button
              onClick={onClose}
              className="w-7 h-7 rounded-xl flex items-center justify-center text-white/30 hover:text-white hover:bg-white/[0.08] transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit((d) => mutation.mutate(d))}>
          <div className="px-6 pb-6 space-y-4 mt-4">
            {/* Preview */}
            {imageUrl && (
              <div className="flex items-center gap-3 p-3 rounded-2xl bg-white/[0.03] border border-white/[0.06]">
                <img
                  src={imageUrl}
                  alt=""
                  className="w-14 h-14 rounded-xl object-cover flex-shrink-0"
                />
                <p className="text-xs text-white/40">
                  Görsel bu gönderiye eklenecek
                </p>
              </div>
            )}

            {/* Caption */}
            <div>
              <label className="text-xs text-white/40 font-medium uppercase tracking-wider mb-1.5 block">
                Açıklama
              </label>
              <Textarea
                {...register("caption")}
                rows={3}
                placeholder="Gönderi metninizi yazın…"
                className="bg-white/[0.04] border-white/[0.08] rounded-xl text-white text-sm resize-none placeholder:text-white/20 focus-visible:ring-indigo-500/30 focus-visible:border-indigo-500/30"
              />
              {errors.caption && (
                <p className="text-xs text-red-400 mt-1">
                  {errors.caption.message}
                </p>
              )}
            </div>

            {/* Hashtags */}
            <div>
              <label className="text-xs text-white/40 font-medium uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                <Hash className="w-3 h-3" />
                Etiketler
              </label>
              <Input
                {...register("hashtags")}
                placeholder="#luxury #style #brand"
                className="bg-white/[0.04] border-white/[0.08] rounded-xl text-white placeholder:text-white/20 focus-visible:ring-indigo-500/30 focus-visible:border-indigo-500/30"
              />
            </div>

            {/* Platform */}
            <div>
              <label className="text-xs text-white/40 font-medium uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Instagram className="w-3 h-3" />
                Platform
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
                        : "border-white/[0.08] bg-white/[0.03] text-white/40 hover:text-white/70"
                    )}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* Schedule time */}
            <div>
              <label className="text-xs text-white/40 font-medium uppercase tracking-wider mb-1.5 block">
                Tarih ve saat
              </label>
              <Input
                type="datetime-local"
                {...register("scheduledAt")}
                className="bg-white/[0.04] border-white/[0.08] rounded-xl text-white focus-visible:ring-indigo-500/30 focus-visible:border-indigo-500/30"
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
                className="flex-1 py-2.5 rounded-2xl border border-white/[0.08] text-white/50 hover:text-white text-sm font-medium transition-colors"
              >
                Vazgeç
              </button>
              <button
                type="submit"
                disabled={mutation.isPending}
                className="flex-1 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-sm font-medium transition-colors flex items-center justify-center gap-2"
              >
                {mutation.isPending && (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                )}
                {mutation.isPending ? "Planlanıyor…" : "Planla"}
              </button>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
