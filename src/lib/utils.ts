import type { Locale } from "./schemas";

/** Minimal class joiner (avoids a clsx dependency). */
export function cn(
  ...classes: Array<string | false | null | undefined>
): string {
  return classes.filter(Boolean).join(" ");
}

/** "+12535550100" -> "(253) 555-0100" for display; non-US passes through. */
export function formatPhone(e164: string): string {
  const us = e164.match(/^\+1(\d{3})(\d{3})(\d{4})$/);
  if (us) return `(${us[1]}) ${us[2]}-${us[3]}`;
  return e164;
}

export function telHref(e164: string): string {
  return `tel:${e164}`;
}

export function formatDate(iso: string, locale: Locale): string {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d)).toLocaleDateString(
    locale === "es" ? "es-US" : "en-US",
    { year: "numeric", month: "long", day: "numeric", timeZone: "UTC" }
  );
}

/** Word-safe truncation for card excerpts. */
export function excerpt(text: string, max = 120): string {
  if (text.length <= max) return text;
  const cut = text.slice(0, max);
  return `${cut.slice(0, Math.max(cut.lastIndexOf(" "), 40))}…`;
}
