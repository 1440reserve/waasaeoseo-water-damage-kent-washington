import type { CSSProperties } from "react";
import type { SiteConfig } from "./schemas";

/**
 * Per-client brand variables applied inline on <html>. Everything visual
 * derives from these four (see globals.css color-mix tones), so a client
 * rebrand is a config change, not a code change.
 */
export function getBrandStyle(config: SiteConfig): CSSProperties {
  const { colors } = config.branding;
  return {
    "--brand-primary": colors.primary,
    "--brand-accent": colors.accent,
    ...(colors.ink ? { "--brand-ink": colors.ink } : {}),
    ...(colors.paper ? { "--brand-paper": colors.paper } : {}),
    // Tinted-section pair (defaults are the warm sand/parchment in
    // globals.css).
    ...(colors.wash ? { "--brand-cream": colors.wash } : {}),
    ...(colors.washCard ? { "--brand-parchment": colors.washCard } : {}),
  } as CSSProperties;
}
