"use client";

import { useState } from "react";
import { ALLOWED_IMAGE_TYPES, MAX_UPLOAD_BYTES } from "@/lib/media/image";
import { Icon } from "@/components/ui/Icon";

/**
 * Upload control for a single image.
 *
 * The file input is part of the form rather than a separate upload endpoint,
 * so the image is saved in the same submission as the rest of the record.
 * That keeps it working without JavaScript and avoids orphaned uploads from
 * abandoned forms. The preview is client-side only.
 */
export function ImageField({
  name,
  label,
  currentUrl,
  hint,
  removable = true,
}: {
  /** Field name for the file input. The action reads `${name}` for the file
   *  and `${name}Remove` for the clear checkbox. */
  name: string;
  label: string;
  currentUrl?: string | null;
  hint?: string;
  /** Set false where an image is mandatory. */
  removable?: boolean;
}) {
  const [preview, setPreview] = useState<string | null>(null);
  const [remove, setRemove] = useState(false);
  const shown = preview ?? (remove ? null : currentUrl) ?? null;
  const maxMb = (MAX_UPLOAD_BYTES / 1024 / 1024).toFixed(0);

  return (
    <div className="flex flex-col gap-2">
      <label className="field-label" htmlFor={`${name}-input`}>
        {label}
      </label>

      <div className="flex items-start gap-4">
        <div
          className="w-24 h-24 flex-none rounded-[var(--p-radius-sm)] border overflow-hidden flex items-center justify-center"
          style={{ borderColor: "var(--p-border)", background: "var(--p-surface-alt)" }}
        >
          {shown ? (
            // Plain img, not next/image: this is a local preview of a blob
            // URL or an already-optimised upload, inside the admin only.
            // eslint-disable-next-line @next/next/no-img-element
            <img src={shown} alt="" className="w-full h-full object-cover" />
          ) : (
            <span className="text-2xs" style={{ color: "var(--p-fg-subtle)" }}>
              None
            </span>
          )}
        </div>

        <div className="flex-1 min-w-0 flex flex-col gap-2">
          <input
            id={`${name}-input`}
            name={name}
            type="file"
            accept={ALLOWED_IMAGE_TYPES.join(",")}
            className="field text-xs"
            onChange={(event) => {
              const file = event.target.files?.[0];
              setPreview(file ? URL.createObjectURL(file) : null);
              if (file) setRemove(false);
            }}
          />

          {removable && currentUrl && (
            <label className="flex items-center gap-2 text-xs cursor-pointer" style={{ color: "var(--p-fg-muted)" }}>
              <input
                type="checkbox"
                name={`${name}Remove`}
                checked={remove}
                onChange={(event) => {
                  setRemove(event.target.checked);
                  if (event.target.checked) setPreview(null);
                }}
                className="w-4 h-4 accent-[var(--p-primary)]"
              />
              <Icon name="close" />
              Remove this image
            </label>
          )}

          <span className="text-2xs" style={{ color: "var(--p-fg-subtle)" }}>
            {hint ? `${hint} ` : ""}PNG, JPEG, WebP, AVIF or GIF, up to {maxMb} MB.
          </span>
        </div>
      </div>
    </div>
  );
}
