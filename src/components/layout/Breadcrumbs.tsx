import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { breadcrumbSchema } from "@/lib/schema-org";
import { localizedUrl, type Href } from "@/lib/seo";
import type { Locale } from "@/lib/schemas";
import { JsonLd } from "@/components/seo/JsonLd";

export type Crumb = { label: string; href?: Href };

/** Visible breadcrumb trail + BreadcrumbList JSON-LD in one component. */
export async function Breadcrumbs({
  locale,
  items,
  className,
}: {
  locale: Locale;
  /** Trailing item = current page (no href needed). Home is added. */
  items: Crumb[];
  className?: string;
}) {
  const t = await getTranslations({ locale });
  const all: Crumb[] = [{ label: t("nav.home"), href: { pathname: "/" } as Href }, ...items];

  const schema = breadcrumbSchema(
    all.map((c) => ({
      name: c.label,
      url: c.href ? localizedUrl(locale, c.href) : undefined,
    }))
  );

  return (
    <nav aria-label={t("a11y.breadcrumb")} className={className}>
      <JsonLd data={schema} />
      <ol className="flex flex-wrap items-center gap-x-2.5 gap-y-1 font-mono text-xs uppercase tracking-[0.14em] text-faint">
        {all.map((crumb, i) => {
          const isLast = i === all.length - 1;
          return (
            <li key={i} className="flex items-center gap-2.5">
              {i > 0 ? <span aria-hidden="true" className="text-line">/</span> : null}
              {crumb.href && !isLast ? (
                <Link href={crumb.href} className="transition-colors hover:text-primary">
                  {crumb.label}
                </Link>
              ) : (
                <span aria-current={isLast ? "page" : undefined} className="text-muted">
                  {crumb.label}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
