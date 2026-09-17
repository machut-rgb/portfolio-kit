export const locales = ["en", "fr", "mg"] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "en";

export const localeNames: Record<Locale, string> = {
  en: "English",
  fr: "Français",
  mg: "Malagasy",
};

/** Shown in the switcher — short enough for a pill. */
export const localeLabels: Record<Locale, string> = { en: "EN", fr: "FR", mg: "MG" };

export function isLocale(value: string | undefined): value is Locale {
  return !!value && (locales as readonly string[]).includes(value);
}

/** Best match for an `Accept-Language` header, falling back to the default. */
export function negotiateLocale(header: string | null): Locale {
  if (!header) return defaultLocale;
  const ranked = header
    .split(",")
    .map((part) => {
      const [tag = "", q = "q=1"] = part.trim().split(";");
      return { tag: tag.toLowerCase(), q: Number.parseFloat(q.replace("q=", "")) || 0 };
    })
    .sort((a, b) => b.q - a.q);
  for (const { tag } of ranked) {
    const base = tag.split("-")[0];
    if (isLocale(base)) return base;
  }
  return defaultLocale;
}
