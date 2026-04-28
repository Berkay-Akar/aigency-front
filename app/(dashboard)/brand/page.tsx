"use client";

import { useState, useEffect } from "react";
import { Save, Check, Sparkles } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { LogoUploader } from "@/components/features/brand/logo-uploader";
import {
  ColorPicker,
  type ColorPickerValue,
} from "@/components/features/brand/color-picker";
import { ToneSelector } from "@/components/features/brand/tone-selector";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { brandKitApi, type BrandKit, type BrandKitTone } from "@/lib/api";
import { useAppStore } from "@/store/app-store";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";

const DEFAULT_COLORS: ColorPickerValue = {
  primary: "#6366F1",
  secondary: "#8B5CF6",
  accent: "#10B981",
};

export default function BrandPage() {
  const t = useTranslations("brandKit");
  const queryClient = useQueryClient();
  const { useBrandKit, setUseBrandKit } = useAppStore();

  const { data: brandKit, isLoading } = useQuery({
    queryKey: ["brand-kit"],
    queryFn: brandKitApi.get,
  });

  const mutation = useMutation({
    mutationFn: (data: Parameters<typeof brandKitApi.update>[0]) =>
      brandKitApi.update(data),
    onSuccess: (updated) => {
      queryClient.setQueryData(["brand-kit"], updated);
      toast.success(t("saveSuccess"));
    },
    onError: () => toast.error(t("saveFailed")),
  });

  const [brandName, setBrandName] = useState("");
  const [tagline, setTagline] = useState("");
  const [website, setWebsite] = useState("");
  const [industry, setIndustry] = useState("");
  const [description, setDescription] = useState("");
  const [colors, setColors] = useState<ColorPickerValue>(DEFAULT_COLORS);
  const [tone, setTone] = useState<BrandKitTone | null>(null);
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [isUploadingLogo, setIsUploadingLogo] = useState(false);

  useEffect(() => {
    if (!brandKit) return;
    setBrandName(brandKit.brandName ?? "");
    setTagline(brandKit.tagline ?? "");
    setWebsite(brandKit.website ?? "");
    setIndustry(brandKit.industry ?? "");
    setDescription(brandKit.description ?? "");
    setLogoUrl(brandKit.logoUrl ?? null);
    setTone(brandKit.tone ?? null);
    setColors({
      primary: brandKit.primaryColor ?? DEFAULT_COLORS.primary,
      secondary: brandKit.secondaryColor ?? DEFAULT_COLORS.secondary,
      accent: brandKit.accentColor ?? DEFAULT_COLORS.accent,
    });
  }, [brandKit]);

  const handleSave = () => {
    // Only include non-empty fields — never nullify existing data
    const patch: Parameters<typeof brandKitApi.update>[0] = {};
    if (brandName.trim()) patch.brandName = brandName.trim();
    if (tagline.trim()) patch.tagline = tagline.trim();
    if (website.trim()) patch.website = website.trim();
    if (industry.trim()) patch.industry = industry.trim();
    if (description.trim()) patch.description = description.trim();
    if (colors.primary) patch.primaryColor = colors.primary;
    if (colors.secondary) patch.secondaryColor = colors.secondary;
    if (colors.accent) patch.accentColor = colors.accent;
    if (tone) patch.tone = tone;

    if (Object.keys(patch).length === 0) {
      toast.info(t("noChanges"));
      return;
    }
    mutation.mutate(patch);
  };

  const handleLogoUpload = async (file: File) => {
    setIsUploadingLogo(true);
    try {
      const { logoUrl: newUrl, brandKit: updated } =
        await brandKitApi.uploadLogo(file);
      setLogoUrl(newUrl);
      queryClient.setQueryData(["brand-kit"], updated);
      toast.success(t("logoUploaded"));
    } catch {
      toast.error(t("logoUploadFailed"));
    } finally {
      setIsUploadingLogo(false);
    }
  };

  const saved = mutation.isSuccess;

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-xl font-bold text-white mb-1">{t("title")}</h1>
          <p className="text-sm text-white/30">{t("subtitle")}</p>
        </div>
        <div className="flex items-center gap-3">
          {/* Use Brand Kit toggle */}
          <button
            type="button"
            onClick={() => setUseBrandKit(!useBrandKit)}
            className={cn(
              "flex items-center gap-2.5 px-4 py-2.5 rounded-xl border text-sm font-medium transition-all",
              useBrandKit
                ? "bg-indigo-500/15 border-indigo-500/40 text-indigo-300"
                : "bg-white/4 border-white/8 text-white/40 hover:text-white/60 hover:bg-white/6",
            )}
          >
            <Sparkles
              className={cn(
                "w-4 h-4",
                useBrandKit ? "text-indigo-400" : "text-white/30",
              )}
            />
            {t("useBrandKit")}
            <span
              className={cn(
                "inline-flex w-8 h-4 rounded-full transition-all relative",
                useBrandKit ? "bg-indigo-500" : "bg-white/20",
              )}
            >
              <span
                className={cn(
                  "absolute top-0.5 w-3 h-3 rounded-full bg-white transition-all",
                  useBrandKit ? "left-4.5" : "left-0.5",
                )}
              />
            </span>
          </button>

          <Button
            onClick={handleSave}
            disabled={mutation.isPending || isLoading}
            className={
              saved
                ? "border border-emerald-500/50 bg-transparent text-emerald-400 hover:bg-emerald-500/10 hover:border-emerald-400 rounded-xl transition-all"
                : "border border-indigo-500/50 bg-transparent text-indigo-300 hover:bg-indigo-500/10 hover:border-indigo-400 rounded-xl transition-all"
            }
          >
            {saved ? (
              <>
                <Check className="w-4 h-4 mr-2" />
                {t("saved")}
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                {t("saveBrandKit")}
              </>
            )}
          </Button>
        </div>
      </div>

      {useBrandKit && (
        <div className="mb-6 px-4 py-3 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-sm flex items-center gap-2">
          <Sparkles className="w-4 h-4 shrink-0" />
          {t("activeNotice")}
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-6">
        {/* Left column */}
        <div className="space-y-6">
          <div className="rounded-3xl border border-white/10 bg-white/4 p-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] backdrop-blur-md">
            <h3 className="text-sm font-semibold text-white mb-1">
              {t("identity")}
            </h3>
            <p className="text-xs text-white/30 mb-5">{t("identityDesc")}</p>
            <div className="space-y-4">
              <div>
                <label className="text-xs text-white/40 font-medium uppercase tracking-wider mb-1.5 block">
                  {t("brandName")}
                </label>
                <Input
                  value={brandName}
                  onChange={(e) => setBrandName(e.target.value)}
                  disabled={isLoading}
                  className="bg-white/4 border-white/8 rounded-xl text-white focus-visible:ring-indigo-500/30 focus-visible:border-indigo-500/30"
                />
              </div>
              <div>
                <label className="text-xs text-white/40 font-medium uppercase tracking-wider mb-1.5 block">
                  {t("tagline")}
                </label>
                <Input
                  placeholder={t("taglinePlaceholder")}
                  value={tagline}
                  onChange={(e) => setTagline(e.target.value)}
                  className="bg-white/4 border-white/8 rounded-xl text-white placeholder:text-white/20 focus-visible:ring-indigo-500/30 focus-visible:border-indigo-500/30"
                />
              </div>
              <div>
                <label className="text-xs text-white/40 font-medium uppercase tracking-wider mb-1.5 block">
                  {t("industry")}
                </label>
                <Input
                  placeholder={t("industryPlaceholder")}
                  value={industry}
                  onChange={(e) => setIndustry(e.target.value)}
                  disabled={isLoading}
                  className="bg-white/4 border-white/8 rounded-xl text-white placeholder:text-white/20 focus-visible:ring-indigo-500/30 focus-visible:border-indigo-500/30"
                />
              </div>
              <div>
                <label className="text-xs text-white/40 font-medium uppercase tracking-wider mb-1.5 block">
                  {t("website")}
                </label>
                <Input
                  placeholder={t("websitePlaceholder")}
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                  disabled={isLoading}
                  className="bg-white/4 border-white/8 rounded-xl text-white placeholder:text-white/20 focus-visible:ring-indigo-500/30 focus-visible:border-indigo-500/30"
                />
              </div>
              <div>
                <label className="text-xs text-white/40 font-medium uppercase tracking-wider mb-1.5 block">
                  {t("description")}
                </label>
                <Textarea
                  placeholder={t("descriptionPlaceholder")}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  disabled={isLoading}
                  rows={4}
                  className="bg-white/4 border-white/8 rounded-xl text-white placeholder:text-white/20 resize-none focus-visible:ring-indigo-500/30 focus-visible:border-indigo-500/30"
                />
              </div>
            </div>
          </div>

          <LogoUploader
            value={logoUrl}
            onUpload={handleLogoUpload}
            onRemove={() => setLogoUrl(null)}
            isUploading={isUploadingLogo}
          />
        </div>

        {/* Right column */}
        <div className="space-y-6">
          <ColorPicker value={colors} onChange={setColors} />
          <ToneSelector value={tone} onChange={setTone} />
        </div>
      </div>
    </div>
  );
}
