"use client";

import { useState } from "react";
import { Sparkles, Copy, Check, Hash } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useStudioStore } from "@/store/studio-store";
import { cn } from "@/lib/utils";

export function CaptionBar() {
  const { caption, hashtags, setCaption, results } = useStudioStore();
  const [copied, setCopied] = useState(false);
  const [activeHashtags, setActiveHashtags] = useState<string[]>([]);

  const handleCopy = () => {
    const text = `${caption}\n\n${activeHashtags.join(" ")}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const toggleHashtag = (tag: string) => {
    setActiveHashtags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  if (results.length === 0) return null;

  return (
    <div className="border-t border-white/[0.06] bg-[#0c0c0c] p-5">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-2 mb-4">
          <div className="flex items-center gap-2 text-sm font-medium text-white/60">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            AI Caption
          </div>
          <div className="h-4 w-[1px] bg-white/[0.08]" />
          <div className="flex items-center gap-2 text-sm text-white/30">
            <Hash className="w-3.5 h-3.5" />
            Click hashtags to include
          </div>
        </div>

        <div className="flex gap-4">
          {/* Caption textarea */}
          <div className="flex-1 relative">
            <Textarea
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="Your AI-generated caption will appear here…"
              rows={3}
              className="bg-white/[0.03] border-white/[0.07] rounded-2xl text-white text-sm placeholder:text-white/20 resize-none pr-12 focus-visible:ring-indigo-500/30 focus-visible:border-indigo-500/30"
            />
            <Button
              size="sm"
              variant="ghost"
              onClick={handleCopy}
              disabled={!caption}
              className="absolute top-2.5 right-2.5 h-7 w-7 p-0 rounded-lg text-white/30 hover:text-white hover:bg-white/[0.07]"
            >
              {copied ? (
                <Check className="w-3.5 h-3.5 text-emerald-400" />
              ) : (
                <Copy className="w-3.5 h-3.5" />
              )}
            </Button>
          </div>

          {/* Hashtags */}
          <div className="w-72 flex flex-wrap gap-1.5 content-start">
            {hashtags.map((tag) => (
              <button
                key={tag}
                onClick={() => toggleHashtag(tag)}
                className={cn(
                  "px-2.5 py-1 rounded-xl text-xs font-medium transition-all duration-150",
                  activeHashtags.includes(tag)
                    ? "bg-indigo-500/20 border border-indigo-500/30 text-indigo-300"
                    : "bg-white/[0.04] border border-white/[0.07] text-white/30 hover:text-white/60 hover:border-white/[0.12]"
                )}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
