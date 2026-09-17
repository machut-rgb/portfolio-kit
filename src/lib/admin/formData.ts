import type { L } from "@/lib/i18n/localize";
import { locales, type Locale } from "@/lib/i18n/config";

/**
 * Every localized field is submitted as three plain inputs — `name.en`,
 * `name.fr`, `name.mg` — never as JSON in a hidden field. That keeps the
 * form working without JavaScript and keeps the server-side parsing this
 * simple: read three keys, build an object, drop empty ones so they fall
 * back to English through `t()` instead of storing an empty string.
 */
export function parseLocalized(formData: FormData, name: string): L {
  const en = String(formData.get(`${name}.en`) ?? "").trim();
  const out: Partial<Record<Locale, string>> = { en };
  for (const locale of locales) {
    if (locale === "en") continue;
    const value = String(formData.get(`${name}.${locale}`) ?? "").trim();
    if (value) out[locale] = value;
  }
  return out as L;
}

/** Same idea, optional — returns undefined if English (the required locale) is empty. */
export function parseLocalizedOptional(formData: FormData, name: string): L | undefined {
  const en = String(formData.get(`${name}.en`) ?? "").trim();
  if (!en) return undefined;
  return parseLocalized(formData, name);
}

/**
 * A list of localized strings (bullets, paragraphs, highlights) submitted
 * as one textarea per locale, one item per line. Lines are matched by
 * position across languages — line 3 of the French textarea is assumed to
 * be the translation of line 3 of the English one. English drives the
 * count: a French/Malagasy line beyond the English line count, or a blank
 * line where English has content, is dropped rather than guessed at.
 */
export function parseLocalizedList(formData: FormData, name: string): L[] {
  const linesFor = (locale: Locale) =>
    String(formData.get(`${name}.${locale}`) ?? "")
      .split("\n")
      .map((line) => line.trim());

  const en = linesFor("en").filter((line) => line.length > 0);
  const fr = linesFor("fr");
  const mg = linesFor("mg");

  return en.map((enLine, i) => {
    const item: Partial<Record<Locale, string>> = { en: enLine };
    if (fr[i]) item.fr = fr[i];
    if (mg[i]) item.mg = mg[i];
    return item as L;
  });
}

/** Comma-separated plain (non-localized) list — tags, tech stacks. */
export function parseList(formData: FormData, name: string): string[] {
  return String(formData.get(name) ?? "")
    .split(",")
    .map((v) => v.trim())
    .filter(Boolean);
}

export function parseString(formData: FormData, name: string): string {
  return String(formData.get(name) ?? "").trim();
}

export function parseOptionalString(formData: FormData, name: string): string | undefined {
  const value = parseString(formData, name);
  return value || undefined;
}

export function parseNumber(formData: FormData, name: string): number | undefined {
  const raw = formData.get(name);
  if (raw === null || raw === "") return undefined;
  const n = Number(raw);
  return Number.isFinite(n) ? n : undefined;
}

export function parseBoolean(formData: FormData, name: string): boolean {
  return formData.get(name) === "on" || formData.get(name) === "true";
}

/** Serializes an `L | L[]` value back into the `name.locale` fields a form field expects as its default. */
export function localizedDefault(value: L | undefined, locale: Locale): string {
  if (!value) return "";
  if (typeof value === "string") return locale === "en" ? value : "";
  return value[locale] ?? "";
}

export function localizedListDefault(values: L[] | undefined, locale: Locale): string {
  if (!values || values.length === 0) return "";
  return values.map((v) => localizedDefault(v, locale)).join("\n");
}

/** Builds the `{en, fr, mg}` string map a `<LocalizedField>` needs for `defaultValues`. */
export function localizedDefaults(value: L | undefined): Record<Locale, string> {
  return { en: localizedDefault(value, "en"), fr: localizedDefault(value, "fr"), mg: localizedDefault(value, "mg") };
}

/** Same, for a list of localized values (bullets/paragraphs) — one joined-by-newline string per locale. */
export function localizedListDefaults(values: L[] | undefined): Record<Locale, string> {
  return {
    en: localizedListDefault(values, "en"),
    fr: localizedListDefault(values, "fr"),
    mg: localizedListDefault(values, "mg"),
  };
}
