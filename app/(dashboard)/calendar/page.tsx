"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { ChevronLeft, ChevronRight, Plus, CalendarDays, List } from "lucide-react";
import { postsApi, type Post } from "@/lib/api";
import { PostCard } from "@/components/features/calendar/post-card";
import { EditModal } from "@/components/features/calendar/edit-modal";
import { ScheduleModal } from "@/components/features/studio/schedule-modal";
import { cn } from "@/lib/utils";

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December",
];

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year: number, month: number) {
  return new Date(year, month, 1).getDay();
}

export default function CalendarPage() {
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
    queryFn: () => postsApi.calendar(from, to).then((r) => r.data),
  });

  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);
  const totalCells = Math.ceil((firstDay + daysInMonth) / 7) * 7;

  const prevMonth = () => {
    if (month === 0) { setMonth(11); setYear((y) => y - 1); }
    else setMonth((m) => m - 1);
  };

  const nextMonth = () => {
    if (month === 11) { setMonth(0); setYear((y) => y + 1); }
    else setMonth((m) => m + 1);
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
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="text-xl font-bold text-white mb-0.5">Calendar</h1>
          <p className="text-sm text-white/30">
            {isLoading ? "Loading…" : `${posts?.length ?? 0} posts scheduled`}
          </p>
        </div>

        <div className="flex items-center gap-2 md:gap-3">
          {/* View toggle */}
          <div className="hidden sm:flex items-center gap-1 p-1 rounded-xl bg-white/[0.05] border border-white/[0.08]">
            <button
              onClick={() => setView("month")}
              className={cn(
                "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors",
                view === "month" ? "bg-white/10 text-white" : "text-white/30 hover:text-white/60"
              )}
            >
              <CalendarDays className="w-3.5 h-3.5" />
              Month
            </button>
            <button
              onClick={() => setView("week")}
              className={cn(
                "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors",
                view === "week" ? "bg-white/10 text-white" : "text-white/30 hover:text-white/60"
              )}
            >
              <List className="w-3.5 h-3.5" />
              Week
            </button>
          </div>

          <button
            onClick={() => setScheduleOpen(true)}
            className="flex items-center gap-1.5 px-3 md:px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium transition-colors shadow-lg shadow-indigo-500/20"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Schedule post</span>
          </button>
        </div>
      </div>

      {/* Month nav */}
      <div className="flex items-center gap-3 mb-4">
        <button
          onClick={prevMonth}
          className="w-8 h-8 rounded-xl flex items-center justify-center text-white/40 hover:text-white hover:bg-white/[0.08] transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        <h2 className="text-base font-semibold text-white min-w-36 text-center">
          {MONTHS[month]} {year}
        </h2>
        <button
          onClick={nextMonth}
          className="w-8 h-8 rounded-xl flex items-center justify-center text-white/40 hover:text-white hover:bg-white/[0.08] transition-colors"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Calendar grid */}
      <div className="flex-1 overflow-hidden flex flex-col">
        {/* Day headers */}
        <div className="grid grid-cols-7 mb-2">
          {DAYS.map((d) => (
            <div key={d} className="text-center text-xs font-medium text-white/30 py-2">
              {d}
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
                  "p-1.5 md:p-2 rounded-2xl border min-h-[70px] md:min-h-[90px] transition-colors",
                  isValidDay
                    ? "border-white/[0.06] bg-white/[0.01] hover:bg-white/[0.03]"
                    : "border-transparent",
                  isToday && "border-indigo-500/30 bg-indigo-500/[0.05]"
                )}
              >
                {isValidDay && (
                  <>
                    <span
                      className={cn(
                        "text-xs font-medium block mb-1",
                        isToday ? "text-indigo-400" : "text-white/30"
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
                        // Adapt API Post to PostCard format
                        const cardStatus: "scheduled" | "published" | "draft" =
                          post.status === "SCHEDULED"
                            ? "scheduled"
                            : post.status === "PUBLISHED"
                            ? "published"
                            : "draft";
                        const cardPost = {
                          id: post.id,
                          date: new Date(post.scheduledAt ?? post.createdAt),
                          time: post.scheduledAt
                            ? new Date(post.scheduledAt).toLocaleTimeString("en-US", {
                                hour: "2-digit",
                                minute: "2-digit",
                                hour12: false,
                              })
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
                          +{dayPosts.length - 2} more
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
      <div className="hidden md:flex items-center gap-6 mt-4 pt-4 border-t border-white/[0.06]">
        {[
          { label: "Scheduled", color: "bg-indigo-500/50" },
          { label: "Draft", color: "bg-white/20" },
          { label: "Published", color: "bg-emerald-500/50" },
        ].map(({ label, color }) => (
          <div key={label} className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${color}`} />
            <span className="text-xs text-white/30">{label}</span>
          </div>
        ))}
      </div>

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
