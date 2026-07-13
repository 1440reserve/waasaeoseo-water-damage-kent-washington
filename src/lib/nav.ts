import { getTranslations } from "next-intl/server";
import { siteConfig } from "./site";
import { getServices, hasAreas, hasGuides } from "./content";
import { resolveImage, type ResolvedImage } from "./images";
import { formatPhone, telHref } from "./utils";
import type { Locale } from "./schemas";
import type { Href } from "./seo";

export type NavLink = { key: string; label: string; href: Href };

export type NavData = {
  locale: Locale;
  name: string;
  logo: ResolvedImage;
  logoInverse: ResolvedImage;
  phoneDisplay: string;
  phoneHref: string;
  phoneAria: string;
  /** Primary header CTA (goes to /contact). */
  cta: { label: string };
  /** The services dropdown menu. */
  menu: {
    label: string;
    href: Href;
    viewAllLabel: string;
    items: NavLink[];
  };
  items: NavLink[];
  a11y: {
    skipToContent: string;
    openMenu: string;
    closeMenu: string;
    mainNavigation: string;
  };
};

/** Builds all header data server-side; Header itself is a client component. */
export async function buildNavData(locale: Locale): Promise<NavData> {
  const t = await getTranslations({ locale });

  const menuItems: NavLink[] = getServices(locale)
    .filter((s) => s.fm.featured)
    .map((service) => ({
      key: service.fm.id,
      label: service.fm.title,
      href: {
        pathname: "/services/[slug]",
        params: { slug: service.fm.slug },
      } as Href,
    }));

  const items: NavLink[] = [
    ...(hasAreas(locale)
      ? [{ key: "areas", label: t("nav.areas"), href: { pathname: "/areas" } as Href }]
      : []),
    ...(hasGuides(locale)
      ? [{ key: "guides", label: t("nav.guides"), href: { pathname: "/guides" } as Href }]
      : []),
    { key: "about", label: t("nav.about"), href: { pathname: "/about" } as Href },
    { key: "contact", label: t("nav.contact"), href: { pathname: "/contact" } as Href },
  ];

  const logo = resolveImage(siteConfig.branding.logo);

  return {
    locale,
    name: siteConfig.name,
    logo,
    logoInverse: siteConfig.branding.logoInverse
      ? resolveImage(siteConfig.branding.logoInverse)
      : logo,
    phoneDisplay: formatPhone(siteConfig.primaryPhone),
    phoneHref: telHref(siteConfig.primaryPhone),
    phoneAria: t("a11y.callPhone", { phone: formatPhone(siteConfig.primaryPhone) }),
    cta: {
      label: t("cta.headerCta"),
    },
    menu: {
      label: t("nav.services"),
      href: { pathname: "/services" } as Href,
      viewAllLabel: t("sections.servicesViewAll"),
      items: menuItems,
    },
    items,
    a11y: {
      skipToContent: t("a11y.skipToContent"),
      openMenu: t("a11y.openMenu"),
      closeMenu: t("a11y.closeMenu"),
      mainNavigation: t("a11y.mainNavigation"),
    },
  };
}
