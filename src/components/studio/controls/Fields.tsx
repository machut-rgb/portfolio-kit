"use client";

import type { ReactNode } from "react";

function Field({ label, hint, children }: { label: string; hint?: string; children: ReactNode }) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-2xs font-mono uppercase tracking-[var(--p-tracking-label)]" style={{ color: "var(--p-fg-muted)" }}>
        {label}
      </span>
      {children}
      {hint && (
        <span className="text-2xs" style={{ color: "var(--p-fg-subtle)" }}>
          {hint}
        </span>
      )}
    </label>
  );
}

export function ColorField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <Field label={label}>
      <div
        className="flex items-center gap-2 rounded-[var(--p-radius-sm)] border px-2 py-1.5"
        style={{ borderColor: "var(--p-border)" }}
      >
        <input
          type="color"
          value={toHex(value)}
          onChange={(e) => onChange(e.target.value)}
          className="w-6 h-6 rounded cursor-pointer border-0 bg-transparent p-0"
          aria-label={label}
        />
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="flex-1 bg-transparent text-xs font-mono outline-none min-w-0"
          style={{ color: "var(--p-fg)" }}
        />
      </div>
    </Field>
  );
}

export function SelectField<T extends string>({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: T;
  options: { value: T; label: string }[];
  onChange: (v: T) => void;
}) {
  return (
    <Field label={label}>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as T)}
        className="field text-sm py-2"
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </Field>
  );
}

export function RangeField({
  label,
  value,
  min,
  max,
  step = 1,
  suffix = "",
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  suffix?: string;
  onChange: (v: number) => void;
}) {
  return (
    <Field label={label} hint={`${value}${suffix}`}>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full accent-[var(--p-primary)]"
      />
    </Field>
  );
}

export function ToggleField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <label className="flex items-center justify-between gap-3 py-1">
      <span className="text-xs" style={{ color: "var(--p-fg)" }}>
        {label}
      </span>
      <button
        type="button"
        role="switch"
        aria-checked={value}
        onClick={() => onChange(!value)}
        className="relative w-9 h-5 rounded-full transition-colors flex-none"
        style={{ background: value ? "var(--p-primary)" : "var(--p-surface-alt)" }}
      >
        <span
          className="absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform"
          style={{ transform: value ? "translateX(18px)" : "translateX(2px)" }}
        />
      </button>
    </label>
  );
}

export function SegmentField<T extends string>({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: T;
  options: { value: T; label: string }[];
  onChange: (v: T) => void;
}) {
  return (
    <Field label={label}>
      <div className="flex rounded-[var(--p-radius-sm)] border p-0.5 gap-0.5" style={{ borderColor: "var(--p-border)" }}>
        {options.map((opt) => (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange(opt.value)}
            className="flex-1 text-2xs py-1.5 rounded-[var(--p-radius-xs)] transition-colors"
            style={{
              background: value === opt.value ? "var(--p-primary)" : "transparent",
              color: value === opt.value ? "var(--p-primary-fg)" : "var(--p-fg-muted)",
            }}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </Field>
  );
}

function toHex(value: string): string {
  if (/^#[0-9a-f]{6}$/i.test(value)) return value;
  // The <input type=color> control only accepts hex; other values (rgba,
  // color-mix, css vars) still work as the text field, just not the swatch.
  return "#888888";
}
