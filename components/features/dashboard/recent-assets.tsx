"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Download, ExternalLink, Instagram, ArrowRight } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { assetsApi, type Asset } from "@/lib/api";
import { downloadAsBlob } from "@/lib/utils";
import { useStudioStore } from "@/store/studio-store";
import { toast } from "sonner";
import { useTranslations } from "next-intl";

const PLATFORM_ICONS: Record<string, React.ReactNode> = {
  instagram: <Instagram className="w-3 h-3" />,
  tiktok: (
    <svg className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor">
      <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.32 6.32 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.18 8.18 0 004.78 1.52V6.73a4.85 4.85 0 01-1.01-.04z" />
    </svg>
  ),
  facebook: (
    <svg className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  ),
};

export function RecentAssets() {
  const t = useTranslations("recentAssets");
  const { data, isLoading } = useQuery({
    queryKey: ["assets", 1, 6],
    queryFn: () => assetsApi.list(1, 6),
  });

  const router = useRouter();
  const loadFromAsset = useStudioStore((s) => s.loadFromAsset);
  const assets = data?.assets ?? [];

  function handleOpenInStudio(asset: Asset) {
    loadFromAsset(asset);
    router.push("/studio");
  }

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

  return (
    <>
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
            {t("sectionTitle")}
          </h2>
          <Link
            href="/assets"
            className="flex items-center gap-1 text-xs text-indigo-400 hover:text-indigo-300 transition-colors"
          >
            {t("viewAll")}
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
          {isLoading ? (
            Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="skeleton aspect-square rounded-2xl" />
            ))
          ) : assets.length > 0 ? (
            assets.map((asset) => (
              <div
                key={asset.id}
                className="group relative aspect-square rounded-2xl overflow-hidden"
              >
                <img
                  src={asset.url}
                  alt={asset.caption ?? ""}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />

                {asset.platform ? (
                  <div className="absolute top-2 left-2 w-5 h-5 rounded-lg bg-black/50 backdrop-blur-sm flex items-center justify-center text-white/70">
                    {PLATFORM_ICONS[asset.platform] ?? null}
                  </div>
                ) : null}

                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <button
                    type="button"
                    onClick={() => void handleDownload(asset)}
                    className="w-7 h-7 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-colors"
                  >
                    <Download className="w-3 h-3" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleOpenInStudio(asset)}
                    title={t("openInStudio")}
                    className="w-7 h-7 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-colors"
                  >
                    <ExternalLink className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-6 py-8 text-center text-muted-foreground text-sm">
              {t("noAssets")}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
