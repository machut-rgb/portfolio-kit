export interface ContactPayload {
  name: string;
  email: string;
  subject?: string;
  message: string;
  /** Honeypot field — must arrive empty. Named oddly on purpose. */
  company?: string;
  locale: string;
}

export interface MailResult {
  ok: boolean;
  error?: string;
}
