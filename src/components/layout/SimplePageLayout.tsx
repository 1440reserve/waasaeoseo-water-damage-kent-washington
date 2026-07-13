import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { siteConfig } from "@/lib/site";
import { getSimplePage, type SimplePageName } from "@/lib/content";
import { buildMetadata, type Href } from "@/lib/seo";
import type { Locale } from "@/lib/schemas";
import { formatDate } from "@/lib/utils";
import { MdxContent } from "@/lib/mdx";
import { Container, Section } from "@/components/ui/primitives";
import { PageHeader } from "@/components/layout/PageHeader";
import { CtaBand } from "@/components/sections/CtaBand";

const HREFS: Record<SimplePageName, Href> = {
  about: { pathname: "/about" } as Href,
  "privacy-policy": { pathname: "/privacy-policy" } as Href,
};

export async function simplePageMetadata(
  locale: Locale,
  name: SimplePageName
): Promise<Metadata> {
  const page = getSimplePage(locale, name);
  if (!page) return {};
  return buildMetadata({
    locale,
    title: page.fm.metaTitle ?? `${page.fm.title} | ${siteConfig.name}`,
    description: page.fm.metaDescription ?? page.fm.title,
    href: HREFS[name],
    // Legal pages stay indexable: they're footer-linked on every page,
    // and a noindex here contradicts the sitemap/internal-link graph.
  });
}

export async function SimplePageLayout({
  locale,
  name,
  withCta = false,
}: {
  locale: Locale;
  name: SimplePageName;
  withCta?: boolean;
}) {
  const page = getSimplePage(locale, name);
  if (!page) notFound();
  const t = await getTranslations({ locale });

  return (
    <>
      <PageHeader
        locale={locale}
        crumbs={[{ label: page.fm.title }]}
        title={page.fm.title}
        intro={
          page.fm.updated
            ? t("guide.updated", { date: formatDate(page.fm.updated, locale) })
            : undefined
        }
      />
      <Section>
        <Container>
          <article className="prose">
            <MdxContent source={page.body} />
          </article>
        </Container>
      </Section>
      {withCta ? <CtaBand locale={locale} /> : null}
    </>
  );
}
