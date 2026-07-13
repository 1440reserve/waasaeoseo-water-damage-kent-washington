import { getTranslations } from "next-intl/server";
import { getFaqs } from "@/lib/content";
import { faqSchema } from "@/lib/schema-org";
import type { FaqItem, Locale } from "@/lib/schemas";
import { Container, Section, AccordionItem } from "@/components/ui/primitives";
import { JsonLd } from "@/components/seo/JsonLd";
import { Reveal } from "@/components/ui/Reveal";

/**
 * Reusable FAQ block: accordion list + FAQPage JSON-LD in one.
 * Used on service pages, area pages, and the homepage teaser.
 */
export function FaqBlock({
  faqs,
  title,
  withSchema = true,
}: {
  faqs: FaqItem[];
  title?: string;
  withSchema?: boolean;
}) {
  if (faqs.length === 0) return null;
  return (
    <div>
      {withSchema ? <JsonLd data={faqSchema(faqs)} /> : null}
      {title ? <h2 className="text-display-3 mb-6">{title}</h2> : null}
      <div className="border-t border-line-soft">
        {faqs.map((faq, i) => (
          <AccordionItem key={i} question={faq.q} defaultOpen={i === 0}>
            {faq.a}
          </AccordionItem>
        ))}
      </div>
    </div>
  );
}

/** Homepage teaser: featured FAQs from faqs.yaml. */
export async function FaqTeaser({ locale }: { locale: Locale }) {
  const t = await getTranslations({ locale });
  const all = getFaqs(locale);
  const featured = (all.some((f) => f.featured)
    ? all.filter((f) => f.featured)
    : all
  ).slice(0, 5);
  if (featured.length === 0) return null;

  return (
    <Section tone="soft" bordered>
      <Container>
        <div className="grid gap-12 lg:grid-cols-[1fr_1.5fr]">
          <div className="lg:sticky lg:top-28 lg:self-start">
            <p className="eyebrow mb-4">{t("sections.faqEyebrow")}</p>
            <h2 className="text-display-2">{t("sections.faqTitle")}</h2>
          </div>
          <Reveal>
            <FaqBlock faqs={featured} />
          </Reveal>
        </div>
      </Container>
    </Section>
  );
}
