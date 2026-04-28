"use client";

import { Instagram } from "lucide-react";
import { cn } from "@/lib/utils";

interface Post {
  id: string;
  time: string;
  platform: string;
  caption: string;
  imageUrl: string;
  status: "scheduled" | "draft" | "published";
}

interface PostCardProps {
  post: Post;
  onClick: (post: Post) => void;
}

const STATUS_STYLES = {
  scheduled: "border-indigo-500/40 bg-indigo-500/10",
  draft: "border-border bg-muted/30",
  published: "border-emerald-500/30 bg-emerald-500/[0.07]",
};

const PlatformIcon = ({ platform }: { platform: string }) => {
  if (platform === "instagram")
    return <Instagram className="w-2.5 h-2.5 text-pink-400" />;
  if (platform === "tiktok")
    return (
      <svg
        className="w-2.5 h-2.5 text-white"
        viewBox="0 0 24 24"
        fill="currentColor"
      >
        <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.32 6.32 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.18 8.18 0 004.78 1.52V6.73a4.85 4.85 0 01-1.01-.04z" />
      </svg>
    );
  return (
    <svg
      className="w-2.5 h-2.5 text-blue-400"
      viewBox="0 0 24 24"
      fill="currentColor"
    >
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  );
};

export function PostCard({ post, onClick }: PostCardProps) {
  return (
    <button
      onClick={() => onClick(post)}
      className={cn(
        "w-full text-left flex items-center gap-1.5 p-1.5 rounded-xl border transition-all duration-150 hover:scale-[1.02] group",
        STATUS_STYLES[post.status],
      )}
    >
      <img
        src={post.imageUrl}
        alt=""
        className="w-7 h-7 rounded-lg object-cover flex-shrink-0"
      />
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-1 mb-0.5">
          <PlatformIcon platform={post.platform} />
          <span className="text-[9px] text-muted-foreground font-medium">
            {post.time}
          </span>
        </div>
        <p className="text-[10px] text-foreground/60 truncate leading-tight">
          {post.caption}
        </p>
      </div>
    </button>
  );
}

export type { Post };
