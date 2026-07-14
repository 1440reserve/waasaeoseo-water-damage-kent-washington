import { getTranslations } from "next-intl/server";
import { siteConfig } from "@/lib/site";
import { getHomeContent } from "@/lib/content";
import { resolveImage } from "@/lib/images";
import { lt, type Locale } from "@/lib/schemas";
import { formatPhone, telHref } from "@/lib/utils";
import { ButtonAnchor, ButtonLink } from "@/components/ui/Button";
import { SmartImage } from "@/components/ui/SmartImage";
import { Stars } from "@/components/ui/primitives";
import { Icon } from "@/components/ui/Icon";
import { HeroPanel } from "./HeroPanel";

export async function Hero({ locale }: { locale: Locale }) {
  const t = await getTranslations({ locale });
  const home = getHomeContent(locale);
  const { hero } = home;
  const variant = siteConfig.homepage.heroVariant;
  const rating = siteConfig.trust.googleRating;
  const phone = formatPhone(siteConfig.primaryPhone);
  const image = hero.image ? resolveImage(hero.image) : null;
  const stat = siteConfig.trust.stats[0];
  const dark = variant === "panorama";

  const ratingRow = rating ? (
    <div className="flex items-center gap-3">
      <Stars rating={rating.value} />
      <span className={dark ? "text-sm text-inverse-muted" : "text-sm text-muted"}>
        <strong className={dark ? "font-semibold text-inverse" : "font-semibold text-ink"}>
          {rating.value}
        </strong>{" "}
        · {rating.count}+ {t("trust.googleReviews")}
      </span>
    </div>
  ) : hero.eyebrow ? (
    <p className="eyebrow-live">{hero.eyebrow}</p>
  ) : null;

  const ctas = (
    <div className="flex flex-wrap items-center gap-4">
      <ButtonLink
        href={{ pathname: "/contact" }}
        variant={dark ? "accent" : "primary"}
        size="lg"
        withArrow
      >
        {hero.ctaLabel ?? t("cta.primary")}
      </ButtonLink>
      <ButtonAnchor
        href={telHref(siteConfig.primaryPhone)}
        variant={dark ? "outline-inverse" : "outline"}
        size="lg"
      >
        <Icon name="phone" className="size-4.5 text-accent" />
        <span className="data">{phone}</span>
      </ButtonAnchor>
    </div>
  );

  if (variant === "panorama") {
    return (
      <section className="dark-zone relative isolate flex min-h-[82vh] items-center overflow-hidden bg-primary text-inverse">
        {/* Full-bleed photo; darkening comes from the CSS overlay below,
            not from the file, so the image stays swappable per client. */}
        {image ? (
          <SmartImage
            image={image}
            alt={hero.imageAlt ?? ""}
            priority
            sizes="100vw"
            // The brand overlay hides compression artifacts; lighter LCP.
            quality={60}
            className="absolute inset-0 -z-20 size-full object-cover"
          />
        ) : null}
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-10"
          style={{
            background:
              "linear-gradient(100deg, color-mix(in srgb, var(--brand-primary) 95%, transparent) 0%, color-mix(in srgb, var(--brand-primary) 84%, transparent) 52%, color-mix(in srgb, var(--brand-primary) 52%, transparent) 100%)",
          }}
        />
        <div className="mx-auto w-full max-w-[76rem] px-5 py-24 sm:px-8">
          {/* Left text-safe zone: copy sits over the 92%-opacity end of the
              gradient so light text keeps contrast. */}
          <div className="max-w-3xl">
            {ratingRow}
            <h1 className="text-display-1 mt-6 text-inverse">{hero.heading}</h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-inverse-muted">
              {hero.subheading}
            </p>
            <div className="mt-10">{ctas}</div>
            <p className="mt-6 text-sm text-inverse-muted/80">{t("cta.available")}</p>
          </div>
        </div>
      </section>
    );
  }

  /* split (default) */
  return (
    <section className="relative isolate overflow-hidden bg-wash">
      <div className="mx-auto grid w-full max-w-[76rem] items-center gap-14 px-5 pb-20 pt-14 sm:px-8 md:pb-28 md:pt-20 lg:grid-cols-[1.05fr_0.9fr]">
        <div>
          {ratingRow}
          <h1 className="text-display-1 mt-6">{hero.heading}</h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted">
            {hero.subheading}
          </p>
          <div className="mt-10">{ctas}</div>
        </div>

        {image ? (
          <div className="relative mx-auto w-full max-w-md lg:max-w-none">
            <SmartImage
              image={image}
              alt={hero.imageAlt ?? siteConfig.name}
              priority
              sizes="(min-width: 1024px) 44vw, (min-width: 640px) 28rem, 92vw"
              className="relative aspect-[4/5] w-full object-cover"
            />
            {stat ? (
              <div className="absolute -left-4 bottom-8 border border-line-soft bg-paper px-6 py-5 shadow-[0_18px_48px_rgba(0,0,0,0.14)]">
                <p className="data text-3xl font-semibold text-primary">
                  {stat.value}
                </p>
                <p className="mt-1 font-mono text-xs uppercase tracking-[0.16em] text-faint">
                  {lt(stat.label, locale)}
                </p>
              </div>
            ) : null}
          </div>
        ) : (
          <HeroPanel locale={locale} />
        )}
      </div>
    </section>
  );
}
