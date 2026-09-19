"use server";

import { eq } from "drizzle-orm";
import { db } from "@/lib/db/client";
import { siteSettings } from "@/lib/db/schema";
import { saveSingleton } from "@/lib/db/singleton";
import { withAdminMutation } from "@/lib/admin/mutation";
import { requireSession } from "@/lib/auth/guard";
import { logAudit } from "@/lib/auth/audit";
import { parseNumber, parseString } from "@/lib/admin/formData";
import { getSiteSettings } from "@/lib/settings";
import { mailSettingsSchema, siteSettingsSchema } from "@/lib/settings/schema";
import { providerReadiness, resolveProvider, type ProviderId } from "@/lib/mail/providers";
import type { FormActionState } from "@/components/admin/forms/AdminForm";

export async function updateMailSettingsAction(
  _prev: FormActionState,
  formData: FormData,
): Promise<FormActionState> {
  const recipient = parseString(formData, "recipient");
  if (recipient && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(recipient)) {
    return { error: "Enter a valid recipient email address, or leave it blank." };
  }

  const mail = mailSettingsSchema.safeParse({
    provider: parseString(formData, "provider") || "console",
    recipient,
    rateLimit: parseNumber(formData, "rateLimit") ?? 5,
    rateWindowSeconds: parseNumber(formData, "rateWindowSeconds") ?? 3600,
  });
  if (!mail.success) {
    return { error: mail.error.issues[0]?.message ?? "Invalid mail settings." };
  }

  // The whole settings blob is revalidated so a partial write cannot leave
  // a shape the public site later fails to load.
  const current = await getSiteSettings();
  const { url: _url, ...rest } = current;
  const next = siteSettingsSchema.safeParse({ ...rest, mail: mail.data });
  if (!next.success) {
    return { error: next.error.issues[0]?.message ?? "Invalid settings." };
  }

  try {
    await withAdminMutation(
      "mailSettings.update",
      async () => {
        await saveSingleton(siteSettings, { data: next.data, updatedAt: new Date() });
      },
      { entityType: "mailSettings" },
    );
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Failed to save." };
  }

  return { success: true };
}

export interface TestSendState {
  message?: string;
  ok?: boolean;
}

/**
 * Sends a real message through the configured provider so a
 * misconfiguration surfaces here rather than when a visitor writes in.
 */
export async function sendTestMessageAction(_prev: TestSendState, _formData: FormData): Promise<TestSendState> {
  const session = await requireSession();
  const { mail } = await getSiteSettings();

  const readiness = providerReadiness(mail.provider as ProviderId);
  if (!readiness.ready) {
    return { ok: false, message: `Missing environment variable(s): ${readiness.missing.join(", ")}.` };
  }

  const result = await resolveProvider(mail.provider as ProviderId).send({
    name: "Portfolio admin",
    email: session.email,
    subject: "Test message",
    message: "This is a test from the admin panel. If you are reading it, delivery works.",
    locale: "en",
    recipient: mail.recipient,
  });

  await logAudit({ actorId: session.id, action: "mailSettings.test", meta: { ok: result.ok } });

  if (!result.ok) return { ok: false, message: result.error ?? "Sending failed." };
  return {
    ok: true,
    message:
      mail.provider === "console"
        ? "Sent. The console provider writes to the server log rather than delivering mail."
        : "Sent. Check the recipient inbox.",
  };
}
