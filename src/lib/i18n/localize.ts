import { defaultLocale, locales, type Locale } from "./config";

/**
 * A value that may be a plain string or a per-locale map.
 *
 * Content authors can write `"Zero Trust"` when a term is the same everywhere
 * and `{ en: "...", fr: "..." }` when it is not. Nothing else in the codebase
 * needs to know which form was used.
 */
export type L<T = string> = T | Partial<Record<Locale, T>>;

function isLocaleMap<T>(value: L<T>): value is Partial<Record<Locale, T>> {
  return (
    typeof value === "object" &&
    value !== null &&
    !Array.isArray(value) &&
    Object.keys(value).some((k) => (locales as readonly string[]).includes(k))
  );
}

/** Resolve a localized value: requested locale → default locale → first present. */
export function t<T>(value: L<T>, locale: Locale = defaultLocale): T {
  if (!isLocaleMap(value)) return value;
  const map = value;
  return (map[locale] ?? map[defaultLocale] ?? Object.values(map)[0]) as T;
}

/** Resolve every localized value in an array. */
export function tAll<T>(values: L<T>[] | undefined, locale: Locale): T[] {
  return (values ?? []).map((v) => t(v, locale));
}
