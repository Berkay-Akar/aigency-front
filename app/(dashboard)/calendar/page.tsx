"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  CalendarDays,
  List,
} from "lucide-react";
import { postsApi, type Post } from "@/lib/api";
import { PostCard } from "@/components/features/calendar/post-card";
import { EditModal } from "@/components/features/calendar/edit-modal";
import { ScheduleModal } from "@/components/features/studio/schedule-modal";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";
import { ApprovalPanel } from "@/components/features/calendar/approval-panel";

const DAY_KEYS = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"] as const;
const MONTH_KEYS = [
  "january",
  "february",
  "march",
  "april",
  "may",
  "june",
  "july",
  "august",
  "september",
  "october",
  "november",
  "december",
] as const;

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year: number, month: number) {
  return new Date(year, month, 1).getDay();
}

export default function CalendarPage() {
  const t = useTranslations("calendar");
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());
  const [view, setView] = useState<"month" | "week">("month");
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [editOpen, setEditOpen] = useState(false);
  const [scheduleOpen, setScheduleOpen] = useState(false);

  // Date range for the current month view
  const from = new Date(year, month, 1).toISOString();
  const to = new Date(year, month + 1, 0, 23, 59, 59).toISOString();

  const { data: posts, isLoading } = useQuery({
    queryKey: ["calendar", year, month],
    queryFn: () => postsApi.calendar(from, to),
  });

  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);
  const totalCells = Math.ceil((firstDay + daysInMonth) / 7) * 7;

  const prevMonth = () => {
    if (month === 0) {
      setMonth(11);
      setYear((y) => y - 1);
    } else setMonth((m) => m - 1);
  };

  const nextMonth = () => {
    if (month === 11) {
      setMonth(0);
      setYear((y) => y + 1);
    } else setMonth((m) => m + 1);
  };

  const getPostsForDay = (day: number) =>
    (posts ?? []).filter((p) => {
      const d = new Date(p.scheduledAt ?? p.createdAt);
      return (
        d.getFullYear() === year &&
        d.getMonth() === month &&
        d.getDate() === day
      );
    });

  const calendarPost = selectedPost
    ? {
        id: selectedPost.id,
        date: new Date(selectedPost.scheduledAt ?? selectedPost.createdAt),
        time: selectedPost.scheduledAt
          ? new Date(selectedPost.scheduledAt).toLocaleTimeString("en-US", {
              hour: "2-digit",
              minute: "2-digit",
              hour12: false,
            })
          : "--:--",
        platform: selectedPost.platform,
        caption: selectedPost.caption,
        imageUrl: selectedPost.imageUrl ?? "",
        status: (selectedPost.status === "SCHEDULED"
          ? "scheduled"
          : selectedPost.status === "PUBLISHED"
            ? "published"
            : "draft") as "scheduled" | "published" | "draft",
      }
    : null;

  return (
    <div className="flex flex-col h-full p-4 md:p-6 pb-24 md:pb-6">
      {/* ── Global header ──────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="text-xl font-bold text-foreground mb-0.5">
            {t("title")}
          </h1>
          <p className="text-sm text-muted-foreground">
            {isLoading
              ? t("loading")
              : t("postsScheduled", { count: posts?.length ?? 0 })}
          </p>
        </div>

        <div className="flex items-center gap-2 md:gap-3">
          {/* View toggle */}
          <div className="hidden sm:flex items-center gap-1 p-1 rounded-xl bg-foreground/5 border border-border">
            <button
              onClick={() => setView("month")}
              className={cn(
                "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors",
                view === "month"
                  ? "bg-foreground/10 text-foreground"
                  : "text-foreground/40 hover:text-foreground/60",
              )}
            >
              <CalendarDays className="w-3.5 h-3.5" />
              {t("month")}
            </button>
            <button
              onClick={() => setView("week")}
              className={cn(
                "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors",
                view === "week"
                  ? "bg-foreground/10 text-foreground"
                  : "text-foreground/40 hover:text-foreground/60",
              )}
            >
              <List className="w-3.5 h-3.5" />
              {t("week")}
            </button>
          </div>

          <button
            onClick={() => setScheduleOpen(true)}
            className="flex items-center gap-1.5 px-3 md:px-4 py-2 rounded-xl bg-linear-to-r from-indigo-500 to-violet-600 hover:from-indigo-400 hover:to-violet-500 text-white text-sm font-medium transition-colors shadow-lg shadow-indigo-500/20"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">{t("schedulePost")}</span>
          </button>
        </div>
      </div>

      {/* ── Two-column body ─────────────────────────────────────────────────
           • Left  : calendar (always visible, flex-1)
           • Right : ApprovalPanel (≥xl only, fixed width)
      ──────────────────────────────────────────────────────────────────────── */}
      <div className="flex flex-1 gap-6 overflow-hidden min-h-0">
        {/* ── LEFT — calendar column ─────────────────────────────────────── */}
        <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
          {/* Month nav */}
          <div className="flex items-center gap-3 mb-4">
            <button
              onClick={prevMonth}
              className="w-8 h-8 rounded-xl flex items-center justify-center text-foreground/40 hover:text-foreground hover:bg-foreground/8 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <h2 className="text-base font-semibold text-foreground min-w-36 text-center">
              {t(MONTH_KEYS[month])} {year}
            </h2>
            <button
              onClick={nextMonth}
              className="w-8 h-8 rounded-xl flex items-center justify-center text-foreground/40 hover:text-foreground hover:bg-foreground/8 transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Calendar grid */}
          <div className="flex-1 overflow-hidden flex flex-col">
            {/* Day headers */}
            <div className="grid grid-cols-7 mb-2">
              {DAY_KEYS.map((key) => (
                <div
                  key={key}
                  className="text-center text-xs font-medium text-muted-foreground py-2"
                >
                  {t(key)}
                </div>
              ))}
            </div>

            {/* Cells */}
            <div className="grid grid-cols-7 flex-1 gap-1">
              {Array.from({ length: totalCells }).map((_, idx) => {
                const dayNum = idx - firstDay + 1;
                const isValidDay = dayNum >= 1 && dayNum <= daysInMonth;
                const isToday =
                  isValidDay &&
                  year === today.getFullYear() &&
                  month === today.getMonth() &&
                  dayNum === today.getDate();
                const dayPosts = isValidDay ? getPostsForDay(dayNum) : [];

                return (
                  <div
                    key={idx}
                    className={cn(
                      "p-1.5 md:p-2 rounded-2xl border min-h-17.5 md:min-h-22.5 transition-colors",
                      isValidDay
                        ? "border-border bg-transparent hover:bg-foreground/2"
                        : "border-transparent",
                      isToday && "border-indigo-500/30 bg-indigo-500/5",
                    )}
                  >
                    {isValidDay && (
                      <>
                        <span
                          className={cn(
                            "text-xs font-medium block mb-1",
                            isToday
                              ? "text-indigo-400"
                              : "text-muted-foreground",
                          )}
                        >
                          {dayNum}
                        </span>

                        {/* Loading skeletons */}
                        {isLoading && dayNum <= 7 && (
                          <div className="skeleton h-6 rounded-lg" />
                        )}

                        <div className="space-y-1">
                          {dayPosts.slice(0, 2).map((post) => {
                            const cardStatus:
                              | "scheduled"
                              | "published"
                              | "draft" =
                              post.status === "SCHEDULED"
                                ? "scheduled"
                                : post.status === "PUBLISHED"
                                  ? "published"
                                  : "draft";
                            const cardPost = {
                              id: post.id,
                              date: new Date(
                                post.scheduledAt ?? post.createdAt,
                              ),
                              time: post.scheduledAt
                                ? new Date(post.scheduledAt).toLocaleTimeString(
                                    "en-US",
                                    {
                                      hour: "2-digit",
                                      minute: "2-digit",
                                      hour12: false,
                                    },
                                  )
                                : "--:--",
                              platform: post.platform,
                              caption: post.caption,
                              imageUrl: post.imageUrl ?? "",
                              status: cardStatus,
                            };
                            return (
                              <PostCard
                                key={post.id}
                                post={cardPost}
                                onClick={() => {
                                  setSelectedPost(post);
                                  setEditOpen(true);
                                }}
                              />
                            );
                          })}
                          {dayPosts.length > 2 && (
                            <p className="text-[9px] text-white/30 pl-1">
                              {t("more", { count: dayPosts.length - 2 })}
                            </p>
                          )}
                        </div>
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Legend */}
          <div className="hidden md:flex items-center gap-6 mt-4 pt-4 border-t border-white/6">
            {[
              { labelKey: "legendScheduled", color: "bg-indigo-500/50" },
              { labelKey: "legendDraft", color: "bg-white/20" },
              { labelKey: "legendPublished", color: "bg-emerald-500/50" },
            ].map(({ labelKey, color }) => (
              <div key={labelKey} className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${color}`} />
                <span className="text-xs text-white/30">{t(labelKey)}</span>
              </div>
            ))}
          </div>

          {/* Compact approval banner — visible only below xl */}
          <div className="xl:hidden mt-4">
            <ApprovalPanel posts={posts ?? []} compact />
          </div>
        </div>
        {/* /LEFT */}

        {/* ── RIGHT — Approval panel (≥xl) ──────────────────────────────── */}
        <div className="hidden xl:flex flex-col w-75 2xl:w-85 shrink-0 overflow-y-auto">
          <ApprovalPanel posts={posts ?? []} />
        </div>
      </div>
      {/* /two-column body */}

      {/* Edit modal */}
      {calendarPost && (
        <EditModal
          post={calendarPost}
          open={editOpen}
          onClose={() => setEditOpen(false)}
        />
      )}

      {/* Schedule modal */}
      <ScheduleModal
        open={scheduleOpen}
        onClose={() => setScheduleOpen(false)}
      />
    </div>
  );
}
