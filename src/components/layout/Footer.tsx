import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { siteConfig } from "@/lib/site";
import { getAreas, getServices, hasGuides } from "@/lib/content";
import { resolveImage } from "@/lib/images";
import { lt, type Locale } from "@/lib/schemas";
import { formatPhone, telHref } from "@/lib/utils";
import type { Href } from "@/lib/seo";
import { Stars } from "@/components/ui/primitives";

/** Human label for a sameAs/profile URL, derived from its hostname. */
const PROFILE_LABELS: Array<[RegExp, string]> = [
  [/maps\.google|google\./, "Google"],
  [/linkedin\./, "LinkedIn"],
  [/facebook\./, "Facebook"],
  [/instagram\./, "Instagram"],
  [/twitter\.com|(^|\.)x\.com/, "X (Twitter)"],
  [/youtube\./, "YouTube"],
  [/yelp\./, "Yelp"],
  [/bbb\./, "BBB"],
  [/nextdoor\./, "Nextdoor"],
  [/angi\.|homeadvisor\./, "Angi"],
  [/thumbtack\./, "Thumbtack"],
];

function profileLabel(url: string): string {
  const hostname = new URL(url).hostname;
  const match = PROFILE_LABELS.find(([pattern]) => pattern.test(hostname));
  return match?.[1] ?? hostname.replace(/^www\./, "");
}

export async function Footer({ locale }: { locale: Locale }) {
  const t = await getTranslations({ locale });
  const logoRef = siteConfig.branding.logoInverse ?? siteConfig.branding.logo;
  const logo = resolveImage(logoRef);
  const rating = siteConfig.trust.googleRating;

  const navLinks: Array<{ key: string; label: string; href: Href }> = [
    { key: "services", label: t("nav.services"), href: { pathname: "/services" } as Href },
    { key: "areas", label: t("nav.areas"), href: { pathname: "/areas" } as Href },
    ...(hasGuides(locale)
      ? [{ key: "guides", label: t("nav.guides"), href: { pathname: "/guides" } as Href }]
      : []),
    { key: "about", label: t("nav.about"), href: { pathname: "/about" } as Href },
    { key: "contact", label: t("nav.contact"), href: { pathname: "/contact" } as Href },
  ];

  /** Second column: featured services. */
  const serviceLinks: Array<{ key: string; label: string; href: Href }> = getServices(locale)
    .filter((s) => s.fm.featured)
    .slice(0, 8)
    .map((service) => ({
      key: service.fm.id,
      label: service.fm.title,
      href: { pathname: "/services/[slug]", params: { slug: service.fm.slug } } as Href,
    }));

  /** Third column: service-area pages. */
  const areaLinks: Array<{ key: string; label: string; href: Href }> = getAreas(locale)
    .filter((a) => a.fm.featured)
    .slice(0, 10)
    .map((area) => ({
      key: area.fm.id,
      label: area.fm.title,
      href: { pathname: "/areas/[slug]", params: { slug: area.fm.slug } } as Href,
    }));

  const legalLinks: Array<{ key: string; label: string; href: Href }> = [
    {
      key: "privacy",
      label: locale === "es" ? "Política de Privacidad" : "Privacy Policy",
      href: { pathname: "/privacy-policy" } as Href,
    },
  ];

  return (
    <footer className="dark-zone relative overflow-hidden bg-wash-dark text-inverse">
      <div className="relative mx-auto w-full max-w-[76rem] px-5 pb-12 pt-20 sm:px-8">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1.2fr]">
          {/* Brand */}
          <div>
            <Link href="/" aria-label={siteConfig.name}>
              <Image
                src={logo.src}
                alt={siteConfig.name}
                width={logo.width}
                height={logo.height}
                unoptimized={logo.src.endsWith(".svg")}
                className="h-10 w-auto"
              />
              {/* Text-level anchor for crawlers that ignore alt/aria-label. */}
              <span className="sr-only">{siteConfig.name}</span>
            </Link>
            {siteConfig.tagline ? (
              <p className="mt-5 max-w-xs font-display text-lg italic leading-snug text-inverse-muted">
                {lt(siteConfig.tagline, locale)}
              </p>
            ) : null}
            <a
              href={telHref(siteConfig.primaryPhone)}
              className="data mt-6 inline-block text-2xl font-semibold text-accent-bright transition-opacity hover:opacity-80"
            >
              {formatPhone(siteConfig.primaryPhone)}
            </a>
            {rating ? (
              <div className="mt-4 flex items-center gap-2.5 text-sm text-inverse-muted">
                <Stars rating={rating.value} />
                <span>
                  {rating.value} · {rating.count}+ {t("trust.reviewsLabel")}
                </span>
              </div>
            ) : null}
          </div>

          {/* Navigate */}
          <nav aria-label={t("a11y.footerNavigation")}>
            <p className="eyebrow-bare mb-5">{t("footer.navigate")}</p>
            <ul className="space-y-2.5 text-[0.95rem]">
              {navLinks.map((l) => (
                <li key={l.key}>
                  <Link href={l.href} className="text-inverse-muted transition-colors hover:text-inverse">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Services */}
          <div>
            <p className="eyebrow-bare mb-5">{t("footer.services")}</p>
            <ul className="space-y-2.5 text-[0.95rem]">
              {serviceLinks.map((item) => (
                <li key={item.key}>
                  <Link
                    href={item.href}
                    className="text-inverse-muted transition-colors hover:text-inverse"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Service areas + profiles */}
          <div>
            <p className="eyebrow-bare mb-5">{t("footer.areas")}</p>
            <ul className="space-y-2.5 text-[0.95rem]">
              {areaLinks.map((item) => (
                <li key={item.key}>
                  <Link
                    href={item.href}
                    className="text-inverse-muted transition-colors hover:text-inverse"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>

            {/* Profiles/social: visible sameAs links (entity + trust signal) */}
            {siteConfig.profiles.length ? (
              <div className="mt-10">
                <p className="eyebrow-bare mb-5">{t("footer.connect")}</p>
                <ul className="flex flex-wrap gap-x-5 gap-y-2 text-[0.95rem]">
                  {siteConfig.profiles.map((profile) => (
                    <li key={profile}>
                      <a
                        href={profile}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-inverse-muted transition-colors hover:text-inverse"
                      >
                        {profileLabel(profile)}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
          </div>
        </div>

        {/* Disclaimer + legal row */}
        <div className="mt-16 border-t border-inverse/15 pt-8">
          <p className="max-w-4xl text-xs leading-relaxed text-inverse-muted/80">
            {lt(siteConfig.footerDisclaimer, locale)}
          </p>
          <div className="mt-6 flex flex-col gap-4 text-xs text-inverse-muted/80 sm:flex-row sm:items-center sm:justify-between">
            <p>
              © {new Date().getFullYear()} {siteConfig.name}. {t("footer.rightsReserved")}
            </p>
            <ul className="flex flex-wrap gap-x-5 gap-y-1">
              {legalLinks.map((l) => (
                <li key={l.key}>
                  <Link href={l.href} className="hover:text-inverse">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}
