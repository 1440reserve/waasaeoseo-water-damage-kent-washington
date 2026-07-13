import { getHomeContent } from "@/lib/content";
import type { Locale } from "@/lib/schemas";
import { Container, Section, SectionHeading } from "@/components/ui/primitives";

/** Genuine local prose: the depth block that separates this homepage from
 * the template city pages the competitors run. Rendered as readable
 * editorial columns, no cards, no decoration. */
export async function LocalIntro({ locale }: { locale: Locale }) {
  const intro = getHomeContent(locale).localIntro;
  if (!intro) return null;

  return (
    <Section tone="paper" bordered>
      <Container>
        <div className="grid gap-12 lg:grid-cols-[1fr_1.4fr]">
          <div className="lg:sticky lg:top-28 lg:self-start">
            <SectionHeading
              eyebrow={intro.eyebrow ?? "Local knowledge"}
              title={intro.title}
            />
          </div>
          <div className="space-y-6">
            {intro.paragraphs.map((p, i) => (
              <p key={i} className="max-w-prose leading-relaxed text-muted">
                {p}
              </p>
            ))}
          </div>
        </div>
      </Container>
    </Section>
  );
}
