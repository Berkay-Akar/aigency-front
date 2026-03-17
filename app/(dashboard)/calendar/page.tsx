"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight, Plus, CalendarDays, List } from "lucide-react";
import { PostCard, type Post } from "@/components/features/calendar/post-card";
import { EditModal } from "@/components/features/calendar/edit-modal";
import { MOCK_CALENDAR_POSTS } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
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
  const [modalOpen, setModalOpen] = useState(false);

  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);

  const prevMonth = () => {
    if (month === 0) { setMonth(11); setYear(y => y - 1); }
    else setMonth(m => m - 1);
  };

  const nextMonth = () => {
    if (month === 11) { setMonth(0); setYear(y => y + 1); }
    else setMonth(m => m + 1);
  };

  const getPostsForDay = (day: number) => {
    return MOCK_CALENDAR_POSTS.filter(
      (p) =>
        p.date.getFullYear() === year &&
        p.date.getMonth() === month &&
        p.date.getDate() === day
    );
  };

  const handlePostClick = (post: Post) => {
    setSelectedPost(post);
    setModalOpen(true);
  };

  const totalCells = Math.ceil((firstDay + daysInMonth) / 7) * 7;

  return (
    <div className="flex flex-col h-full p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-white mb-0.5">Content Calendar</h1>
          <p className="text-sm text-white/30">
            {MOCK_CALENDAR_POSTS.length} posts scheduled this month
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* View toggle */}
          <div className="flex items-center gap-1 p-1 rounded-xl bg-white/[0.05] border border-white/[0.08]">
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

          <button className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium transition-colors shadow-lg shadow-indigo-500/20">
            <Plus className="w-4 h-4" />
            Schedule post
          </button>
        </div>
      </div>

      {/* Calendar nav */}
      <div className="flex items-center gap-4 mb-4">
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
            const posts = isValidDay ? getPostsForDay(dayNum) : [];

            return (
              <div
                key={idx}
                className={cn(
                  "p-2 rounded-2xl border min-h-[90px] transition-colors",
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
                        "text-xs font-medium block mb-1.5",
                        isToday
                          ? "text-indigo-400"
                          : "text-white/30"
                      )}
                    >
                      {dayNum}
                    </span>
                    <div className="space-y-1">
                      {posts.slice(0, 2).map((post) => (
                        <PostCard
                          key={post.id}
                          post={post}
                          onClick={handlePostClick}
                        />
                      ))}
                      {posts.length > 2 && (
                        <p className="text-[9px] text-white/30 pl-1">
                          +{posts.length - 2} more
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
      <div className="flex items-center gap-6 mt-4 pt-4 border-t border-white/[0.06]">
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

      <EditModal
        post={selectedPost}
        open={modalOpen}
        onClose={() => setModalOpen(false)}
      />
    </div>
  );
}
