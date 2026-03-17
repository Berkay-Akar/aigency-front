"use client";

import { ChevronDown, Bell, Search } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CreditBadge } from "./credit-badge";
import { useAppStore } from "@/store/app-store";

const WORKSPACES = ["My Brand", "Client — Luxe Co.", "Client — SportX"];

export function Topbar() {
  const { workspace, setWorkspace } = useAppStore();

  return (
    <header className="h-[60px] flex items-center justify-between px-6 border-b border-white/[0.06] bg-[#080808]/80 backdrop-blur-sm flex-shrink-0">
      {/* Left: workspace switcher */}
      <DropdownMenu>
        <DropdownMenuTrigger className="flex items-center gap-2 text-sm font-medium text-white/80 hover:text-white transition-colors group outline-none">
          <div className="w-6 h-6 rounded-lg bg-indigo-500/20 flex items-center justify-center">
            <span className="text-indigo-400 text-xs font-bold">
              {workspace[0]}
            </span>
          </div>
          {workspace}
          <ChevronDown className="w-3.5 h-3.5 text-white/40 group-hover:text-white/60" />
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="start"
          className="bg-[#111] border-white/[0.08] rounded-xl shadow-2xl w-52"
        >
          {WORKSPACES.map((ws) => (
            <DropdownMenuItem
              key={ws}
              onClick={() => setWorkspace(ws)}
              className={`text-sm rounded-lg cursor-pointer ${
                ws === workspace
                  ? "text-indigo-300 bg-indigo-500/10"
                  : "text-white/60 hover:text-white"
              }`}
            >
              <div className="w-5 h-5 rounded-md bg-white/10 flex items-center justify-center mr-2">
                <span className="text-xs font-semibold text-white/60">
                  {ws[0]}
                </span>
              </div>
              {ws}
            </DropdownMenuItem>
          ))}
          <DropdownMenuSeparator className="bg-white/[0.06]" />
          <DropdownMenuItem className="text-sm text-white/40 hover:text-white rounded-lg cursor-pointer">
            + New workspace
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Right: credits + notifications + avatar */}
      <div className="flex items-center gap-3">
        <button className="w-8 h-8 rounded-xl flex items-center justify-center text-white/30 hover:text-white/60 hover:bg-white/[0.05] transition-all">
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
              <AvatarImage src="https://github.com/shadcn.png" />
              <AvatarFallback className="bg-indigo-600 text-white text-xs font-semibold">
                BK
              </AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="bg-[#111] border-white/[0.08] rounded-xl shadow-2xl w-48"
          >
            <div className="px-3 py-2.5">
              <p className="text-sm font-medium text-white">Berkay Akar</p>
              <p className="text-xs text-white/40">berkay@aigencys.com</p>
            </div>
            <DropdownMenuSeparator className="bg-white/[0.06]" />
            <DropdownMenuItem className="text-sm text-white/60 hover:text-white rounded-lg cursor-pointer">
              Profile
            </DropdownMenuItem>
            <DropdownMenuItem className="text-sm text-white/60 hover:text-white rounded-lg cursor-pointer">
              Billing
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-white/[0.06]" />
            <DropdownMenuItem className="text-sm text-red-400 hover:text-red-300 rounded-lg cursor-pointer">
              Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
