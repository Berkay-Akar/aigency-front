"use client";

import Link from "next/link";
import { ChevronDown, Bell, Search } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { CreditBadge } from "./credit-badge";
import { useAppStore } from "@/store/app-store";
import { useAuthStore } from "@/store/auth-store";

export function Topbar() {
  const { workspace } = useAppStore();
  const { user, logout } = useAuthStore();

  const initials = user?.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "?";

  return (
    <header className="h-[60px] flex items-center justify-between px-4 md:px-6 border-b border-white/[0.06] bg-[#080808]/80 backdrop-blur-sm flex-shrink-0">
      {/* Left: workspace name */}
      <div className="flex items-center gap-2 text-sm font-medium text-white/80">
        <div className="w-6 h-6 rounded-lg bg-indigo-500/20 flex items-center justify-center">
          <span className="text-indigo-400 text-xs font-bold">
            {workspace?.[0] ?? "W"}
          </span>
        </div>
        <span className="hidden sm:inline">{workspace || "Workspace"}</span>
        <ChevronDown className="w-3.5 h-3.5 text-white/30" />
      </div>

      {/* Right: credits + notifications + avatar */}
      <div className="flex items-center gap-2 md:gap-3">
        <button className="w-8 h-8 rounded-xl hidden sm:flex items-center justify-center text-white/30 hover:text-white/60 hover:bg-white/[0.05] transition-all">
          <Search className="w-4 h-4" />
        </button>
        <button className="w-8 h-8 rounded-xl flex items-center justify-center text-white/30 hover:text-white/60 hover:bg-white/[0.05] transition-all relative">
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-indigo-500" />
        </button>

        <CreditBadge />

        <DropdownMenu>
          <DropdownMenuTrigger className="flex items-center gap-2 outline-none">
            <Avatar className="w-8 h-8 border border-white/10">
              <AvatarFallback className="bg-indigo-600 text-white text-xs font-semibold">
                {initials}
              </AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="bg-[#111] border-white/[0.08] rounded-xl shadow-2xl w-48"
          >
            <div className="px-3 py-2.5">
              <p className="text-sm font-medium text-white">{user?.name ?? "User"}</p>
              <p className="text-xs text-white/40">{user?.email ?? ""}</p>
            </div>
            <DropdownMenuSeparator className="bg-white/[0.06]" />
            <DropdownMenuItem className="text-sm text-white/60 hover:text-white rounded-lg cursor-pointer">
              <Link href="/settings" className="w-full">Profile</Link>
            </DropdownMenuItem>
            <DropdownMenuItem className="text-sm text-white/60 hover:text-white rounded-lg cursor-pointer">
              <Link href="/billing" className="w-full">Billing</Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-white/[0.06]" />
            <DropdownMenuItem
              onClick={logout}
              className="text-sm text-red-400 hover:text-red-300 rounded-lg cursor-pointer"
            >
              Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
