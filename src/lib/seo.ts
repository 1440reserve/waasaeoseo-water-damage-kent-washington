import type { Metadata } from "next";
import { getPathname } from "@/i18n/navigation";
import { siteConfig, siteLocales } from "./site";
import { lt, type Locale } from "./schemas";
import { resolveImage, type ResolvedImage } from "./images";

export type Href = Parameters<typeof getPathname>[0]["href"];

export function absoluteUrl(pathname: string): string {
  return new URL(pathname, siteConfig.domain).toString();
}

/** Public URL for a route in a given locale (localized path + prefix). */
export function localizedUrl(locale: Locale, href: Href): string {
  return absoluteUrl(getPathname({ locale, href }));
}

const OG_LOCALE: Record<Locale, string> = { en: "en_US", es: "es_US" };

type BuildMeta = {
  locale: Locale;
  /** Full title: formulas applied at the call site (under 60 chars). */
  title: string;
  description: string;
  href: Href;
  /**
   * Per-locale hrefs for hreflang. Omit for static routes (all site locales
   * assumed). For dynamic content, pass only locales with a translation.
   */
  alternates?: Partial<Record<Locale, Href>>;
  image?: (ResolvedImage & { alt?: string }) | null;
  ogType?: "website" | "article" | "profile";
  noIndex?: boolean;
};

/** Sitewide fallback share image so every page emits og:image (per locale). */
function defaultShareImage(locale: Locale): ResolvedImage & { alt?: string } {
  const { branding } = siteConfig;
  if (branding.ogImage) {
    return { ...resolveImage(lt(branding.ogImage, locale)), alt: siteConfig.name };
  }
  // Generated 1200x630 branded card (src/app/api/og/route.tsx): a real
  // share-sized image instead of the small logo.
  return { src: "/api/og", width: 1200, height: 630, alt: siteConfig.name };
}

export function buildMetadata(meta: BuildMeta): Metadata {
  const alternateHrefs: Partial<Record<Locale, Href>> =
    meta.alternates ??
    Object.fromEntries(siteLocales.map((l) => [l, meta.href]));

  const canonical = localizedUrl(
    meta.locale,
    alternateHrefs[meta.locale] ?? meta.href
  );

  const languages: Record<string, string> = {};
  for (const l of siteLocales) {
    const href = alternateHrefs[l];
    if (href) languages[l] = localizedUrl(l, href);
  }
  if (languages.en) languages["x-default"] = languages.en;

  const image = meta.image ?? defaultShareImage(meta.locale);
  const imageUrl = absoluteUrl(image.src);

  return {
    title: meta.title,
    description: meta.description,
    alternates: {
      canonical,
      // Only emit hreflang when a real language pair exists.
      languages: Object.keys(languages).length > 2 ? languages : undefined,
    },
    openGraph: {
      title: meta.title,
      description: meta.description,
      url: canonical,
      siteName: siteConfig.name,
      type: meta.ogType ?? "website",
      locale: OG_LOCALE[meta.locale],
      images: [
        {
          url: imageUrl,
          width: image.width,
          height: image.height,
          alt: image.alt,
        },
      ],
    },
    // Explicit title/description/image: X/Twitter's OG fallback is
    // unreliable and SEO tools grade the card as incomplete without them.
    twitter: {
      card: "summary_large_image",
      title: meta.title,
      description: meta.description,
      images: [imageUrl],
    },
    ...(meta.noIndex ? { robots: { index: false, follow: false } } : {}),
  };
}
