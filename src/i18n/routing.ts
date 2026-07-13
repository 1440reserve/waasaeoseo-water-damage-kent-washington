import { defineRouting } from "next-intl/routing";
import { siteLocales } from "@/lib/site";

/**
 * Localized pathnames: English routes live at the root (no /en prefix).
 * The [locale] structure is kept so Spanish can be added later by adding
 * "es" to the client's `locales` and per-locale slug maps here (e.g.
 * "/services": { en: "/services", es: "/servicios" }). Dynamic content
 * slugs are locale-specific in each content file's frontmatter.
 */
export const routing = defineRouting({
  locales: siteLocales,
  defaultLocale: "en",
  localePrefix: "as-needed",
  pathnames: {
    "/": "/",
    "/services": "/services",
    "/services/[slug]": "/services/[slug]",
    "/areas": "/areas",
    "/areas/[slug]": "/areas/[slug]",
    "/guides": "/guides",
    "/guides/[slug]": "/guides/[slug]",
    "/about": "/about",
    "/contact": "/contact",
    "/privacy-policy": "/privacy-policy",
    "/terms": "/terms",
  },
});

export type AppPathname = keyof typeof routing.pathnames;
