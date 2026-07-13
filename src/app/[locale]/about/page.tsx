import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import type { Locale } from "@/lib/schemas";
import {
  SimplePageLayout,
  simplePageMetadata,
} from "@/components/layout/SimplePageLayout";

type Props = { params: Promise<{ locale: Locale }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return simplePageMetadata(locale, "about");
}

export default async function AboutPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <SimplePageLayout locale={locale} name="about" withCta />;
}
