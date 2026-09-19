"use server";

import { profile } from "@/lib/db/schema";
import { saveSingleton } from "@/lib/db/singleton";
import { withAdminMutation } from "@/lib/admin/mutation";
import {
  parseLocalized,
  parseLocalizedList,
  parseOptionalString,
  parseNumber,
  parseString,
} from "@/lib/admin/formData";
import type { FormActionState } from "@/components/admin/forms/AdminForm";

export async function updateProfileAction(_prev: FormActionState, formData: FormData): Promise<FormActionState> {
  const firstName = parseString(formData, "firstName");
  const lastName = parseString(formData, "lastName");
  const email = parseString(formData, "email");

  if (!firstName || !lastName) return { error: "First and last name are required." };
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return { error: "Enter a valid email address." };

  try {
    await withAdminMutation(
      "profile.update",
      async () => {
        await saveSingleton(profile, {
            firstName,
            lastName,
            handle: parseString(formData, "handle"),
            headline: parseLocalized(formData, "headline"),
            roles: parseLocalizedList(formData, "roles"),
            summary: parseLocalized(formData, "summary"),
            availability: parseLocalized(formData, "availability"),
            location: parseLocalized(formData, "location"),
            email,
            phone: parseOptionalString(formData, "phone"),
            photoSrc: parseOptionalString(formData, "photoSrc"),
            photoAlt: parseLocalized(formData, "photoAlt"),
            photoWidth: parseNumber(formData, "photoWidth"),
            photoHeight: parseNumber(formData, "photoHeight"),
          resume: parseOptionalString(formData, "resume"),
          updatedAt: new Date(),
        });
      },
      { entityType: "profile" },
    );
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Failed to save." };
  }

  return { success: true };
}
