import { getTranslations } from "next-intl/server";
import { siteConfig } from "@/lib/site";
import type { Locale, IconKey } from "@/lib/schemas";
import { formatPhone, telHref } from "@/lib/utils";
import { Icon } from "@/components/ui/Icon";

/**
 * Photo-free hero aside for the split hero. Fills the right column with a
 * real, useful emergency-response panel (badge, tap-to-call, what we
 * handle) instead of a stock photo. Honest by construction: nothing here
 * claims a job that did not happen. Swap in a real photo later and the
 * Hero renders that instead.
 */
const HANDLES: { icon: IconKey; key: string }[] = [
  { icon: "waves", key: "flooding" },
  { icon: "pipe", key: "pipes" },
  { icon: "alert", key: "sewage" },
  { icon: "mold", key: "mold" },
  { icon: "storm", key: "storm" },
  { icon: "droplet", key: "extraction" },
];

export async function HeroPanel({ locale }: { locale: Locale }) {
  const t = await getTranslations({ locale });
  const phone = formatPhone(siteConfig.primaryPhone);

  return (
    <div className="relative mx-auto w-full max-w-md lg:max-w-none">
      <div className="dark-zone relative isolate overflow-hidden border border-line-soft bg-primary text-inverse shadow-[0_18px_48px_rgba(0,0,0,0.16)]">
        {/* Subtle water motif, decorative only. */}
        <svg
          aria-hidden="true"
          className="absolute inset-x-0 bottom-0 -z-10 h-40 w-full text-inverse/5"
          viewBox="0 0 400 160"
          preserveAspectRatio="none"
          fill="none"
        >
          <path
            d="M0 96c40-28 80-28 120 0s80 28 120 0 80-28 120 0 80 28 120 0v64H0z"
            fill="currentColor"
          />
          <path
            d="M0 120c40-24 80-24 120 0s80 24 120 0 80-24 120 0 80 24 120 0v40H0z"
            fill="currentColor"
          />
        </svg>

        <div className="p-7 sm:p-8">
          <div className="flex items-center gap-2.5">
            <span className="relative flex size-2.5">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-accent opacity-75 motion-reduce:animate-none" />
              <span className="relative inline-flex size-2.5 rounded-full bg-accent" />
            </span>
            <span className="font-mono text-xs font-semibold uppercase tracking-[0.14em] text-inverse-muted">
              {t("heroPanel.badge")}
            </span>
          </div>

          <p className="mt-6 text-sm text-inverse-muted">{t("heroPanel.callLabel")}</p>
          <a
            href={telHref(siteConfig.primaryPhone)}
            className="data mt-1 block text-4xl font-semibold text-inverse transition-colors hover:text-accent-bright sm:text-[2.75rem]"
          >
            {phone}
          </a>

          {/* Response readout: existing copy, no invented stats. */}
          <p className="mt-6 flex items-start gap-2.5 border-t border-inverse/15 pt-5 text-sm text-inverse-muted">
            <Icon name="activity" className="mt-0.5 size-4 shrink-0 text-accent" strokeWidth={1.8} />
            {t("cta.available")}
          </p>

          <div className="mt-7 border-t border-inverse/15 pt-6">
            <p className="font-mono text-xs font-semibold uppercase tracking-[0.14em] text-inverse-muted">
              {t("heroPanel.handlesTitle")}
            </p>
            <ul className="mt-4 grid grid-cols-1 gap-x-5 gap-y-3 sm:grid-cols-2">
              {HANDLES.map(({ icon, key }) => (
                <li key={key} className="flex items-center gap-2.5 text-sm text-inverse-muted">
                  <Icon name={icon} className="size-4.5 shrink-0 text-accent" />
                  {t(`heroPanel.${key}`)}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
