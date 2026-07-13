import type { Metadata, Viewport } from "next";
import { notFound } from "next/navigation";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { siteConfig, siteLocales } from "@/lib/site";
import { getBrandStyle } from "@/lib/theme";
import { getFontTheme } from "@/lib/fonts";
import { buildNavData } from "@/lib/nav";
import { organizationSchema, websiteSchema } from "@/lib/schema-org";
import type { Locale } from "@/lib/schemas";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { StickyCallBar } from "@/components/layout/StickyCallBar";
import { CookieConsent } from "@/components/layout/CookieConsent";
import { JsonLd } from "@/components/seo/JsonLd";
import "@/styles/globals.css";

export function generateStaticParams() {
  return siteLocales.map((locale) => ({ locale }));
}

/**
 * Namespaces needed by client components ("use client" + useTranslations).
 * Without this pick, next-intl v4 serializes the entire catalog into every
 * page's payload; server components read messages directly and need nothing
 * here. Extend when a client component adopts a new namespace.
 */
const CLIENT_MESSAGE_NAMESPACES = ["consent", "a11y", "form"];

export const dynamicParams = false;

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.domain),
  icons: { icon: `/client/${siteConfig.branding.icon}` },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: siteConfig.branding.colors.primary,
};

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);

  const font = getFontTheme();
  const brand = getBrandStyle(siteConfig);
  const nav = await buildNavData(locale as Locale);
  const messages = await getMessages();
  const clientMessages = Object.fromEntries(
    CLIENT_MESSAGE_NAMESPACES.map((ns) => [ns, messages[ns]])
  );
  const { ga4Id, gtmId, cookieConsent } = siteConfig.integrations;
  const showConsentBanner = cookieConsent ?? Boolean(ga4Id || gtmId);

  return (
    // suppressHydrationWarning: the inline script below adds a "js" class
    // to <html> before React hydrates (scroll-reveal gating), so the
    // client className intentionally differs from the server render.
    // Applies to this element's attributes only, not children.
    <html
      lang={locale}
      className={font.className}
      style={{ ...brand, ...font.style }}
      suppressHydrationWarning
    >
      <body>
        {/* Gates scroll-reveal hidden states behind JS availability. */}
        <script
          dangerouslySetInnerHTML={{
            __html: "document.documentElement.classList.add('js')",
          }}
        />
        <NextIntlClientProvider messages={clientMessages}>
          <Header nav={nav} />
          <main id="main">{children}</main>
          <Footer locale={locale as Locale} />
          <StickyCallBar locale={locale as Locale} />
          {/* Spacer so the mobile sticky bar never covers footer content. */}
          <div aria-hidden="true" className="h-[3.4rem] md:hidden" />
          <CookieConsent ga4Id={ga4Id} gtmId={gtmId} showBanner={showConsentBanner} />
        </NextIntlClientProvider>
        <JsonLd data={organizationSchema(locale as Locale)} />
        <JsonLd data={websiteSchema(locale as Locale)} />
      </body>
    </html>
  );
}
