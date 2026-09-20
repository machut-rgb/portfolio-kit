"use client";

import { AdminForm } from "@/components/admin/forms/AdminForm";
import { LocalizedField } from "@/components/admin/forms/LocalizedField";
import { SelectField, TextField } from "@/components/admin/forms/Fields";
import { createFirstAdminAction, saveSetupProfileAction, saveSetupThemeAction } from "./actions";

const EMPTY = { en: "", fr: "", mg: "" };

export function AccountStep() {
  return (
    <AdminForm action={createFirstAdminAction} submitLabel="Create account" pendingLabel="Creating…">
      <TextField name="email" label="Your email" type="email" required hint="You will sign in with this." />
      <TextField name="password" label="Password" required hint="At least 10 characters." />
      <TextField name="confirm" label="Confirm password" required />
    </AdminForm>
  );
}

export function ProfileStep({
  defaults,
}: {
  defaults: { firstName: string; lastName: string; contactEmail: string };
}) {
  return (
    <AdminForm action={saveSetupProfileAction} submitLabel="Continue" pendingLabel="Saving…">
      <div className="grid sm:grid-cols-2 gap-5">
        <TextField name="firstName" label="First name" defaultValue={defaults.firstName} required />
        <TextField name="lastName" label="Last name" defaultValue={defaults.lastName} required />
      </div>
      <LocalizedField name="role" label="What you do" defaultValues={EMPTY} required />
      <LocalizedField
        name="headline"
        label="Headline"
        defaultValues={EMPTY}
        multiline
        rows={2}
        hint="One sentence shown at the top of your site."
        required
      />
      <LocalizedField name="location" label="Where you are" defaultValues={EMPTY} />
      <TextField
        name="contactEmail"
        label="Public contact email"
        type="email"
        defaultValue={defaults.contactEmail}
        hint="Shown on your site. It can differ from your sign-in address."
      />
    </AdminForm>
  );
}

export function ThemeStep({
  presets,
  current,
}: {
  presets: { id: string; name: string; description: string }[];
  current: { preset: string; mode: string };
}) {
  return (
    <AdminForm action={saveSetupThemeAction} submitLabel="Finish setup" pendingLabel="Saving…">
      <SelectField
        name="defaultPreset"
        label="Theme"
        defaultValue={current.preset}
        options={presets.map((p) => ({ value: p.id, label: `${p.name} — ${p.description}` }))}
      />
      <SelectField
        name="defaultMode"
        label="Light or dark"
        defaultValue={current.mode}
        options={[
          { value: "dark", label: "Dark" },
          { value: "light", label: "Light" },
          { value: "system", label: "Follow the visitor's system" },
        ]}
      />
      <p className="text-xs" style={{ color: "var(--p-fg-subtle)" }}>
        You can change this any time, and try every theme live from the Theme Studio on your site.
      </p>
    </AdminForm>
  );
}
