"use server";

import { redirect } from "next/navigation";
import { db } from "@/lib/db/client";
import { profile, users } from "@/lib/db/schema";
import { saveSingleton } from "@/lib/db/singleton";
import { hashPassword } from "@/lib/auth/password";
import { generateId } from "@/lib/auth/tokens";
import { createSession } from "@/lib/auth/session";
import { requireSession } from "@/lib/auth/guard";
import { hasAdminAccount } from "@/lib/auth/setup";
import { logAudit } from "@/lib/auth/audit";
import { adminHref } from "@/lib/auth/config";
import { withAdminMutation } from "@/lib/admin/mutation";
import { parseLocalized, parseString } from "@/lib/admin/formData";
import { getThemeSettings } from "@/lib/settings";
import { themeSettingsSchema } from "@/lib/settings/schema";
import { themeSettings } from "@/lib/db/schema";
import { presetMap } from "@/lib/theme/presets";
import type { FormActionState } from "@/components/admin/forms/AdminForm";

const MIN_PASSWORD_LENGTH = 10;

/** Step 1. The only action in the app that creates an account, and the only
 *  one reachable without a session, so it re-checks that none exists. */
export async function createFirstAdminAction(
  _prev: FormActionState,
  formData: FormData,
): Promise<FormActionState> {
  if (await hasAdminAccount()) {
    return { error: "An account already exists. Sign in instead." };
  }

  const email = parseString(formData, "email").toLowerCase();
  const password = parseString(formData, "password");
  const confirm = parseString(formData, "confirm");

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return { error: "Enter a valid email address." };
  if (password.length < MIN_PASSWORD_LENGTH) {
    return { error: `Use at least ${MIN_PASSWORD_LENGTH} characters for the password.` };
  }
  if (password !== confirm) return { error: "The two passwords do not match." };

  const id = generateId();
  await db.insert(users).values({ id, email, passwordHash: await hashPassword(password) });
  await createSession(id);
  await logAudit({ actorId: id, action: "setup.account_created" });

  redirect(`${adminHref("/setup")}?step=2`);
}

/** Step 2. Creates the profile row if the database was never seeded. */
export async function saveSetupProfileAction(
  _prev: FormActionState,
  formData: FormData,
): Promise<FormActionState> {
  await requireSession();

  const firstName = parseString(formData, "firstName");
  const lastName = parseString(formData, "lastName");
  if (!firstName || !lastName) return { error: "Enter your first and last name." };

  const existing = await db.query.profile.findFirst();
  const role = parseLocalized(formData, "role");

  try {
    await withAdminMutation(
      "setup.profile",
      async () => {
        await saveSingleton(profile, {
          firstName,
          lastName,
          handle: existing?.handle ?? `~/${firstName.toLowerCase()}.dev`,
          headline: parseLocalized(formData, "headline"),
          roles: [role],
          summary: existing?.summary ?? parseLocalized(formData, "headline"),
          availability: existing?.availability ?? "Available for work",
          location: parseLocalized(formData, "location"),
          email: parseString(formData, "contactEmail") || existing?.email || "",
          updatedAt: new Date(),
        });
      },
      { entityType: "profile" },
    );
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Failed to save." };
  }

  redirect(`${adminHref("/setup")}?step=3`);
}

/** Step 3. Sets the sitewide default look, then the wizard is done. */
export async function saveSetupThemeAction(
  _prev: FormActionState,
  formData: FormData,
): Promise<FormActionState> {
  await requireSession();

  const defaultPreset = parseString(formData, "defaultPreset");
  if (!presetMap[defaultPreset]) return { error: "Choose one of the available themes." };

  const current = await getThemeSettings();
  const next = themeSettingsSchema.safeParse({
    ...current,
    defaultPreset,
    defaultMode: parseString(formData, "defaultMode") || current.defaultMode,
  });
  if (!next.success) return { error: "Those theme settings are not valid." };

  try {
    await withAdminMutation(
      "setup.theme",
      async () => {
        await saveSingleton(themeSettings, { data: next.data, updatedAt: new Date() });
      },
      { entityType: "themeSettings" },
    );
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Failed to save." };
  }

  redirect(adminHref());
}

