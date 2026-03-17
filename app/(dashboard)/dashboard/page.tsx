import {
  TrendingUp,
  FileImage,
  Users,
  Clock,
} from "lucide-react";
import { AnalyticsCard } from "@/components/features/dashboard/analytics-card";
import { QuickActions } from "@/components/features/dashboard/quick-actions";
import { RecentAssets } from "@/components/features/dashboard/recent-assets";
import { ANALYTICS } from "@/lib/mock-data";

const CARDS = [
  {
    label: "Engagement Rate",
    value: ANALYTICS.engagement.value,
    change: ANALYTICS.engagement.change,
    trend: "up" as const,
    icon: TrendingUp,
    color: "text-indigo-400",
    bg: "bg-indigo-500/10",
  },
  {
    label: "Posts Published",
    value: ANALYTICS.posts.value,
    change: ANALYTICS.posts.change,
    trend: "up" as const,
    icon: FileImage,
    color: "text-violet-400",
    bg: "bg-violet-500/10",
  },
  {
    label: "Total Reach",
    value: ANALYTICS.reach.value,
    change: ANALYTICS.reach.change,
    trend: "up" as const,
    icon: Users,
    color: "text-amber-400",
    bg: "bg-amber-500/10",
  },
  {
    label: "Hours Saved",
    value: ANALYTICS.savedHours.value,
    change: ANALYTICS.savedHours.change,
    trend: "up" as const,
    icon: Clock,
    color: "text-emerald-400",
    bg: "bg-emerald-500/10",
  },
];

export default function DashboardPage() {
  return (
    <div className="p-8 space-y-10 max-w-7xl">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white mb-1">
          Good morning 👋
        </h1>
        <p className="text-white/40 text-sm">
          Here&apos;s what&apos;s happening with your brand this week.
        </p>
      </div>

      {/* Analytics grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {CARDS.map((card) => (
          <AnalyticsCard key={card.label} {...card} />
        ))}
      </div>

      {/* Quick actions */}
      <QuickActions />

      {/* Recent assets */}
      <RecentAssets />

      {/* Upcoming posts */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold text-white/40 uppercase tracking-wider">
            Upcoming Posts
          </h2>
        </div>
        <div className="space-y-2">
          {[
            {
              time: "Today, 9:00 AM",
              platform: "Instagram",
              caption: "Luxury timepiece that defines moments. ✨",
              img: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=80&h=80&fit=crop",
            },
            {
              time: "Today, 6:00 PM",
              platform: "TikTok",
              caption: "Performance meets style. 👟",
              img: "https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=80&h=80&fit=crop",
            },
            {
              time: "Tomorrow, 12:00 PM",
              platform: "Facebook",
              caption: "Your wardrobe, reimagined.",
              img: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=80&h=80&fit=crop",
            },
          ].map((post, i) => (
            <div
              key={i}
              className="flex items-center gap-4 p-4 rounded-2xl bg-white/[0.02] border border-white/[0.06] hover:bg-white/[0.04] transition-colors group"
            >
              <img
                src={post.img}
                alt=""
                className="w-10 h-10 rounded-xl object-cover flex-shrink-0"
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm text-white/70 font-medium truncate">
                  {post.caption}
                </p>
                <p className="text-xs text-white/30 mt-0.5">
                  {post.time} · {post.platform}
                </p>
              </div>
              <div className="px-2.5 py-1 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-medium flex-shrink-0">
                Scheduled
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
