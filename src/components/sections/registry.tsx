import type { ComponentType } from "react";
import type { HomeSectionKey, Locale } from "@/lib/schemas";
import { Hero } from "./Hero";
import { TrustBar } from "./TrustBar";
import { ServiceGrid } from "./ServiceGrid";
import { ProcessSteps } from "./ProcessSteps";
import { WhyUs } from "./WhyUs";
import { LocalIntro } from "./LocalIntro";
import { Testimonials } from "./Testimonials";
import { ServiceArea } from "./ServiceArea";
import { FaqTeaser } from "./FaqSections";
import { CtaBand } from "./CtaBand";

/**
 * Homepage section registry. site.config.ts `homepage.sections` picks and
 * orders these per client: same components, different composition, so
 * every site feels arranged rather than templated.
 */
export const HOME_SECTIONS: Record<
  HomeSectionKey,
  ComponentType<{ locale: Locale }>
> = {
  hero: Hero,
  trustBar: TrustBar,
  services: ServiceGrid,
  process: ProcessSteps,
  whyUs: WhyUs,
  localIntro: LocalIntro,
  testimonials: Testimonials,
  serviceArea: ServiceArea,
  faqTeaser: FaqTeaser,
  ctaBand: CtaBand,
};
