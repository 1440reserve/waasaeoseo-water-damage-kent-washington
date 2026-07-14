import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { siteConfig } from "@/lib/site";
import {
  getGuideBySlug,
  getGuides,
  getServiceById,
  guideAlternates,
} from "@/lib/content";
import { buildMetadata, localizedUrl, type Href } from "@/lib/seo";
import { guideSchema } from "@/lib/schema-org";
import { resolveImage } from "@/lib/images";
import type { Locale } from "@/lib/schemas";
import { formatDate } from "@/lib/utils";
import { MdxContent } from "@/lib/mdx";
import { extractToc } from "@/lib/toc";
import { Container, Section } from "@/components/ui/primitives";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { SmartImage } from "@/components/ui/SmartImage";
import { JsonLd } from "@/components/seo/JsonLd";
import { CtaBand } from "@/components/sections/CtaBand";
import { Icon } from "@/components/ui/Icon";

type Props = { params: Promise<{ locale: Locale; slug: string }> };

export function generateStaticParams({ params }: { params: { locale: string } }) {
  return getGuides(params.locale as Locale).map((g) => ({ slug: g.fm.slug }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  const guide = getGuideBySlug(locale, slug);
  if (!guide) return {};
  const alternates = Object.fromEntries(
    Object.entries(guideAlternates(guide.fm.id)).map(([l, s]) => [
      l,
      { pathname: "/guides/[slug]", params: { slug: s } } as Href,
    ])
  );
  return buildMetadata({
    locale,
    // Brand appended for recognition; frontmatter metaTitle overrides when
    // the combination runs past ~60 chars.
    title: guide.fm.metaTitle ?? `${guide.fm.title} | ${siteConfig.name}`,
    description: guide.fm.metaDescription,
    href: { pathname: "/guides/[slug]", params: { slug } } as Href,
    alternates,
    image: guide.fm.image
      ? { ...resolveImage(guide.fm.image), alt: guide.fm.imageAlt }
      : null,
    ogType: "article",
  });
}

export default async function GuidePage({ params }: Props) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const guide = getGuideBySlug(locale, slug);
  if (!guide) notFound();

  const t = await getTranslations({ locale });
  const service = guide.fm.service
    ? getServiceById(locale, guide.fm.service)
    : undefined;
  const href = { pathname: "/guides/[slug]", params: { slug } } as Href;
  const url = localizedUrl(locale, href);

  return (
    <>
      <JsonLd data={guideSchema(guide, locale, url)} />

      <div className="bg-wash">
        <Container className="max-w-4xl pb-14 pt-10 md:pt-14">
          <Breadcrumbs
            locale={locale}
            items={[
              { label: t("nav.guides"), href: { pathname: "/guides" } as Href },
              { label: guide.fm.title },
            ]}
            className="mb-10"
          />
          <h1 className="text-display-2">{guide.fm.title}</h1>
          <div className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-3 border-t border-line-soft pt-6 text-sm text-muted">
            <span className="font-medium text-ink">
              {locale === "es" ? "Por" : "By"} {siteConfig.name}
            </span>
            <span className="tabular-nums">
              {t("guide.published", { date: formatDate(guide.fm.date, locale) })}
            </span>
            {guide.fm.updated ? (
              <span className="tabular-nums">
                {t("guide.updated", { date: formatDate(guide.fm.updated, locale) })}
              </span>
            ) : null}
          </div>

          {/* Quick answer: the above-fold plain-language block (AEO). */}
          <div className="mt-8 border-l-2 border-accent bg-paper p-6 md:p-7">
            <p className="eyebrow-bare mb-3 !text-[0.68rem]">
              {t("guide.quickAnswerLabel")}
            </p>
            <p className="text-lg leading-relaxed text-ink">{guide.fm.quickAnswer}</p>
          </div>
        </Container>
      </div>

      <Section>
        <Container className="max-w-4xl">
          {guide.fm.image ? (
            <SmartImage
              image={resolveImage(guide.fm.image)}
              alt={guide.fm.imageAlt ?? guide.fm.title}
              sizes="(min-width: 896px) 56rem, 92vw"
              className="mb-12 aspect-[2/1] w-full object-cover"
            />
          ) : null}
          {(() => {
            const toc = extractToc(guide.body);
            return toc.length >= 3 ? (
              <nav
                aria-label={locale === "es" ? "Contenido" : "On this page"}
                className="mx-auto mb-12 max-w-prose border-l-2 border-accent bg-wash px-6 py-5"
              >
                <p className="eyebrow-bare mb-3 !text-[0.68rem]">
                  {locale === "es" ? "En esta página" : "On this page"}
                </p>
                <ol className="space-y-2 text-[0.95rem]">
                  {toc.map((h) => (
                    <li key={h.id}>
                      <a
                        href={`#${h.id}`}
                        className="text-muted transition-colors hover:text-accent-ink"
                      >
                        {h.text}
                      </a>
                    </li>
                  ))}
                </ol>
              </nav>
            ) : null;
          })()}
          <article className="prose mx-auto">
            <MdxContent source={guide.body} />
          </article>

          {service ? (
            <div className="mx-auto mt-14 max-w-[68ch] border border-line-soft bg-soft p-7">
              <p className="eyebrow-bare mb-2 !text-[0.68rem]">{t("guide.relatedService")}</p>
              <Link
                href={{
                  pathname: "/services/[slug]",
                  params: { slug: service.fm.slug },
                } as Href}
                className="group inline-flex items-center gap-2.5 font-display text-xl font-medium text-primary"
              >
                {service.fm.h1}
                <Icon
                  name="arrow-right"
                  className="size-4.5 text-accent transition-transform group-hover:translate-x-1"
                />
              </Link>
            </div>
          ) : null}
        </Container>
      </Section>

      <CtaBand locale={locale} />
    </>
  );
}
