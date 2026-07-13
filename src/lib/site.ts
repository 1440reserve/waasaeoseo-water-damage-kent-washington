import { activeClient, ACTIVE_CLIENT_ID } from "@/generated/active-client";
import { SiteConfigSchema, type SiteConfig, type Locale } from "./schemas";

/**
 * The active client's validated config. Selected at build time by SITE_ID
 * (scripts/prepare-client.mjs generates src/generated/active-client.ts).
 * Parsing here fails the build loudly if a client config is invalid.
 *
 * Must stay edge-safe (imported by the i18n proxy): no node builtins.
 */
export const siteConfig: SiteConfig = SiteConfigSchema.parse(activeClient);

export const CLIENT_ID: string = ACTIVE_CLIENT_ID;

export const siteLocales: Locale[] = siteConfig.locales;

export const isBilingual = siteLocales.length > 1;
