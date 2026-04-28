"use client";

import { useQuery } from "@tanstack/react-query";
import {
  TrendingUp,
  FileImage,
  Users,
  Clock,
  Zap,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { AnalyticsCard } from "@/components/features/dashboard/analytics-card";
import { QuickActions } from "@/components/features/dashboard/quick-actions";
import { RecentAssets } from "@/components/features/dashboard/recent-assets";
import { useWorkspaceData } from "@/hooks/use-workspace-data";
import { useAuthStore } from "@/store/auth-store";
import { postsApi } from "@/lib/api";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";

function SkeletonCard() {
  return <div className="skeleton h-32 rounded-3xl" />;
}

export default function DashboardPage() {
  const t = useTranslations("dashboard");
  const { user } = useAuthStore();
  const { workspace, balance, health, isLoading } = useWorkspaceData();

  const { data: posts } = useQuery({
    queryKey: ["posts"],
    queryFn: () => postsApi.list(),
  });

  const firstName = user?.name?.split(" ")[0] ?? "there";
  const hour = new Date().getHours();
  const greeting =
    hour < 12
      ? t("goodMorning")
      : hour < 18
        ? t("goodAfternoon")
        : t("goodEvening");

  const scheduledCount =
    posts?.filter((p) => p.status === "SCHEDULED").length ?? 0;
  const publishedCount =
    posts?.filter((p) => p.status === "PUBLISHED").length ?? 0;

  const CARDS = [
    {
      label: t("creditsRemaining"),
      value:
        balance != null && typeof balance.credits === "number"
          ? balance.credits.toLocaleString()
          : "—",
      change: balance?.plan ?? "Growth",
      trend: "up" as const,
      icon: Zap,
      color: "text-indigo-400",
      bg: "bg-indigo-500/10",
    },
    {
      label: t("postsPublished"),
      value: String(publishedCount),
      change: `+${publishedCount}`,
      trend: "up" as const,
      icon: FileImage,
      color: "text-violet-400",
      bg: "bg-violet-500/10",
    },
    {
      label: t("scheduled"),
      value: String(scheduledCount),
      change: t("upcoming", { count: scheduledCount }),
      trend: "up" as const,
      icon: Users,
      color: "text-amber-400",
      bg: "bg-amber-500/10",
    },
    {
      label: t("hoursSaved"),
      value: posts ? `${Math.floor(posts.length * 0.75)}h` : "—",
      change: t("thisMonth"),
      trend: "up" as const,
      icon: Clock,
      color: "text-emerald-400",
      bg: "bg-emerald-500/10",
    },
  ];

  return (
    <div className="p-5 md:p-8 space-y-8 pb-24 md:pb-8">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-foreground mb-1">
            {greeting}, {firstName} 👋
          </h1>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>{workspace?.name ?? t("loadingWorkspace")}</span>
            {health && (
              <>
                <span className="text-white/20">·</span>
                <span
                  className={cn(
                    "flex items-center gap-1",
                    health.status === "ok"
                      ? "text-emerald-400"
                      : "text-amber-400",
                  )}
                >
                  {health.status === "ok" ? (
                    <CheckCircle className="w-3 h-3" />
                  ) : (
                    <AlertCircle className="w-3 h-3" />
                  )}
                  API {health.status}
                </span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Analytics grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        {isLoading
          ? Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)
          : CARDS.map((card) => <AnalyticsCard key={card.label} {...card} />)}
      </div>

      {/* Quick actions */}
      <QuickActions />

      {/* Recent assets */}
      <RecentAssets />

      {/* Upcoming posts */}
      {posts && posts.filter((p) => p.status === "SCHEDULED").length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-white/40 uppercase tracking-wider">
              {t("upcomingPosts")}
            </h2>
          </div>
          <div className="space-y-2">
            {posts
              .filter((p) => p.status === "SCHEDULED")
              .slice(0, 5)
              .map((post) => (
                <div
                  key={post.id}
                  className="flex items-center gap-4 p-4 rounded-2xl bg-card border border-border hover:bg-muted/30 transition-colors"
                >
                  {post.imageUrl && (
                    <img
                      src={post.imageUrl}
                      alt=""
                      className="w-10 h-10 rounded-xl object-cover flex-shrink-0"
                    />
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-foreground/70 font-medium truncate">
                      {post.caption}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {post.scheduledAt
                        ? new Date(post.scheduledAt).toLocaleString("en-US", {
                            month: "short",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })
                        : "—"}{" "}
                      · {post.platform}
                    </p>
                  </div>
                  <div className="px-2.5 py-1 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-medium flex-shrink-0">
                    {t("scheduledBadge")}
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
}
