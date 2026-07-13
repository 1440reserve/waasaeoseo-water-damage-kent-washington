import { getTranslations } from "next-intl/server";
import { getReviews, hasReviews } from "@/lib/content";
import { siteConfig } from "@/lib/site";
import type { Locale, Review } from "@/lib/schemas";
import { Container, Section, SectionHeading, Stars } from "@/components/ui/primitives";
import { Reveal } from "@/components/ui/Reveal";
import { Icon } from "@/components/ui/Icon";

const SOURCE_LABEL: Record<Review["source"], string> = {
  google: "Google",
  yelp: "Yelp",
  facebook: "Facebook",
  other: "",
};

export function ReviewCard({ review }: { review: Review }) {
  return (
    <figure className="flex h-full flex-col border border-line-soft bg-paper p-8">
      <Icon name="quote" className="size-7 text-accent/70" strokeWidth={1} />
      <blockquote className="mt-5 flex-1 font-display text-[1.06rem] italic leading-relaxed text-ink">
        “{review.text}”
      </blockquote>
      <figcaption className="mt-6 flex items-center justify-between gap-4 border-t border-line-soft pt-5">
        <div>
          <p className="text-sm font-semibold">{review.author}</p>
          {SOURCE_LABEL[review.source] ? (
            <p className="mt-0.5 font-mono text-xs uppercase tracking-[0.14em] text-faint">
              {SOURCE_LABEL[review.source]}
            </p>
          ) : null}
        </div>
        <Stars rating={review.rating} />
      </figcaption>
    </figure>
  );
}

/**
 * Renders nothing until reviews.yaml carries real reviews. Never seed
 * this with invented quotes.
 */
export async function Testimonials({ locale }: { locale: Locale }) {
  if (!hasReviews(locale)) return null;
  const t = await getTranslations({ locale });
  const reviews = getReviews(locale);
  const featured = (reviews.some((r) => r.featured)
    ? reviews.filter((r) => r.featured)
    : reviews
  ).slice(0, 3);
  const rating = siteConfig.trust.googleRating;

  return (
    <Section tone="soft" bordered>
      <Container>
        <SectionHeading
          eyebrow={t("sections.testimonialsEyebrow")}
          title={t("sections.testimonialsTitle")}
          lede={
            rating
              ? t("trust.ratedBy", { rating: rating.value, count: rating.count })
              : undefined
          }
        />
        <div className="grid gap-5 md:grid-cols-3">
          {featured.map((review, i) => (
            <Reveal key={i} delay={i * 90}>
              <ReviewCard review={review} />
            </Reveal>
          ))}
        </div>
      </Container>
    </Section>
  );
}
