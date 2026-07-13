import { getTranslations } from "next-intl/server";
import { siteConfig } from "@/lib/site";
import { getHomeContent } from "@/lib/content";
import { resolveImage, type ResolvedImage } from "@/lib/images";
import type { Locale } from "@/lib/schemas";
import { formatPhone, telHref } from "@/lib/utils";
import { Container } from "@/components/ui/primitives";
import { ButtonAnchor, ButtonLink } from "@/components/ui/Button";
import { SmartImage } from "@/components/ui/SmartImage";
import { Icon } from "@/components/ui/Icon";

/**
 * Final conversion band: photo under an ~85% brand overlay (falls back to
 * flat brand primary when the client has no band photo). Standalone use
 * renders with home.yaml copy; pages reuse it with their own heading via
 * props.
 */
export async function CtaBand({
  locale,
  heading,
  subheading,
}: {
  locale: Locale;
  heading?: string;
  subheading?: string;
}) {
  const t = await getTranslations({ locale });
  let h = heading;
  let sub = subheading;
  let image: ResolvedImage | null = null;
  let imageAlt = "";
  try {
    const content = getHomeContent(locale).ctaBand;
    h = h ?? content?.heading;
    sub = sub ?? content?.subheading;
    if (content?.image) {
      image = resolveImage(content.image);
      imageAlt = content.imageAlt ?? "";
    }
  } catch {
    /* non-home usage without home.yaml: fall through to defaults */
  }
  h = h ?? t("cta.bandHeading");
  sub = sub ?? t("cta.bandSubheading");

  return (
    <section className="dark-zone relative isolate overflow-hidden bg-primary py-20 text-inverse md:py-28">
      {image ? (
        <>
          <SmartImage
            image={image}
            alt={imageAlt}
            sizes="100vw"
            // 85% overlay on top; low quality is invisible here.
            quality={55}
            className="absolute inset-0 -z-20 size-full object-cover"
          />
          <div
            aria-hidden="true"
            className="absolute inset-0 -z-10"
            style={{
              background: "color-mix(in srgb, var(--brand-primary) 85%, transparent)",
            }}
          />
        </>
      ) : null}
      <Container className="relative">
        <div className="grid items-center gap-10 lg:grid-cols-[1.5fr_1fr]">
          <div>
            <p className="eyebrow-live mb-5">{t("heroPanel.badge")}</p>
            <h2 className="text-display-2 text-inverse">{h}</h2>
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-inverse-muted">
              {sub}
            </p>
          </div>
          <div className="flex flex-col items-start gap-4 lg:items-end">
            <ButtonLink href={{ pathname: "/contact" }} variant="accent" size="lg" withArrow>
              {t("cta.primary")}
            </ButtonLink>
            <ButtonAnchor
              href={telHref(siteConfig.primaryPhone)}
              variant="outline-inverse"
              size="lg"
            >
              <Icon name="phone" className="size-4.5 text-accent" />
              <span className="data">{formatPhone(siteConfig.primaryPhone)}</span>
            </ButtonAnchor>
          </div>
        </div>
      </Container>
    </section>
  );
}
