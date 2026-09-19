"use client";

import { useState } from "react";
import { AdminForm, type FormActionState } from "@/components/admin/forms/AdminForm";
import { iconOptions } from "@/lib/admin/iconOptions";
import { detectPlatform } from "@/lib/admin/socialPlatforms";
import { Icon } from "@/components/ui/Icon";
import type { socialLinks } from "@/lib/db/schema";

/**
 * Label and icon fill themselves in from the URL, and stop doing so the
 * moment the owner edits them. Pasting a GitHub profile should not require
 * knowing that the icon is registered under the name `git`.
 */
export function SocialLinkForm({
  action,
  defaults,
}: {
  action: (prev: FormActionState, formData: FormData) => Promise<FormActionState>;
  defaults?: typeof socialLinks.$inferSelect;
}) {
  const [href, setHref] = useState(defaults?.href ?? "");
  const [label, setLabel] = useState(defaults?.label ?? "");
  const [icon, setIcon] = useState(defaults?.icon ?? "globe");
  const [touched, setTouched] = useState({ label: !!defaults?.label, icon: !!defaults?.icon });

  function onHrefChange(value: string) {
    setHref(value);
    const detected = detectPlatform(value);
    if (!detected) return;
    if (!touched.label) setLabel(detected.label);
    if (!touched.icon) setIcon(detected.icon);
  }

  return (
    <AdminForm action={action}>
      <div className="flex flex-col gap-1.5">
        <label className="field-label" htmlFor="href">
          Address
        </label>
        <input
          id="href"
          name="href"
          type="text"
          value={href}
          onChange={(event) => onHrefChange(event.target.value)}
          placeholder="https://github.com/your-name"
          className="field"
          required
        />
        <span className="text-2xs" style={{ color: "var(--p-fg-subtle)" }}>
          A full https:// link, or mailto:you@example.com for an email address.
        </span>
      </div>

      <div className="grid sm:grid-cols-2 gap-5">
        <div className="flex flex-col gap-1.5">
          <label className="field-label" htmlFor="label">
            Label
          </label>
          <input
            id="label"
            name="label"
            type="text"
            value={label}
            onChange={(event) => {
              setLabel(event.target.value);
              setTouched((prev) => ({ ...prev, label: true }));
            }}
            className="field"
            required
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="field-label" htmlFor="icon">
            Icon
          </label>
          <div className="flex items-center gap-2">
            <span
              className="w-9 h-9 flex-none rounded-[var(--p-radius-sm)] border flex items-center justify-center"
              style={{ borderColor: "var(--p-border)", background: "var(--p-surface-alt)" }}
            >
              <Icon name={icon} />
            </span>
            <select
              id="icon"
              name="icon"
              value={icon}
              onChange={(event) => {
                setIcon(event.target.value);
                setTouched((prev) => ({ ...prev, icon: true }));
              }}
              className="field flex-1"
            >
              {iconOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="field-label" htmlFor="handle">
          Handle (optional)
        </label>
        <input
          id="handle"
          name="handle"
          type="text"
          defaultValue={defaults?.handle ?? ""}
          placeholder="your-name"
          className="field"
        />
      </div>
    </AdminForm>
  );
}
