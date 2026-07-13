import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const nextConfig: NextConfig = {
  // All pages are statically generated per client (SITE_ID) at build time.
  // Client assets are copied to public/client/ by scripts/prepare-client.mjs.
  images: {
    formats: ["image/avif", "image/webp"],
    // Allowed `quality` values (Next 16 rejects unlisted ones). The lower
    // tiers serve photos that sit under heavy brand-color overlays.
    qualities: [55, 60, 75],
  },
  turbopack: {
    root: __dirname,
  },
};

export default withNextIntl(nextConfig);
