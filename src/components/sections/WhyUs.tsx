import { getTranslations } from "next-intl/server";
import { getHomeContent } from "@/lib/content";
import { siteConfig } from "@/lib/site";
import type { Locale } from "@/lib/schemas";
import { Container, Section } from "@/components/ui/primitives";
import { Icon } from "@/components/ui/Icon";
import { Reveal } from "@/components/ui/Reveal";

/** Editorial differentiators: sticky title column + ruled rows. */
export async function WhyUs({ locale }: { locale: Locale }) {
  const t = await getTranslations({ locale });
  const whyUs = getHomeContent(locale).whyUs;
  if (!whyUs) return null;

  return (
    <Section tone="paper" bordered>
      <Container>
        <div className="grid gap-12 lg:grid-cols-[1fr_1.4fr]">
          <div className="lg:sticky lg:top-28 lg:self-start">
            <p className="eyebrow mb-4">
              {t("sections.whyUsEyebrow", { name: siteConfig.name })}
            </p>
            <h2 className="text-display-2">
              {whyUs.title ?? t("sections.whyUsTitle")}
            </h2>
          </div>
          <div>
            {whyUs.blocks.map((block, i) => (
              <Reveal key={i} delay={i * 60}>
                <div className={`group border-b border-line py-8 ${i === 0 ? "pt-0" : ""}`}>
                  <div className="flex items-center gap-3">
                    {block.icon ? (
                      <Icon name={block.icon} className="size-5 text-accent" />
                    ) : null}
                    <h3 className="font-display text-xl font-medium tracking-tight">
                      {block.title}
                    </h3>
                  </div>
                  <p className="mt-3 leading-relaxed text-muted">{block.description}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </Container>
    </Section>
  );
}
