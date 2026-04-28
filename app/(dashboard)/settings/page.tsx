"use client";

import { useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Bell,
  Users,
  Webhook,
  Check,
  Loader2,
  UserPlus,
  ExternalLink,
  Palette,
  Moon,
  Sun,
  ShieldCheck,
  Plus,
  Pencil,
  Trash2,
  ChevronDown,
  X,
  AlertTriangle,
} from "lucide-react";
import { toast } from "sonner";
import { useTranslations } from "next-intl";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
  workspaceApi,
  rolesApi,
  socialApi,
  type WorkspaceMember,
  type CustomRole,
  type Permission,
} from "@/lib/api";
import { cn } from "@/lib/utils";
import { useAppStore } from "@/store/app-store";

const TABS = [
  { id: "team", labelKey: "team", icon: Users },
  { id: "notifications", labelKey: "notifications", icon: Bell },
  { id: "integrations", labelKey: "integrations", icon: Webhook },
  { id: "appearance", labelKey: "appearance", icon: Palette },
];

const SOCIAL_PLATFORMS = [
  {
    id: "instagram",
    label: "Instagram",
    gradient: "from-pink-600 to-orange-500",
  },
  { id: "tiktok", label: "TikTok", gradient: "from-zinc-800 to-zinc-600" },
  { id: "facebook", label: "Facebook", gradient: "from-blue-700 to-blue-500" },
  {
    id: "twitter",
    label: "X / Twitter",
    gradient: "from-zinc-900 to-zinc-700",
  },
];

// ─── Permission groups ─────────────────────────────────────────────────────────

const PERMISSION_GROUPS: { key: string; perms: Permission[] }[] = [
  { key: "members", perms: ["MANAGE_MEMBERS", "MANAGE_ROLES"] },
  {
    key: "content",
    perms: [
      "MANAGE_BRAND_KIT",
      "MANAGE_SOCIAL",
      "MANAGE_POSTS",
      "RUN_AI_GENERATION",
    ],
  },
  {
    key: "tasks",
    perms: ["CREATE_TASKS", "ASSIGN_TASKS", "MANAGE_TASKS", "VIEW_ALL_TASKS"],
  },
];

const ROLE_PRESET_COLORS = [
  "#6366f1",
  "#8b5cf6",
  "#ec4899",
  "#f59e0b",
  "#10b981",
  "#3b82f6",
  "#ef4444",
  "#14b8a6",
];

// ─── Role Form (create / edit) ─────────────────────────────────────────────────

function RoleForm({
  initial,
  onClose,
}: {
  initial?: CustomRole;
  onClose: () => void;
}) {
  const t = useTranslations("settingsPage");
  const queryClient = useQueryClient();
  const [name, setName] = useState(initial?.name ?? "");
  const [color, setColor] = useState(initial?.color ?? ROLE_PRESET_COLORS[0]);
  const [perms, setPerms] = useState<Set<Permission>>(
    new Set(initial?.permissions ?? []),
  );

  const isEdit = !!initial;

  const { mutate, isPending } = useMutation({
    mutationFn: async () => {
      const permissions = Array.from(perms);
      if (isEdit)
        return rolesApi.update(initial.id, { name, color, permissions });
      return rolesApi.create({ name, color, permissions });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["workspace", "roles"] });
      toast.success(
        isEdit ? t("team.roles.updateSuccess") : t("team.roles.createSuccess"),
      );
      onClose();
    },
    onError: () => {
      toast.error(
        isEdit ? t("team.roles.updateFailed") : t("team.roles.createFailed"),
      );
    },
  });

  const togglePerm = (p: Permission) =>
    setPerms((prev) => {
      const next = new Set(prev);
      next.has(p) ? next.delete(p) : next.add(p);
      return next;
    });

  return (
    <div className="p-5 rounded-3xl bg-card border border-border space-y-5">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-semibold text-foreground">
          {isEdit ? t("team.roles.editRole") : t("team.roles.createRole")}
        </h4>
        <button
          onClick={onClose}
          className="text-muted-foreground hover:text-foreground transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Name */}
      <div className="space-y-1.5">
        <label className="text-xs font-medium text-muted-foreground">
          {t("team.roles.roleName")}
        </label>
        <Input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder={t("team.roles.roleNamePlaceholder")}
          maxLength={50}
        />
      </div>

      {/* Color */}
      <div className="space-y-2">
        <label className="text-xs font-medium text-muted-foreground">
          {t("team.roles.roleColor")}
        </label>
        <div className="flex items-center gap-2 flex-wrap">
          {ROLE_PRESET_COLORS.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setColor(c)}
              className={cn(
                "w-7 h-7 rounded-full transition-transform",
                color === c
                  ? "ring-2 ring-offset-2 ring-offset-card ring-white/50 scale-110"
                  : "hover:scale-105",
              )}
              style={{ backgroundColor: c }}
            />
          ))}
          <input
            type="color"
            value={color}
            onChange={(e) => setColor(e.target.value)}
            className="w-7 h-7 rounded-full cursor-pointer border border-border bg-transparent overflow-hidden"
            title="Custom color"
          />
        </div>
      </div>

      {/* Permissions */}
      <div className="space-y-4">
        <p className="text-xs font-medium text-muted-foreground">
          {t("team.roles.permissionsTitle")}
        </p>
        {PERMISSION_GROUPS.map(({ key, perms: groupPerms }) => (
          <div key={key} className="space-y-2">
            <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
              {t(`team.roles.groups.${key}`)}
            </p>
            {groupPerms.map((p) => {
              const active = perms.has(p);
              return (
                <div
                  key={p}
                  className="flex items-center justify-between gap-3 py-1"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground/80">
                      {t(`team.roles.permissions.${p}.label`)}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {t(`team.roles.permissions.${p}.desc`)}
                    </p>
                  </div>
                  {/* Toggle switch */}
                  <button
                    type="button"
                    role="switch"
                    aria-checked={active}
                    onClick={() => togglePerm(p)}
                    className={cn(
                      "relative flex-shrink-0 w-10 h-5 rounded-full transition-colors duration-200",
                      active ? "bg-indigo-500" : "bg-white/10",
                    )}
                  >
                    <span
                      className={cn(
                        "absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-all duration-200",
                        active ? "left-[calc(100%-18px)]" : "left-0.5",
                      )}
                    />
                  </button>
                </div>
              );
            })}
          </div>
        ))}
      </div>

      {/* Actions */}
      <div className="flex gap-2 pt-1">
        <button
          onClick={onClose}
          className="flex-1 py-2.5 rounded-xl text-sm font-medium bg-muted/50 text-muted-foreground hover:text-foreground transition-colors"
        >
          {t("team.roles.cancel")}
        </button>
        <button
          disabled={!name.trim() || isPending}
          onClick={() => mutate()}
          className="flex-1 py-2.5 rounded-xl text-sm font-medium bg-linear-to-r from-indigo-500 to-violet-600 hover:from-indigo-400 hover:to-violet-500 disabled:opacity-50 text-white transition-colors flex items-center justify-center gap-2"
        >
          {isPending && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
          {isPending ? t("team.roles.saving") : t("team.roles.save")}
        </button>
      </div>
    </div>
  );
}

// ─── Roles section ─────────────────────────────────────────────────────────────

function RolesSection() {
  const t = useTranslations("settingsPage");
  const queryClient = useQueryClient();
  const [showCreate, setShowCreate] = useState(false);
  const [editingRole, setEditingRole] = useState<CustomRole | null>(null);

  const { data: roles = [], isLoading } = useQuery({
    queryKey: ["workspace", "roles"],
    queryFn: rolesApi.list,
  });

  const [deleteConfirmRole, setDeleteConfirmRole] = useState<CustomRole | null>(
    null,
  );

  const { mutate: deleteRole, isPending: isDeleting } = useMutation({
    mutationFn: (id: string) => rolesApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["workspace", "roles"] });
      queryClient.invalidateQueries({ queryKey: ["workspace", "members"] });
      setDeleteConfirmRole(null);
    },
    onError: (err: unknown) => {
      const status =
        err &&
        typeof err === "object" &&
        "response" in err &&
        (err as { response?: { status?: number } }).response?.status;
      toast.error(
        status === 409
          ? t("team.roles.deleteConflict")
          : t("team.roles.deleteFailed"),
      );
    },
  });

  if (editingRole) {
    return (
      <RoleForm initial={editingRole} onClose={() => setEditingRole(null)} />
    );
  }

  if (showCreate) {
    return <RoleForm onClose={() => setShowCreate(false)} />;
  }

  return (
    <div className="p-5 rounded-3xl bg-card border border-border space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-indigo-400" />
            {t("team.roles.sectionTitle")}
          </h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            {t("team.roles.sectionDesc")}
          </p>
        </div>
        <button
          onClick={() => setShowCreate(true)}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-400 text-xs font-medium transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
          {t("team.roles.createRole")}
        </button>
      </div>

      {isLoading ? (
        <div className="space-y-2">
          {[1, 2].map((i) => (
            <div key={i} className="skeleton h-12 rounded-xl" />
          ))}
        </div>
      ) : roles.length === 0 ? (
        <p className="text-xs text-muted-foreground text-center py-4">
          {t("team.roles.noRoles")}
        </p>
      ) : (
        <div className="space-y-2">
          {roles.map((role) => (
            <div
              key={role.id}
              className="flex items-start gap-3 p-3 rounded-xl bg-muted/30 border border-border/50"
            >
              <div
                className="w-1 self-stretch rounded-full flex-shrink-0 mt-0.5"
                style={{ backgroundColor: role.color || "#6366f1" }}
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-foreground">
                    {role.name}
                  </span>
                  <span
                    className="text-[10px] font-medium px-1.5 py-0.5 rounded-full"
                    style={{
                      backgroundColor: `${role.color}22`,
                      color: role.color || "#6366f1",
                    }}
                  >
                    {role.permissions.length} {t("team.roles.permCount")}
                  </span>
                </div>
                {role.permissions.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-1.5">
                    {role.permissions.slice(0, 4).map((p) => (
                      <span
                        key={p}
                        className="text-[10px] px-1.5 py-0.5 rounded bg-white/[0.05] text-muted-foreground"
                      >
                        {t(`team.roles.permissions.${p}.label`)}
                      </span>
                    ))}
                    {role.permissions.length > 4 && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/[0.05] text-muted-foreground">
                        +{role.permissions.length - 4}
                      </span>
                    )}
                  </div>
                )}
              </div>
              <div className="flex items-center gap-1 flex-shrink-0">
                <button
                  onClick={() => setEditingRole(role)}
                  className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
                >
                  <Pencil className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setDeleteConfirmRole(role)}
                  className="p-1.5 rounded-lg text-muted-foreground hover:text-red-400 hover:bg-red-400/10 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {deleteConfirmRole && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-sm bg-[#111] border border-white/10 rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-red-500/15 flex items-center justify-center flex-shrink-0">
                <AlertTriangle className="w-5 h-5 text-red-400" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-foreground">
                  {t("team.roles.deleteDialogTitle")}
                </h3>
                <p className="text-sm text-muted-foreground mt-1">
                  {t("team.roles.deleteDialogDesc")}
                </p>
              </div>
            </div>
            <div className="flex gap-2 pt-1">
              <button
                onClick={() => setDeleteConfirmRole(null)}
                className="flex-1 py-2.5 rounded-xl text-sm font-medium bg-muted/50 text-muted-foreground hover:text-foreground transition-colors"
              >
                {t("team.roles.cancel")}
              </button>
              <button
                disabled={isDeleting}
                onClick={() =>
                  deleteConfirmRole && deleteRole(deleteConfirmRole.id)
                }
                className="flex-1 py-2.5 rounded-xl text-sm font-medium bg-red-500 hover:bg-red-600 disabled:opacity-50 text-white transition-colors flex items-center justify-center gap-2"
              >
                {isDeleting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                {t("team.roles.deleteButton")}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Team tab ─────────────────────────────────────────────────────────────────

function TeamTab() {
  const t = useTranslations("settingsPage");
  const queryClient = useQueryClient();
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRoleId, setInviteRoleId] = useState<string>("");
  const [inviting, setInviting] = useState(false);
  const [memberRoleOpen, setMemberRoleOpen] = useState<string | null>(null);

  const { data: members = [], isLoading } = useQuery({
    queryKey: ["workspace", "members"],
    queryFn: () => workspaceApi.getMembers(),
  });

  const { data: roles = [] } = useQuery({
    queryKey: ["workspace", "roles"],
    queryFn: rolesApi.list,
  });

  const { mutate: assignRole } = useMutation({
    mutationFn: ({
      memberId,
      roleId,
    }: {
      memberId: string;
      roleId: string | null;
    }) => rolesApi.assignToMember(memberId, roleId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["workspace", "members"] });
      toast.success(t("team.roleSaved"));
      setMemberRoleOpen(null);
    },
    onError: () => toast.error(t("team.roleSaveFailed")),
  });

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteEmail.trim()) return;
    setInviting(true);
    try {
      await workspaceApi.inviteMember(inviteEmail.trim(), inviteRoleId || null);
      queryClient.invalidateQueries({ queryKey: ["workspace", "members"] });
      toast.success(t("team.inviteSentTo", { email: inviteEmail }));
      setInviteEmail("");
      setInviteRoleId("");
    } catch {
      toast.error(t("team.inviteFailed"));
    } finally {
      setInviting(false);
    }
  };

  return (
    <div className="space-y-5">
      {/* Invite */}
      <div className="p-5 rounded-3xl bg-card border border-border">
        <h3 className="text-sm font-semibold text-foreground mb-1">
          {t("team.inviteTitle")}
        </h3>
        <p className="text-xs text-muted-foreground mb-4">
          {t("team.inviteDesc")}
        </p>
        <form onSubmit={handleInvite} className="space-y-2">
          <div className="flex gap-2">
            <Input
              type="email"
              placeholder={t("team.invitePlaceholder")}
              value={inviteEmail}
              onChange={(e) => setInviteEmail(e.target.value)}
              className="flex-1"
            />
            <button
              type="submit"
              disabled={inviting || !inviteEmail}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-linear-to-r from-indigo-500 to-violet-600 hover:from-indigo-400 hover:to-violet-500 disabled:opacity-50 text-white text-sm font-medium transition-colors flex-shrink-0"
            >
              {inviting ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <UserPlus className="w-4 h-4" />
              )}
              <span className="hidden sm:inline">{t("team.inviteButton")}</span>
            </button>
          </div>
          {/* Role selector for invite */}
          {roles.length > 0 && (
            <div className="relative">
              <select
                value={inviteRoleId}
                onChange={(e) => setInviteRoleId(e.target.value)}
                className="w-full appearance-none bg-input border border-border rounded-xl px-3 py-2.5 text-sm text-foreground/70 focus:outline-none focus:ring-1 focus:ring-indigo-500 pr-8"
              >
                <option value="">{t("team.noRole")}</option>
                {roles.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.name}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
            </div>
          )}
        </form>
      </div>

      {/* Roles management */}
      <RolesSection />

      {/* Members list */}
      <div className="p-5 rounded-3xl bg-card border border-border">
        <h3 className="text-sm font-semibold text-foreground mb-4">
          {t("team.membersTitle")}
        </h3>
        {isLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="skeleton h-12 rounded-xl" />
            ))}
          </div>
        ) : members.length > 0 ? (
          <div className="space-y-2">
            {members.map((m: WorkspaceMember) => (
              <div
                key={m.id}
                className="flex items-center justify-between py-2.5"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-indigo-500/20 flex items-center justify-center text-xs font-bold text-indigo-300">
                    {m.name?.[0]?.toUpperCase() ?? "?"}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      {m.name}
                    </p>
                    <p className="text-xs text-muted-foreground">{m.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {/* Custom role badge */}
                  {m.customRole && (
                    <span
                      className="text-[10px] font-medium px-2 py-0.5 rounded-full"
                      style={{
                        backgroundColor: `${m.customRole.color}22`,
                        color: m.customRole.color || "#6366f1",
                      }}
                    >
                      {m.customRole.name}
                    </span>
                  )}
                  {/* System role badge */}
                  <span
                    className={cn(
                      "text-xs font-medium px-2.5 py-1 rounded-xl capitalize",
                      m.role?.toLowerCase() === "owner"
                        ? "bg-indigo-500/15 text-indigo-300"
                        : "bg-white/[0.06] text-muted-foreground",
                    )}
                  >
                    {m.role}
                  </span>
                  {/* Assign role dropdown (non-owners) */}
                  {m.role?.toLowerCase() !== "owner" && roles.length > 0 && (
                    <div className="relative">
                      <button
                        onClick={() =>
                          setMemberRoleOpen(
                            memberRoleOpen === m.id ? null : m.id,
                          )
                        }
                        className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
                        title={t("team.assignRole")}
                      >
                        <ShieldCheck className="w-3.5 h-3.5" />
                      </button>
                      {memberRoleOpen === m.id && (
                        <div className="absolute right-0 top-8 z-20 w-44 bg-[#111] border border-white/10 rounded-xl shadow-2xl p-1">
                          <button
                            onClick={() =>
                              assignRole({ memberId: m.id, roleId: null })
                            }
                            className="w-full text-left px-3 py-2 text-xs text-muted-foreground hover:text-foreground hover:bg-white/[0.06] rounded-lg transition-colors"
                          >
                            {t("team.removeRole")}
                          </button>
                          <Separator className="my-1 bg-white/10" />
                          {roles.map((r) => (
                            <button
                              key={r.id}
                              onClick={() =>
                                assignRole({ memberId: m.id, roleId: r.id })
                              }
                              className="w-full flex items-center gap-2 text-left px-3 py-2 text-xs text-foreground/80 hover:text-foreground hover:bg-white/[0.06] rounded-lg transition-colors"
                            >
                              <span
                                className="w-2 h-2 rounded-full flex-shrink-0"
                                style={{
                                  backgroundColor: r.color || "#6366f1",
                                }}
                              />
                              {r.name}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground text-center py-6">
            {t("team.noTeammates")}
          </p>
        )}
      </div>
    </div>
  );
}

// ─── Integrations tab ─────────────────────────────────────────────────────────

function IntegrationsTab() {
  const t = useTranslations("settingsPage");
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
      toast.error(t("integrations.connectFailed"));
      setConnecting(null);
    }
  };

  const handleDisconnect = () => {
    toast.info(t("integrations.disconnectSoon"));
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
                className="flex items-center justify-between p-5 rounded-2xl bg-card border border-border hover:bg-muted/30 transition-colors"
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
                    <p className="text-sm font-semibold text-foreground">
                      {label}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {isConnected
                        ? conn?.username
                          ? `@${conn.username}`
                          : t("integrations.connected")
                        : t("integrations.connectYour", { platform: label })}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  {isConnected && (
                    <span className="flex items-center gap-1.5 text-xs text-emerald-500 font-medium">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse-dot" />
                      {t("integrations.connected")}
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
                        ? "bg-muted text-muted-foreground hover:text-foreground hover:bg-muted/70 border border-border"
                        : "bg-linear-to-r from-indigo-500 to-violet-600 hover:from-indigo-400 hover:to-violet-500 text-white",
                    )}
                  >
                    {isConnecting ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : !isConnected ? (
                      <ExternalLink className="w-3.5 h-3.5" />
                    ) : null}
                    {isConnecting
                      ? "Redirecting…"
                      : isConnected
                        ? t("integrations.disconnectButton")
                        : t("integrations.connectButton")}
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
  const t = useTranslations("settingsPage");

  return (
    <div className="p-6 rounded-3xl bg-card border border-border space-y-5">
      <h3 className="text-sm font-semibold text-foreground mb-2">
        {t("notifications.sectionTitle")}
      </h3>
      <Separator className="bg-border" />
      {(
        [
          [
            t("notifications.postPublished"),
            t("notifications.postPublishedDesc"),
          ],
          [
            t("notifications.generationComplete"),
            t("notifications.generationCompleteDesc"),
          ],
          [t("notifications.creditsLow"), t("notifications.creditsLowDesc")],
          [
            t("notifications.weeklyReport"),
            t("notifications.weeklyReportDesc"),
          ],
        ] as [string, string][]
      ).map(([label, desc], i) => (
        <div key={i} className="flex items-center justify-between">
          <div>
            <p className="text-sm text-foreground/70 font-medium">{label}</p>
            <p className="text-xs text-muted-foreground">{desc}</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              defaultChecked={i < 3}
              className="sr-only peer"
            />
            <div className="w-9 h-5 bg-border rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-indigo-500" />
          </label>
        </div>
      ))}
    </div>
  );
}

// ─── Appearance tab ───────────────────────────────────────────────────────────

function AppearanceTab() {
  const t = useTranslations("settingsPage");
  const { theme, setTheme } = useAppStore();

  const options = [
    {
      id: "dark" as const,
      icon: Moon,
      title: t("appearance.dark"),
      desc: t("appearance.darkDesc"),
    },
    {
      id: "light" as const,
      icon: Sun,
      title: t("appearance.light"),
      desc: t("appearance.lightDesc"),
    },
  ];

  return (
    <div className="p-6 rounded-3xl bg-card border border-border space-y-5">
      <div>
        <h3 className="text-sm font-semibold text-foreground mb-1">
          {t("appearance.title")}
        </h3>
        <p className="text-xs text-muted-foreground">
          {t("appearance.subtitle")}
        </p>
      </div>
      <Separator className="bg-border" />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {options.map(({ id, icon: Icon, title, desc }) => {
          const active = theme === id;
          return (
            <button
              key={id}
              type="button"
              onClick={() => setTheme(id)}
              className={cn(
                "relative flex flex-col items-start gap-3 p-4 rounded-2xl border text-left transition-all duration-150",
                active
                  ? "border-indigo-500/50 bg-indigo-500/10 ring-1 ring-indigo-500/30"
                  : "border-border bg-card hover:bg-muted/30 hover:border-border/60",
              )}
            >
              {active && (
                <span className="absolute top-3 right-3 w-5 h-5 rounded-full bg-indigo-500 flex items-center justify-center">
                  <Check className="w-3 h-3 text-white" />
                </span>
              )}
              <div
                className={cn(
                  "w-9 h-9 rounded-xl flex items-center justify-center",
                  active ? "bg-indigo-500/20" : "bg-muted",
                )}
              >
                <Icon
                  className={cn(
                    "w-5 h-5",
                    active ? "text-indigo-400" : "text-muted-foreground",
                  )}
                />
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground/80">
                  {title}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">{desc}</p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────

function SettingsPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const activeTab = searchParams.get("tab") ?? "team";
  const t = useTranslations("settingsPage");

  function setActiveTab(id: string) {
    router.replace(`/settings?tab=${id}`, { scroll: false });
  }

  return (
    <div className="min-h-full p-5 md:p-8 pb-24 md:pb-8 w-full">
      <div className="mb-6">
        <h1 className="text-xl font-bold text-foreground mb-1">{t("title")}</h1>
        <p className="text-sm text-muted-foreground">{t("subtitle")}</p>
      </div>

      {/* Mobile: horizontal tab scroll */}
      <div className="flex md:hidden gap-1.5 mb-6 overflow-x-auto pb-1">
        {TABS.map(({ id, labelKey, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className={cn(
              "flex-shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium transition-colors",
              activeTab === id
                ? "bg-linear-to-r from-indigo-500 to-violet-600 text-white"
                : "bg-muted/50 text-muted-foreground",
            )}
          >
            <Icon className="w-3.5 h-3.5" />
            {t(`tabs.${labelKey}`)}
          </button>
        ))}
      </div>

      <div className="flex gap-8">
        {/* Desktop sidebar tabs */}
        <div className="hidden md:block w-44 flex-shrink-0 space-y-1">
          {TABS.map(({ id, labelKey, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 border-l-2",
                activeTab === id
                  ? "bg-indigo-500/15 text-indigo-300 border-indigo-500"
                  : "text-muted-foreground hover:text-foreground/70 hover:bg-muted/50 border-transparent",
              )}
            >
              <Icon
                className={cn(
                  "w-4 h-4",
                  activeTab === id ? "text-indigo-400" : "",
                )}
              />
              {t(`tabs.${labelKey}`)}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {activeTab === "team" && <TeamTab />}
          {activeTab === "notifications" && <NotificationsTab />}
          {activeTab === "integrations" && <IntegrationsTab />}
          {activeTab === "appearance" && <AppearanceTab />}
        </div>
      </div>
    </div>
  );
}

export default function SettingsPage() {
  return (
    <Suspense fallback={null}>
      <SettingsPageContent />
    </Suspense>
  );
}
