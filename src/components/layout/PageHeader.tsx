import type { ReactNode } from "react";
import type { Locale } from "@/lib/schemas";
import { Container } from "@/components/ui/primitives";
import { Breadcrumbs, type Crumb } from "./Breadcrumbs";

/** Standard page opener: breadcrumb trail + display H1 + optional intro. */
export function PageHeader({
  locale,
  crumbs,
  title,
  intro,
  children,
}: {
  locale: Locale;
  crumbs: Crumb[];
  title: string;
  intro?: string;
  children?: ReactNode;
}) {
  return (
    <div className="bg-wash">
      <Container className="pb-14 pt-10 md:pb-20 md:pt-14">
        <Breadcrumbs locale={locale} items={crumbs} className="mb-8" />
        <h1 className="text-display-1 max-w-4xl">{title}</h1>
        {intro ? (
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted">{intro}</p>
        ) : null}
        {children}
      </Container>
    </div>
  );
}
