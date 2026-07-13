"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import type { Locale } from "@/lib/schemas";
import { cn } from "@/lib/utils";
import { Icon } from "@/components/ui/Icon";

export type LeadFormServiceOption = { value: string; label: string };

type Props = {
  locale: Locale;
  services: LeadFormServiceOption[];
  /** Page path, so the operator knows which page generated the lead. */
  source: string;
  phoneDisplay: string;
  phoneHref: string;
  className?: string;
};

type Status = "idle" | "submitting" | "success" | "error";

const FIELD =
  "w-full border-b border-line bg-transparent py-2.5 text-[1rem] outline-none transition-colors placeholder:text-faint focus:border-accent";
const LABEL = "block text-[0.7rem] font-semibold uppercase tracking-[0.16em] text-muted";

/**
 * Short intake form: name, phone, email, service, brief description,
 * SMS consent. Honeypot + fill-time check for spam.
 */
export function LeadForm({ locale, services, source, phoneDisplay, phoneHref, className }: Props) {
  const t = useTranslations("form");
  const [status, setStatus] = useState<Status>("idle");
  const startedAt = useRef<number | null>(null);

  // Fill-time capture for the spam heuristic (must not run during render).
  useEffect(() => {
    startedAt.current = Date.now();
  }, []);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (status === "submitting") return;
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());
    setStatus("submitting");
    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          consentSms: data.consentSms === "on",
          locale,
          source,
          ...(startedAt.current !== null
            ? { elapsedMs: Date.now() - startedAt.current }
            : {}),
        }),
      });
      if (!res.ok) throw new Error(String(res.status));
      setStatus("success");
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className={cn("border border-accent/40 bg-accent-soft/50 p-8", className)}>
        <span className="grid size-11 place-items-center rounded-full bg-accent text-ink">
          <Icon name="check" className="size-5" strokeWidth={2} />
        </span>
        <h3 className="text-display-3 mt-5">{t("successTitle")}</h3>
        <p className="mt-3 leading-relaxed text-muted">{t("successBody")}</p>
        <a
          href={phoneHref}
          className="data mt-6 inline-flex items-center gap-2.5 text-xl font-semibold text-primary hover:text-accent-ink"
        >
          <Icon name="phone" className="size-5 text-accent" />
          {phoneDisplay}
        </a>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className={cn("@container space-y-6", className)} noValidate={false}>
      {/* Honeypot: hidden from humans, tempting to bots */}
      <div className="absolute -left-[9999px]" aria-hidden="true">
        <label>
          Company
          <input type="text" name="company" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      <div className="grid gap-6 @md:grid-cols-2">
        <div className="min-w-0">
          <label htmlFor="lead-name" className={LABEL}>
            {t("name")} *
          </label>
          <input id="lead-name" name="name" required autoComplete="name" className={FIELD} />
        </div>
        <div className="min-w-0">
          <label htmlFor="lead-phone" className={LABEL}>
            {t("phone")} *
          </label>
          <input
            id="lead-phone"
            name="phone"
            type="tel"
            required
            autoComplete="tel"
            className={FIELD}
          />
        </div>
      </div>

      <div className="grid gap-6 @md:grid-cols-2">
        <div className="min-w-0">
          <label htmlFor="lead-email" className={LABEL}>
            {t("email")}
          </label>
          <input id="lead-email" name="email" type="email" autoComplete="email" className={FIELD} />
        </div>
        <div className="min-w-0">
          <label htmlFor="lead-service" className={LABEL}>
            {t("service")}
          </label>
          <select id="lead-service" name="service" defaultValue="" className={cn(FIELD, "cursor-pointer truncate pr-7")}>
            <option value="" disabled>
              {t("servicePlaceholder")}
            </option>
            {services.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
            <option value="other">{t("other")}</option>
          </select>
        </div>
      </div>

      <div>
        <label htmlFor="lead-message" className={LABEL}>
          {t("message")}
        </label>
        <textarea
          id="lead-message"
          name="message"
          rows={4}
          placeholder={t("messagePlaceholder")}
          className={cn(FIELD, "resize-none leading-relaxed")}
        />
      </div>

      <label className="flex items-start gap-3 text-xs leading-relaxed text-faint">
        <input type="checkbox" name="consentSms" className="mt-0.5 size-4 accent-(--brand-accent)" />
        {t("smsConsent")}
      </label>

      {status === "error" ? (
        <p className="border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-800" role="alert">
          {t("errorGeneric")}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={status === "submitting"}
        className="inline-flex w-full items-center justify-center gap-2.5 bg-primary px-7 py-4 text-base font-medium text-inverse transition-colors hover:bg-primary-deep disabled:opacity-60"
      >
        {status === "submitting" ? t("submitting") : t("submit")}
        <Icon name="arrow-right" className="size-4" />
      </button>
    </form>
  );
}
