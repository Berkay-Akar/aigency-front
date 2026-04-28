"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Trash2,
  CalendarPlus,
  FileText,
  CheckCircle,
  Clock,
  AlertCircle,
  Send,
  Plus,
  Filter,
} from "lucide-react";
import { toast } from "sonner";
import { useTranslations } from "next-intl";
import { postsApi, type Post, type PostStatus } from "@/lib/api";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import Link from "next/link";

const STATUS_CONFIG: Record<
  PostStatus,
  { label: string; color: string; bg: string; icon: React.ElementType }
> = {
  DRAFT: {
    label: "Draft",
    color: "text-white/50",
    bg: "bg-white/[0.06]",
    icon: FileText,
  },
  SCHEDULED: {
    label: "Scheduled",
    color: "text-amber-400",
    bg: "bg-amber-500/10",
    icon: Clock,
  },
  PUBLISHED: {
    label: "Published",
    color: "text-emerald-400",
    bg: "bg-emerald-500/10",
    icon: CheckCircle,
  },
  FAILED: {
    label: "Failed",
    color: "text-red-400",
    bg: "bg-red-500/10",
    icon: AlertCircle,
  },
};

const PLATFORM_COLORS: Record<string, string> = {
  instagram: "bg-gradient-to-br from-pink-600 to-orange-500",
  tiktok: "bg-zinc-800",
  facebook: "bg-blue-700",
  twitter: "bg-zinc-900",
};

function PostRow({
  post,
  onDelete,
}: {
  post: Post;
  onDelete: (id: string) => void;
}) {
  const t = useTranslations("posts");
  const cfg = STATUS_CONFIG[post.status];
  const Icon = cfg.icon;
  const statusLabel =
    post.status === "DRAFT"
      ? t("statusDraft")
      : post.status === "SCHEDULED"
        ? t("statusScheduled")
        : post.status === "PUBLISHED"
          ? t("statusPublished")
          : t("statusFailed");

  return (
    <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/[0.02] border border-white/[0.06] hover:bg-white/[0.04] transition-colors group">
      {/* Image */}
      {post.imageUrl ? (
        <img
          src={post.imageUrl}
          alt=""
          className="w-12 h-12 rounded-xl object-cover flex-shrink-0"
        />
      ) : (
        <div className="w-12 h-12 rounded-xl bg-white/[0.05] flex items-center justify-center flex-shrink-0">
          <FileText className="w-5 h-5 text-white/20" />
        </div>
      )}

      {/* Caption */}
      <div className="flex-1 min-w-0">
        <p className="text-sm text-white/80 font-medium truncate mb-1">
          {post.caption}
        </p>
        <div className="flex items-center gap-2 flex-wrap">
          {/* Platform badge */}
          <span
            className={cn(
              "w-4 h-4 rounded flex-shrink-0 inline-block",
              PLATFORM_COLORS[post.platform] ?? "bg-white/10",
            )}
          />
          <span className="text-xs text-white/30 capitalize">
            {post.platform}
          </span>
          {post.scheduledAt && (
            <>
              <span className="text-white/20">·</span>
              <span className="text-xs text-white/30">
                {new Date(post.scheduledAt).toLocaleString("en-US", {
                  month: "short",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </>
          )}
        </div>
      </div>

      {/* Status badge */}
      <div
        className={cn(
          "flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-medium flex-shrink-0",
          cfg.bg,
          cfg.color,
        )}
      >
        <Icon className="w-3 h-3" />
        {statusLabel}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
        <Link
          href="/calendar"
          className="w-7 h-7 rounded-lg bg-white/[0.05] flex items-center justify-center text-white/40 hover:text-white hover:bg-white/[0.1] transition-colors"
          title={t("viewInCalendar")}
        >
          <CalendarPlus className="w-3.5 h-3.5" />
        </Link>
        <button
          onClick={() => onDelete(post.id)}
          className="w-7 h-7 rounded-lg bg-white/[0.05] flex items-center justify-center text-white/40 hover:text-red-400 hover:bg-red-500/10 transition-colors"
          title={t("delete")}
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}

export default function PostsPage() {
  const t = useTranslations("posts");
  const queryClient = useQueryClient();
  const [filterStatus, setFilterStatus] = useState<PostStatus | "ALL">("ALL");
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);

  const { data: posts, isLoading } = useQuery({
    queryKey: ["posts"],
    queryFn: () => postsApi.list(),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => postsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      toast.success(t("postDeleted"));
      setDeleteTarget(null);
    },
    onError: () => {
      toast.error(t("deleteFailed"));
      setDeleteTarget(null);
    },
  });

  const filtered = posts?.filter(
    (p) => filterStatus === "ALL" || p.status === filterStatus,
  );

  const counts = posts
    ? {
        ALL: posts.length,
        DRAFT: posts.filter((p) => p.status === "DRAFT").length,
        SCHEDULED: posts.filter((p) => p.status === "SCHEDULED").length,
        PUBLISHED: posts.filter((p) => p.status === "PUBLISHED").length,
        FAILED: posts.filter((p) => p.status === "FAILED").length,
      }
    : null;

  return (
    <div className="p-5 md:p-8 pb-24 md:pb-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-white mb-0.5">{t("title")}</h1>
          <p className="text-sm text-white/30">
            {t("totalPosts", { count: posts?.length ?? 0 })}
          </p>
        </div>
        <Link
          href="/studio"
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-linear-to-r from-indigo-500 to-violet-600 hover:from-indigo-400 hover:to-violet-500 text-white text-sm font-medium transition-colors shadow-lg shadow-indigo-500/20"
        >
          <Plus className="w-4 h-4" />
          <span className="hidden sm:inline">{t("createPost")}</span>
        </Link>
      </div>

      {/* Status filter tabs */}
      <div className="flex items-center gap-1.5 mb-6 overflow-x-auto pb-1">
        <Filter className="w-3.5 h-3.5 text-white/20 flex-shrink-0 mr-1" />
        {(["ALL", "DRAFT", "SCHEDULED", "PUBLISHED", "FAILED"] as const).map(
          (status) => {
            const active = filterStatus === status;
            const cfg =
              status === "ALL" ? null : STATUS_CONFIG[status as PostStatus];
            return (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={cn(
                  "flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-colors",
                  active
                    ? "bg-linear-to-r from-indigo-500 to-violet-600 text-white"
                    : "bg-white/[0.05] text-white/40 hover:text-white/70",
                )}
              >
                {cfg && <cfg.icon className="w-3 h-3" />}
                {status === "ALL"
                  ? t("all")
                  : status === "DRAFT"
                    ? t("statusDraft")
                    : status === "SCHEDULED"
                      ? t("statusScheduled")
                      : status === "PUBLISHED"
                        ? t("statusPublished")
                        : t("statusFailed")}
                {counts && (
                  <span
                    className={cn(
                      "text-[10px]",
                      active ? "text-white/70" : "text-white/20",
                    )}
                  >
                    {counts[status]}
                  </span>
                )}
              </button>
            );
          },
        )}
      </div>

      {/* Posts list */}
      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="skeleton h-20 rounded-2xl" />
          ))}
        </div>
      ) : filtered && filtered.length > 0 ? (
        <div className="space-y-2">
          {filtered.map((post) => (
            <PostRow
              key={post.id}
              post={post}
              onDelete={(id) => setDeleteTarget(id)}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="w-14 h-14 rounded-2xl bg-white/[0.04] flex items-center justify-center mb-4">
            <Send className="w-6 h-6 text-white/20" />
          </div>
          <p className="text-white/30 text-sm font-medium mb-1">
            {filterStatus === "ALL"
              ? t("noPostsYet")
              : t("noStatusPosts", { status: filterStatus.toLowerCase() })}
          </p>
          <p className="text-white/20 text-xs mb-6">{t("generateInStudio")}</p>
          <Link
            href="/studio"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-linear-to-r from-indigo-500 to-violet-600 hover:from-indigo-400 hover:to-violet-500 text-white text-sm font-medium transition-colors"
          >
            <Plus className="w-4 h-4" />
            {t("goToStudio")}
          </Link>
        </div>
      )}

      {/* Delete confirm dialog */}
      <Dialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
      >
        <DialogContent className="bg-[#111] border-white/[0.08] rounded-3xl max-w-sm p-6">
          <DialogHeader>
            <DialogTitle className="text-base font-semibold text-white">
              {t("deleteTitle")}
            </DialogTitle>
          </DialogHeader>
          <p className="text-sm text-white/40 mt-2">{t("deleteDesc")}</p>
          <div className="flex gap-3 mt-6">
            <button
              onClick={() => setDeleteTarget(null)}
              className="flex-1 py-2.5 rounded-2xl border border-white/[0.08] text-white/50 hover:text-white text-sm font-medium transition-colors"
            >
              {t("cancel")}
            </button>
            <button
              onClick={() =>
                deleteTarget && deleteMutation.mutate(deleteTarget)
              }
              disabled={deleteMutation.isPending}
              className="flex-1 py-2.5 rounded-2xl bg-red-600 hover:bg-red-500 disabled:opacity-50 text-white text-sm font-medium transition-colors"
            >
              {deleteMutation.isPending ? "Deleting…" : "Delete"}
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
