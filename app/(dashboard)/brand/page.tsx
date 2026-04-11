"use client";

import { useState, useEffect } from "react";
import { Save, Check } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { LogoUploader } from "@/components/features/brand/logo-uploader";
import { ColorPicker } from "@/components/features/brand/color-picker";
import { ToneSelector } from "@/components/features/brand/tone-selector";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { workspaceApi } from "@/lib/api";

const LS_BRAND = "brand_local";

function loadLocal(): Record<string, string> {
  if (typeof window === "undefined") return {};
  try {
    return JSON.parse(localStorage.getItem(LS_BRAND) ?? "{}") as Record<
      string,
      string
    >;
  } catch {
    return {};
  }
}

function saveLocal(patch: Record<string, string>) {
  if (typeof window === "undefined") return;
  const prev = loadLocal();
  localStorage.setItem(LS_BRAND, JSON.stringify({ ...prev, ...patch }));
}

export default function BrandPage() {
  const queryClient = useQueryClient();

  const { data: workspace, isLoading } = useQuery({
    queryKey: ["workspace"],
    queryFn: workspaceApi.get,
  });

  const mutation = useMutation({
    mutationFn: (data: Parameters<typeof workspaceApi.update>[0]) =>
      workspaceApi.update(data),
    onSuccess: (updated) => {
      queryClient.setQueryData(["workspace"], updated);
      toast.success("Brand kit saved.");
    },
    onError: () => toast.error("Could not save. Please try again."),
  });

  const [brandName, setBrandName] = useState("");
  const [tagline, setTagline] = useState("");
  const [website, setWebsite] = useState("");
  const [industry, setIndustry] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    if (!workspace) return;
    setBrandName(workspace.name ?? "");
    setWebsite(workspace.website ?? "");
    setIndustry(workspace.industry ?? "");
    setDescription(workspace.description ?? "");
    const local = loadLocal();
    if (local.tagline) setTagline(local.tagline);
  }, [workspace]);

  const handleSave = () => {
    saveLocal({ tagline });
    mutation.mutate({ name: brandName, website, industry, description });
  };

  const saved = mutation.isSuccess;

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-xl font-bold text-white mb-1">Brand Kit</h1>
          <p className="text-sm text-white/30">
            Define your brand identity for consistent AI-generated content
          </p>
        </div>
        <Button
          onClick={handleSave}
          disabled={mutation.isPending || isLoading}
          className={
            saved
              ? "bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl"
              : "bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl shadow-lg shadow-indigo-500/20"
          }
        >
          {saved ? (
            <>
              <Check className="w-4 h-4 mr-2" />
              Saved!
            </>
          ) : (
            <>
              <Save className="w-4 h-4 mr-2" />
              Save brand kit
            </>
          )}
        </Button>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Left column */}
        <div className="space-y-6">
          <div className="p-6 rounded-3xl bg-white/[0.02] border border-white/[0.06]">
            <h3 className="text-sm font-semibold text-white mb-1">
              Brand Identity
            </h3>
            <p className="text-xs text-white/30 mb-5">
              Basic information about your brand
            </p>
            <div className="space-y-4">
              <div>
                <label className="text-xs text-white/40 font-medium uppercase tracking-wider mb-1.5 block">
                  Brand name
                </label>
                <Input
                  value={brandName}
                  onChange={(e) => setBrandName(e.target.value)}
                  disabled={isLoading}
                  className="bg-white/[0.04] border-white/[0.08] rounded-xl text-white focus-visible:ring-indigo-500/30 focus-visible:border-indigo-500/30"
                />
              </div>
              <div>
                <label className="text-xs text-white/40 font-medium uppercase tracking-wider mb-1.5 block">
                  Tagline
                </label>
                <Input
                  placeholder="e.g. Premium by design"
                  value={tagline}
                  onChange={(e) => setTagline(e.target.value)}
                  className="bg-white/[0.04] border-white/[0.08] rounded-xl text-white placeholder:text-white/20 focus-visible:ring-indigo-500/30 focus-visible:border-indigo-500/30"
                />
              </div>
              <div>
                <label className="text-xs text-white/40 font-medium uppercase tracking-wider mb-1.5 block">
                  Industry
                </label>
                <Input
                  placeholder="e.g. Fashion & Beauty"
                  value={industry}
                  onChange={(e) => setIndustry(e.target.value)}
                  disabled={isLoading}
                  className="bg-white/[0.04] border-white/[0.08] rounded-xl text-white placeholder:text-white/20 focus-visible:ring-indigo-500/30 focus-visible:border-indigo-500/30"
                />
              </div>
              <div>
                <label className="text-xs text-white/40 font-medium uppercase tracking-wider mb-1.5 block">
                  Website
                </label>
                <Input
                  placeholder="https://yourbrand.com"
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                  disabled={isLoading}
                  className="bg-white/[0.04] border-white/[0.08] rounded-xl text-white placeholder:text-white/20 focus-visible:ring-indigo-500/30 focus-visible:border-indigo-500/30"
                />
              </div>
              <div>
                <label className="text-xs text-white/40 font-medium uppercase tracking-wider mb-1.5 block">
                  Brand description
                </label>
                <Textarea
                  placeholder="Describe your brand, target audience, and what makes it unique…"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  disabled={isLoading}
                  rows={4}
                  className="bg-white/[0.04] border-white/[0.08] rounded-xl text-white placeholder:text-white/20 resize-none focus-visible:ring-indigo-500/30 focus-visible:border-indigo-500/30"
                />
              </div>
            </div>
          </div>

          <LogoUploader />
        </div>

        {/* Right column */}
        <div className="space-y-6">
          <ColorPicker />
          <ToneSelector />
        </div>
      </div>
    </div>
  );
}
