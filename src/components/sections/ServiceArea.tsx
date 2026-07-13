import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { siteConfig } from "@/lib/site";
import { getAreas, getHomeContent } from "@/lib/content";
import { resolveImage } from "@/lib/images";
import type { Locale } from "@/lib/schemas";
import type { Href } from "@/lib/seo";
import { formatPhone, telHref } from "@/lib/utils";
import { Container, Section, SectionHeading } from "@/components/ui/primitives";
import { SmartImage } from "@/components/ui/SmartImage";
import { Icon } from "@/components/ui/Icon";
import { Reveal } from "@/components/ui/Reveal";

/**
 * Service-area section: blurb + linked area pages + phone. No NAP card or
 * map here: this is a service-area business with no published address yet.
 * Add the address/map treatment back once a real location exists.
 */
export async function ServiceArea({ locale }: { locale: Locale }) {
  const t = await getTranslations({ locale });
  const content = getHomeContent(locale).serviceArea;
  const landmark = content?.image ? resolveImage(content.image) : null;
  const areas = getAreas(locale).filter((a) => a.fm.featured);

  return (
    <Section tone="paper" bordered>
      <Container>
        <div className="grid items-start gap-12 lg:grid-cols-[1fr_1.1fr]">
          <div>
            <SectionHeading
              eyebrow={t("sections.serviceAreaEyebrow")}
              title={content?.title ?? t("sections.serviceAreaTitle", { region: siteConfig.areaServed })}
              className="mb-8 md:mb-8"
            />
            {content?.blurb ? (
              <p className="max-w-xl leading-relaxed text-muted">{content.blurb}</p>
            ) : null}

            <div className="mt-10 flex items-start gap-8">
              <p className="space-y-3 border-l-2 border-accent pl-5">
                <span className="block font-display text-lg font-medium">
                  {siteConfig.name}
                </span>
                <a
                  href={telHref(siteConfig.primaryPhone)}
                  className="mt-2 flex items-center gap-2.5 font-medium tabular-nums text-primary hover:text-accent"
                >
                  <Icon name="phone" className="size-4 shrink-0 text-accent" />
                  {formatPhone(siteConfig.primaryPhone)}
                </a>
              </p>
              {landmark ? (
                <div className="hidden shrink-0 border-t-[3px] border-accent sm:block">
                  <SmartImage
                    image={landmark}
                    alt={content?.imageAlt ?? ""}
                    sizes="9rem"
                    className="h-44 w-36 object-cover"
                  />
                </div>
              ) : null}
            </div>
          </div>

          <Reveal>
            <div>
              <p className="eyebrow-bare mb-4 !text-[0.7rem]">
                {t("sections.communitiesServed")}
              </p>
              {areas.length ? (
                <ul className="flex flex-wrap gap-2">
                  {areas.map((area) => (
                    <li key={area.fm.id}>
                      <Link
                        href={{ pathname: "/areas/[slug]", params: { slug: area.fm.slug } } as Href}
                        className="block border border-line px-3 py-1.5 text-sm text-muted transition-colors hover:border-accent hover:text-primary"
                      >
                        {area.fm.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              ) : (
                <ul className="flex flex-wrap gap-2">
                  {siteConfig.serviceAreas.map((city) => (
                    <li
                      key={city}
                      className="border border-line px-3 py-1.5 text-sm text-muted"
                    >
                      {city}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </Reveal>
        </div>
      </Container>
    </Section>
  );
}
