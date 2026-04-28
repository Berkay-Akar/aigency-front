"use client";

import { useState } from "react";
import { Download } from "lucide-react";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { downloadInFormat } from "@/lib/utils";
import { cn } from "@/lib/utils";

type ImageFormat = "jpg" | "png" | "webp";

const FORMATS: { value: ImageFormat; label: string }[] = [
  { value: "jpg", label: "JPG" },
  { value: "png", label: "PNG" },
  { value: "webp", label: "WebP" },
];

interface DownloadFormatMenuProps {
  url: string;
  basename: string;
  highlight?: boolean;
  /** Pass a label string to show the expanding hover label */
  label?: string;
  className?: string;
}

export function DownloadFormatMenu({
  url,
  basename,
  highlight,
  label,
  className,
}: DownloadFormatMenuProps) {
  const [loading, setLoading] = useState(false);

  async function handleFormat(format: ImageFormat) {
    setLoading(true);
    try {
      await downloadInFormat(url, `${basename}-${Date.now()}`, format);
    } catch {
      toast.error("İndirme başarısız");
    } finally {
      setLoading(false);
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        disabled={loading}
        className={cn(
          "group flex items-center justify-center gap-2 rounded-2xl border px-4 py-3 text-sm font-medium transition-all duration-200 disabled:opacity-50 cursor-default",
          highlight
            ? "border-indigo-500/30 bg-indigo-500/10 text-indigo-200 hover:bg-indigo-500/20"
            : "border-border bg-foreground/[0.04] text-foreground/50 hover:border-border hover:bg-foreground/[0.08] hover:text-foreground/80",
          className,
        )}
        title={label ?? "İndir"}
      >
        <span className="shrink-0">
          <Download className="h-4 w-4" />
        </span>
        {label && (
          <span className="max-w-0 overflow-hidden whitespace-nowrap text-xs transition-all duration-200 group-hover:max-w-30">
            {label}
          </span>
        )}
      </DropdownMenuTrigger>
      <DropdownMenuContent side="top" align="center" className="min-w-28">
        {FORMATS.map((f) => (
          <DropdownMenuItem
            key={f.value}
            onClick={() => void handleFormat(f.value)}
            className="cursor-pointer text-sm"
          >
            {f.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
