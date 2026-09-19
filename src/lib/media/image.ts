/**
 * Upload validation and dimension reading.
 *
 * No image library: reading width and height only needs a few bytes from
 * each format's header, and pulling in sharp or similar would add a native
 * binary to a project that otherwise deploys anywhere. If a format is not
 * recognised the upload still succeeds with unknown dimensions, since the
 * layout uses `fill` and does not depend on them.
 */

/** Formats accepted for upload. SVG is excluded on purpose: it can carry
 *  scripts, and serving it same-origin would be a stored-XSS vector. */
export const ALLOWED_IMAGE_TYPES = ["image/png", "image/jpeg", "image/webp", "image/avif", "image/gif"] as const;

export const MAX_UPLOAD_BYTES = 2 * 1024 * 1024;

export interface ImageValidationError {
  message: string;
}

export function validateImage(file: File): ImageValidationError | null {
  if (!ALLOWED_IMAGE_TYPES.includes(file.type as (typeof ALLOWED_IMAGE_TYPES)[number])) {
    return { message: `Unsupported image type. Use PNG, JPEG, WebP, AVIF or GIF.` };
  }
  if (file.size > MAX_UPLOAD_BYTES) {
    const mb = (MAX_UPLOAD_BYTES / 1024 / 1024).toFixed(0);
    return { message: `Image is too large. Keep it under ${mb} MB.` };
  }
  if (file.size === 0) {
    return { message: "That file is empty." };
  }
  return null;
}

export interface Dimensions {
  width: number;
  height: number;
}

/** Reads intrinsic dimensions from the file header. Returns null when the
 *  format is unrecognised or the header is truncated. */
export function readDimensions(buffer: Buffer): Dimensions | null {
  return readPng(buffer) ?? readGif(buffer) ?? readWebp(buffer) ?? readJpeg(buffer);
}

function readPng(b: Buffer): Dimensions | null {
  // \x89PNG\r\n\x1a\n then IHDR: width and height are big-endian at 16 and 20.
  if (b.length < 24) return null;
  if (b.readUInt32BE(0) !== 0x89504e47) return null;
  return { width: b.readUInt32BE(16), height: b.readUInt32BE(20) };
}

function readGif(b: Buffer): Dimensions | null {
  if (b.length < 10) return null;
  if (b.toString("ascii", 0, 3) !== "GIF") return null;
  return { width: b.readUInt16LE(6), height: b.readUInt16LE(8) };
}

function readWebp(b: Buffer): Dimensions | null {
  if (b.length < 30) return null;
  if (b.toString("ascii", 0, 4) !== "RIFF" || b.toString("ascii", 8, 12) !== "WEBP") return null;

  const format = b.toString("ascii", 12, 16);
  if (format === "VP8X") {
    // 24-bit little-endian, stored as value minus one.
    const width = 1 + (b[24]! | (b[25]! << 8) | (b[26]! << 16));
    const height = 1 + (b[27]! | (b[28]! << 8) | (b[29]! << 16));
    return { width, height };
  }
  if (format === "VP8L") {
    const bits = b.readUInt32LE(21);
    return { width: 1 + (bits & 0x3fff), height: 1 + ((bits >> 14) & 0x3fff) };
  }
  if (format === "VP8 ") {
    return { width: b.readUInt16LE(26) & 0x3fff, height: b.readUInt16LE(28) & 0x3fff };
  }
  return null;
}

function readJpeg(b: Buffer): Dimensions | null {
  if (b.length < 4 || b.readUInt16BE(0) !== 0xffd8) return null;

  let offset = 2;
  while (offset + 9 < b.length) {
    if (b[offset] !== 0xff) {
      offset += 1;
      continue;
    }
    const marker = b[offset + 1]!;
    // SOF0-SOF15 carry the frame dimensions; skip DHT/DAC/DRI and restarts.
    const isStartOfFrame =
      marker >= 0xc0 && marker <= 0xcf && marker !== 0xc4 && marker !== 0xc8 && marker !== 0xcc;
    if (isStartOfFrame) {
      return { height: b.readUInt16BE(offset + 5), width: b.readUInt16BE(offset + 7) };
    }
    const segmentLength = b.readUInt16BE(offset + 2);
    if (segmentLength < 2) return null;
    offset += 2 + segmentLength;
  }
  return null;
}
