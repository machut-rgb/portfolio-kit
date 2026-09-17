"use client";

import { useEffect, useState } from "react";
import { useTheme } from "@/lib/theme/provider";
import { useStudio } from "./context";
import { FONT_LABELS } from "@/lib/theme/font-stacks";
import type { CardStyle, Density, FontKey, IconSetId, ThemeMode } from "@/lib/theme/types";
import { Icon } from "@/components/ui/Icon";
import { ColorField, RangeField, SegmentField, SelectField, ToggleField } from "./controls/Fields";
import type { Dictionary } from "@/lib/i18n/dictionaries";

const fontOptions = Object.entries(FONT_LABELS).map(([value, label]) => ({
  value: value as FontKey,
  label,
}));

const TABS = ["colors", "typography", "layout", "effects", "motion", "icons"] as const;
type Tab = (typeof TABS)[number];

export function ThemeStudioPanel({ dict }: { dict: Dictionary["theme"] }) {
  const { open, setOpen } = useStudio();
  const { theme, presets, presetId, setPreset, mode, setMode, resolvedMode, overrides, setOverride, resetOverrides, exportSnippet } =
    useTheme();
  const [tab, setTab] = useState<Tab>("colors");
  const [copied, setCopied] = useState(false);
  const hasOverrides = Object.keys(overrides).length > 0;

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, setOpen]);

  if (!open) return null;

  const colors = theme.colors[resolvedMode];
  const colorPath = (key: string) => `colors.${resolvedMode}.${key}`;

  async function copyExport() {
    try {
      await navigator.clipboard.writeText(exportSnippet());
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      /* clipboard permission denied — the textarea below still has it */
    }
  }

  return (
    <>
      <div
        className="fixed inset-0 z-[90] bg-black/40 no-print"
        onClick={() => setOpen(false)}
        aria-hidden="true"
      />
      <aside
        className="fixed inset-y-0 right-0 z-[91] w-full sm:w-[380px] flex flex-col no-print"
        style={{ background: "var(--p-bg)", borderLeft: "1px solid var(--p-border)" }}
        role="dialog"
        aria-modal="true"
        aria-label={dict.title}
      >
        <div
          className="flex items-center justify-between px-5 py-4 border-b flex-none"
          style={{ borderColor: "var(--p-border)" }}
        >
          <div>
            <h2 className="text-sm font-semibold" style={{ fontFamily: "var(--p-font-display)" }}>
              {dict.title}
            </h2>
            <p className="text-2xs mt-0.5" style={{ color: "var(--p-fg-subtle)" }}>
              {dict.subtitle}
            </p>
          </div>
          <button type="button" onClick={() => setOpen(false)} className="btn-ghost w-8 h-8 rounded-[var(--p-radius-sm)]" aria-label={dict.close}>
            <Icon name="close" />
          </button>
        </div>

        <div className="px-5 pt-4 flex-none">
          <SelectField
            label={dict.preset}
            value={presetId}
            options={presets.map((p) => ({ value: p.id, label: p.name }))}
            onChange={setPreset}
          />
          <div className="mt-3">
            <SegmentField<ThemeMode | "system">
              label={dict.mode}
              value={mode}
              options={[
                { value: "light", label: dict.light },
                { value: "dark", label: dict.dark },
                { value: "system", label: dict.system },
              ]}
              onChange={setMode}
            />
          </div>
        </div>

        <div
          className="flex gap-1 px-5 mt-4 border-b overflow-x-auto flex-none"
          style={{ borderColor: "var(--p-border)" }}
        >
          {TABS.map((tabId) => (
            <button
              key={tabId}
              type="button"
              onClick={() => setTab(tabId)}
              className="px-2.5 py-2 text-2xs font-mono uppercase tracking-[var(--p-tracking-label)] border-b-2 -mb-px whitespace-nowrap"
              style={{
                borderColor: tab === tabId ? "var(--p-primary)" : "transparent",
                color: tab === tabId ? "var(--p-fg)" : "var(--p-fg-muted)",
              }}
            >
              {dict[tabId as keyof typeof dict] as string}
            </button>
          ))}
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-5 flex flex-col gap-4">
          {tab === "colors" && (
            <>
              <ColorField label="Background" value={colors.bg} onChange={(v) => setOverride(colorPath("bg"), v)} />
              <ColorField label="Surface" value={colors.surface} onChange={(v) => setOverride(colorPath("surface"), v)} />
              <ColorField label="Border" value={colors.border} onChange={(v) => setOverride(colorPath("border"), v)} />
              <ColorField label="Text" value={colors.fg} onChange={(v) => setOverride(colorPath("fg"), v)} />
              <ColorField label="Muted text" value={colors.fgMuted} onChange={(v) => setOverride(colorPath("fgMuted"), v)} />
              <ColorField label="Primary" value={colors.primary} onChange={(v) => setOverride(colorPath("primary"), v)} />
              <ColorField label="Accent" value={colors.accent} onChange={(v) => setOverride(colorPath("accent"), v)} />
              <ColorField
                label="Gradient start"
                value={colors.gradientFrom}
                onChange={(v) => setOverride(colorPath("gradientFrom"), v)}
              />
              <ColorField
                label="Gradient end"
                value={colors.gradientTo}
                onChange={(v) => setOverride(colorPath("gradientTo"), v)}
              />
            </>
          )}

          {tab === "typography" && (
            <>
              <SelectField
                label="Display font"
                value={theme.typography.display}
                options={fontOptions}
                onChange={(v) => setOverride("typography.display", v)}
              />
              <SelectField
                label="Body font"
                value={theme.typography.body}
                options={fontOptions}
                onChange={(v) => setOverride("typography.body", v)}
              />
              <SelectField
                label="Mono font"
                value={theme.typography.mono}
                options={fontOptions}
                onChange={(v) => setOverride("typography.mono", v)}
              />
              <RangeField
                label="Base size"
                value={theme.typography.baseSize}
                min={14}
                max={19}
                suffix="px"
                onChange={(v) => setOverride("typography.baseSize", v)}
              />
              <RangeField
                label="Scale ratio"
                value={theme.typography.scaleRatio}
                min={1.1}
                max={1.45}
                step={0.01}
                onChange={(v) => setOverride("typography.scaleRatio", v)}
              />
              <RangeField
                label="Display weight"
                value={theme.typography.displayWeight}
                min={400}
                max={900}
                step={100}
                onChange={(v) => setOverride("typography.displayWeight", v)}
              />
              <SegmentField
                label="Label case"
                value={theme.typography.labelCase}
                options={[
                  { value: "none", label: "None" },
                  { value: "uppercase", label: "UPPER" },
                  { value: "lowercase", label: "lower" },
                ]}
                onChange={(v) => setOverride("typography.labelCase", v)}
              />
            </>
          )}

          {tab === "layout" && (
            <>
              <SegmentField<Density>
                label="Density"
                value={theme.layout.density}
                options={[
                  { value: "compact", label: "Compact" },
                  { value: "comfortable", label: "Cozy" },
                  { value: "spacious", label: "Spacious" },
                ]}
                onChange={(v) => setOverride("layout.density", v)}
              />
              <SegmentField<"left" | "center">
                label="Section align"
                value={theme.layout.align}
                options={[
                  { value: "left", label: "Left" },
                  { value: "center", label: "Center" },
                ]}
                onChange={(v) => setOverride("layout.align", v)}
              />
              <RangeField
                label="Content width"
                value={theme.layout.contentWidth}
                min={800}
                max={1400}
                step={20}
                suffix="px"
                onChange={(v) => setOverride("layout.contentWidth", v)}
              />
              <RangeField
                label="Section spacing"
                value={theme.layout.sectionSpacing}
                min={48}
                max={160}
                step={4}
                suffix="px"
                onChange={(v) => setOverride("layout.sectionSpacing", v)}
              />
              <RangeField
                label="Corner radius"
                value={theme.shape.radius}
                min={0}
                max={28}
                suffix="px"
                onChange={(v) => setOverride("shape.radius", v)}
              />
              <RangeField
                label="Border width"
                value={theme.shape.borderWidth}
                min={1}
                max={3}
                suffix="px"
                onChange={(v) => setOverride("shape.borderWidth", v)}
              />
            </>
          )}

          {tab === "effects" && (
            <>
              <SelectField<CardStyle>
                label="Card style"
                value={theme.effects.cardStyle}
                options={[
                  { value: "outline", label: "Outline" },
                  { value: "solid", label: "Solid" },
                  { value: "elevated", label: "Elevated" },
                  { value: "ghost", label: "Ghost" },
                  { value: "underline", label: "Underline" },
                ]}
                onChange={(v) => setOverride("effects.cardStyle", v)}
              />
              <ToggleField label="Blueprint grid" value={theme.effects.grid} onChange={(v) => setOverride("effects.grid", v)} />
              <ToggleField label="Hero glow" value={theme.effects.glow} onChange={(v) => setOverride("effects.glow", v)} />
              <ToggleField label="Film grain" value={theme.effects.noise} onChange={(v) => setOverride("effects.noise", v)} />
              <ToggleField label="Scanlines" value={theme.effects.scanlines} onChange={(v) => setOverride("effects.scanlines", v)} />
              <RangeField
                label="Nav blur"
                value={theme.effects.navBlur}
                min={0}
                max={24}
                suffix="px"
                onChange={(v) => setOverride("effects.navBlur", v)}
              />
            </>
          )}

          {tab === "motion" && (
            <>
              <ToggleField label="Enable motion" value={theme.motion.enabled} onChange={(v) => setOverride("motion.enabled", v)} />
              <ToggleField label="Scroll reveals" value={theme.motion.reveal} onChange={(v) => setOverride("motion.reveal", v)} />
              <RangeField
                label="Duration"
                value={theme.motion.duration}
                min={100}
                max={500}
                step={10}
                suffix="ms"
                onChange={(v) => setOverride("motion.duration", v)}
              />
            </>
          )}

          {tab === "icons" && (
            <>
              <SegmentField<IconSetId>
                label="Icon set"
                value={theme.icons.set}
                options={[
                  { value: "line", label: "Line" },
                  { value: "solid", label: "Solid" },
                  { value: "duotone", label: "Duotone" },
                  { value: "emoji", label: "Emoji" },
                ]}
                onChange={(v) => setOverride("icons.set", v)}
              />
              <RangeField
                label="Icon size"
                value={theme.icons.size}
                min={14}
                max={28}
                suffix="px"
                onChange={(v) => setOverride("icons.size", v)}
              />
              <RangeField
                label="Stroke width"
                value={theme.icons.strokeWidth}
                min={1}
                max={2.5}
                step={0.25}
                onChange={(v) => setOverride("icons.strokeWidth", v)}
              />
            </>
          )}
        </div>

        <div className="flex-none px-5 py-4 border-t flex flex-col gap-2" style={{ borderColor: "var(--p-border)" }}>
          <button type="button" className="btn btn-outline btn-sm w-full" onClick={copyExport}>
            <Icon name="copy" />
            {dict.export}
          </button>
          <p className="text-2xs" style={{ color: copied ? "var(--p-success)" : "var(--p-fg-subtle)" }}>
            {copied ? "✓ Copied to clipboard" : dict.exportHint}
          </p>
          {hasOverrides && (
            <button type="button" className="btn-ghost btn-sm text-2xs self-start" onClick={resetOverrides}>
              {dict.reset}
            </button>
          )}
        </div>
      </aside>
    </>
  );
}
