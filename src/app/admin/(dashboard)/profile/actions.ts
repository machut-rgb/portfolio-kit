"use server";

import { db } from "@/lib/db/client";
import { profile } from "@/lib/db/schema";
import { saveSingleton } from "@/lib/db/singleton";
import { withAdminMutation } from "@/lib/admin/mutation";
import { describeStorageError, fileFromForm, storeImage } from "@/lib/media/storage";
import {
  parseBoolean,
  parseLocalized,
  parseLocalizedList,
  parseOptionalString,
  parseString,
} from "@/lib/admin/formData";
import type { FormActionState } from "@/components/admin/forms/AdminForm";

export async function updateProfileAction(_prev: FormActionState, formData: FormData): Promise<FormActionState> {
  const firstName = parseString(formData, "firstName");
  const lastName = parseString(formData, "lastName");
  const email = parseString(formData, "email");

  if (!firstName || !lastName) return { error: "First and last name are required." };
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return { error: "Enter a valid email address." };

  // The upload and the existing-photo lookup both touch the database, so
  // they belong inside a guard: an unhandled throw here surfaced as a raw
  // runtime error page instead of a message on the form.
  let photo: { src: string | null; width: number | null; height: number | null };
  try {
    const upload = await storeImage(fileFromForm(formData, "photo"));
    if (upload.error) return { error: upload.error };

    const removePhoto = parseBoolean(formData, "photoRemove");
    const existingPhoto = await db.query.profile.findFirst();
    photo = upload.stored
      ? { src: upload.stored.url, width: upload.stored.width, height: upload.stored.height }
      : removePhoto
        ? { src: null, width: null, height: null }
        : {
            src: existingPhoto?.photoSrc ?? null,
            width: existingPhoto?.photoWidth ?? null,
            height: existingPhoto?.photoHeight ?? null,
          };
  } catch (err) {
    return { error: describeStorageError(err) };
  }

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
          photoSrc: photo.src,
          photoAlt: parseLocalized(formData, "photoAlt"),
          photoWidth: photo.width,
          photoHeight: photo.height,
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
