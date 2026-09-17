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
        to: process.env.MAIL_TO || user,
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
    const to = process.env.MAIL_TO;
    if (!to) return { ok: false, error: "MAIL_TO is not set." };
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

export function resolveProvider(): MailProvider {
  switch (process.env.MAIL_PROVIDER) {
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
