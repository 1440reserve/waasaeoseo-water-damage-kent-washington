import { getTranslations } from "next-intl/server";
import { siteConfig } from "@/lib/site";
import { resolveImage } from "@/lib/images";
import { lt, type Locale } from "@/lib/schemas";
import { SmartImage } from "@/components/ui/SmartImage";
import { Stars } from "@/components/ui/primitives";
import { Reveal } from "@/components/ui/Reveal";

/**
 * Rating + headline stats + badges in one hairline band. Renders nothing
 * until the trust config carries real data (never fabricate it).
 */
export async function TrustBar({ locale }: { locale: Locale }) {
  const t = await getTranslations({ locale });
  const { googleRating, stats, badges } = siteConfig.trust;
  if (!googleRating && stats.length === 0 && badges.length === 0) return null;

  return (
    <section className="border-y border-line-soft bg-paper">
      <div className="mx-auto flex w-full max-w-[76rem] flex-wrap items-center justify-center gap-x-12 gap-y-8 px-5 py-10 sm:px-8 md:justify-between md:py-12">
        {googleRating ? (
          <Reveal>
            <div className="flex items-center gap-4">
              <p className="data text-4xl font-semibold text-primary">
                {googleRating.value}
              </p>
              <div>
                <Stars rating={googleRating.value} />
                <p className="mt-1 font-mono text-xs uppercase tracking-[0.14em] text-faint">
                  {googleRating.count}+ {t("trust.googleReviews")}
                </p>
              </div>
            </div>
          </Reveal>
        ) : null}

        {stats.map((stat, i) => (
          <Reveal key={i} delay={(i + 1) * 90}>
            <div className="text-center md:text-left">
              <p className="data text-4xl font-semibold text-primary">
                {stat.value}
              </p>
              <p className="mt-1 font-mono text-xs uppercase tracking-[0.14em] text-faint">
                {lt(stat.label, locale)}
              </p>
            </div>
          </Reveal>
        ))}

        {badges.length ? (
          <Reveal delay={(stats.length + 1) * 90}>
            <ul className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
              {badges.map((badge, i) => (
                <li key={i} className="flex items-center">
                  {badge.image ? (
                    <SmartImage
                      image={resolveImage(badge.image)}
                      alt={badge.label}
                      className="h-10 w-auto opacity-80"
                    />
                  ) : (
                    <span className="border border-line px-3.5 py-2 font-mono text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-muted">
                      {badge.label}
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </Reveal>
        ) : null}
      </div>
    </section>
  );
}
