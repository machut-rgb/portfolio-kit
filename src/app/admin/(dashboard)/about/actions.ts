"use server";

import { eq } from "drizzle-orm";
import { db } from "@/lib/db/client";
import { about } from "@/lib/db/schema";
import { withAdminMutation } from "@/lib/admin/mutation";
import { parseLocalizedList, parseLocalizedOptional } from "@/lib/admin/formData";
import type { FormActionState } from "@/components/admin/forms/AdminForm";

export async function updateAboutAction(_prev: FormActionState, formData: FormData): Promise<FormActionState> {
  const paragraphs = parseLocalizedList(formData, "paragraphs");
  if (paragraphs.length === 0) return { error: "Add at least one paragraph." };

  try {
    await withAdminMutation(
      "about.update",
      async () => {
        await db
          .update(about)
          .set({
            paragraphs,
            quote: parseLocalizedOptional(formData, "quote"),
            updatedAt: new Date(),
          })
          .where(eq(about.id, 1));
      },
      { entityType: "about" },
    );
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Failed to save." };
  }

  return { success: true };
}
