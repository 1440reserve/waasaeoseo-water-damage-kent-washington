import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { getServices, type Service } from "@/lib/content";
import type { Locale } from "@/lib/schemas";
import type { Href } from "@/lib/seo";
import { excerpt } from "@/lib/utils";
import { Container, Section, SectionHeading } from "@/components/ui/primitives";
import { Icon } from "@/components/ui/Icon";
import { Reveal } from "@/components/ui/Reveal";
import { ButtonLink } from "@/components/ui/Button";

export async function ServiceCard({
  service,
  locale,
  headingLevel: Heading = "h3",
  fullSummary = false,
}: {
  service: Service;
  locale: Locale;
  /** h2 when the card sits directly under the page H1 (index pages). */
  headingLevel?: "h2" | "h3";
  /** Show the full quick answer instead of a teaser (index pages). */
  fullSummary?: boolean;
}) {
  const t = await getTranslations({ locale });
  const href = {
    pathname: "/services/[slug]",
    params: { slug: service.fm.slug },
  } as Href;

  return (
    <Link
      href={href}
      className="group relative flex h-full flex-col border-t-[3px] border-accent bg-parchment p-7 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_18px_44px_rgba(0,0,0,0.10)]"
    >
      <Icon name={service.fm.icon} className="size-7 text-accent-ink" strokeWidth={1.4} />
      <Heading className="mt-4 font-display text-xl font-semibold tracking-tight transition-colors group-hover:text-primary">
        {service.fm.title}
      </Heading>
      <p
        className={
          fullSummary
            ? "mt-3 flex-1 text-[0.95rem] leading-relaxed text-muted"
            : "mt-3 line-clamp-2 flex-1 text-[0.95rem] leading-relaxed text-muted"
        }
      >
        {fullSummary ? service.fm.quickAnswer : excerpt(service.fm.quickAnswer, 110)}
      </p>
      <span className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-accent-ink">
        {t("sections.learnMore")}
        <Icon
          name="arrow-right"
          className="size-4 transition-transform duration-300 group-hover:translate-x-1.5"
        />
      </span>
    </Link>
  );
}

/** Homepage services grid: plain keyword headers, one card per featured
 * service, linking to its dedicated page. */
export async function ServiceGrid({ locale }: { locale: Locale }) {
  const t = await getTranslations({ locale });
  const services = getServices(locale).filter((s) => s.fm.featured);
  if (services.length === 0) return null;

  return (
    <Section tone="soft">
      <Container>
        <SectionHeading
          eyebrow={t("sections.servicesEyebrow")}
          title={t("sections.servicesTitle")}
        />
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {services.slice(0, 8).map((service, i) => (
            <Reveal key={service.fm.id} delay={i * 80}>
              <ServiceCard service={service} locale={locale} />
            </Reveal>
          ))}
        </div>
        <div className="mt-10">
          <ButtonLink href={{ pathname: "/services" }} variant="ghost" withArrow>
            {t("sections.servicesViewAll")}
          </ButtonLink>
        </div>
      </Container>
    </Section>
  );
}
