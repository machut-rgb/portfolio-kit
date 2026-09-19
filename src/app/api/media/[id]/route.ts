import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db/client";
import { media } from "@/lib/db/schema";

/**
 * Serves an uploaded image.
 *
 * Ids are the SHA-256 of the content, so a given URL can never point at
 * different bytes. That makes `immutable` caching correct rather than
 * merely convenient, and means browsers and any CDN in front of the app
 * stop asking for the file after the first request.
 */
export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  if (!/^[a-f0-9]{64}$/.test(id)) {
    return new NextResponse(null, { status: 404 });
  }

  const row = await db.query.media.findFirst({ where: eq(media.id, id) });
  if (!row) {
    return new NextResponse(null, { status: 404 });
  }

  return new NextResponse(new Uint8Array(row.data), {
    headers: {
      "Content-Type": row.mimeType,
      "Content-Length": String(row.byteSize),
      "Cache-Control": "public, max-age=31536000, immutable",
      "X-Content-Type-Options": "nosniff",
      "Content-Disposition": `inline; filename="${encodeURIComponent(row.filename)}"`,
    },
  });
}
