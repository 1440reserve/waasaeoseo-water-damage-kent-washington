"use client";

import { useSyncExternalStore } from "react";
import Script from "next/script";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import type { Href } from "@/lib/seo";

const STORAGE_KEY = "cookie-consent";
const CHANGE_EVENT = "cookie-consent-change";

function subscribe(callback: () => void) {
  window.addEventListener("storage", callback);
  window.addEventListener(CHANGE_EVENT, callback);
  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener(CHANGE_EVENT, callback);
  };
}

function getSnapshot(): string {
  return window.localStorage.getItem(STORAGE_KEY) ?? "";
}

function decide(choice: "granted" | "denied") {
  window.localStorage.setItem(STORAGE_KEY, choice);
  window.dispatchEvent(new Event(CHANGE_EVENT));
}

/**
 * Cookie-consent banner + consent-gated analytics loader.
 * Analytics scripts (GA4/GTM) are injected only after the visitor accepts,
 * so no tracking cookies are set beforehand (GDPR/CCPA-friendly default).
 * When the banner is disabled but analytics ids exist, scripts load
 * unconditionally: the site owner has opted out of consent gating.
 */
export function CookieConsent({
  ga4Id,
  gtmId,
  showBanner,
}: {
  ga4Id?: string;
  gtmId?: string;
  showBanner: boolean;
}) {
  const t = useTranslations("consent");
  // Server snapshot "" = no choice yet, so the banner is in the SSR HTML
  // (visible to crawlers and no-JS visitors); after hydration a stored
  // choice hides it. Bottom-anchored, so the brief flash is harmless.
  const consent = useSyncExternalStore(subscribe, getSnapshot, () => "");

  const analyticsAllowed = showBanner ? consent === "granted" : true;

  return (
    <>
      {showBanner && consent === "" ? (
        <div
          role="region"
          aria-label={t("regionLabel")}
          className="fixed inset-x-0 bottom-0 z-[70] border-t border-line bg-paper p-4 shadow-[0_-8px_30px_rgba(0,0,0,0.08)]"
        >
          <div className="mx-auto flex w-full max-w-[76rem] flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm leading-relaxed text-muted">
              {t("message")}{" "}
              <Link
                href={{ pathname: "/privacy-policy" } as Href}
                className="underline underline-offset-2 hover:text-primary"
              >
                {t("privacyLink")}
              </Link>
            </p>
            <div className="flex shrink-0 gap-3">
              <button
                type="button"
                onClick={() => decide("denied")}
                className="border border-line px-4 py-2 text-sm font-medium text-muted transition-colors hover:border-accent hover:text-primary"
              >
                {t("decline")}
              </button>
              <button
                type="button"
                onClick={() => decide("granted")}
                className="bg-primary px-4 py-2 text-sm font-medium text-inverse transition-colors hover:bg-primary-deep"
              >
                {t("accept")}
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {analyticsAllowed && gtmId ? (
        <Script id="gtm" strategy="afterInteractive">
          {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${gtmId}');`}
        </Script>
      ) : null}
      {analyticsAllowed && ga4Id ? (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${ga4Id}`}
            strategy="afterInteractive"
          />
          <Script id="ga4" strategy="afterInteractive">
            {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${ga4Id}');`}
          </Script>
        </>
      ) : null}
    </>
  );
}
