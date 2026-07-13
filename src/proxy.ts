import createIntlProxy from "next-intl/middleware";
import { routing } from "./i18n/routing";

/**
 * Locale routing (Next 16: proxy.ts, formerly middleware.ts).
 * Rewrites localized public paths to the internal [locale] route tree
 * and sets alternate-link headers.
 */
export default createIntlProxy(routing);

export const config = {
  // Skip API routes, Next internals, client assets, and files with extensions.
  matcher: "/((?!api|_next|_vercel|client|.*\\..*).*)",
};
