import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/* ------------------------------------------------------------------ */
/* Container / Section: the layout rhythm of the whole system          */
/* ------------------------------------------------------------------ */
export function Container({
  children,
  className,
  wide = false,
}: {
  children: ReactNode;
  className?: string;
  wide?: boolean;
}) {
  return (
    <div
      className={cn(
        "mx-auto w-full px-5 sm:px-8",
        wide ? "max-w-[88rem]" : "max-w-[76rem]",
        className
      )}
    >
      {children}
    </div>
  );
}

export type SectionTone = "paper" | "soft" | "dark" | "wash";

const TONE_CLASSES: Record<SectionTone, string> = {
  paper: "bg-paper",
  soft: "bg-soft",
  dark: "dark-zone bg-wash-dark text-inverse",
  wash: "bg-wash",
};

export function Section({
  children,
  className,
  tone = "paper",
  id,
  bordered = false,
}: {
  children: ReactNode;
  className?: string;
  tone?: SectionTone;
  id?: string;
  bordered?: boolean;
}) {
  return (
    <section
      id={id}
      className={cn(
        "py-20 md:py-28",
        TONE_CLASSES[tone],
        bordered && "border-t border-line-soft",
        className
      )}
    >
      {children}
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* SectionHeading: eyebrow + display title (+ optional lede)           */
/* ------------------------------------------------------------------ */
export function SectionHeading({
  eyebrow,
  title,
  lede,
  dark = false,
  className,
}: {
  eyebrow?: string;
  title: string;
  lede?: string;
  dark?: boolean;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "mb-12 grid gap-6 md:mb-16 md:grid-cols-[1fr_auto] md:items-end",
        className
      )}
    >
      <div className="max-w-2xl">
        {eyebrow ? <p className="eyebrow mb-4">{eyebrow}</p> : null}
        <h2 className={cn("text-display-2", dark && "text-inverse")}>{title}</h2>
      </div>
      {lede ? (
        <p
          className={cn(
            "max-w-md text-base leading-relaxed md:pb-1.5",
            dark ? "text-inverse-muted" : "text-muted"
          )}
        >
          {lede}
        </p>
      ) : null}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Star rating                                                         */
/* ------------------------------------------------------------------ */
export function Stars({
  rating,
  className,
}: {
  rating: number;
  className?: string;
}) {
  return (
    <span
      className={cn("inline-flex items-center gap-0.5 text-accent", className)}
      role="img"
      aria-label={`${rating} / 5`}
    >
      {Array.from({ length: 5 }, (_, i) => (
        <svg
          key={i}
          viewBox="0 0 24 24"
          className={cn("size-4", i < Math.round(rating) ? "opacity-100" : "opacity-25")}
          fill="currentColor"
          aria-hidden="true"
        >
          <path d="m12 3.5 2.5 5.3 5.8.7-4.3 4 1.1 5.7L12 16.4l-5.1 2.8L8 13.5l-4.3-4 5.8-.7L12 3.5Z" />
        </svg>
      ))}
    </span>
  );
}

/* ------------------------------------------------------------------ */
/* Accordion item: native <details>, zero JS, content in DOM for SEO   */
/* ------------------------------------------------------------------ */
export function AccordionItem({
  question,
  children,
  defaultOpen = false,
}: {
  question: string;
  children: ReactNode;
  defaultOpen?: boolean;
}) {
  return (
    <details
      className="group border-b border-line-soft"
      open={defaultOpen || undefined}
    >
      <summary className="flex items-center justify-between gap-6 py-5 text-left font-display text-lg font-medium tracking-tight transition-colors hover:text-primary">
        {question}
        <span className="grid size-8 shrink-0 place-items-center rounded-full border border-line text-muted transition-transform duration-300 group-open:rotate-45">
          <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" aria-hidden="true">
            <path d="M12 5v14M5 12h14" />
          </svg>
        </span>
      </summary>
      <div className="pb-6 pr-10 leading-relaxed text-muted">{children}</div>
    </details>
  );
}
