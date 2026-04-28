"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Wand2,
  CalendarDays,
  Images,
  Palette,
  Settings,
  HelpCircle,
  FileText,
  CreditCard,
  CheckSquare,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Logo } from "./logo";
import { useTranslations } from "next-intl";

const NAV_ITEMS = [
  { href: "/dashboard", icon: LayoutDashboard, labelKey: "dashboard" },
  { href: "/studio", icon: Wand2, labelKey: "studio" },
  { href: "/posts", icon: FileText, labelKey: "posts" },
  { href: "/calendar", icon: CalendarDays, labelKey: "calendar" },
  { href: "/assets", icon: Images, labelKey: "assets" },
  { href: "/brand", icon: Palette, labelKey: "brand" },
  { href: "/tasks", icon: CheckSquare, labelKey: "tasks" },
];

const BOTTOM_ITEMS = [
  { href: "/billing", icon: CreditCard, labelKey: "billing" },
  { href: "/settings", icon: Settings, labelKey: "settings" },
  { href: "/help", icon: HelpCircle, labelKey: "help" },
];

// Items shown in the mobile bottom nav (most important only)
const MOBILE_NAV = [
  { href: "/dashboard", icon: LayoutDashboard, labelKey: "home" },
  { href: "/studio", icon: Wand2, labelKey: "studio" },
  { href: "/posts", icon: FileText, labelKey: "posts" },
  { href: "/calendar", icon: CalendarDays, labelKey: "calendar" },
  { href: "/settings", icon: Settings, labelKey: "settings" },
];

interface SidebarProps {
  mobile?: boolean;
}

export function Sidebar({ mobile }: SidebarProps) {
  const pathname = usePathname();
  const t = useTranslations("nav");

  if (mobile) {
    return (
      <nav className="fixed bottom-0 left-0 right-0 z-50 flex items-center justify-around border-t border-border sidebar-bg px-2 py-2 shadow-[0_-8px_32px_rgba(0,0,0,0.35)] backdrop-blur-xl">
        {MOBILE_NAV.map(({ href, icon: Icon, labelKey }) => {
          const active = pathname === href || pathname.startsWith(href + "/");
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex flex-col items-center gap-1 px-3 py-1.5 rounded-xl transition-colors min-w-[52px]",
                active ? "text-indigo-400" : "text-foreground/40",
              )}
            >
              <Icon className="w-5 h-5" />
              <span className="text-[10px] font-medium">{t(labelKey)}</span>
            </Link>
          );
        })}
      </nav>
    );
  }

  return (
    <aside className="flex h-full w-[220px] flex-shrink-0 flex-col border-r border-border sidebar-bg backdrop-blur-xl">
      {/* Logo */}
      <div className="h-[60px] flex items-center px-5 border-b border-border">
        <Logo />
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
        {NAV_ITEMS.map(({ href, icon: Icon, labelKey }) => {
          const active = pathname === href || pathname.startsWith(href + "/");
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150",
                active
                  ? "bg-indigo-500/15 text-foreground"
                  : "text-foreground/40 hover:text-foreground/70 hover:bg-foreground/[0.04]",
              )}
            >
              <Icon
                className={cn(
                  "w-4 h-4 flex-shrink-0",
                  active ? "text-indigo-400" : "text-current",
                )}
              />
              {t(labelKey)}
              {active && (
                <span className="ml-auto w-1.5 h-1.5 rounded-full bg-indigo-400" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Bottom items */}
      <div className="p-3 space-y-0.5 border-t border-border">
        {BOTTOM_ITEMS.map(({ href, icon: Icon, labelKey }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150",
                active
                  ? "bg-indigo-500/15 text-foreground"
                  : "text-foreground/40 hover:text-foreground/60 hover:bg-foreground/[0.04]",
              )}
            >
              <Icon className="w-4 h-4 flex-shrink-0" />
              {t(labelKey)}
            </Link>
          );
        })}
      </div>
    </aside>
  );
}
