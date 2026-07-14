import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { siteConfig } from "@/lib/site";
import { telHref } from "@/lib/utils";
import type { Locale } from "@/lib/schemas";
import { Icon } from "@/components/ui/Icon";
import { StickyBarShell } from "./StickyBarShell";

/**
 * Mobile-only sticky call bar (the phone is the #1 initial-contact channel
 * for emergency home services). Content is server-rendered; a thin client
 * shell reveals it on scroll so it does not shout on first paint.
 */
export async function StickyCallBar({ locale }: { locale: Locale }) {
  const t = await getTranslations({ locale, namespace: "stickyBar" });

  return (
    <StickyBarShell>
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
    </StickyBarShell>
  );
}
