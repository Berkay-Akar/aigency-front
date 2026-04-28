"use client";

import { useState, useCallback, useMemo } from "react";
import {
  FileCheck,
  Download,
  Calendar,
  AlertCircle,
  Loader2,
  X,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { useAppStore } from "@/store/app-store";
import type { Post } from "@/lib/api";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type RangePreset = "1w" | "2w" | "3w" | "1m" | "2m";

interface RangePresetOption {
  key: RangePreset;
  labelKey: string;
  days: number;
}

const RANGE_PRESETS: RangePresetOption[] = [
  { key: "1w", labelKey: "oneWeek", days: 7 },
  { key: "2w", labelKey: "twoWeeks", days: 14 },
  { key: "3w", labelKey: "threeWeeks", days: 21 },
  { key: "1m", labelKey: "oneMonth", days: 30 },
  { key: "2m", labelKey: "twoMonths", days: 60 },
];

const PLATFORM_LABELS: Record<string, string> = {
  instagram: "Instagram",
  tiktok: "TikTok",
  facebook: "Facebook",
  twitter: "Twitter / X",
  linkedin: "LinkedIn",
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function toDateInputValue(date: Date): string {
  return date.toISOString().slice(0, 10);
}

function addDays(date: Date, days: number): Date {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

function formatDateReadable(dateStr: string): string {
  const d = new Date(dateStr + "T00:00:00");
  return d.toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function formatPostTime(isoString: string): string {
  return new Date(isoString).toLocaleTimeString(undefined, {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}

function formatPostDate(isoString: string): string {
  return new Date(isoString).toLocaleDateString(undefined, {
    weekday: "long",
    month: "long",
    day: "numeric",
  });
}

// ---------------------------------------------------------------------------
// Export document generator
// ---------------------------------------------------------------------------

/**
 * Generates a professional, print-ready HTML approval document and triggers a
 * browser download.
 *
 * TODO: Replace this client-side HTML generation with a call to a backend PDF
 * endpoint (e.g. Next.js API route → puppeteer / pdfkit / WeasyPrint) for
 * production-quality PDF output.  The signature of this function should remain
 * stable so the swap is a single-file change.
 */
function generateApprovalDocument(
  posts: Post[],
  startDate: Date,
  endDate: Date,
  workspaceName: string,
  downloadLabel: string,
): void {
  const filtered = posts
    .filter((p) => {
      const dt = new Date(p.scheduledAt ?? p.createdAt);
      return (
        dt >= startDate &&
        dt <= endDate &&
        (p.status === "SCHEDULED" || p.status === "PUBLISHED")
      );
    })
    .sort((a, b) => {
      const da = new Date(a.scheduledAt ?? a.createdAt).getTime();
      const db = new Date(b.scheduledAt ?? b.createdAt).getTime();
      return da - db;
    });

  const fromLabel = formatDateReadable(toDateInputValue(startDate));
  const toLabel = formatDateReadable(toDateInputValue(endDate));
  const now = new Date().toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const rows = filtered
    .map((p) => {
      const dt = p.scheduledAt ?? p.createdAt;
      const status = p.status === "PUBLISHED" ? "Published" : "Scheduled";
      const platform =
        PLATFORM_LABELS[p.platform?.toLowerCase()] ?? p.platform ?? "—";
      const caption = (p.caption ?? "")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");
      const statusBg = p.status === "PUBLISHED" ? "#dcfce7" : "#e0e7ff";
      const statusColor = p.status === "PUBLISHED" ? "#166534" : "#3730a3";
      return `
          <tr>
            <td style="padding:12px 16px;border-bottom:1px solid #f0f0f0;vertical-align:top;white-space:nowrap">${formatPostDate(dt)}</td>
            <td style="padding:12px 16px;border-bottom:1px solid #f0f0f0;vertical-align:top;white-space:nowrap">${formatPostTime(dt)}</td>
            <td style="padding:12px 16px;border-bottom:1px solid #f0f0f0;vertical-align:top">${platform}</td>
            <td style="padding:12px 16px;border-bottom:1px solid #f0f0f0;vertical-align:top;max-width:360px;line-height:1.55">${caption}</td>
            <td style="padding:12px 16px;border-bottom:1px solid #f0f0f0;vertical-align:top">
              <span style="display:inline-block;padding:3px 10px;border-radius:20px;font-size:11px;font-weight:600;background:${statusBg};color:${statusColor}">${status}</span>
            </td>
          </tr>`;
    })
    .join("");

  const emptyRow =
    filtered.length === 0
      ? `<tr><td colspan="5" style="padding:40px 16px;text-align:center;color:#9ca3af;font-size:14px">No scheduled content found for this period.</td></tr>`
      : "";

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <title>Content Calendar Approval — ${workspaceName}</title>
  <style>
    *{box-sizing:border-box;margin:0;padding:0}
    body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;color:#111;background:#fff;padding:48px 56px;max-width:960px;margin:0 auto}
    @media print{body{padding:24px 32px}@page{margin:1.5cm}}
    h1{font-size:24px;font-weight:700;color:#111;margin-bottom:4px}
    h2{font-size:13px;font-weight:500;color:#6b7280;margin-bottom:32px;letter-spacing:.01em}
    .meta{display:flex;gap:32px;margin-bottom:36px;padding:20px 24px;background:#f9fafb;border-radius:12px;border:1px solid #f0f0f0}
    .meta-item{display:flex;flex-direction:column;gap:3px}
    .meta-label{font-size:10px;font-weight:600;text-transform:uppercase;letter-spacing:.08em;color:#9ca3af}
    .meta-value{font-size:13px;font-weight:600;color:#111}
    table{width:100%;border-collapse:collapse}
    thead tr{background:#f9fafb;border-bottom:2px solid #e5e7eb}
    th{padding:10px 16px;text-align:left;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.08em;color:#6b7280}
    tbody tr:hover{background:#fafafa}
    td{font-size:13px;color:#374151}
    .footer{margin-top:48px;padding-top:20px;border-top:1px solid #f0f0f0;display:flex;justify-content:space-between;align-items:center}
    .footer-brand{font-size:12px;font-weight:600;color:#6366f1}
    .footer-date{font-size:11px;color:#9ca3af}
    .count-badge{display:inline-flex;align-items:center;gap:6px;padding:6px 14px;background:#ede9fe;color:#5b21b6;border-radius:20px;font-size:12px;font-weight:600;margin-bottom:24px}
  </style>
</head>
<body>
  <h1>Content Calendar Approval</h1>
  <h2>${workspaceName}</h2>
  <div class="meta">
    <div class="meta-item"><span class="meta-label">Period</span><span class="meta-value">${fromLabel} — ${toLabel}</span></div>
    <div class="meta-item"><span class="meta-label">Posts</span><span class="meta-value">${filtered.length} scheduled</span></div>
    <div class="meta-item"><span class="meta-label">Generated</span><span class="meta-value">${now}</span></div>
  </div>
  <table>
    <thead>
      <tr>
        <th>Date</th>
        <th>Time</th>
        <th>Platform</th>
        <th>Caption</th>
        <th>Status</th>
      </tr>
    </thead>
    <tbody>
      ${rows}${emptyRow}
    </tbody>
  </table>
  <div class="footer">
    <span class="footer-brand">Generated by Aigencys</span>
    <span class="footer-date">Prepared for client review · ${now}</span>
  </div>
</body>
</html>`;

  const blob = new Blob([html], { type: "text/html;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `content-calendar-approval-${toDateInputValue(startDate)}-${toDateInputValue(endDate)}.html`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);

  toast.success(downloadLabel);
}

// ---------------------------------------------------------------------------
// ApprovalExportModal
// ---------------------------------------------------------------------------

interface ApprovalExportModalProps {
  open: boolean;
  onClose: () => void;
  posts: Post[];
}

function ApprovalExportModal({
  open,
  onClose,
  posts,
}: ApprovalExportModalProps) {
  const t = useTranslations("calendar");
  const tCommon = useTranslations("common");
  const { workspace } = useAppStore();

  const today = useMemo(() => new Date(), []);
  const [selectedPreset, setSelectedPreset] = useState<RangePreset | null>(
    "1m",
  );
  const [fromDate, setFromDate] = useState<string>(toDateInputValue(today));
  const [toDate, setToDate] = useState<string>(
    toDateInputValue(addDays(today, 30)),
  );
  const [isGenerating, setIsGenerating] = useState(false);

  const applyPreset = useCallback(
    (preset: RangePreset) => {
      const option = RANGE_PRESETS.find((r) => r.key === preset);
      if (!option) return;
      setSelectedPreset(preset);
      const start = today;
      const end = addDays(today, option.days);
      setFromDate(toDateInputValue(start));
      setToDate(toDateInputValue(end));
    },
    [today],
  );

  const handleFromChange = (v: string) => {
    setFromDate(v);
    setSelectedPreset(null);
  };

  const handleToChange = (v: string) => {
    setToDate(v);
    setSelectedPreset(null);
  };

  const startDate = useMemo(() => new Date(fromDate + "T00:00:00"), [fromDate]);
  const endDate = useMemo(() => new Date(toDate + "T23:59:59"), [toDate]);

  const filteredCount = useMemo(
    () =>
      posts.filter((p) => {
        const dt = new Date(p.scheduledAt ?? p.createdAt);
        return (
          dt >= startDate &&
          dt <= endDate &&
          (p.status === "SCHEDULED" || p.status === "PUBLISHED")
        );
      }).length,
    [posts, startDate, endDate],
  );

  const isDateRangeInvalid = fromDate > toDate;

  const handleGenerate = async () => {
    if (isDateRangeInvalid || isGenerating) return;
    setIsGenerating(true);
    // Small delay for UX — allows loading state to render before blocking operation
    await new Promise((res) => setTimeout(res, 600));
    try {
      generateApprovalDocument(
        posts,
        startDate,
        endDate,
        workspace ?? "Aigencys",
        t("approval.downloadStarted"),
      );
    } finally {
      setIsGenerating(false);
      onClose();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="bg-card border-border rounded-3xl max-w-md p-0 overflow-hidden shadow-2xl">
        <DialogHeader className="p-6 pb-0">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-base font-semibold text-foreground">
              {t("approval.selectRange")}
            </DialogTitle>
            <button
              onClick={onClose}
              className="w-7 h-7 rounded-xl flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-foreground/8 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            {t("approval.rangeInfo")}
          </p>
        </DialogHeader>

        <div className="p-6 space-y-5">
          {/* Quick preset pills */}
          <div>
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2.5">
              {t("approval.quickSelect")}
            </p>
            <div className="flex flex-wrap gap-2">
              {RANGE_PRESETS.map((preset) => (
                <button
                  key={preset.key}
                  onClick={() => applyPreset(preset.key)}
                  className={cn(
                    "px-3.5 py-1.5 rounded-xl text-sm font-medium transition-all border",
                    selectedPreset === preset.key
                      ? "bg-indigo-500/15 border-indigo-500/40 text-indigo-400"
                      : "bg-foreground/4 border-border text-foreground/50 hover:text-foreground/80 hover:bg-foreground/7",
                  )}
                >
                  {t(`approval.${preset.labelKey}`)}
                </button>
              ))}
            </div>
          </div>

          {/* Custom date range */}
          <div>
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2.5">
              {t("approval.customRange")}
            </p>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">
                  {t("approval.customFrom")}
                </label>
                <input
                  type="date"
                  value={fromDate}
                  onChange={(e) => handleFromChange(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-foreground/4 border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500/40 transition-colors scheme-dark"
                />
              </div>
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">
                  {t("approval.customTo")}
                </label>
                <input
                  type="date"
                  value={toDate}
                  onChange={(e) => handleToChange(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-foreground/4 border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500/40 transition-colors scheme-dark"
                />
              </div>
            </div>
            {isDateRangeInvalid && (
              <p className="text-xs text-red-400 mt-1.5 flex items-center gap-1">
                <AlertCircle className="w-3 h-3 shrink-0" />
                {t("approval.dateRangeError")}
              </p>
            )}
          </div>

          {/* Post count / empty state preview */}
          <div
            className={cn(
              "flex items-center gap-2.5 px-4 py-3 rounded-2xl border",
              filteredCount === 0
                ? "bg-amber-500/5 border-amber-500/20"
                : "bg-indigo-500/5 border-indigo-500/15",
            )}
          >
            {filteredCount === 0 ? (
              <>
                <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
                <p className="text-sm text-amber-300/80">
                  {t("approval.emptyState")}
                </p>
              </>
            ) : (
              <>
                <Calendar className="w-4 h-4 text-indigo-400 shrink-0" />
                <p className="text-sm text-foreground/70">
                  {t("approval.postCount", { count: filteredCount })}
                </p>
              </>
            )}
          </div>
        </div>

        {/* Footer actions */}
        <div className="px-6 pb-6 flex items-center gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2.5 rounded-xl text-sm font-medium text-foreground/50 hover:text-foreground/80 hover:bg-foreground/6 border border-border transition-colors"
          >
            {tCommon("cancel")}
          </button>
          <button
            onClick={handleGenerate}
            disabled={isGenerating || isDateRangeInvalid}
            className={cn(
              "flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium text-white transition-all shadow-lg",
              isGenerating || isDateRangeInvalid
                ? "bg-indigo-500/40 shadow-none cursor-not-allowed"
                : "bg-linear-to-r from-indigo-500 to-violet-600 hover:from-indigo-400 hover:to-violet-500 shadow-indigo-500/20",
            )}
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                {t("approval.generating")}
              </>
            ) : (
              <>
                <Download className="w-4 h-4" />
                {t("approval.generate")}
              </>
            )}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// ---------------------------------------------------------------------------
// ApprovalPanel — main export
// ---------------------------------------------------------------------------

interface ApprovalPanelProps {
  posts: Post[];
  /** compact = true: render inline banner card (used below xl breakpoint) */
  compact?: boolean;
}

export function ApprovalPanel({ posts, compact = false }: ApprovalPanelProps) {
  const t = useTranslations("calendar");
  const [modalOpen, setModalOpen] = useState(false);

  if (compact) {
    return (
      <>
        <div className="flex items-center gap-4 p-4 rounded-2xl border border-border bg-card/60 backdrop-blur-sm">
          <div className="w-9 h-9 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center shrink-0">
            <FileCheck className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-foreground">
              {t("approval.compactTitle")}
            </p>
            <p className="text-xs text-muted-foreground truncate">
              {t("approval.compactDesc")}
            </p>
          </div>
          <button
            onClick={() => setModalOpen(true)}
            className="shrink-0 flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-linear-to-r from-indigo-500 to-violet-600 hover:from-indigo-400 hover:to-violet-500 text-white text-xs font-semibold transition-all shadow-md shadow-indigo-500/15"
          >
            <Download className="w-3.5 h-3.5" />
            {t("approval.exportButton")}
          </button>
        </div>
        <ApprovalExportModal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          posts={posts}
        />
      </>
    );
  }

  // Full sidebar panel (≥ xl)
  return (
    <>
      <div className="flex flex-col gap-4 h-full">
        {/* Intro card */}
        <div className="rounded-2xl border border-border bg-card p-5 flex flex-col gap-4">
          {/* Icon + title row */}
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center shrink-0 mt-0.5">
              <FileCheck className="w-5 h-5 text-indigo-400" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-bold text-foreground leading-snug">
                {t("approval.title")}
              </h3>
              <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
                {t("approval.description")}
              </p>
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-border" />

          {/* Sub-label + CTA */}
          <div className="flex flex-col gap-3">
            <p className="text-xs text-muted-foreground leading-relaxed">
              {t("approval.panelSub")}
            </p>
            <button
              onClick={() => setModalOpen(true)}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-linear-to-r from-indigo-500 to-violet-600 hover:from-indigo-400 hover:to-violet-500 text-white text-sm font-semibold transition-all shadow-lg shadow-indigo-500/20"
            >
              <Download className="w-4 h-4" />
              {t("approval.exportButton")}
            </button>
          </div>
        </div>

        {/* Quick-stats strip — shows how many posts in current visible data */}
        {posts.length > 0 && (
          <div className="rounded-2xl border border-border bg-card p-4 flex flex-col gap-3">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              {t("approval.thisMonth")}
            </p>
            <div className="grid grid-cols-3 gap-2">
              {(
                [
                  {
                    label: t("approval.statScheduled"),
                    color: "text-indigo-400",
                    dot: "bg-indigo-500/50",
                    count: posts.filter((p) => p.status === "SCHEDULED").length,
                  },
                  {
                    label: t("approval.statPublished"),
                    color: "text-emerald-400",
                    dot: "bg-emerald-500/50",
                    count: posts.filter((p) => p.status === "PUBLISHED").length,
                  },
                  {
                    label: t("approval.statDraft"),
                    color: "text-foreground/40",
                    dot: "bg-foreground/20",
                    count: posts.filter((p) => p.status === "DRAFT").length,
                  },
                ] as {
                  label: string;
                  color: string;
                  dot: string;
                  count: number;
                }[]
              ).map(({ label, color, dot, count }) => (
                <div
                  key={label}
                  className="flex flex-col items-center gap-1.5 py-3 rounded-xl bg-foreground/3 border border-border"
                >
                  <span className={cn("text-xl font-bold tabular-nums", color)}>
                    {count}
                  </span>
                  <div className="flex items-center gap-1">
                    <div className={cn("w-1.5 h-1.5 rounded-full", dot)} />
                    <span className="text-[10px] text-muted-foreground font-medium">
                      {label}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Spacer — pushes everything up */}
        <div className="flex-1" />
      </div>

      <ApprovalExportModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        posts={posts}
      />
    </>
  );
}
