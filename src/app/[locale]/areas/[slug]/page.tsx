import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { siteConfig } from "@/lib/site";
import {
  areaAlternates,
  getAreaBySlug,
  getAreas,
  getGuides,
  getServices,
} from "@/lib/content";
import { guidesForArea, relatedAreas, servicesForArea } from "@/lib/linking";
import { buildMetadata, localizedUrl, type Href } from "@/lib/seo";
import { areaSchema } from "@/lib/schema-org";
import { resolveImage } from "@/lib/images";
import type { Locale } from "@/lib/schemas";
import { formatDate, formatPhone, telHref } from "@/lib/utils";
import { MdxContent } from "@/lib/mdx";
import { Container, Section } from "@/components/ui/primitives";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { ButtonAnchor, ButtonLink } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { SmartImage } from "@/components/ui/SmartImage";
import { JsonLd } from "@/components/seo/JsonLd";
import { FaqBlock } from "@/components/sections/FaqSections";
import { LeadFormPanel } from "@/components/sections/LeadFormPanel";
import { CtaBand } from "@/components/sections/CtaBand";

type Props = { params: Promise<{ locale: Locale; slug: string }> };

export function generateStaticParams({ params }: { params: { locale: string } }) {
  return getAreas(params.locale as Locale).map((a) => ({ slug: a.fm.slug }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  const area = getAreaBySlug(locale, slug);
  if (!area) return {};
  const alternates = Object.fromEntries(
    Object.entries(areaAlternates(area.fm.id)).map(([l, s]) => [
      l,
      { pathname: "/areas/[slug]", params: { slug: s } } as Href,
    ])
  );
  return buildMetadata({
    locale,
    title: area.fm.metaTitle ?? `${area.fm.h1} | ${siteConfig.name}`,
    description: area.fm.metaDescription,
    href: { pathname: "/areas/[slug]", params: { slug } } as Href,
    alternates,
    image: area.fm.image
      ? { ...resolveImage(area.fm.image), alt: area.fm.imageAlt }
      : null,
  });
}

export default async function AreaPage({ params }: Props) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const area = getAreaBySlug(locale, slug);
  if (!area) notFound();

  const t = await getTranslations({ locale });
  const fm = area.fm;
  const services = servicesForArea(area, getServices(locale));
  const related = relatedAreas(area, getAreas(locale)).slice(0, 3);
  const guides = guidesForArea(area, getGuides(locale)).slice(0, 3);
  const href = { pathname: "/areas/[slug]", params: { slug } } as Href;
  const url = localizedUrl(locale, href);

  return (
    <>
      <JsonLd data={areaSchema(area, locale, url)} />

      <div className="bg-wash">
        <Container className="pb-16 pt-10 md:pt-14">
          <Breadcrumbs
            locale={locale}
            items={[
              { label: t("nav.areas"), href: { pathname: "/areas" } as Href },
              { label: fm.title },
            ]}
            className="mb-8"
          />
          <div className="grid items-start gap-12 lg:grid-cols-[1.1fr_0.9fr]">
            <div>
              <h1 className="text-display-1">{fm.h1}</h1>
              {fm.updated ? (
                <p className="mt-4 font-mono text-xs uppercase tracking-[0.12em] text-faint">
                  {t("guide.updated", { date: formatDate(fm.updated, locale) })}
                </p>
              ) : null}
              <div className="mt-8 border-l-2 border-accent bg-paper p-6 md:p-7">
                <p className="eyebrow-bare mb-3 !text-[0.68rem]">
                  {t("area.quickAnswerLabel")}
                </p>
                <p className="text-lg leading-relaxed">{fm.quickAnswer}</p>
              </div>
              <div className="mt-8 flex flex-wrap items-center gap-4">
                <ButtonLink href={{ pathname: "/contact" }} size="lg" withArrow>
                  {t("cta.primary")}
                </ButtonLink>
                <ButtonAnchor href={telHref(siteConfig.primaryPhone)} variant="outline" size="lg">
                  <Icon name="phone" className="size-4.5 text-accent" />
                  <span className="data">{formatPhone(siteConfig.primaryPhone)}</span>
                </ButtonAnchor>
              </div>
            </div>

            {fm.image ? (
              <div className="relative hidden lg:block">
                <div aria-hidden="true" className="absolute -inset-2 translate-x-5 translate-y-5 border border-accent/40" />
                <SmartImage
                  image={resolveImage(fm.image)}
                  alt={fm.imageAlt ?? fm.title}
                  sizes="(min-width: 1024px) 38vw, 0px"
                  className="relative aspect-[4/3] w-full object-cover"
                />
              </div>
            ) : null}
          </div>
        </Container>
      </div>

      {/* Body + lead-form rail */}
      <Section bordered>
        <Container>
          <div className="grid items-start gap-14 lg:grid-cols-[1fr_24rem]">
            <div>
              <article className="prose">
                <MdxContent source={area.body} />
              </article>

              {fm.neighborhoods.length ? (
                <div className="mt-12">
                  <h2 className="text-display-3 mb-6">{t("area.neighborhoodsTitle")}</h2>
                  <ul className="flex flex-wrap gap-2">
                    {fm.neighborhoods.map((n) => (
                      <li key={n} className="border border-line px-3 py-1.5 text-sm text-muted">
                        {n}
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}
            </div>

            <aside className="space-y-8 lg:sticky lg:top-28">
              <LeadFormPanel locale={locale} source={url} />
            </aside>
          </div>
        </Container>
      </Section>

      {/* Services in this area */}
      {services.length ? (
        <Section tone="soft" bordered className="!py-16">
          <Container>
            <h2 className="text-display-3 mb-8">
              {t("area.servicesTitle", { area: fm.title })}
            </h2>
            <ul className="grid gap-x-10 gap-y-3 sm:grid-cols-2 lg:grid-cols-3">
              {services.map((service) => (
                <li key={service.fm.id}>
                  <Link
                    href={{
                      pathname: "/services/[slug]",
                      params: { slug: service.fm.slug },
                    } as Href}
                    className="group flex items-center justify-between border-b border-line-soft py-3 font-medium transition-colors hover:text-primary"
                  >
                    {service.fm.title}
                    <Icon
                      name="arrow-right"
                      className="size-4 text-accent transition-transform group-hover:translate-x-1"
                    />
                  </Link>
                </li>
              ))}
            </ul>
          </Container>
        </Section>
      ) : null}

      {/* Area FAQ + related areas/guides */}
      <Section bordered>
        <Container>
          <div className="grid items-start gap-14 lg:grid-cols-2">
            {fm.faqs.length ? (
              <FaqBlock faqs={fm.faqs} title={t("area.faqTitle", { area: fm.title })} />
            ) : (
              <div />
            )}
            <div className="space-y-10">
              {related.length ? (
                <div>
                  <p className="eyebrow-bare mb-4 !text-[0.7rem]">{t("area.relatedTitle")}</p>
                  <ul className="space-y-2.5">
                    {related.map((r) => (
                      <li key={r.fm.id}>
                        <Link
                          href={{ pathname: "/areas/[slug]", params: { slug: r.fm.slug } } as Href}
                          className="link-sweep font-medium text-primary"
                        >
                          {r.fm.title}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}
              {guides.length ? (
                <div>
                  <p className="eyebrow-bare mb-4 !text-[0.7rem]">{t("area.guidesTitle")}</p>
                  <ul className="space-y-2.5">
                    {guides.map((g) => (
                      <li key={g.fm.id}>
                        <Link
                          href={{ pathname: "/guides/[slug]", params: { slug: g.fm.slug } } as Href}
                          className="link-sweep font-medium text-primary"
                        >
                          {g.fm.title}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}
            </div>
          </div>
        </Container>
      </Section>

      <CtaBand locale={locale} />
    </>
  );
}
