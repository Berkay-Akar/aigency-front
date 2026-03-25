"use client";

import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Bell,
  Shield,
  Users,
  Webhook,
  Check,
  Loader2,
  UserPlus,
  ExternalLink,
} from "lucide-react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { workspaceApi, socialApi, type WorkspaceMember } from "@/lib/api";
import { cn } from "@/lib/utils";

const TABS = [
  { id: "workspace", label: "Workspace", icon: Shield },
  { id: "team", label: "Team", icon: Users },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "integrations", label: "Integrations", icon: Webhook },
];

const workspaceSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  industry: z.string().optional(),
  website: z.string().url("Enter a valid URL").optional().or(z.literal("")),
  description: z.string().optional(),
});

type WorkspaceFormData = z.infer<typeof workspaceSchema>;

const SOCIAL_PLATFORMS = [
  { id: "instagram", label: "Instagram", gradient: "from-pink-600 to-orange-500" },
  { id: "tiktok", label: "TikTok", gradient: "from-zinc-800 to-zinc-600" },
  { id: "facebook", label: "Facebook", gradient: "from-blue-700 to-blue-500" },
  { id: "twitter", label: "X / Twitter", gradient: "from-zinc-900 to-zinc-700" },
];

// ─── Workspace tab ────────────────────────────────────────────────────────────

function WorkspaceTab() {
  const queryClient = useQueryClient();
  const { data: workspace, isLoading } = useQuery({
    queryKey: ["workspace"],
    queryFn: () => workspaceApi.get(),
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<WorkspaceFormData>({ resolver: zodResolver(workspaceSchema) });

  useEffect(() => {
    if (workspace) {
      reset({
        name: workspace.name ?? "",
        industry: workspace.industry ?? "",
        website: workspace.website ?? "",
        description: workspace.description ?? "",
      });
    }
  }, [workspace, reset]);

  const mutation = useMutation({
    mutationFn: (data: WorkspaceFormData) => workspaceApi.update(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["workspace"] });
      toast.success("Workspace updated.");
    },
    onError: () => toast.error("Failed to update workspace."),
  });

  if (isLoading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="skeleton h-11 rounded-xl" />
        ))}
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit((d) => mutation.mutate(d))}
      className="space-y-6"
    >
      <div className="p-6 rounded-3xl bg-white/[0.02] border border-white/[0.06] space-y-4">
        <h3 className="text-sm font-semibold text-white">Workspace Details</h3>

        <div>
          <Label className="text-xs text-white/40 font-medium uppercase tracking-wider mb-1.5 block">
            Workspace name
          </Label>
          <Input
            {...register("name")}
            className="bg-white/[0.04] border-white/[0.08] rounded-xl text-white focus-visible:ring-indigo-500/30 focus-visible:border-indigo-500/30"
          />
          {errors.name && (
            <p className="text-xs text-red-400 mt-1">{errors.name.message}</p>
          )}
        </div>

        <div>
          <Label className="text-xs text-white/40 font-medium uppercase tracking-wider mb-1.5 block">
            Industry
          </Label>
          <Input
            {...register("industry")}
            placeholder="e.g. Fashion & Beauty"
            className="bg-white/[0.04] border-white/[0.08] rounded-xl text-white placeholder:text-white/20 focus-visible:ring-indigo-500/30 focus-visible:border-indigo-500/30"
          />
        </div>

        <div>
          <Label className="text-xs text-white/40 font-medium uppercase tracking-wider mb-1.5 block">
            Website
          </Label>
          <Input
            {...register("website")}
            placeholder="https://yourbrand.com"
            className="bg-white/[0.04] border-white/[0.08] rounded-xl text-white placeholder:text-white/20 focus-visible:ring-indigo-500/30 focus-visible:border-indigo-500/30"
          />
          {errors.website && (
            <p className="text-xs text-red-400 mt-1">{errors.website.message}</p>
          )}
        </div>

        <div>
          <Label className="text-xs text-white/40 font-medium uppercase tracking-wider mb-1.5 block">
            Description
          </Label>
          <Textarea
            {...register("description")}
            placeholder="Describe your brand…"
            rows={3}
            className="bg-white/[0.04] border-white/[0.08] rounded-xl text-white placeholder:text-white/20 resize-none focus-visible:ring-indigo-500/30 focus-visible:border-indigo-500/30"
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting || mutation.isPending}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-sm font-medium transition-colors"
        >
          {mutation.isPending ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : mutation.isSuccess ? (
            <Check className="w-4 h-4" />
          ) : null}
          {mutation.isPending ? "Saving…" : "Save changes"}
        </button>
      </div>
    </form>
  );
}

// ─── Team tab ─────────────────────────────────────────────────────────────────

function TeamTab() {
  const queryClient = useQueryClient();
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviting, setInviting] = useState(false);

  const { data: members, isLoading } = useQuery({
    queryKey: ["workspace", "members"],
    queryFn: () => workspaceApi.getMembers(),
  });

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteEmail.trim()) return;
    setInviting(true);
    try {
      await workspaceApi.inviteMember(inviteEmail.trim());
      queryClient.invalidateQueries({ queryKey: ["workspace", "members"] });
      toast.success(`Invite sent to ${inviteEmail}`);
      setInviteEmail("");
    } catch {
      toast.error("Failed to send invite.");
    } finally {
      setInviting(false);
    }
  };

  return (
    <div className="space-y-5">
      {/* Invite */}
      <div className="p-5 rounded-3xl bg-white/[0.02] border border-white/[0.06]">
        <h3 className="text-sm font-semibold text-white mb-1">Invite teammate</h3>
        <p className="text-xs text-white/30 mb-4">
          Team members can access all workspace content and settings.
        </p>
        <form onSubmit={handleInvite} className="flex gap-2">
          <Input
            type="email"
            placeholder="colleague@company.com"
            value={inviteEmail}
            onChange={(e) => setInviteEmail(e.target.value)}
            className="flex-1 bg-white/[0.04] border-white/[0.08] rounded-xl text-white placeholder:text-white/20 focus-visible:ring-indigo-500/30 focus-visible:border-indigo-500/30"
          />
          <button
            type="submit"
            disabled={inviting || !inviteEmail}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-sm font-medium transition-colors flex-shrink-0"
          >
            {inviting ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <UserPlus className="w-4 h-4" />
            )}
            <span className="hidden sm:inline">Invite</span>
          </button>
        </form>
      </div>

      {/* Members list */}
      <div className="p-5 rounded-3xl bg-white/[0.02] border border-white/[0.06]">
        <h3 className="text-sm font-semibold text-white mb-4">Members</h3>
        {isLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="skeleton h-12 rounded-xl" />
            ))}
          </div>
        ) : members && members.length > 0 ? (
          <div className="space-y-2">
            {members.map((m: WorkspaceMember) => (
              <div
                key={m.id}
                className="flex items-center justify-between py-2.5"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-indigo-600/20 flex items-center justify-center text-xs font-bold text-indigo-300">
                    {m.name?.[0]?.toUpperCase() ?? "?"}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">{m.name}</p>
                    <p className="text-xs text-white/30">{m.email}</p>
                  </div>
                </div>
                <span
                  className={cn(
                    "text-xs font-medium px-2.5 py-1 rounded-xl capitalize",
                    m.role === "owner"
                      ? "bg-indigo-500/15 text-indigo-300"
                      : "bg-white/[0.06] text-white/40"
                  )}
                >
                  {m.role}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-white/30 text-center py-6">
            No teammates yet. Invite someone above.
          </p>
        )}
      </div>
    </div>
  );
}

// ─── Integrations tab ─────────────────────────────────────────────────────────

function IntegrationsTab() {
  const queryClient = useQueryClient();
  const [connecting, setConnecting] = useState<string | null>(null);

  const { data: connections, isLoading } = useQuery({
    queryKey: ["social", "connections"],
    queryFn: () => socialApi.getConnections(),
  });

  const handleConnect = async (platform: string) => {
    setConnecting(platform);
    try {
      const res = await socialApi.getConnectUrl(platform);
      window.location.href = res.url;
    } catch {
      toast.error("Failed to get connection URL. Please try again.");
      setConnecting(null);
    }
  };

  const handleDisconnect = () => {
    toast.info("Platform disconnect is coming soon.");
  };

  const getConnection = (id: string) =>
    connections?.find((c) => c.platform === id);

  return (
    <div className="space-y-3">
      {isLoading
        ? Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="skeleton h-20 rounded-2xl" />
          ))
        : SOCIAL_PLATFORMS.map(({ id, label, gradient }) => {
            const conn = getConnection(id);
            const isConnected = conn?.connected ?? false;
            const isConnecting = connecting === id;

            return (
              <div
                key={id}
                className="flex items-center justify-between p-5 rounded-2xl bg-white/[0.02] border border-white/[0.06] hover:bg-white/[0.04] transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`w-10 h-10 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center flex-shrink-0`}
                  >
                    <span className="text-white text-xs font-bold">
                      {label[0]}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">{label}</p>
                    <p className="text-xs text-white/30">
                      {isConnected
                        ? conn?.username
                          ? `@${conn.username}`
                          : "Connected"
                        : `Connect your ${label} account`}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  {isConnected && (
                    <span className="flex items-center gap-1.5 text-xs text-emerald-400 font-medium">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse-dot" />
                      Connected
                    </span>
                  )}
                  <button
                    onClick={() =>
                      isConnected ? handleDisconnect() : handleConnect(id)
                    }
                    disabled={isConnecting}
                    className={cn(
                      "flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium transition-colors",
                      isConnected
                        ? "bg-white/[0.05] text-white/40 hover:text-white hover:bg-white/[0.08] border border-white/[0.07]"
                        : "bg-indigo-600 hover:bg-indigo-500 text-white"
                    )}
                  >
                    {isConnecting ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : !isConnected ? (
                      <ExternalLink className="w-3.5 h-3.5" />
                    ) : null}
                    {isConnecting ? "Redirecting…" : isConnected ? "Disconnect" : "Connect"}
                  </button>
                </div>
              </div>
            );
          })}
    </div>
  );
}

// ─── Notifications tab ────────────────────────────────────────────────────────

function NotificationsTab() {
  return (
    <div className="p-6 rounded-3xl bg-white/[0.02] border border-white/[0.06] space-y-5">
      <h3 className="text-sm font-semibold text-white mb-2">
        Notification Preferences
      </h3>
      <Separator className="bg-white/[0.06]" />
      {[
        { label: "Post published successfully", desc: "When a scheduled post goes live" },
        { label: "Generation complete", desc: "When AI finishes generating content" },
        { label: "Credits running low", desc: "When you have less than 100 credits" },
        { label: "Weekly report", desc: "Performance summary every Monday" },
      ].map(({ label, desc }, i) => (
        <div key={i} className="flex items-center justify-between">
          <div>
            <p className="text-sm text-white/70 font-medium">{label}</p>
            <p className="text-xs text-white/30">{desc}</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              defaultChecked={i < 3}
              className="sr-only peer"
            />
            <div className="w-9 h-5 bg-white/[0.1] rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-indigo-600" />
          </label>
        </div>
      ))}
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("workspace");

  return (
    <div className="p-5 md:p-8 pb-24 md:pb-8 max-w-4xl">
      <div className="mb-6">
        <h1 className="text-xl font-bold text-white mb-1">Settings</h1>
        <p className="text-sm text-white/30">
          Manage your workspace, team, and integrations
        </p>
      </div>

      {/* Mobile: horizontal tab scroll */}
      <div className="flex md:hidden gap-1.5 mb-6 overflow-x-auto pb-1">
        {TABS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className={cn(
              "flex-shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium transition-colors",
              activeTab === id
                ? "bg-indigo-600 text-white"
                : "bg-white/[0.05] text-white/40"
            )}
          >
            <Icon className="w-3.5 h-3.5" />
            {label}
          </button>
        ))}
      </div>

      <div className="flex gap-8">
        {/* Desktop sidebar tabs */}
        <div className="hidden md:block w-44 flex-shrink-0 space-y-1">
          {TABS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors",
                activeTab === id
                  ? "bg-white/[0.08] text-white"
                  : "text-white/40 hover:text-white/70 hover:bg-white/[0.04]"
              )}
            >
              <Icon className="w-4 h-4" />
              {label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {activeTab === "workspace" && <WorkspaceTab />}
          {activeTab === "team" && <TeamTab />}
          {activeTab === "notifications" && <NotificationsTab />}
          {activeTab === "integrations" && <IntegrationsTab />}
        </div>
      </div>
    </div>
  );
}
