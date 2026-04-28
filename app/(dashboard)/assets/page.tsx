"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Download,
  ExternalLink,
  CalendarPlus,
  Plus,
  Search,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { FilterBar } from "@/components/features/assets/filter-bar";
import { assetsApi, type Asset } from "@/lib/api";
import { downloadAsBlob, cn } from "@/lib/utils";
import { useStudioStore } from "@/store/studio-store";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useTranslations } from "next-intl";

const PAGE_LIMIT = 20;

function AssetSkeleton() {
  return (
    <div className="skeleton rounded-2xl break-inside-avoid aspect-square" />
  );
}

export default function AssetsPage() {
  const t = useTranslations("assets");
  const [activeType, setActiveType] = useState("all");
  const [activePlatform, setActivePlatform] = useState("all");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const router = useRouter();
  const loadFromAsset = useStudioStore((s) => s.loadFromAsset);

  const { data, isLoading } = useQuery({
    queryKey: ["assets", page, PAGE_LIMIT],
    queryFn: () => assetsApi.list(page, PAGE_LIMIT),
    placeholderData: (prev) => prev,
  });

  const assets = data?.assets ?? [];
  const totalPages = data?.pagination.totalPages ?? 1;

  async function handleDownload(asset: Asset) {
    const ext = asset.url.split(".").pop()?.split("?")[0] ?? "png";
    try {
      await downloadAsBlob(
        asset.url,
        `aigencys-${asset.id.slice(0, 8)}.${ext}`,
      );
    } catch {
      toast.error(t("downloadFailed"));
    }
  }

  function handleOpenInStudio(asset: Asset) {
    loadFromAsset(asset);
    router.push("/studio");
  }

  const filtered = assets.filter((asset) => {
    const typeMatch =
      activeType === "all" ||
      (activeType === "images" && asset.type === "image") ||
      (activeType === "videos" && asset.type === "video");
    const platformMatch =
      activePlatform === "all" ||
      (asset.platform ?? "").toLowerCase() === activePlatform.toLowerCase();
    const searchMatch =
      search === "" ||
      (asset.caption ?? "").toLowerCase().includes(search.toLowerCase());
    return typeMatch && platformMatch && searchMatch;
  });

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-xl font-bold text-white mb-1">{t("title")}</h1>
          <p className="text-sm text-white/30">
            {data
              ? t("totalAssets", { count: data.pagination.total })
              : t("loading")}
          </p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-linear-to-r from-indigo-500 to-violet-600 hover:from-indigo-400 hover:to-violet-500 text-white text-sm font-medium transition-colors shadow-lg shadow-indigo-500/20">
          <Plus className="w-4 h-4" />
          {t("uploadAsset")}
        </button>
      </div>

      {/* Search + Filters */}
      <div className="flex items-center gap-4 mb-8">
        <div className="relative w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
          <Input
            placeholder={t("searchPlaceholder")}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 bg-white/4 border-white/8 rounded-xl text-white placeholder:text-white/20 focus-visible:ring-indigo-500/30 focus-visible:border-indigo-500/30"
          />
        </div>
        <FilterBar
          activeType={activeType}
          setActiveType={setActiveType}
          activePlatform={activePlatform}
          setActivePlatform={setActivePlatform}
        />
      </div>

      {/* Grid */}
      {isLoading ? (
        <div className="columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <AssetSkeleton key={i} />
          ))}
        </div>
      ) : filtered.length > 0 ? (
        <div className="columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
          {filtered.map((asset) => (
            <div
              key={asset.id}
              className="group relative rounded-2xl overflow-hidden break-inside-avoid"
            >
              <img
                src={asset.url}
                alt={asset.caption ?? ""}
                className="w-full object-cover group-hover:scale-105 transition-transform duration-500"
              />

              <div className="absolute inset-0 bg-linear-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="absolute bottom-0 left-0 right-0 p-3">
                  {asset.caption ? (
                    <p className="text-xs text-white/80 mb-2 line-clamp-2 leading-relaxed">
                      {asset.caption}
                    </p>
                  ) : null}
                  {asset.generationJob?.prompt ? (
                    <p className="text-xs text-white/50 mb-2 line-clamp-2 leading-relaxed italic">
                      &ldquo;{asset.generationJob.prompt}&rdquo;
                    </p>
                  ) : null}
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => void handleDownload(asset)}
                      className="flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-xl bg-[rgba(0,0,0,0.60)] backdrop-blur-sm border border-white/20 text-white text-xs font-medium hover:bg-[rgba(0,0,0,0.75)] transition-colors"
                    >
                      <Download className="w-3 h-3" />
                      {t("download")}
                    </button>
                    <button className="flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-xl bg-indigo-600 backdrop-blur-sm border border-indigo-400/60 text-white text-xs font-medium hover:bg-indigo-500 transition-colors">
                      <CalendarPlus className="w-3 h-3" />
                      {t("schedule")}
                    </button>
                  </div>
                </div>

                <div className="absolute top-3 right-3">
                  <button
                    type="button"
                    onClick={() => handleOpenInStudio(asset)}
                    title={t("openInStudio")}
                    className="group/btn flex items-center gap-1.5 h-7 rounded-xl bg-[rgba(0,0,0,0.60)] backdrop-blur-sm border border-white/20 px-2 text-white hover:bg-[rgba(0,0,0,0.75)] transition-all overflow-hidden"
                  >
                    <ExternalLink className="w-3 h-3 shrink-0" />
                    <span className="text-xs font-medium max-w-0 group-hover/btn:max-w-20 overflow-hidden whitespace-nowrap transition-all duration-300">
                      {t("openInStudio")}
                    </span>
                  </button>
                </div>
              </div>

              {asset.platform ? (
                <div className="absolute top-3 left-3 px-2 py-1 rounded-lg bg-black/50 backdrop-blur-sm text-white/60 text-[10px] font-medium capitalize">
                  {asset.platform}
                </div>
              ) : null}
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="w-14 h-14 rounded-2xl bg-white/4 flex items-center justify-center mb-4">
            <Search className="w-6 h-6 text-white/20" />
          </div>
          <p className="text-white/30 text-sm font-medium mb-1">
            {t("noAssetsFound")}
          </p>
          <p className="text-white/20 text-xs">{t("adjustFilters")}</p>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 ? (
        <div className="flex items-center justify-center gap-2 mt-10">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page <= 1}
            className={cn(
              "px-4 py-2 rounded-xl border text-sm font-medium transition-colors",
              page <= 1
                ? "border-white/6 text-white/20 cursor-not-allowed"
                : "border-white/8 text-white/50 hover:text-white hover:border-white/20",
            )}
          >
            {t("previous")}
          </button>
          <span className="text-xs text-white/30 tabular-nums px-2">
            {page} / {totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page >= totalPages}
            className={cn(
              "px-4 py-2 rounded-xl border text-sm font-medium transition-colors",
              page >= totalPages
                ? "border-white/6 text-white/20 cursor-not-allowed"
                : "border-white/8 text-white/50 hover:text-white hover:border-white/20",
            )}
          >
            {t("next")}
          </button>
        </div>
      ) : null}
    </div>
  );
}
