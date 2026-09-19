import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { resolveProvider } from "@/lib/mail/providers";
import { getSiteSettings } from "@/lib/settings";
import { checkRateLimit } from "@/lib/mail/rateLimit";
import { locales } from "@/lib/i18n/config";

/**
 * POST /api/contact
 *
 * Validates, rate-limits by IP, rejects honeypot hits, then hands off to
 * whichever `MailProvider` is configured. Always returns JSON, never throws
 * past this boundary — the client always gets a `{ success, error? }` shape.
 */
const payloadSchema = z.object({
  name: z.string().trim().min(2).max(120),
  email: z.string().trim().email().max(200),
  subject: z.string().trim().max(200).optional(),
  message: z.string().trim().min(10).max(4000),
  company: z.string().optional(), // honeypot: any non-empty value marks the submission as a bot
  locale: z.enum(locales as unknown as [string, ...string[]]).optional(),
});

function clientKey(req: NextRequest): string {
  const forwarded = req.headers.get("x-forwarded-for");
  return forwarded?.split(",")[0]?.trim() || req.headers.get("x-real-ip") || "unknown";
}

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ success: false, error: "Malformed request body." }, { status: 400 });
  }

  const parsed = payloadSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { success: false, error: parsed.error.issues[0]?.message || "Invalid submission." },
      { status: 400 },
    );
  }

  // Silently accept honeypot hits so bots don't learn the field is monitored.
  if (parsed.data.company) {
    return NextResponse.json({ success: true });
  }

  const { mail } = await getSiteSettings();

  const key = `contact:${clientKey(req)}`;
  const rate = await checkRateLimit(key, {
    limit: mail.rateLimit,
    windowSeconds: mail.rateWindowSeconds,
  });
  if (!rate.allowed) {
    return NextResponse.json(
      { success: false, error: "rate_limited", retryAfterSeconds: rate.retryAfterSeconds },
      { status: 429 },
    );
  }

  const provider = resolveProvider(mail.provider);
  const result = await provider.send({
    ...parsed.data,
    locale: parsed.data.locale ?? "en",
    recipient: mail.recipient,
  });

  if (!result.ok) {
    console.error("[contact] provider error:", result.error);
    return NextResponse.json({ success: false, error: "send_failed" }, { status: 502 });
  }

  return NextResponse.json({ success: true });
}

export async function GET() {
  return NextResponse.json({ status: "ok", timestamp: new Date().toISOString() });
}
