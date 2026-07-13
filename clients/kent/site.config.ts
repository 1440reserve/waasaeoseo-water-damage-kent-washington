import type { SiteConfigInput } from "../../src/lib/schemas";

/**
 * KENT: water damage lead-gen site for Kent, WA (kentwaterdamagepros.com).
 * Skeleton config: structure is final, values marked TODO are placeholders.
 *
 * Deliberately absent (do not invent):
 * - address: no verified physical location yet (schema omits it too).
 * - trust.googleRating / stats / badges: zeroed until real data exists.
 * - profiles: add live GBP/social URLs once created.
 */
const config = {
  id: "kent",
  name: "Kent Water Damage Pros",
  domain: "https://kentwaterdamagepros.com",
  locales: ["en"],
  // TODO: replace with the CallScaler tracking number before launch.
  primaryPhone: "+12535550100",
  areaServed: "Kent, WA",
  // Broader footprint labels (Kent itself is areaServed above); the /areas
  // pages carry the real local depth.
  serviceAreas: ["Covington", "Des Moines", "SeaTac", "Tukwila"],
  branding: {
    logo: "brand/logo.svg",
    logoInverse: "brand/logo-inverse.svg",
    icon: "brand/icon.svg",
    // TODO: add a real 1200x630 share JPG and set ogImage: "og/share-en.jpg".
    colors: {
      primary: "#143A5E", // deep water blue
      accent: "#C65A1E", // safety orange
      ink: "#101820",
      paper: "#FFFFFF",
    },
    fontPair: "editorial",
  },
  homepage: {
    heroVariant: "split",
    sections: [
      "hero",
      "trustBar",
      "services",
      "process",
      "whyUs",
      "localIntro",
      "testimonials",
      "serviceArea",
      "faqTeaser",
      "ctaBand",
    ],
  },
  trust: {
    // TODO: set googleRating { value, count, url } once the GBP has real reviews.
    // TODO: add badges (e.g. IICRC certification) only if actually held.
    // TODO: add stats only with real, verifiable figures.
    badges: [],
    stats: [],
  },
  footerDisclaimer:
    "We connect you with a licensed local restoration professional.",
  integrations: {
    // TODO: replace with the real lead inbox before launch.
    leadEmails: ["todo-leads@kentwaterdamagepros.com"],
    // TODO: set ga4Id/gtmId when analytics is provisioned.
  },
  // TODO: add live profile URLs (GBP, Facebook, etc.) once they exist.
  profiles: [],
} satisfies SiteConfigInput;

export default config;
