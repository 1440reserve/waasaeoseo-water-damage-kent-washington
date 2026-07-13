import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { siteConfig } from "@/lib/site";
import { getGuides } from "@/lib/content";
import { buildMetadata, type Href } from "@/lib/seo";
import type { Locale } from "@/lib/schemas";
import { excerpt, formatDate } from "@/lib/utils";
import { Container, Section } from "@/components/ui/primitives";
import { PageHeader } from "@/components/layout/PageHeader";
import { CtaBand } from "@/components/sections/CtaBand";
import { Icon } from "@/components/ui/Icon";
import { Reveal } from "@/components/ui/Reveal";

type Props = { params: Promise<{ locale: Locale }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale });
  return buildMetadata({
    locale,
    title: `${t("guide.indexTitle")} | ${siteConfig.name}`,
    description: t("guide.indexMetaDescription"),
    href: { pathname: "/guides" },
  });
}

export default async function GuidesPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale });
  const guides = getGuides(locale);

  return (
    <>
      <PageHeader
        locale={locale}
        crumbs={[{ label: t("nav.guides") }]}
        title={t("guide.indexTitle")}
        intro={t("guide.indexIntro")}
      />
      <Section>
        <Container>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {guides.map((guide, i) => (
              <Reveal key={guide.fm.id} delay={i * 60} className="flex flex-col">
                <Link
                  href={{ pathname: "/guides/[slug]", params: { slug: guide.fm.slug } } as Href}
                  className="group flex h-full flex-col border border-line-soft bg-paper p-7 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_18px_44px_rgba(0,0,0,0.10)]"
                >
                  <p className="font-mono text-xs uppercase tracking-[0.14em] text-faint tabular-nums">
                    {formatDate(guide.fm.updated ?? guide.fm.date, locale)}
                  </p>
                  <h2 className="mt-3 font-display text-xl font-semibold tracking-tight transition-colors group-hover:text-primary">
                    {guide.fm.title}
                  </h2>
                  <p className="mt-3 flex-1 text-[0.95rem] leading-relaxed text-muted">
                    {excerpt(guide.fm.quickAnswer, 140)}
                  </p>
                  <span className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-accent-ink">
                    {t("guide.continueReading")}
                    <Icon
                      name="arrow-right"
                      className="size-4 transition-transform duration-300 group-hover:translate-x-1.5"
                    />
                  </span>
                </Link>
              </Reveal>
            ))}
          </div>
        </Container>
      </Section>
      <CtaBand locale={locale} />
    </>
  );
}
