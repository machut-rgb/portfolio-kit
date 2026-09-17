"use client";

import { useState } from "react";
import { locales, localeLabels, type Locale } from "@/lib/i18n/config";
import { cn } from "@/lib/utils/cn";

interface Props {
  name: string;
  label: string;
  defaultValues: Record<Locale, string>;
  multiline?: boolean;
  rows?: number;
  hint?: string;
  required?: boolean;
  placeholder?: string;
}

/**
 * Renders one input (or textarea) per locale, named `${name}.en`,
 * `${name}.fr`, `${name}.mg`. Only English is ever `required` — French and
 * Malagasy fall back to it at render time (`t()`) when left blank, so
 * partial translation is a normal, non-broken state, not an error.
 */
export function LocalizedField({ name, label, defaultValues, multiline, rows = 3, hint, required, placeholder }: Props) {
  const [active, setActive] = useState<Locale>("en");
  const Tag = multiline ? "textarea" : "input";

  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center justify-between">
        <label className="field-label">
          {label}
          {required && <span style={{ color: "var(--p-danger)" }}> *</span>}
        </label>
        <div className="flex gap-0.5 rounded-[var(--p-radius-xs)] border p-0.5" style={{ borderColor: "var(--p-border)" }}>
          {locales.map((locale) => (
            <button
              key={locale}
              type="button"
              onClick={() => setActive(locale)}
              className={cn(
                "px-2 py-0.5 rounded-[3px] text-2xs font-mono uppercase transition-colors",
                active === locale ? "bg-primary text-primary-fg" : "text-muted",
              )}
            >
              {localeLabels[locale]}
              {locale !== "en" && defaultValues[locale] && (
                <span className="ml-1" style={{ color: active === locale ? "inherit" : "var(--p-success)" }}>
                  •
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {locales.map((locale) => (
        <Tag
          key={locale}
          name={`${name}.${locale}`}
          defaultValue={defaultValues[locale]}
          rows={multiline ? rows : undefined}
          required={locale === "en" && required}
          placeholder={locale === "en" ? placeholder : `${placeholder ?? ""} (${localeLabels.en} shown if left blank)`}
          className={cn("field", multiline && "resize-y", active !== locale && "hidden")}
        />
      ))}
      {hint && (
        <span className="text-2xs" style={{ color: "var(--p-fg-subtle)" }}>
          {hint}
        </span>
      )}
    </div>
  );
}
