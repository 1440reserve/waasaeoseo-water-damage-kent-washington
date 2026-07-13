import fs from "node:fs";
import path from "node:path";
import { cache } from "react";
import matter from "gray-matter";
import { parse as parseYaml } from "yaml";
import { z } from "zod";
import { CLIENT_ID, siteLocales } from "./site";
import {
  AreaFrontmatterSchema,
  FaqsFileSchema,
  GuideFrontmatterSchema,
  HomeContentSchema,
  PageFrontmatterSchema,
  ReviewsFileSchema,
  ServiceFrontmatterSchema,
  type AreaFrontmatter,
  type FaqEntry,
  type GuideFrontmatter,
  type HomeContent,
  type Locale,
  type PageFrontmatter,
  type Review,
  type ServiceFrontmatter,
} from "./schemas";

/* ------------------------------------------------------------------ */
/* Entities                                                            */
/* ------------------------------------------------------------------ */
export type Service = { fm: ServiceFrontmatter; body: string };
export type Area = { fm: AreaFrontmatter; body: string };
export type Guide = { fm: GuideFrontmatter; body: string };
export type SimplePage = { fm: PageFrontmatter; body: string };
export type SimplePageName = "about" | "privacy-policy" | "terms";

/* ------------------------------------------------------------------ */
/* Low-level readers                                                   */
/* ------------------------------------------------------------------ */
function contentPath(locale: Locale, ...parts: string[]): string {
  return path.join(process.cwd(), "clients", CLIENT_ID, "content", locale, ...parts);
}

function fail(file: string, error: unknown): never {
  const detail =
    error instanceof z.ZodError ? z.prettifyError(error) : String(error);
  throw new Error(`Invalid content in ${file}:\n${detail}`);
}

function readMdx<T>(schema: z.ZodType<T>, file: string): { fm: T; body: string } {
  const raw = fs.readFileSync(file, "utf8");
  const { data, content } = matter(raw);
  try {
    return { fm: schema.parse(data), body: content.trim() };
  } catch (e) {
    fail(file, e);
  }
}

function readMdxDir<T>(schema: z.ZodType<T>, dir: string): Array<{ fm: T; body: string }> {
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".mdx"))
    .map((f) => readMdx(schema, path.join(dir, f)));
}

function readYamlFile<T>(schema: z.ZodType<T>, file: string, fallback: T): T {
  if (!fs.existsSync(file)) return fallback;
  try {
    return schema.parse(parseYaml(fs.readFileSync(file, "utf8")));
  } catch (e) {
    fail(file, e);
  }
}

/* ------------------------------------------------------------------ */
/* Services                                                            */
/* ------------------------------------------------------------------ */
export const getServices = cache((locale: Locale): Service[] =>
  readMdxDir(ServiceFrontmatterSchema, contentPath(locale, "services"))
    .filter((s) => !s.fm.draft)
    .sort((a, b) => a.fm.order - b.fm.order || a.fm.title.localeCompare(b.fm.title))
);

export function getServiceBySlug(locale: Locale, slug: string): Service | undefined {
  return getServices(locale).find((s) => s.fm.slug === slug);
}

export function getServiceById(locale: Locale, id: string): Service | undefined {
  return getServices(locale).find((s) => s.fm.id === id);
}

/** Per-locale URL slugs for hreflang pairing, keyed by shared `id`. */
export function serviceAlternates(id: string): Partial<Record<Locale, string>> {
  const out: Partial<Record<Locale, string>> = {};
  for (const locale of siteLocales) {
    const s = getServiceById(locale, id);
    if (s) out[locale] = s.fm.slug;
  }
  return out;
}

/* ------------------------------------------------------------------ */
/* Areas                                                               */
/* ------------------------------------------------------------------ */
export const getAreas = cache((locale: Locale): Area[] =>
  readMdxDir(AreaFrontmatterSchema, contentPath(locale, "areas"))
    .filter((a) => !a.fm.draft)
    .sort((a, b) => a.fm.order - b.fm.order || a.fm.title.localeCompare(b.fm.title))
);

export function getAreaBySlug(locale: Locale, slug: string): Area | undefined {
  return getAreas(locale).find((a) => a.fm.slug === slug);
}

export function getAreaById(locale: Locale, id: string): Area | undefined {
  return getAreas(locale).find((a) => a.fm.id === id);
}

export function areaAlternates(id: string): Partial<Record<Locale, string>> {
  const out: Partial<Record<Locale, string>> = {};
  for (const locale of siteLocales) {
    const a = getAreaById(locale, id);
    if (a) out[locale] = a.fm.slug;
  }
  return out;
}

/* ------------------------------------------------------------------ */
/* Guides                                                              */
/* ------------------------------------------------------------------ */
export const getGuides = cache((locale: Locale): Guide[] =>
  readMdxDir(GuideFrontmatterSchema, contentPath(locale, "guides"))
    .filter((g) => !g.fm.draft)
    .sort((a, b) => b.fm.date.localeCompare(a.fm.date))
);

export function getGuideBySlug(locale: Locale, slug: string): Guide | undefined {
  return getGuides(locale).find((g) => g.fm.slug === slug);
}

export function guideAlternates(id: string): Partial<Record<Locale, string>> {
  const out: Partial<Record<Locale, string>> = {};
  for (const locale of siteLocales) {
    const g = getGuides(locale).find((x) => x.fm.id === id);
    if (g) out[locale] = g.fm.slug;
  }
  return out;
}

/* ------------------------------------------------------------------ */
/* YAML data + simple pages                                            */
/* ------------------------------------------------------------------ */
export const getFaqs = cache((locale: Locale): FaqEntry[] =>
  readYamlFile(FaqsFileSchema, contentPath(locale, "faqs.yaml"), [])
);

/** Real reviews only (reviews.yaml). Missing file = no reviews rendered. */
export const getReviews = cache((locale: Locale): Review[] =>
  readYamlFile(ReviewsFileSchema, contentPath(locale, "reviews.yaml"), [])
);

export const getHomeContent = cache((locale: Locale): HomeContent => {
  const file = contentPath(locale, "home.yaml");
  if (!fs.existsSync(file)) {
    throw new Error(`Missing required homepage content: ${file}`);
  }
  try {
    return HomeContentSchema.parse(parseYaml(fs.readFileSync(file, "utf8")));
  } catch (e) {
    fail(file, e);
  }
});

export const getSimplePage = cache(
  (locale: Locale, name: SimplePageName): SimplePage | undefined => {
    const file = contentPath(locale, `${name}.mdx`);
    if (!fs.existsSync(file)) return undefined;
    return readMdx(PageFrontmatterSchema, file);
  }
);

/* ------------------------------------------------------------------ */
/* Feature flags derived from available content                        */
/* ------------------------------------------------------------------ */
export function hasReviews(locale: Locale): boolean {
  return getReviews(locale).length > 0;
}
export function hasGuides(locale: Locale): boolean {
  return getGuides(locale).length > 0;
}
export function hasAreas(locale: Locale): boolean {
  return getAreas(locale).length > 0;
}
