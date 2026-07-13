import { z } from "zod";

/* ------------------------------------------------------------------ */
/* Locales                                                             */
/* ------------------------------------------------------------------ */
/** "es" stays in the union so Spanish can be added later without a
 * schema change; the active client's `locales` picks what actually builds. */
export const LOCALES = ["en", "es"] as const;
export type Locale = (typeof LOCALES)[number];
export const DEFAULT_LOCALE: Locale = "en";

/* ------------------------------------------------------------------ */
/* Primitives                                                          */
/* ------------------------------------------------------------------ */
const slug = z
  .string()
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "must be a lowercase-hyphen slug");

const clientId = z
  .string()
  .regex(/^[a-z0-9_][a-z0-9-_]*$/, "must be a lowercase slug (may start with _)");

/** Path relative to the client's assets/ folder, e.g. "photos/kent.jpg". */
const imageRef = z.string().min(1);

/** Config text that renders on the site: plain string or per-locale map. */
const localized = z.union([
  z.string(),
  z.partialRecord(z.enum(LOCALES), z.string()),
]);
export type LocalizedText = z.infer<typeof localized>;

/** Resolve a LocalizedText for a locale (falls back to en, then any value). */
export function lt(value: LocalizedText | undefined, locale: Locale): string {
  if (value == null) return "";
  if (typeof value === "string") return value;
  return value[locale] ?? value.en ?? Object.values(value)[0] ?? "";
}

const e164Phone = z
  .string()
  .regex(/^\+\d{7,15}$/, 'must be E.164, e.g. "+12535550100"');

/* ------------------------------------------------------------------ */
/* Site config (clients/<id>/site.config.ts)                           */
/* ------------------------------------------------------------------ */
export const FONT_PAIR_KEYS = ["editorial", "classic", "modern"] as const;

const BrandingSchema = z.object({
  /** Logo for light backgrounds (SVG preferred), relative to assets/. */
  logo: imageRef,
  /** Logo for dark backgrounds; falls back to `logo`. */
  logoInverse: imageRef.optional(),
  /** Square icon (favicon / app icon), SVG preferred. */
  icon: imageRef,
  /** Share image (1200x630). Localizable so /es gets translated art.
   * Falls back to `logo` when unset. */
  ogImage: localized.optional(),
  colors: z.object({
    /** Deep brand color: headers, dark bands, buttons. */
    primary: z.string(),
    /** Warm highlight: rules, labels, hovers. */
    accent: z.string(),
    /** Near-black text color. Defaults to a warm ink. */
    ink: z.string().optional(),
    /** Page background. Defaults to warm off-white. */
    paper: z.string().optional(),
    /** Tinted section background. Defaults to warm sand. */
    wash: z.string().optional(),
    /** Card fill on tinted sections. Default pairs with the default wash;
     * override together with `wash`. */
    washCard: z.string().optional(),
  }),
  fontPair: z.enum(FONT_PAIR_KEYS).default("editorial"),
});

export const HOME_SECTION_KEYS = [
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
] as const;
export type HomeSectionKey = (typeof HOME_SECTION_KEYS)[number];

const HomepageSchema = z.object({
  heroVariant: z.enum(["split", "panorama"]).default("split"),
  /** Order + selection of homepage sections. Omit any you don't want. */
  sections: z.array(z.enum(HOME_SECTION_KEYS)).nonempty(),
});

const TrustSchema = z.object({
  /**
   * Only set this once the business has a real Google Business Profile
   * with real reviews. Never fabricate a rating or count: self-applied
   * fake trust data is worse than none.
   */
  googleRating: z
    .object({
      value: z.number().min(0).max(5),
      count: z.number().int().positive(),
      url: z.url().optional(),
    })
    .optional(),
  /** Certification/membership badges (e.g. IICRC). Text-only badges
   * render as styled marks. Only list credentials that are actually held. */
  badges: z
    .array(z.object({ label: z.string(), image: imageRef.optional() }))
    .default([]),
  /** Headline stats. Only real, verifiable figures belong here. */
  stats: z
    .array(z.object({ value: z.string(), label: localized }))
    .default([]),
});

const IntegrationsSchema = z.object({
  /** Where lead-form submissions are emailed. */
  leadEmails: z.array(z.email()).nonempty(),
  ga4Id: z.string().optional(),
  gtmId: z.string().optional(),
  /**
   * Show the cookie-consent banner. Defaults to on whenever analytics
   * (ga4Id/gtmId) are configured; analytics scripts only load after the
   * visitor accepts. Set explicitly to force it on or off.
   */
  cookieConsent: z.boolean().optional(),
});

/**
 * Optional physical address. Most lead-gen sites launch without one and
 * add it later once there is a real, verifiable location. Never invent
 * an address to fill this in.
 */
const AddressSchema = z.object({
  streetAddress: z.string(),
  addressLocality: z.string(),
  addressRegion: z.string().length(2),
  postalCode: z.string(),
});
export type Address = z.infer<typeof AddressSchema>;

export const SiteConfigSchema = z.object({
  id: clientId,
  /** Public-facing name of the business, e.g. "Kent Water Damage Pros". */
  name: z.string(),
  /** Canonical production origin, no trailing slash. */
  domain: z.url(),
  tagline: localized.optional(),
  locales: z.array(z.enum(LOCALES)).nonempty().default(["en"]),
  /** Primary display/contact number (E.164): header, sticky bar, schema. */
  primaryPhone: e164Phone,
  /** Human-readable primary service area for schema, e.g. "Kent, WA". */
  areaServed: z.string(),
  /** Additional cities/communities genuinely served (service-area section). */
  serviceAreas: z.array(z.string()).default([]),
  /** Physical address. OPTIONAL: omit until there is a real location. */
  address: AddressSchema.optional(),
  branding: BrandingSchema,
  homepage: HomepageSchema,
  trust: TrustSchema.prefault({}),
  /** Footer disclaimer line, e.g. the lead-gen routing disclosure. */
  footerDisclaimer: localized,
  integrations: IntegrationsSchema,
  /** sameAs profiles: GBP, socials, directories. Live URLs only. */
  profiles: z.array(z.url()).default([]),
});

export type SiteConfig = z.infer<typeof SiteConfigSchema>;
export type SiteConfigInput = z.input<typeof SiteConfigSchema>;

/* ------------------------------------------------------------------ */
/* Shared content pieces                                               */
/* ------------------------------------------------------------------ */
export const ICON_KEYS = [
  /* water-damage domain */
  "droplet", "waves", "pipe", "mold", "storm", "snowflake",
  "home", "building", "truck", "wrench", "alert", "fan",
  /* generic/UI-adjacent */
  "shield", "clock", "document", "clipboard", "phone", "activity",
] as const;
export type IconKey = (typeof ICON_KEYS)[number];

const FaqItemSchema = z.object({
  q: z.string().min(8),
  a: z.string().min(20),
});
export type FaqItem = z.infer<typeof FaqItemSchema>;

/** Under 60 chars per the title formula; hard-fail keeps quality up. */
const metaTitle = z.string().max(60).optional();
/** Unique, benefit + location + CTA, max 160 chars. Required everywhere. */
const metaDescription = z.string().min(70).max(165);

/* ------------------------------------------------------------------ */
/* Frontmatter: services (water damage)                                */
/* ------------------------------------------------------------------ */
export const ServiceFrontmatterSchema = z.object({
  /** Locale-independent key pairing en/es versions of the same page. */
  id: slug,
  /** Locale-specific URL slug. */
  slug: slug,
  /** Short name for cards/nav, e.g. "Flood Cleanup". */
  title: z.string(),
  /** Full H1 per the title formula, e.g. "Flood Cleanup in Kent, WA". */
  h1: z.string(),
  metaTitle,
  metaDescription,
  /** Plain-English answer paragraph rendered above the fold (AEO). */
  quickAnswer: z.string().min(80),
  icon: z.enum(ICON_KEYS).default("droplet"),
  image: imageRef.optional(),
  imageAlt: z.string().optional(),
  order: z.number().default(99),
  /** Show on the homepage services grid. */
  featured: z.boolean().default(true),
  /** Bulleted "what this covers" highlights shown near the top. */
  highlights: z.array(z.string()).default([]),
  /** What-to-expect steps, rendered as a numbered process. */
  processSteps: z
    .array(z.object({ title: z.string(), description: z.string() }))
    .default([]),
  /** Area ids where this service is emphasized (internal linking). */
  areas: z.array(slug).default([]),
  /** Related service ids. */
  related: z.array(slug).default([]),
  faqs: z.array(FaqItemSchema).default([]),
  /** ISO date of the last substantive review: drives the visible
   * "Updated" date and dateModified in schema. */
  updated: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  draft: z.boolean().default(false),
});
export type ServiceFrontmatter = z.infer<typeof ServiceFrontmatterSchema>;

/* ------------------------------------------------------------------ */
/* Frontmatter: areas (city/neighborhood pages)                        */
/* ------------------------------------------------------------------ */
export const AreaFrontmatterSchema = z.object({
  id: slug,
  slug: slug,
  /** Display name, e.g. "Kent East Hill" or "Covington". */
  title: z.string(),
  /** Full H1, e.g. "Water Damage Restoration in Covington, WA". */
  h1: z.string(),
  metaTitle,
  metaDescription,
  /** Plain-English answer paragraph rendered above the fold (AEO). */
  quickAnswer: z.string().min(80),
  image: imageRef.optional(),
  imageAlt: z.string().optional(),
  order: z.number().default(99),
  /** Show in the homepage service-area section. */
  featured: z.boolean().default(true),
  /** Neighborhoods/landmarks inside this area (genuine local signal). */
  neighborhoods: z.array(z.string()).default([]),
  /** Service ids emphasized for this area (internal linking). */
  services: z.array(slug).default([]),
  /** Related area ids. */
  related: z.array(slug).default([]),
  faqs: z.array(FaqItemSchema).default([]),
  updated: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  draft: z.boolean().default(false),
});
export type AreaFrontmatter = z.infer<typeof AreaFrontmatterSchema>;

/* ------------------------------------------------------------------ */
/* Frontmatter: guides (article-type support content)                  */
/* ------------------------------------------------------------------ */
export const GuideFrontmatterSchema = z.object({
  id: slug,
  slug: slug,
  title: z.string(),
  /** Overrides the default "<title> | <name>" when that exceeds ~60 chars. */
  metaTitle,
  metaDescription,
  /** Plain-English answer paragraph rendered above the fold (AEO). */
  quickAnswer: z.string().min(80),
  /** ISO date, e.g. "2026-07-13". */
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  updated: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  /** Pillar service id this guide supports (hub-and-spoke). */
  service: slug.optional(),
  /** Optional area id when the guide is location-specific. */
  area: slug.optional(),
  image: imageRef.optional(),
  imageAlt: z.string().optional(),
  draft: z.boolean().default(false),
});
export type GuideFrontmatter = z.infer<typeof GuideFrontmatterSchema>;

/* ------------------------------------------------------------------ */
/* Frontmatter: simple pages (about, privacy)                          */
/* ------------------------------------------------------------------ */
export const PageFrontmatterSchema = z.object({
  title: z.string(),
  metaTitle,
  metaDescription: z.string().max(165).optional(),
  updated: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  image: imageRef.optional(),
  imageAlt: z.string().optional(),
});
export type PageFrontmatter = z.infer<typeof PageFrontmatterSchema>;

/* ------------------------------------------------------------------ */
/* YAML data files                                                     */
/* ------------------------------------------------------------------ */
export const FaqsFileSchema = z.array(
  FaqItemSchema.extend({
    id: slug,
    /** Featured FAQs appear in the homepage teaser. */
    featured: z.boolean().default(false),
  })
);
export type FaqEntry = z.infer<typeof FaqsFileSchema>[number];

/** Real reviews only, quoted with permission. Never fabricate these. */
export const ReviewsFileSchema = z.array(
  z.object({
    author: z.string(),
    rating: z.number().min(1).max(5),
    text: z.string().min(30),
    source: z
      .enum(["google", "yelp", "facebook", "other"])
      .default("google"),
    date: z.string().optional(),
    /** Optional links for filtering/showcasing. */
    service: slug.optional(),
    area: slug.optional(),
    featured: z.boolean().default(false),
  })
);
export type Review = z.infer<typeof ReviewsFileSchema>[number];

/* ------------------------------------------------------------------ */
/* home.yaml: homepage copy                                            */
/* ------------------------------------------------------------------ */
export const HomeContentSchema = z.object({
  hero: z.object({
    eyebrow: z.string().optional(),
    /** Rendered in a single weight and color (no inline accents). */
    heading: z.string(),
    subheading: z.string(),
    image: imageRef.optional(),
    imageAlt: z.string().optional(),
    ctaLabel: z.string().optional(),
    secondaryCtaLabel: z.string().optional(),
  }),
  metaTitle: z.string().max(60),
  metaDescription,
  whyUs: z
    .object({
      title: z.string().optional(),
      blocks: z
        .array(
          z.object({
            title: z.string(),
            description: z.string(),
            icon: z.enum(ICON_KEYS).optional(),
          })
        )
        .nonempty(),
    })
    .optional(),
  serviceArea: z
    .object({
      title: z.string().optional(),
      /** Genuine local blurb, not a keyword-stuffed city list. */
      blurb: z.string(),
      /** Small local-landmark photo card shown beside the area list. */
      image: imageRef.optional(),
      imageAlt: z.string().optional(),
    })
    .optional(),
  ctaBand: z
    .object({
      heading: z.string().optional(),
      subheading: z.string().optional(),
      /** Background photo; rendered under an ~85% brand overlay. */
      image: imageRef.optional(),
      imageAlt: z.string().optional(),
    })
    .optional(),
  /** Numbered walkthrough of what happens after the call. */
  process: z
    .object({
      eyebrow: z.string().optional(),
      title: z.string(),
      steps: z
        .array(z.object({ title: z.string(), description: z.string() }))
        .nonempty(),
    })
    .optional(),
  /** Genuine local prose: the depth block that makes the homepage more
   * than a template. Substance only, never a stuffed city list. */
  localIntro: z
    .object({
      eyebrow: z.string().optional(),
      title: z.string(),
      paragraphs: z.array(z.string()).nonempty(),
    })
    .optional(),
});
export type HomeContent = z.infer<typeof HomeContentSchema>;
