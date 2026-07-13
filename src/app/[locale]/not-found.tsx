import { getLocale, getTranslations } from "next-intl/server";
import { Container } from "@/components/ui/primitives";
import { ButtonLink } from "@/components/ui/Button";

export default async function NotFound() {
  const locale = await getLocale();
  const t = await getTranslations({ locale, namespace: "notFound" });

  return (
    <div className="bg-wash">
      <Container className="flex min-h-[60vh] flex-col items-start justify-center py-24">
        <p className="eyebrow mb-5">404</p>
        <h1 className="text-display-1 max-w-2xl">{t("title")}</h1>
        <p className="mt-6 max-w-md text-lg leading-relaxed text-muted">{t("body")}</p>
        <div className="mt-10">
          <ButtonLink href={{ pathname: "/" }} size="lg" withArrow>
            {t("backHome")}
          </ButtonLink>
        </div>
      </Container>
    </div>
  );
}
