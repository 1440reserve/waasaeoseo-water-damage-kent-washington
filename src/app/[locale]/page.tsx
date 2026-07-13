import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { siteConfig } from "@/lib/site";
import { getHomeContent } from "@/lib/content";
import { buildMetadata } from "@/lib/seo";
import type { Locale } from "@/lib/schemas";
import { HOME_SECTIONS } from "@/components/sections/registry";

/**
 * The homepage IS the head-topic page (water damage restoration): the hub
 * in the hub-and-spoke model. There is deliberately no separate
 * /services/water-damage-restoration page competing with it.
 */
type Props = { params: Promise<{ locale: Locale }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const home = getHomeContent(locale);
  return buildMetadata({
    locale,
    title: home.metaTitle,
    description: home.metaDescription,
    href: { pathname: "/" },
    // No per-page override: the branded share card (branding.ogImage)
    // is the right social image for the homepage.
  });
}

export default async function HomePage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      {siteConfig.homepage.sections.map((key) => {
        const SectionComponent = HOME_SECTIONS[key];
        return <SectionComponent key={key} locale={locale} />;
      })}
    </>
  );
}
