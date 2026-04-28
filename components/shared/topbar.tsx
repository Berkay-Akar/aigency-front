"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import {
  ChevronDown,
  Bell,
  Search,
  Check,
  Plus,
  Loader2,
  UserPlus,
  Sun,
  Moon,
  X,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useRef, useEffect, KeyboardEvent } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { CreditBadge } from "./credit-badge";
import { LanguageSwitcher } from "./language-switcher";
import { useAppStore } from "@/store/app-store";
import { useAuthStore } from "@/store/auth-store";
import { brandsApi, notificationsApi } from "@/lib/api";
import { addOrUpdateBrandSession } from "@/lib/auth";
import { cn } from "@/lib/utils";

export function Topbar() {
  const t = useTranslations("common");
  const router = useRouter();
  const { workspace, setWorkspace, theme, setTheme } = useAppStore();
  const { user, logout, switchBrand, activeWorkspaceId } = useAuthStore();
  const queryClient = useQueryClient();

  const [switching, setSwitching] = useState<string | null>(null);
  const [creatingBrand, setCreatingBrand] = useState(false);
  const [newBrandName, setNewBrandName] = useState("");
  const [showNewInput, setShowNewInput] = useState(false);
  const [brandMenuOpen, setBrandMenuOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);
  const newInputRef = useRef<HTMLInputElement>(null);

  const tNotif = useTranslations("notificationsPanel");

  const { data: notifData, refetch: refetchNotifs } = useQuery({
    queryKey: ["notifications", "unread"],
    queryFn: () => notificationsApi.list({ limit: 15, unreadOnly: false }),
    refetchInterval: 30_000,
  });

  const notifications = notifData?.notifications ?? [];
  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const { mutate: markRead } = useMutation({
    mutationFn: (id: string) => notificationsApi.markRead(id),
    onSuccess: () => {
      void refetchNotifs();
    },
  });

  const { mutate: markAllRead } = useMutation({
    mutationFn: () => notificationsApi.markAllRead(),
    onSuccess: () => void refetchNotifs(),
  });

  useEffect(() => {
    if (!notifOpen) return;
    const handler = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setNotifOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [notifOpen]);

  const { data: brands = [] } = useQuery({
    queryKey: ["brands"],
    queryFn: brandsApi.list,
  });

  const initials = user?.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "?";

  const handleSwitchBrand = async (brandId: string, brandName: string) => {
    if (switching) return;
    setSwitching(brandId);
    try {
      await switchBrand(brandId);
      setWorkspace(brandName);
      queryClient.clear();
      toast.success(t("switchedTo", { name: brandName }));
    } catch {
      toast.error(t("couldNotSwitch"));
    } finally {
      setSwitching(null);
    }
  };

  const handleCreateBrand = async () => {
    const name = newBrandName.trim();
    if (!name) return;
    setCreatingBrand(true);
    try {
      const { brand, token } = await brandsApi.create(name);
      // Store the new brand's token so the session is available immediately
      addOrUpdateBrandSession({
        workspaceId: brand.workspaceId,
        name: brand.name,
        token,
      });
      await handleSwitchBrand(brand.workspaceId, brand.name);
      queryClient.invalidateQueries({ queryKey: ["brands"] });
      setNewBrandName("");
      setShowNewInput(false);
    } catch {
      toast.error(t("couldNotCreate"));
    } finally {
      setCreatingBrand(false);
    }
  };

  const handleNewInputKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") void handleCreateBrand();
    if (e.key === "Escape") {
      setShowNewInput(false);
      setNewBrandName("");
    }
  };

  return (
    <header className="flex h-15 shrink-0 items-center justify-between border-b border-white/10 topbar-bg px-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] backdrop-blur-xl md:px-6">
      {/* Left: brand switcher */}
      <DropdownMenu
        open={brandMenuOpen}
        onOpenChange={(o) => {
          if (!o && showNewInput) return;
          setBrandMenuOpen(o);
          if (!o) {
            setShowNewInput(false);
            setNewBrandName("");
          }
        }}
      >
        <DropdownMenuTrigger className="flex items-center gap-2 text-sm font-medium text-white/80 outline-none hover:text-white transition-colors group">
          <div className="w-6 h-6 rounded-lg bg-indigo-500/20 flex items-center justify-center">
            <span className="text-indigo-400 text-xs font-bold">
              {workspace?.[0] ?? "W"}
            </span>
          </div>
          <span className="hidden sm:inline">
            {workspace || t("workspace")}
          </span>
          <ChevronDown className="w-3.5 h-3.5 text-white/30 group-hover:text-white/50 transition-colors" />
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="start"
          className="bg-[#111] border-white/8 rounded-xl shadow-2xl w-56 p-1"
        >
          <div className="px-3 py-2">
            <p className="text-[10px] font-semibold text-white/30 uppercase tracking-wider">
              {t("yourBrands")}
            </p>
          </div>

          {brands.map((brand) => {
            const isActive =
              activeWorkspaceId === brand.workspaceId ||
              (!activeWorkspaceId && brand.name === workspace);
            const isLoading = switching === brand.workspaceId;
            return (
              <DropdownMenuItem
                key={brand.workspaceId}
                onClick={() =>
                  void handleSwitchBrand(brand.workspaceId, brand.name)
                }
                disabled={isActive || !!switching}
                className={cn(
                  "flex items-center gap-2.5 px-3 py-2 rounded-lg cursor-pointer transition-colors",
                  isActive
                    ? "text-white bg-white/6"
                    : "text-white/50 hover:text-white",
                )}
              >
                <div className="w-6 h-6 rounded-lg bg-indigo-500/20 flex items-center justify-center shrink-0">
                  <span className="text-indigo-400 text-[10px] font-bold">
                    {brand.name[0]}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{brand.name}</p>
                  <p className="text-[10px] text-white/30 capitalize">
                    {brand.role.toLowerCase()}
                  </p>
                </div>
                {isLoading ? (
                  <Loader2 className="w-3.5 h-3.5 text-indigo-400 animate-spin shrink-0" />
                ) : isActive ? (
                  <Check className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                ) : null}
              </DropdownMenuItem>
            );
          })}

          <DropdownMenuSeparator className="bg-white/6 my-1" />

          {showNewInput ? (
            <div className="px-2 py-1.5">
              <input
                ref={newInputRef}
                autoFocus
                value={newBrandName}
                onChange={(e) => setNewBrandName(e.target.value)}
                onKeyDown={handleNewInputKeyDown}
                placeholder={t("brandNamePlaceholder")}
                disabled={creatingBrand}
                className="w-full bg-white/6 border border-white/10 rounded-lg px-3 py-1.5 text-sm text-white placeholder:text-white/25 outline-none focus:border-indigo-500/40 disabled:opacity-50"
              />
              <div className="flex gap-1.5 mt-1.5">
                <button
                  onClick={() => void handleCreateBrand()}
                  disabled={creatingBrand || !newBrandName.trim()}
                  className="flex-1 text-xs font-medium py-1 rounded-lg bg-linear-to-r from-indigo-500 to-violet-600 hover:from-indigo-400 hover:to-violet-500 text-white disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  {creatingBrand ? t("creating") : t("create")}
                </button>
                <button
                  onClick={() => {
                    setShowNewInput(false);
                    setNewBrandName("");
                  }}
                  className="flex-1 text-xs font-medium py-1 rounded-lg bg-white/5 hover:bg-white/8 text-white/50 transition-colors"
                >
                  {t("cancel")}
                </button>
              </div>
            </div>
          ) : (
            <>
              <DropdownMenuItem
                onClick={() => {
                  setShowNewInput(true);
                  setTimeout(() => newInputRef.current?.focus(), 50);
                }}
                closeOnClick={false}
                className="flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer text-white/40 hover:text-white transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span className="text-sm">{t("newBrand")}</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => router.push("/login?addAccount=1")}
                className="flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer text-white/40 hover:text-white transition-colors"
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span className="text-sm">{t("loginAnotherAccount")}</span>
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Right: credits + notifications + avatar */}
      <div className="flex items-center gap-2 md:gap-3">
        {/* Theme toggle */}
        <button
          type="button"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          aria-label={
            theme === "dark" ? "Switch to light mode" : "Switch to dark mode"
          }
          className="relative w-8 h-8 rounded-xl flex items-center justify-center text-white/30 hover:text-white/70 hover:bg-white/5 transition-all overflow-hidden"
        >
          <Sun
            className="w-4 h-4 absolute transition-all duration-300"
            style={{
              opacity: theme === "light" ? 1 : 0,
              transform:
                theme === "light"
                  ? "rotate(0deg) scale(1)"
                  : "rotate(-90deg) scale(0.5)",
            }}
          />
          <Moon
            className="w-4 h-4 absolute transition-all duration-300"
            style={{
              opacity: theme === "dark" ? 1 : 0,
              transform:
                theme === "dark"
                  ? "rotate(0deg) scale(1)"
                  : "rotate(90deg) scale(0.5)",
            }}
          />
        </button>
        <LanguageSwitcher />
        <button
          type="button"
          aria-label={t("search")}
          className="w-8 h-8 rounded-xl hidden sm:flex items-center justify-center text-white/30 hover:text-white/60 hover:bg-white/5 transition-all"
        >
          <Search className="w-4 h-4" aria-hidden />
        </button>
        {/* Notifications */}
        <div className="relative" ref={notifRef}>
          <button
            type="button"
            aria-label={tNotif("title")}
            onClick={() => setNotifOpen(!notifOpen)}
            className="w-8 h-8 rounded-xl flex items-center justify-center text-white/30 hover:text-white/60 hover:bg-white/5 transition-all relative"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 min-w-[14px] h-[14px] rounded-full bg-indigo-500 flex items-center justify-center text-[9px] font-bold text-white px-0.5">
                {unreadCount > 9 ? "9+" : unreadCount}
              </span>
            )}
          </button>

          {notifOpen && (
            <div className="absolute right-0 top-10 z-50 w-80 bg-[#111] border border-white/10 rounded-2xl shadow-2xl overflow-hidden">
              {/* Panel header */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-white/[0.06]">
                <span className="text-sm font-semibold text-white">
                  {tNotif("title")}
                  {unreadCount > 0 && (
                    <span className="ml-2 text-xs font-medium px-1.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-400">
                      {unreadCount}
                    </span>
                  )}
                </span>
                <div className="flex items-center gap-1">
                  {unreadCount > 0 && (
                    <button
                      onClick={() => markAllRead()}
                      className="text-[10px] text-white/40 hover:text-white transition-colors"
                    >
                      {tNotif("markAllRead")}
                    </button>
                  )}
                  <button
                    onClick={() => setNotifOpen(false)}
                    className="ml-2 text-white/20 hover:text-white/60 transition-colors"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Notifications list */}
              <div className="max-h-80 overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="py-10 text-center">
                    <Bell className="w-6 h-6 text-white/10 mx-auto mb-2" />
                    <p className="text-xs text-white/30">
                      {tNotif("noNotifications")}
                    </p>
                  </div>
                ) : (
                  notifications.map((notif) => (
                    <button
                      key={notif.id}
                      onClick={() => {
                        if (!notif.isRead) markRead(notif.id);
                        if (notif.taskId) router.push("/tasks");
                        setNotifOpen(false);
                      }}
                      className={`w-full text-left px-4 py-3 border-b border-white/[0.04] last:border-0 transition-colors ${
                        notif.isRead
                          ? "opacity-50 hover:opacity-70"
                          : "hover:bg-white/[0.03]"
                      }`}
                    >
                      <div className="flex items-start gap-2.5">
                        {!notif.isRead && (
                          <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-indigo-500 flex-shrink-0" />
                        )}
                        <div
                          className={`flex-1 min-w-0 ${notif.isRead ? "" : ""}`}
                        >
                          <p className="text-xs font-medium text-white/80 leading-snug">
                            {notif.title}
                          </p>
                          {notif.body && (
                            <p className="text-[10px] text-white/40 mt-0.5 leading-relaxed line-clamp-2">
                              {notif.body}
                            </p>
                          )}
                          <p className="text-[10px] text-white/25 mt-1">
                            {new Date(notif.createdAt).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    </button>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        <CreditBadge />

        <DropdownMenu>
          <DropdownMenuTrigger className="flex items-center gap-2 outline-none">
            <Avatar className="w-8 h-8 border border-white/10">
              <AvatarFallback className="bg-indigo-500 text-white text-xs font-semibold">
                {initials}
              </AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="bg-[#111] border-white/8 rounded-xl shadow-2xl w-48"
          >
            <div className="px-3 py-2.5">
              <p className="text-sm font-medium text-white">
                {user?.name ?? t("user")}
              </p>
              <p className="text-xs text-white/40">{user?.email ?? ""}</p>
            </div>
            <DropdownMenuSeparator className="bg-white/6" />
            <DropdownMenuItem className="text-sm text-white/60 hover:text-white rounded-lg cursor-pointer">
              <Link href="/settings" className="w-full">
                {t("profile")}
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem className="text-sm text-white/60 hover:text-white rounded-lg cursor-pointer">
              <Link href="/billing" className="w-full">
                {t("billing")}
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-white/6" />
            <DropdownMenuItem
              onClick={logout}
              className="text-sm text-red-400 hover:text-red-300 rounded-lg cursor-pointer"
            >
              {t("signOut")}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
