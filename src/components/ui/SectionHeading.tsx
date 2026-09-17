import type { L } from "@/lib/i18n/localize";
import { t } from "@/lib/i18n/localize";
import type { Locale } from "@/lib/i18n/config";
import { cn } from "@/lib/utils/cn";

export function SectionHeading({
  eyebrow,
  title,
  intro,
  locale,
  align,
  className,
}: {
  eyebrow?: L | false;
  title?: L | false;
  intro?: L;
  locale: Locale;
  align?: "left" | "center";
  className?: string;
}) {
  if (!eyebrow && !title && !intro) return null;
  return (
    <div
      className={cn(
        "mb-10 md:mb-14",
        align === "center" && "text-center mx-auto",
        className,
      )}
    >
      {eyebrow !== false && eyebrow && <div className="eyebrow mb-3">{t(eyebrow, locale)}</div>}
      {title !== false && title && (
        <h2 className="text-heading">{t(title, locale)}</h2>
      )}
      {intro && <p className="measure mt-4 text-md text-muted">{t(intro, locale)}</p>}
    </div>
  );
}
