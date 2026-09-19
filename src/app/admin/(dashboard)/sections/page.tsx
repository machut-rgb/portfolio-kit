import { asc } from "drizzle-orm";
import { db } from "@/lib/db/client";
import { sections } from "@/lib/db/schema";
import { sectionVariantOptions, type SectionType } from "@config/sections.config";
import { AdminForm } from "@/components/admin/forms/AdminForm";
import { LocalizedField } from "@/components/admin/forms/LocalizedField";
import { CheckboxField, SelectField } from "@/components/admin/forms/Fields";
import { localizedDefaults } from "@/lib/admin/formData";
import type { L } from "@/lib/i18n/localize";
import { updateSectionAction, moveSectionAction } from "./actions";

/** `title`/`eyebrow` can hold `false`, meaning "render no heading". */
function headingDefaults(value: L | false | null) {
  return { hidden: value === false, defaults: localizedDefaults(value === false || value === null ? undefined : value) };
}

export default async function SectionsPage() {
  const rows = await db.query.sections.findMany({ orderBy: [asc(sections.position)] });

  return (
    <div className="max-w-3xl">
      <div className="eyebrow mb-2">Site</div>
      <h1 className="text-heading mb-2">Sections &amp; layout</h1>
      <p className="text-sm mb-8 measure" style={{ color: "var(--p-fg-muted)" }}>
        The home page renders these in order. Each section has multiple layout variants that show the same
        content differently — switching one is the fastest way to make a fork not look like the original.
      </p>

      <div className="flex flex-col gap-4">
        {rows.map((row, i) => {
          const variants = sectionVariantOptions[row.type as SectionType] ?? [row.variant];
          const title = headingDefaults(row.title ?? null);
          const eyebrow = headingDefaults(row.eyebrow ?? null);

          return (
            <details key={row.id} className="card" open={false}>
              <summary className="flex items-center gap-3 cursor-pointer list-none">
                <div className="flex flex-col">
                  <form action={moveSectionAction.bind(null, row.id, "up")}>
                    <button type="submit" className="btn-ghost btn-sm px-1.5" disabled={i === 0} aria-label="Move up">
                      ▲
                    </button>
                  </form>
                  <form action={moveSectionAction.bind(null, row.id, "down")}>
                    <button
                      type="submit"
                      className="btn-ghost btn-sm px-1.5"
                      disabled={i === rows.length - 1}
                      aria-label="Move down"
                    >
                      ▼
                    </button>
                  </form>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-sm capitalize" style={{ fontFamily: "var(--p-font-display)" }}>
                    {row.id}
                  </div>
                  <div className="text-xs mt-0.5 font-mono" style={{ color: "var(--p-fg-muted)" }}>
                    {row.variant}
                    {!row.enabled && <span style={{ color: "var(--p-danger)" }}> · hidden</span>}
                    {row.nav && <span style={{ color: "var(--p-accent)" }}> · in nav</span>}
                  </div>
                </div>

                <span className="text-2xs font-mono" style={{ color: "var(--p-fg-subtle)" }}>
                  edit
                </span>
              </summary>

              <div className="mt-5 pt-5 border-t" style={{ borderColor: "var(--p-border)" }}>
                <AdminForm action={updateSectionAction.bind(null, row.id)}>
                  <SelectField
                    name="variant"
                    label="Layout variant"
                    defaultValue={row.variant}
                    options={variants.map((v) => ({ value: v, label: v }))}
                  />

                  <div className="flex flex-wrap gap-x-8">
                    <CheckboxField name="enabled" label="Show on page" defaultChecked={row.enabled} />
                    <CheckboxField name="nav" label="Show in nav" defaultChecked={row.nav} />
                    <CheckboxField name="divider" label="Divider above" defaultChecked={row.divider} />
                  </div>

                  <div className="hairline my-1" />

                  <CheckboxField name="hideEyebrow" label="No eyebrow" defaultChecked={eyebrow.hidden} />
                  <LocalizedField name="eyebrow" label="Eyebrow" defaultValues={eyebrow.defaults} />

                  <CheckboxField name="hideTitle" label="No heading" defaultChecked={title.hidden} />
                  <LocalizedField name="title" label="Heading" defaultValues={title.defaults} />

                  <LocalizedField
                    name="navLabel"
                    label="Nav label (optional)"
                    defaultValues={localizedDefaults(row.navLabel ?? undefined)}
                    hint="Overrides the default wording in the navigation."
                  />

                  <LocalizedField
                    name="intro"
                    label="Intro (optional)"
                    defaultValues={localizedDefaults(row.intro ?? undefined)}
                    multiline
                    rows={2}
                  />
                </AdminForm>
              </div>
            </details>
          );
        })}
      </div>
    </div>
  );
}
