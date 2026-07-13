import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { siteConfig } from "@/lib/site";
import { buildMetadata, localizedUrl } from "@/lib/seo";
import type { Locale } from "@/lib/schemas";
import { formatPhone, telHref } from "@/lib/utils";
import { Container, Section } from "@/components/ui/primitives";
import { PageHeader } from "@/components/layout/PageHeader";
import { LeadFormPanel } from "@/components/sections/LeadFormPanel";

type Props = { params: Promise<{ locale: Locale }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale });
  return buildMetadata({
    locale,
    title: `${t("contact.metaTitle")} | ${siteConfig.name}`,
    description: t("contact.metaDescription"),
    href: { pathname: "/contact" },
  });
}

export default async function ContactPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale });

  return (
    <>
      <PageHeader
        locale={locale}
        crumbs={[{ label: t("nav.contact") }]}
        title={t("contact.title")}
        intro={t("contact.intro")}
      />
      <Section>
        <Container>
          <div className="grid items-start gap-14 lg:grid-cols-[1.1fr_0.9fr]">
            <LeadFormPanel
              locale={locale}
              source={localizedUrl(locale, { pathname: "/contact" })}
            />

            <div className="space-y-10">
              {/* Prefer to talk */}
              <div className="border-l-2 border-accent pl-6">
                <p className="eyebrow-bare mb-2 !text-[0.7rem]">{t("contact.callTitle")}</p>
                <a
                  href={telHref(siteConfig.primaryPhone)}
                  className="font-display text-4xl font-semibold tabular-nums tracking-tight text-primary transition-colors hover:text-accent"
                >
                  {formatPhone(siteConfig.primaryPhone)}
                </a>
                <p className="mt-2 text-sm text-muted">{t("cta.available")}</p>
              </div>
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}
