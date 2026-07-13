import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { siteConfig } from "@/lib/site";
import { telHref } from "@/lib/utils";
import type { Locale } from "@/lib/schemas";
import { Icon } from "@/components/ui/Icon";

/**
 * Mobile-only sticky bar (the phone is the #1 initial-contact channel
 * for emergency home services). Pure CSS, zero JS.
 */
export async function StickyCallBar({ locale }: { locale: Locale }) {
  const t = await getTranslations({ locale, namespace: "stickyBar" });

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-2 border-t border-line-soft md:hidden">
      <a
        href={telHref(siteConfig.primaryPhone)}
        className="flex items-center justify-center gap-2 bg-accent py-3.5 pb-[max(0.875rem,env(safe-area-inset-bottom))] font-semibold text-ink"
      >
        <Icon name="phone" className="size-4.5" strokeWidth={1.8} />
        {t("call")}
      </a>
      <Link
        href={{ pathname: "/contact" }}
        className="flex items-center justify-center gap-2 bg-primary py-3.5 pb-[max(0.875rem,env(safe-area-inset-bottom))] font-semibold text-inverse"
      >
        {t("contact")}
      </Link>
    </div>
  );
}
