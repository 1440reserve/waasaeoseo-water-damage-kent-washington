import { getTranslations } from "next-intl/server";
import { siteConfig } from "@/lib/site";
import { getServices } from "@/lib/content";
import type { Locale } from "@/lib/schemas";
import { formatPhone, telHref } from "@/lib/utils";
import { cn } from "@/lib/utils";
import { LeadForm } from "./LeadForm";

/**
 * Server wrapper: builds the service options + phone and renders the
 * client-side LeadForm inside a titled panel. Drop onto any page.
 */
export async function LeadFormPanel({
  locale,
  source,
  className,
  framed = true,
}: {
  locale: Locale;
  source: string;
  className?: string;
  framed?: boolean;
}) {
  const t = await getTranslations({ locale, namespace: "form" });
  const services = getServices(locale).map((s) => ({
    value: s.fm.id,
    label: s.fm.title,
  }));

  return (
    <div
      className={cn(
        framed && "border border-line-soft bg-paper p-8 shadow-[0_24px_60px_rgba(0,0,0,0.07)] md:p-10",
        "relative",
        className
      )}
    >
      <h2 className="text-display-3">{t("title")}</h2>
      <p className="mt-2 mb-8 text-sm leading-relaxed text-muted">{t("subtitle")}</p>
      <LeadForm
        locale={locale}
        services={services}
        source={source}
        phoneDisplay={formatPhone(siteConfig.primaryPhone)}
        phoneHref={telHref(siteConfig.primaryPhone)}
      />
    </div>
  );
}
