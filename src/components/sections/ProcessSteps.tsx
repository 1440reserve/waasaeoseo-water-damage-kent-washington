import { getHomeContent } from "@/lib/content";
import type { Locale } from "@/lib/schemas";
import { Container, Section, SectionHeading } from "@/components/ui/primitives";
import { Reveal } from "@/components/ui/Reveal";

/** Numbered walkthrough of what happens after the call: ruled rows with
 * oversized step numerals, mirroring the WhyUs editorial rhythm. */
export async function ProcessSteps({ locale }: { locale: Locale }) {
  const process = getHomeContent(locale).process;
  if (!process) return null;

  return (
    <Section tone="wash" bordered>
      <Container>
        <SectionHeading
          eyebrow={process.eyebrow ?? "How it works"}
          title={process.title}
        />
        <ol className="mt-12">
          {process.steps.map((step, i) => (
            <Reveal key={i} delay={i * 60}>
              <li className={`grid gap-4 border-b border-line py-8 sm:grid-cols-[5rem_1fr] sm:gap-8 ${i === 0 ? "pt-0" : ""}`}>
                {/* Mono "timestamp": the process step logged like a dispatch entry. */}
                <div
                  aria-hidden
                  className="flex items-center gap-3 sm:flex-col sm:items-start sm:gap-3"
                >
                  <span className="data text-4xl font-semibold leading-none text-accent-ink">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="h-px w-8 bg-accent sm:w-10" />
                </div>
                <div>
                  <h3 className="font-display text-xl font-medium tracking-tight">
                    {step.title}
                  </h3>
                  <p className="mt-3 max-w-prose leading-relaxed text-muted">
                    {step.description}
                  </p>
                </div>
              </li>
            </Reveal>
          ))}
        </ol>
      </Container>
    </Section>
  );
}
