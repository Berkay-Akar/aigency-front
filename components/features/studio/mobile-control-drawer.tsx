"use client";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

interface MobileControlDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  children: React.ReactNode;
}

export function MobileControlDrawer({
  open,
  onOpenChange,
  title,
  children,
}: MobileControlDrawerProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="left"
        showCloseButton
        className={cn(
          "w-full gap-0 border-white/[0.08] bg-[#070707]/98 p-0 sm:max-w-md",
          "data-[side=left]:w-full"
        )}
      >
        <SheetHeader className="border-b border-white/[0.06] px-5 py-4 text-left">
          <SheetTitle className="text-base font-semibold text-white">{title}</SheetTitle>
        </SheetHeader>
        <div className="max-h-[calc(100vh-4rem)] overflow-y-auto px-4 py-4">{children}</div>
      </SheetContent>
    </Sheet>
  );
}
