import type { MetadataRoute } from "next";
import { siteLocales } from "@/lib/site";
import {
  areaAlternates,
  getAreas,
  getGuides,
  getServices,
  getSimplePage,
  guideAlternates,
  serviceAlternates,
} from "@/lib/content";
import { localizedUrl, type Href } from "@/lib/seo";
import type { Locale } from "@/lib/schemas";

type Entry = MetadataRoute.Sitemap[number];

/** One entry per locale-URL, with hreflang alternates where pairs exist. */
function entriesFor(
  hrefByLocale: Partial<Record<Locale, Href>>,
  lastModified?: string
): Entry[] {
  const urls = Object.fromEntries(
    Object.entries(hrefByLocale).map(([l, href]) => [
      l,
      localizedUrl(l as Locale, href),
    ])
  ) as Partial<Record<Locale, string>>;

  return (Object.keys(urls) as Locale[]).map((locale) => ({
    url: urls[locale]!,
    ...(lastModified ? { lastModified } : {}),
    ...(Object.keys(urls).length > 1
      ? { alternates: { languages: urls as Record<string, string> } }
      : {}),
  }));
}

function staticEntry(pathname: string): Entry[] {
  const href = { pathname } as Href;
  return entriesFor(Object.fromEntries(siteLocales.map((l) => [l, href])));
}

/** Dynamic-collection entries deduped across locales by shared id. */
function collectionEntries(
  ids: Set<string>,
  alternatesFor: (id: string) => Partial<Record<Locale, string>>,
  pathname: string
): Entry[] {
  const entries: Entry[] = [];
  for (const id of ids) {
    const hrefs = Object.fromEntries(
      Object.entries(alternatesFor(id)).map(([l, slug]) => [
        l,
        { pathname, params: { slug } } as Href,
      ])
    );
    entries.push(...entriesFor(hrefs));
  }
  return entries;
}

export default function sitemap(): MetadataRoute.Sitemap {
  const en: Locale = "en";
  const entries: Entry[] = [
    ...staticEntry("/"),
    ...staticEntry("/services"),
    ...staticEntry("/areas"),
    ...(getGuides(en).length ? staticEntry("/guides") : []),
    ...(getSimplePage(en, "about") ? staticEntry("/about") : []),
    ...staticEntry("/contact"),
    ...(getSimplePage(en, "privacy-policy") ? staticEntry("/privacy-policy") : []),
  ];

  entries.push(
    ...collectionEntries(
      new Set(siteLocales.flatMap((l) => getServices(l).map((s) => s.fm.id))),
      serviceAlternates,
      "/services/[slug]"
    ),
    ...collectionEntries(
      new Set(siteLocales.flatMap((l) => getAreas(l).map((a) => a.fm.id))),
      areaAlternates,
      "/areas/[slug]"
    )
  );

  // Guides (with lastModified for freshness signals)
  const guideIds = new Map<string, string>();
  for (const l of siteLocales) {
    for (const g of getGuides(l)) {
      guideIds.set(g.fm.id, g.fm.updated ?? g.fm.date);
    }
  }
  for (const [id, lastModified] of guideIds) {
    const hrefs = Object.fromEntries(
      Object.entries(guideAlternates(id)).map(([l, slug]) => [
        l,
        { pathname: "/guides/[slug]", params: { slug } } as Href,
      ])
    );
    entries.push(...entriesFor(hrefs, lastModified));
  }

  return entries;
}
