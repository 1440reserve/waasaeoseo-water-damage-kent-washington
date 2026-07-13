import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { siteConfig } from "@/lib/site";
import { getServices } from "@/lib/content";
import { buildMetadata } from "@/lib/seo";
import type { Locale } from "@/lib/schemas";
import { Container, Section } from "@/components/ui/primitives";
import { PageHeader } from "@/components/layout/PageHeader";
import { ServiceCard } from "@/components/sections/ServiceGrid";
import { CtaBand } from "@/components/sections/CtaBand";
import { Reveal } from "@/components/ui/Reveal";

type Props = { params: Promise<{ locale: Locale }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale });
  return buildMetadata({
    locale,
    title: `${t("service.indexTitle")} | ${siteConfig.name}`,
    description: t("service.indexMetaDescription"),
    href: { pathname: "/services" },
  });
}

export default async function ServicesPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale });
  const services = getServices(locale);

  return (
    <>
      <PageHeader
        locale={locale}
        crumbs={[{ label: t("nav.services") }]}
        title={t("service.indexTitle")}
        intro={t("service.indexIntro")}
      />
      <Section>
        <Container>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((service, i) => (
              <Reveal key={service.fm.id} delay={i * 60} className="flex flex-col">
                <ServiceCard service={service} locale={locale} headingLevel="h2" fullSummary />
              </Reveal>
            ))}
          </div>
        </Container>
      </Section>
      <CtaBand locale={locale} />
    </>
  );
}
