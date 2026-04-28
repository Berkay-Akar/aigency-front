"use client";

import { useState, useRef } from "react";
import { Plus, X } from "lucide-react";
import { useTranslations } from "next-intl";

const PRESET_COLORS = [
  "#6366F1",
  "#8B5CF6",
  "#EC4899",
  "#EF4444",
  "#F59E0B",
  "#10B981",
  "#06B6D4",
  "#3B82F6",
  "#FFFFFF",
  "#94A3B8",
  "#1F2937",
  "#000000",
];

// ─── Color Utilities ──────────────────────────────────────────────────────────

function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const h = hex.replace("#", "");
  const full =
    h.length === 3
      ? h
          .split("")
          .map((c) => c + c)
          .join("")
      : h;
  const n = parseInt(full.slice(0, 6), 16) || 0;
  return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 };
}

function rgbToHex(r: number, g: number, b: number): string {
  return (
    "#" +
    [r, g, b]
      .map((v) =>
        Math.round(Math.max(0, Math.min(255, v)))
          .toString(16)
          .padStart(2, "0"),
      )
      .join("")
  );
}

function rgbToHsv(
  r: number,
  g: number,
  b: number,
): { h: number; s: number; v: number } {
  const rf = r / 255,
    gf = g / 255,
    bf = b / 255;
  const max = Math.max(rf, gf, bf),
    min = Math.min(rf, gf, bf),
    d = max - min;
  const v = max;
  const s = max === 0 ? 0 : d / max;
  let h = 0;
  if (d !== 0) {
    if (max === rf) h = ((gf - bf) / d) % 6;
    else if (max === gf) h = (bf - rf) / d + 2;
    else h = (rf - gf) / d + 4;
    h = h * 60;
    if (h < 0) h += 360;
  }
  return { h: Math.round(h) % 360, s, v };
}

function hsvToRgb(
  h: number,
  s: number,
  v: number,
): { r: number; g: number; b: number } {
  const c = v * s,
    x = c * (1 - Math.abs(((h / 60) % 2) - 1)),
    m = v - c;
  let rf = 0,
    gf = 0,
    bf = 0;
  if (h < 60) {
    rf = c;
    gf = x;
  } else if (h < 120) {
    rf = x;
    gf = c;
  } else if (h < 180) {
    gf = c;
    bf = x;
  } else if (h < 240) {
    gf = x;
    bf = c;
  } else if (h < 300) {
    rf = x;
    bf = c;
  } else {
    rf = c;
    bf = x;
  }
  return {
    r: Math.round((rf + m) * 255),
    g: Math.round((gf + m) * 255),
    b: Math.round((bf + m) * 255),
  };
}

function hexToHsv(hex: string) {
  const { r, g, b } = hexToRgb(hex);
  return rgbToHsv(r, g, b);
}

function hsvToHex(h: number, s: number, v: number) {
  const { r, g, b } = hsvToRgb(h, s, v);
  return rgbToHex(r, g, b);
}

// ─── ColorPickerPopover ───────────────────────────────────────────────────────

function ColorPickerPopover({
  color,
  onChange,
}: {
  color: string;
  onChange: (hex: string) => void;
}) {
  const init = hexToHsv(color.startsWith("#") ? color : "#" + color);
  const [hue, setHue] = useState(init.h);
  const [sat, setSat] = useState(init.s);
  const [val, setVal] = useState(init.v);
  const [hexInput, setHexInput] = useState(
    color.replace("#", "").toUpperCase(),
  );

  const svRef = useRef<HTMLDivElement>(null);
  const hueRef = useRef<HTMLDivElement>(null);

  const apply = (h: number, s: number, v: number) => {
    setHue(h);
    setSat(s);
    setVal(v);
    const hex = hsvToHex(h, s, v);
    setHexInput(hex.replace("#", "").toUpperCase());
    onChange(hex);
  };

  const handleSVDown = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    const el = svRef.current;
    if (!el) return;
    const capturedHue = hue;
    const pick = (cx: number, cy: number) => {
      const r = el.getBoundingClientRect();
      apply(
        capturedHue,
        Math.max(0, Math.min((cx - r.left) / r.width, 1)),
        1 - Math.max(0, Math.min((cy - r.top) / r.height, 1)),
      );
    };
    pick(e.clientX, e.clientY);
    const mm = (ev: MouseEvent) => pick(ev.clientX, ev.clientY);
    const mu = () => {
      document.removeEventListener("mousemove", mm);
      document.removeEventListener("mouseup", mu);
    };
    document.addEventListener("mousemove", mm);
    document.addEventListener("mouseup", mu);
  };

  const handleHueDown = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    const el = hueRef.current;
    if (!el) return;
    const capturedSat = sat;
    const capturedVal = val;
    const pick = (cx: number) => {
      const r = el.getBoundingClientRect();
      apply(
        Math.round(Math.max(0, Math.min((cx - r.left) / r.width, 1)) * 360) %
          360,
        capturedSat,
        capturedVal,
      );
    };
    pick(e.clientX);
    const mm = (ev: MouseEvent) => pick(ev.clientX);
    const mu = () => {
      document.removeEventListener("mousemove", mm);
      document.removeEventListener("mouseup", mu);
    };
    document.addEventListener("mousemove", mm);
    document.addEventListener("mouseup", mu);
  };

  const commitHex = () => {
    const clean = hexInput.replace(/[^0-9A-Fa-f]/g, "").slice(0, 6);
    if (clean.length === 6) {
      const { h, s, v } = hexToHsv("#" + clean);
      apply(h, s, v);
      setHexInput(clean.toUpperCase());
    } else {
      setHexInput(hsvToHex(hue, sat, val).replace("#", "").toUpperCase());
    }
  };

  const pureHue = hsvToHex(hue, 1, 1);
  const currentHex = hsvToHex(hue, sat, val);

  return (
    <div
      className="absolute z-50 mt-2 w-64 rounded-2xl border border-border bg-card p-3 shadow-2xl shadow-black/40 space-y-3"
      style={{ top: "100%", left: 0 }}
      onMouseDown={(e) => e.stopPropagation()}
    >
      {/* S/V plane */}
      <div
        ref={svRef}
        onMouseDown={handleSVDown}
        className="relative h-36 w-full rounded-xl cursor-crosshair select-none overflow-hidden"
        style={{ background: `linear-gradient(to right, #fff, ${pureHue})` }}
      >
        <div
          className="absolute inset-0 rounded-xl"
          style={{ background: "linear-gradient(to top, #000, transparent)" }}
        />
        <div
          className="absolute -translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full border-2 border-white shadow-md pointer-events-none"
          style={{
            left: `${sat * 100}%`,
            top: `${(1 - val) * 100}%`,
            backgroundColor: currentHex,
          }}
        />
      </div>

      {/* Hue slider */}
      <div
        ref={hueRef}
        onMouseDown={handleHueDown}
        className="relative h-3 w-full rounded-full cursor-pointer select-none"
        style={{
          background:
            "linear-gradient(to right,#f00,#ff0,#0f0,#0ff,#00f,#f0f,#f00)",
        }}
      >
        <div
          className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-4 h-4 rounded-full border-2 border-white shadow-md pointer-events-none"
          style={{ left: `${(hue / 360) * 100}%`, backgroundColor: pureHue }}
        />
      </div>

      {/* Hex input */}
      <div className="flex items-center gap-2">
        <div
          className="w-7 h-7 rounded-lg border border-border shrink-0"
          style={{ backgroundColor: currentHex }}
        />
        <div className="flex items-center rounded-lg border border-border bg-secondary px-2 py-1.5 flex-1 min-w-0">
          <span className="text-xs text-secondary-foreground/60 mr-0.5 select-none font-mono">
            #
          </span>
          <input
            className="bg-transparent text-xs text-secondary-foreground outline-none w-full font-mono uppercase tracking-wider"
            maxLength={6}
            value={hexInput}
            onChange={(e) => setHexInput(e.target.value.toUpperCase())}
            onBlur={commitHex}
            onKeyDown={(e) => {
              if (e.key === "Enter") commitHex();
            }}
          />
        </div>
      </div>

      {/* Presets */}
      <div>
        <p className="text-[10px] text-muted-foreground/60 uppercase tracking-wider font-medium mb-2">
          Presets
        </p>
        <div className="grid grid-cols-6 gap-1.5">
          {PRESET_COLORS.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => {
                const { h, s, v } = hexToHsv(c);
                apply(h, s, v);
              }}
              className="w-7 h-7 rounded-lg border border-border/50 hover:scale-110 transition-transform shadow-sm"
              style={{ backgroundColor: c }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── ColorSwatch ──────────────────────────────────────────────────────────────

interface ColorSwatchProps {
  color: string;
  label: string;
  isOpen: boolean;
  onOpen: () => void;
  onRemove?: () => void;
  onChange: (color: string) => void;
}

function ColorSwatch({
  color,
  label,
  isOpen,
  onOpen,
  onRemove,
  onChange,
}: ColorSwatchProps) {
  return (
    <div className="relative flex flex-col items-center gap-2 group">
      <button
        type="button"
        onClick={onOpen}
        className="relative w-10 h-10 rounded-2xl border-2 border-transparent hover:border-white/20 transition-all shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/40"
        style={{ backgroundColor: color }}
      >
        {isOpen && (
          <span className="absolute inset-[-3px] rounded-[14px] ring-2 ring-indigo-400 ring-offset-2 ring-offset-card pointer-events-none" />
        )}
      </button>
      {onRemove && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-card border border-border flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10"
        >
          <X className="w-2.5 h-2.5 text-muted-foreground" />
        </button>
      )}
      <span className="text-[10px] text-muted-foreground">{label}</span>
      {isOpen && <ColorPickerPopover color={color} onChange={onChange} />}
    </div>
  );
}

// ─── ColorPicker ──────────────────────────────────────────────────────────────

export interface ColorPickerValue {
  primary: string;
  secondary: string;
  accent: string;
}

interface ColorPickerProps {
  value: ColorPickerValue;
  onChange: (v: ColorPickerValue) => void;
}

export function ColorPicker({ value, onChange }: ColorPickerProps) {
  const t = useTranslations("brandKit");
  const [extra, setExtra] = useState<string[]>([]);
  const [activeKey, setActiveKey] = useState<
    "primary" | "secondary" | "accent" | number | null
  >(null);

  const containerRef = useRef<HTMLDivElement>(null);

  const open = (key: typeof activeKey) =>
    setActiveKey((prev) => (prev === key ? null : key));

  const handleContainerMouseDown = (e: React.MouseEvent) => {
    if (!containerRef.current?.contains(e.target as Node)) {
      setActiveKey(null);
    }
  };

  return (
    <div
      ref={containerRef}
      className="p-6 rounded-3xl bg-card border border-border"
      onMouseDown={handleContainerMouseDown}
    >
      <h3 className="text-sm font-semibold text-foreground mb-1">
        {t("colorsTitle")}
      </h3>
      <p className="text-xs text-muted-foreground mb-5">{t("colorsDesc")}</p>

      <div className="flex items-end gap-4 mb-2 flex-wrap">
        <ColorSwatch
          color={value.primary}
          label={t("primary")}
          isOpen={activeKey === "primary"}
          onOpen={() => open("primary")}
          onChange={(c) => onChange({ ...value, primary: c })}
        />
        <ColorSwatch
          color={value.secondary}
          label={t("secondary")}
          isOpen={activeKey === "secondary"}
          onOpen={() => open("secondary")}
          onChange={(c) => onChange({ ...value, secondary: c })}
        />
        <ColorSwatch
          color={value.accent}
          label={t("accent")}
          isOpen={activeKey === "accent"}
          onOpen={() => open("accent")}
          onChange={(c) => onChange({ ...value, accent: c })}
        />
        {extra.map((color, i) => (
          <ColorSwatch
            key={i}
            color={color}
            label={t("colorN", { n: i + 4 })}
            isOpen={activeKey === i}
            onOpen={() => open(i)}
            onRemove={() => {
              setExtra((e) => e.filter((_, idx) => idx !== i));
              if (activeKey === i) setActiveKey(null);
            }}
            onChange={(c) =>
              setExtra((e) => e.map((ec, idx) => (idx === i ? c : ec)))
            }
          />
        ))}
        {extra.length < 3 && (
          <button
            type="button"
            onClick={() => setExtra((e) => [...e, "#FFFFFF"])}
            className="w-10 h-10 rounded-2xl border border-dashed border-border hover:border-border/70 flex items-center justify-center text-muted-foreground/40 hover:text-muted-foreground/70 transition-colors mb-6"
          >
            <Plus className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
}
