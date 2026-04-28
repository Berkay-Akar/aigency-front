"use client";

import { useState } from "react";
import { X, Instagram, Clock, Calendar } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";
import type { Post } from "./post-card";

interface EditModalProps {
  post: Post | null;
  open: boolean;
  onClose: () => void;
}

const PLATFORMS = [
  {
    id: "instagram",
    label: "Instagram",
    color: "text-pink-400 bg-pink-500/10 border-pink-500/30",
  },
  {
    id: "tiktok",
    label: "TikTok",
    color: "text-white bg-white/10 border-white/20",
  },
  {
    id: "facebook",
    label: "Facebook",
    color: "text-blue-400 bg-blue-500/10 border-blue-500/30",
  },
];

export function EditModal({ post, open, onClose }: EditModalProps) {
  const t = useTranslations("editModal");
  const [caption, setCaption] = useState(post?.caption ?? "");
  const [time, setTime] = useState(post?.time ?? "");
  const [platform, setPlatform] = useState(post?.platform ?? "instagram");

  if (!post) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="bg-card border-border rounded-3xl max-w-md p-0 overflow-hidden shadow-2xl">
        <DialogHeader className="p-6 pb-0">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-base font-semibold text-foreground">
              {t("title")}
            </DialogTitle>
            <button
              onClick={onClose}
              className="w-7 h-7 rounded-xl flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-white/[0.08] transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </DialogHeader>

        <div className="p-6 space-y-5">
          {/* Preview */}
          <div className="flex items-center gap-3 p-3 rounded-2xl bg-white/[0.03] border border-white/[0.06]">
            <img
              src={post.imageUrl}
              alt=""
              className="w-14 h-14 rounded-xl object-cover"
            />
            <div>
              <p className="text-xs text-muted-foreground mb-1 capitalize">
                {post.platform}
              </p>
              <p className="text-sm text-foreground/70 font-medium">
                {post.time}
              </p>
            </div>
          </div>

          {/* Caption */}
          <div>
            <label className="text-xs text-muted-foreground font-medium uppercase tracking-wider mb-1.5 block">
              {t("captionLabel")}
            </label>
            <Textarea
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              rows={4}
              className="bg-white/[0.04] border-white/[0.08] rounded-2xl text-foreground text-sm resize-none focus-visible:ring-indigo-500/30 focus-visible:border-indigo-500/30"
            />
          </div>

          {/* Time */}
          <div>
            <label className="text-xs text-muted-foreground font-medium uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
              <Clock className="w-3 h-3" />
              {t("timeLabel")}
            </label>
            <Input
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="bg-white/[0.04] border-white/[0.08] rounded-xl text-foreground focus-visible:ring-indigo-500/30 focus-visible:border-indigo-500/30"
            />
          </div>

          {/* Platform */}
          <div>
            <label className="text-xs text-muted-foreground font-medium uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Calendar className="w-3 h-3" />
              {t("platformLabel")}
            </label>
            <div className="flex gap-2">
              {PLATFORMS.map(({ id, label, color }) => (
                <button
                  key={id}
                  onClick={() => setPlatform(id)}
                  className={cn(
                    "flex-1 py-2 px-3 rounded-xl border text-xs font-medium transition-all",
                    platform === id
                      ? color
                      : "border-white/[0.08] bg-white/[0.03] text-muted-foreground hover:text-foreground/60",
                  )}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <Button
              variant="ghost"
              onClick={onClose}
              className="flex-1 rounded-2xl border border-border text-muted-foreground hover:text-foreground hover:bg-white/[0.06]"
            >
              {t("cancel")}
            </Button>
            <Button
              onClick={onClose}
              className="flex-1 rounded-2xl bg-linear-to-r from-indigo-500 to-violet-600 hover:from-indigo-400 hover:to-violet-500 text-white font-medium shadow-lg shadow-indigo-500/20"
            >
              {t("save")}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
