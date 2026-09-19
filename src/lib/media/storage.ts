import "server-only";
import { createHash } from "node:crypto";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db/client";
import { media } from "@/lib/db/schema";
import { readDimensions, validateImage } from "./image";

/**
 * Where uploaded images live.
 *
 * Mirrors the `MailProvider` pattern: one small interface, swappable per
 * deployment. Only the database provider ships today. An S3-compatible one
 * would be a second file implementing this interface plus an env switch,
 * and nothing calling `storeImage` would change.
 */
export interface StorageProvider {
  /** Persists the bytes and returns the public URL to reference them by. */
  save(input: SaveInput): Promise<StoredImage>;
  /** Best-effort cleanup. Missing objects are not an error. */
  remove(url: string): Promise<void>;
}

export interface SaveInput {
  filename: string;
  mimeType: string;
  bytes: Buffer;
}

export interface StoredImage {
  url: string;
  width: number | null;
  height: number | null;
}

export const MEDIA_URL_PREFIX = "/api/media/";

/** Content-addressed: the id is the SHA-256 of the bytes, so re-uploading
 *  the same file is a no-op and the serving route can cache forever. */
const databaseProvider: StorageProvider = {
  async save({ filename, mimeType, bytes }) {
    const id = createHash("sha256").update(bytes).digest("hex");
    const dimensions = readDimensions(bytes);

    const existing = await db.query.media.findFirst({ where: eq(media.id, id) });
    if (!existing) {
      await db.insert(media).values({
        id,
        filename,
        mimeType,
        byteSize: bytes.byteLength,
        width: dimensions?.width ?? null,
        height: dimensions?.height ?? null,
        data: bytes,
      });
    }

    return {
      url: `${MEDIA_URL_PREFIX}${id}`,
      width: dimensions?.width ?? existing?.width ?? null,
      height: dimensions?.height ?? existing?.height ?? null,
    };
  },

  async remove(url) {
    if (!url.startsWith(MEDIA_URL_PREFIX)) return;
    const id = url.slice(MEDIA_URL_PREFIX.length);
    if (id) await db.delete(media).where(eq(media.id, id));
  },
};

export function resolveStorage(): StorageProvider {
  return databaseProvider;
}

export interface UploadResult {
  stored?: StoredImage;
  error?: string;
}

/**
 * Validates and stores one uploaded file. Returns an empty result when no
 * file was submitted, which is the normal case for a form saved without
 * changing its image.
 */
export async function storeImage(file: File | null): Promise<UploadResult> {
  if (!file || file.size === 0) return {};

  const invalid = validateImage(file);
  if (invalid) return { error: invalid.message };

  const bytes = Buffer.from(await file.arrayBuffer());
  const stored = await resolveStorage().save({
    filename: file.name || "upload",
    mimeType: file.type,
    bytes,
  });
  return { stored };
}

/** Reads a submitted file field, tolerating browsers that send an empty part. */
export function fileFromForm(formData: FormData, name: string): File | null {
  const value = formData.get(name);
  return value instanceof File && value.size > 0 ? value : null;
}

/** Thrown for problems the person can fix themselves: wrong format, too
 *  large. Its message is written for them and is shown verbatim. */
export class UploadError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "UploadError";
  }
}

/**
 * Turns a storage failure into something an admin can act on.
 *
 * The common case is an existing database that predates the `media` table:
 * the raw driver error is a full SQL statement, which tells the owner
 * nothing about what to do next.
 */
export function describeStorageError(error: unknown): string {
  if (error instanceof UploadError) return error.message;

  const message = error instanceof Error ? error.message : String(error);
  if (/no such table: ?media/i.test(message) || /"media"/.test(message)) {
    return "Image storage is not set up yet. Run `npm run db:migrate` to add the media table, then try again.";
  }
  return "Could not save the image. Check the server logs for details.";
}
