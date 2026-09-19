export interface ContactPayload {
  name: string;
  email: string;
  subject?: string;
  message: string;
  /** Honeypot field — must arrive empty. Named oddly on purpose. */
  company?: string;
  locale: string;
  /** Resolved from settings by the caller, so providers do no lookups. */
  recipient?: string;
}

export interface MailResult {
  ok: boolean;
  error?: string;
}
