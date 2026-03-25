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
    <div className="border-t border-white/6 bg-[#080808] p-5">
      <div className="mx-auto max-w-4xl">
        <div className="mb-4 flex items-center gap-2">
          <div className="flex items-center gap-2 text-sm font-medium text-white/60">
            <Sparkles className="size-3.5 text-indigo-400" />
            AI metin
          </div>
          <div className="h-4 w-px bg-white/8" />
          <div className="flex items-center gap-2 text-sm text-white/30">
            <Hash className="size-3.5" />
            Etiketlere tıklayarak ekleyin
          </div>
        </div>

        <div className="flex flex-col gap-4 md:flex-row">
          <div className="relative flex-1">
            <Textarea
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="AI ürettiği metin burada görünür — düzenleyebilirsiniz."
              rows={3}
              className="resize-none rounded-2xl border-white/7 bg-white/[0.03] pr-12 text-sm text-white placeholder:text-white/20 focus-visible:border-indigo-500/30 focus-visible:ring-indigo-500/30"
            />
            <Button
              size="sm"
              variant="ghost"
              onClick={handleCopy}
              disabled={!caption}
              className="absolute top-2.5 right-2.5 h-7 w-7 rounded-lg p-0 text-white/30 hover:bg-white/[0.07] hover:text-white"
            >
              {copied ? (
                <Check className="size-3.5 text-emerald-400" />
              ) : (
                <Copy className="size-3.5" />
              )}
            </Button>
          </div>

          <div className="flex w-full flex-wrap content-start gap-1.5 md:w-72">
            {hashtags.map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => toggleHashtag(tag)}
                className={cn(
                  "rounded-xl border px-2.5 py-1 text-xs font-medium transition-all duration-150",
                  activeHashtags.includes(tag)
                    ? "border-indigo-500/30 bg-indigo-500/20 text-indigo-300"
                    : "border-white/7 bg-white/[0.04] text-white/30 hover:border-white/12 hover:text-white/60"
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
