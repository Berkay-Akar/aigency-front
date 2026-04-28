"use client";

import { useTranslations } from "next-intl";
import { useStudioStore } from "@/store/studio-store";
import { cn } from "@/lib/utils";

export function RecentGenerationsList({
  className,
  vertical = false,
}: {
  className?: string;
  vertical?: boolean;
}) {
  const t = useTranslations("studio");
  const recent = useStudioStore((s) => s.recentGenerations);
  const setResult = useStudioStore((s) => s.setResult);

  if (recent.length === 0) {
    return (
      <div
        className={cn(
          "rounded-2xl border border-dashed border-border px-4 py-6 text-center text-xs text-muted-foreground",
          className,
        )}
      >
        {t("noRecent")}
      </div>
    );
  }

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
        {t("recentGenerations")}
      </p>
      {vertical ? (
        <div className="grid grid-cols-2 gap-1.5 overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {recent.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() =>
                setResult(
                  { url: item.thumb, assetId: item.assetId ?? item.id },
                  false,
                )
              }
              className="group relative aspect-square overflow-hidden rounded-xl border border-border bg-foreground/[0.03] text-left transition-all hover:border-indigo-500/35 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/40"
            >
              <img
                src={item.thumb}
                alt=""
                className="h-full w-full object-cover"
              />
              <span className="absolute inset-x-0 bottom-0 bg-linear-to-t from-black/80 to-transparent px-1.5 py-1 text-[9px] font-medium text-white/90 line-clamp-1">
                {item.label}
              </span>
            </button>
          ))}
        </div>
      ) : (
        <div className="flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {recent.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() =>
                setResult(
                  { url: item.thumb, assetId: item.assetId ?? item.id },
                  false,
                )
              }
              className="group relative h-20 w-20 shrink-0 overflow-hidden rounded-xl border border-border bg-foreground/[0.03] text-left transition-all hover:border-indigo-500/35 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/40"
            >
              <img
                src={item.thumb}
                alt=""
                className="h-full w-full object-cover"
              />
              <span className="absolute inset-x-0 bottom-0 bg-linear-to-t from-black/80 to-transparent px-1.5 py-1 text-[9px] font-medium text-white/90 line-clamp-1">
                {item.label}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
