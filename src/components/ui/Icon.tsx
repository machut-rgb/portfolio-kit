import type { CSSProperties } from "react";
import { icons, isIconName } from "@config/icons.config";
import { cn } from "@/lib/utils/cn";

/**
 * Renders both the vector and the text glyph for an icon; CSS decides which
 * one is visible based on the active icon set. That keeps icons server-
 * rendered (no client JS) while still being switchable at runtime.
 */
export function Icon({
  name,
  className,
  label,
  style,
}: {
  name: string;
  className?: string;
  /** Provide when the icon is the only content of a control. */
  label?: string;
  style?: CSSProperties;
}) {
  if (!isIconName(name)) return null;
  const def = icons[name];
  const a11y = label
    ? { role: "img" as const, "aria-label": label }
    : { "aria-hidden": true as const };

  return (
    <>
      <svg
        viewBox="0 0 24 24"
        className={cn("icon", className)}
        style={style}
        dangerouslySetInnerHTML={{ __html: def.svg }}
        {...a11y}
      />
      <span className={cn("icon-glyph", className)} style={style} {...a11y}>
        {def.glyph}
      </span>
    </>
  );
}
