import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { siteConfig } from "@/lib/site";
import {
  getAreas,
  getGuides,
  getServiceBySlug,
  getServices,
  serviceAlternates,
} from "@/lib/content";
import {
  areasForService,
  guidesForService,
  relatedServices,
} from "@/lib/linking";
import { buildMetadata, localizedUrl, type Href } from "@/lib/seo";
import { serviceSchema } from "@/lib/schema-org";
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
import { Reveal } from "@/components/ui/Reveal";

type Props = { params: Promise<{ locale: Locale; slug: string }> };

export function generateStaticParams({ params }: { params: { locale: string } }) {
  return getServices(params.locale as Locale).map((s) => ({ slug: s.fm.slug }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  const service = getServiceBySlug(locale, slug);
  if (!service) return {};
  const alternates = Object.fromEntries(
    Object.entries(serviceAlternates(service.fm.id)).map(([l, s]) => [
      l,
      { pathname: "/services/[slug]", params: { slug: s } } as Href,
    ])
  );
  return buildMetadata({
    locale,
    title: service.fm.metaTitle ?? `${service.fm.h1} | ${siteConfig.name}`,
    description: service.fm.metaDescription,
    href: { pathname: "/services/[slug]", params: { slug } } as Href,
    alternates,
    image: service.fm.image
      ? { ...resolveImage(service.fm.image), alt: service.fm.imageAlt }
      : null,
  });
}

export default async function ServicePage({ params }: Props) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const service = getServiceBySlug(locale, slug);
  if (!service) notFound();

  const t = await getTranslations({ locale });
  const fm = service.fm;
  const areas = areasForService(service, getAreas(locale));
  const related = relatedServices(service, getServices(locale)).slice(0, 3);
  const guides = guidesForService(service, getGuides(locale)).slice(0, 3);
  const href = { pathname: "/services/[slug]", params: { slug } } as Href;
  const url = localizedUrl(locale, href);
  const phone = formatPhone(siteConfig.primaryPhone);

  return (
    <>
      <JsonLd data={serviceSchema(service, locale, url)} />

      {/* Opener: breadcrumb, H1, quick answer (AEO), CTAs */}
      <div className="bg-wash">
        <Container className="pb-16 pt-10 md:pt-14">
          <Breadcrumbs
            locale={locale}
            items={[
              { label: t("nav.services"), href: { pathname: "/services" } as Href },
              { label: fm.title },
            ]}
            className="mb-8"
          />
          <div className="grid items-start gap-12 lg:grid-cols-[1.15fr_0.85fr]">
            <div>
              <h1 className="text-display-1">{fm.h1}</h1>

              {fm.updated ? (
                <p className="mt-4 font-mono text-xs uppercase tracking-[0.12em] text-faint">
                  {t("guide.updated", { date: formatDate(fm.updated, locale) })}
                </p>
              ) : null}

              {/* Quick answer: the above-fold plain-language block that
                  answer engines and skimming visitors both consume. */}
              <div className="mt-8 border-l-2 border-accent bg-paper p-6 md:p-7">
                <p className="eyebrow-bare mb-3 !text-[0.68rem]">
                  {t("service.quickAnswerLabel")}
                </p>
                <p className="text-lg leading-relaxed text-ink">{fm.quickAnswer}</p>
              </div>

              <div className="mt-8 flex flex-wrap items-center gap-4">
                <ButtonLink href={{ pathname: "/contact" }} size="lg" withArrow>
                  {t("cta.primary")}
                </ButtonLink>
                <ButtonAnchor href={telHref(siteConfig.primaryPhone)} variant="outline" size="lg">
                  <Icon name="phone" className="size-4.5 text-accent" />
                  <span className="data">{phone}</span>
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

      {/* Highlights */}
      {fm.highlights.length ? (
        <Section className="!py-14" bordered>
          <Container>
            <h2 className="text-display-3 mb-8">{t("service.highlightsTitle")}</h2>
            <ul className="grid gap-x-10 gap-y-4 md:grid-cols-2">
              {fm.highlights.map((item, i) => (
                <li key={i} className="flex items-start gap-3.5 border-b border-line-soft pb-4">
                  <Icon name="check" className="mt-1 size-4.5 shrink-0 text-accent" />
                  <span className="leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>
          </Container>
        </Section>
      ) : null}

      {/* Long-form body (MDX) with sticky lead-form rail */}
      <Section bordered>
        <Container>
          <div className="grid items-start gap-14 lg:grid-cols-[1fr_22rem]">
            <article className="prose">
              <MdxContent source={service.body} />
            </article>
            <aside className="lg:sticky lg:top-28 space-y-8">
              <LeadFormPanel locale={locale} source={url} />
            </aside>
          </div>
        </Container>
      </Section>

      {/* What to expect */}
      {fm.processSteps.length ? (
        <Section tone="soft" bordered>
          <Container>
            <h2 className="text-display-2 mb-12">{t("service.processTitle")}</h2>
            <ol className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
              {fm.processSteps.map((step, i) => (
                <Reveal key={i} delay={i * 80}>
                  <li className="h-full border-t-[3px] border-accent bg-parchment p-7">
                    <h3 className="font-display text-lg font-medium">{step.title}</h3>
                    <p className="mt-2.5 text-sm leading-relaxed text-muted">{step.description}</p>
                  </li>
                </Reveal>
              ))}
            </ol>
          </Container>
        </Section>
      ) : null}

      {/* FAQs */}
      {fm.faqs.length ? (
        <Section bordered>
          <Container className="max-w-4xl">
            <FaqBlock faqs={fm.faqs} title={t("service.faqTitle", { service: fm.title })} />
          </Container>
        </Section>
      ) : null}

      {/* Areas served + related services + supporting guides */}
      {(areas.length || related.length || guides.length) ? (
        <Section tone="soft" bordered className="!py-14">
          <Container className="grid gap-10 md:grid-cols-2 lg:grid-cols-3">
            {areas.length ? (
              <div>
                <p className="eyebrow-bare mb-4 !text-[0.7rem]">{t("service.areasTitle")}</p>
                <ul className="space-y-2.5">
                  {areas.map((a) => (
                    <li key={a.fm.id}>
                      <Link
                        href={{ pathname: "/areas/[slug]", params: { slug: a.fm.slug } } as Href}
                        className="link-sweep font-medium text-primary"
                      >
                        {a.fm.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
            {related.length ? (
              <div>
                <p className="eyebrow-bare mb-4 !text-[0.7rem]">{t("service.relatedTitle")}</p>
                <ul className="space-y-2.5">
                  {related.map((r) => (
                    <li key={r.fm.id}>
                      <Link
                        href={{ pathname: "/services/[slug]", params: { slug: r.fm.slug } } as Href}
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
                <p className="eyebrow-bare mb-4 !text-[0.7rem]">{t("service.guidesTitle")}</p>
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
          </Container>
        </Section>
      ) : null}

      <CtaBand locale={locale} />
    </>
  );
}
