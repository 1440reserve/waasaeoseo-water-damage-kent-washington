import { siteConfig } from "./site";
import { absoluteUrl } from "./seo";
import { resolveImage } from "./images";
import { lt, type Address, type FaqItem, type Locale } from "./schemas";
import type { Area, Guide, Service } from "./content";

/**
 * JSON-LD builders, one per page type. The business is a plain
 * LocalBusiness (no niche subtype fabricated). Address is OPTIONAL by
 * design: it renders only once the client config carries a real,
 * verifiable location. Never emit a placeholder address.
 */

export type JsonLdObject = Record<string, unknown>;

export const ORG_ID = `${siteConfig.domain}/#organization`;

function postalAddress(address: Address): JsonLdObject {
  return {
    "@type": "PostalAddress",
    streetAddress: address.streetAddress,
    addressLocality: address.addressLocality,
    addressRegion: address.addressRegion,
    postalCode: address.postalCode,
    addressCountry: "US",
  };
}

function areaServed(): JsonLdObject[] {
  return [
    { "@type": "City", name: siteConfig.areaServed },
    ...siteConfig.serviceAreas.map((name) => ({ "@type": "City", name })),
  ];
}

/** Sitewide LocalBusiness node (rendered once, in the layout). */
export function organizationSchema(locale: Locale): JsonLdObject {
  const logoUrl = absoluteUrl(resolveImage(siteConfig.branding.logo).src);
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": ORG_ID,
    name: siteConfig.name,
    url: siteConfig.domain,
    logo: logoUrl,
    image: logoUrl,
    telephone: siteConfig.primaryPhone,
    areaServed: areaServed(),
    // Address is optional and currently omitted: no physical location has
    // been verified yet. Add `address` to site.config.ts when one exists.
    ...(siteConfig.address ? { address: postalAddress(siteConfig.address) } : {}),
    ...(siteConfig.profiles.length ? { sameAs: siteConfig.profiles } : {}),
    // No aggregateRating here: Google treats self-applied ratings on your
    // own LocalBusiness/Organization node as self-serving and ignores or
    // penalizes them. Ratings belong on genuinely hosted first-party
    // reviews only.
    ...(siteConfig.tagline ? { slogan: lt(siteConfig.tagline, locale) } : {}),
  };
}

/** WebSite node: establishes the official site name for search engines. */
export function websiteSchema(locale: Locale): JsonLdObject {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${siteConfig.domain}/#website`,
    name: siteConfig.name,
    url: siteConfig.domain,
    inLanguage: locale,
    publisher: { "@id": ORG_ID },
  };
}

/** Service node for a service page, provided by the LocalBusiness. */
export function serviceSchema(service: Service, locale: Locale, url: string): JsonLdObject {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": `${url}#service`,
    name: service.fm.h1,
    serviceType: service.fm.title,
    description: service.fm.quickAnswer,
    url,
    provider: { "@id": ORG_ID },
    areaServed: areaServed(),
    inLanguage: locale,
  };
}

/** Service node for an area page: the head service scoped to one place. */
export function areaSchema(area: Area, locale: Locale, url: string): JsonLdObject {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": `${url}#service`,
    name: area.fm.h1,
    serviceType: "Water damage restoration",
    description: area.fm.quickAnswer,
    url,
    provider: { "@id": ORG_ID },
    areaServed: [{ "@type": "Place", name: area.fm.title }],
    inLanguage: locale,
  };
}

export function faqSchema(faqs: FaqItem[]): JsonLdObject {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
}

export function breadcrumbSchema(
  items: Array<{ name: string; url?: string }>
): JsonLdObject {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      // The final (current-page) item may omit `item` per Google guidance.
      ...(item.url ? { item: item.url } : {}),
    })),
  };
}

/** Sitewide fallback image for article nodes: validators require one. */
function defaultArticleImage(locale: Locale): string {
  const { branding } = siteConfig;
  const ref = branding.ogImage ? lt(branding.ogImage, locale) : branding.logo;
  return absoluteUrl(resolveImage(ref).src);
}

/**
 * Article node for a guide. The business is the author (no fabricated
 * person bylines); swap in a real Person author if one exists later.
 */
export function guideSchema(guide: Guide, locale: Locale, url: string): JsonLdObject {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: guide.fm.title,
    description: guide.fm.metaDescription,
    datePublished: guide.fm.date,
    dateModified: guide.fm.updated ?? guide.fm.date,
    author: { "@id": ORG_ID },
    publisher: { "@id": ORG_ID },
    mainEntityOfPage: url,
    inLanguage: locale,
    image: guide.fm.image
      ? absoluteUrl(resolveImage(guide.fm.image).src)
      : defaultArticleImage(locale),
  };
}
