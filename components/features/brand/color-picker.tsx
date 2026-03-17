"use client";

import { useState } from "react";
import { Plus, X } from "lucide-react";

const PRESET_COLORS = [
  "#6366F1", "#8B5CF6", "#EC4899", "#EF4444",
  "#F59E0B", "#10B981", "#06B6D4", "#3B82F6",
  "#FFFFFF", "#94A3B8", "#1F2937", "#000000",
];

interface ColorSwatchProps {
  color: string;
  label: string;
  onRemove?: () => void;
  onChange: (color: string) => void;
}

function ColorSwatch({ color, label, onRemove, onChange }: ColorSwatchProps) {
  return (
    <div className="flex flex-col items-center gap-2 group">
      <label className="relative cursor-pointer">
        <div
          className="w-10 h-10 rounded-2xl border-2 border-white/10 hover:border-white/30 transition-colors shadow-md"
          style={{ backgroundColor: color }}
        />
        <input
          type="color"
          value={color}
          onChange={(e) => onChange(e.target.value)}
          className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
        />
        {onRemove && (
          <button
            onClick={(e) => { e.preventDefault(); onRemove(); }}
            className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-[#111] border border-white/10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <X className="w-2.5 h-2.5 text-white/60" />
          </button>
        )}
      </label>
      <span className="text-[10px] text-white/30">{label}</span>
    </div>
  );
}

export function ColorPicker() {
  const [colors, setColors] = useState({
    primary: "#6366F1",
    secondary: "#8B5CF6",
    accent: "#10B981",
  });
  const [extra, setExtra] = useState<string[]>([]);

  return (
    <div className="p-6 rounded-3xl bg-white/[0.02] border border-white/[0.06]">
      <h3 className="text-sm font-semibold text-white mb-1">Brand Colors</h3>
      <p className="text-xs text-white/30 mb-5">
        These colors will be used in all generated content
      </p>

      <div className="flex items-end gap-4 mb-6">
        <ColorSwatch
          color={colors.primary}
          label="Primary"
          onChange={(c) => setColors((p) => ({ ...p, primary: c }))}
        />
        <ColorSwatch
          color={colors.secondary}
          label="Secondary"
          onChange={(c) => setColors((p) => ({ ...p, secondary: c }))}
        />
        <ColorSwatch
          color={colors.accent}
          label="Accent"
          onChange={(c) => setColors((p) => ({ ...p, accent: c }))}
        />
        {extra.map((color, i) => (
          <ColorSwatch
            key={i}
            color={color}
            label={`Color ${i + 4}`}
            onRemove={() => setExtra((e) => e.filter((_, idx) => idx !== i))}
            onChange={(c) =>
              setExtra((e) => e.map((ec, idx) => (idx === i ? c : ec)))
            }
          />
        ))}
        {extra.length < 3 && (
          <button
            onClick={() => setExtra((e) => [...e, "#FFFFFF"])}
            className="w-10 h-10 rounded-2xl border border-dashed border-white/10 hover:border-white/25 flex items-center justify-center text-white/20 hover:text-white/40 transition-colors mb-6"
          >
            <Plus className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Preset swatches */}
      <div>
        <p className="text-xs text-white/20 mb-3 uppercase tracking-wider font-medium">
          Presets
        </p>
        <div className="flex flex-wrap gap-2">
          {PRESET_COLORS.map((c) => (
            <button
              key={c}
              onClick={() => setColors((p) => ({ ...p, primary: c }))}
              className="w-6 h-6 rounded-lg border border-white/10 hover:border-white/30 hover:scale-110 transition-all shadow-sm"
              style={{ backgroundColor: c }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
