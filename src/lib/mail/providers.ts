import type { ContactPayload, MailResult } from "./types";
import { getFullName } from "@/lib/content";

/**
 * Every provider implements the same tiny interface, so switching how
 * contact-form mail is delivered is a one-line env var change
 * (`MAIL_PROVIDER`), not a code change.
 */
export interface MailProvider {
  send(payload: ContactPayload): Promise<MailResult>;
}

/** Recipient chosen in the admin, falling back to the environment. */
function recipientFor(payload: ContactPayload): string {
  return payload.recipient?.trim() || process.env.MAIL_TO?.trim() || "";
}

function subjectLine(payload: ContactPayload) {
  return payload.subject ? `[Portfolio] ${payload.subject}` : `[Portfolio] New message from ${payload.name}`;
}

function escapeHtml(input: string) {
  return input.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);
}

function htmlBody(payload: ContactPayload) {
  return `<div style="font-family:sans-serif;max-width:600px">
  <h2>New message from your portfolio</h2>
  <p><strong>Name:</strong> ${escapeHtml(payload.name)}</p>
  <p><strong>Email:</strong> ${escapeHtml(payload.email)}</p>
  <p><strong>Subject:</strong> ${escapeHtml(payload.subject || "—")}</p>
  <hr/>
  <p style="white-space:pre-line">${escapeHtml(payload.message)}</p>
</div>`;
}

/** Logs to the server console. Zero setup — the default so `npm run dev` works out of the box. */
export const consoleProvider: MailProvider = {
  async send(payload) {
    // eslint-disable-next-line no-console
    console.log("[contact] MAIL_PROVIDER=console — message received:\n", {
      ...payload,
      receivedAt: new Date().toISOString(),
    });
    return { ok: true };
  },
};

export const smtpProvider: MailProvider = {
  async send(payload) {
    const nodemailer = await import("nodemailer");
    const host = process.env.SMTP_HOST;
    const port = Number(process.env.SMTP_PORT || 587);
    const user = process.env.SMTP_USER;
    const pass = process.env.SMTP_PASS;
    if (!host || !user || !pass) {
      return { ok: false, error: "SMTP_HOST, SMTP_USER and SMTP_PASS must be set." };
    }
    const transporter = nodemailer.createTransport({
      host,
      port,
      secure: process.env.SMTP_SECURE === "true",
      auth: { user, pass },
    });
    try {
      await transporter.sendMail({
        from: process.env.MAIL_FROM || `"Portfolio" <${user}>`,
        to: recipientFor(payload) || user,
        replyTo: payload.email,
        subject: subjectLine(payload),
        html: htmlBody(payload),
      });
      return { ok: true };
    } catch (err) {
      return { ok: false, error: err instanceof Error ? err.message : "SMTP send failed" };
    }
  },
};

export const resendProvider: MailProvider = {
  async send(payload) {
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) return { ok: false, error: "RESEND_API_KEY is not set." };
    const to = recipientFor(payload);
    if (!to) return { ok: false, error: "No recipient address is configured." };
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: process.env.MAIL_FROM || "Portfolio <onboarding@resend.dev>",
        to: [to],
        reply_to: payload.email,
        subject: subjectLine(payload),
        html: htmlBody(payload),
      }),
    });
    if (!res.ok) return { ok: false, error: `Resend responded ${res.status}` };
    return { ok: true };
  },
};

export const webhookProvider: MailProvider = {
  async send(payload) {
    const url = process.env.CONTACT_WEBHOOK_URL;
    if (!url) return { ok: false, error: "CONTACT_WEBHOOK_URL is not set." };
    const name = await getFullName();
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        text: `New portfolio message for ${name} from ${payload.name} <${payload.email}>\n${payload.subject ? `Subject: ${payload.subject}\n` : ""}${payload.message}`,
        payload,
      }),
    });
    if (!res.ok) return { ok: false, error: `Webhook responded ${res.status}` };
    return { ok: true };
  },
};

export type ProviderId = "console" | "smtp" | "resend" | "webhook";

export function resolveProvider(provider: ProviderId): MailProvider {
  switch (provider) {
    case "smtp":
      return smtpProvider;
    case "resend":
      return resendProvider;
    case "webhook":
      return webhookProvider;
    default:
      return consoleProvider;
  }
}

/**
 * Whether a provider has the environment variables it needs.
 *
 * Reports only which names are missing, never their values, so the admin
 * can diagnose a misconfiguration without the page ever rendering a
 * credential.
 */
export function providerReadiness(provider: ProviderId): { ready: boolean; missing: string[] } {
  const required: Record<ProviderId, string[]> = {
    console: [],
    smtp: ["SMTP_HOST", "SMTP_USER", "SMTP_PASS"],
    resend: ["RESEND_API_KEY"],
    webhook: ["CONTACT_WEBHOOK_URL"],
  };
  const missing = required[provider].filter((name) => !process.env[name]?.trim());
  return { ready: missing.length === 0, missing };
}
