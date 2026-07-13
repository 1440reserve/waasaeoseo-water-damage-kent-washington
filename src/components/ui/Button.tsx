import type { ComponentProps, ReactNode } from "react";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
import { Icon } from "./Icon";

type Variant = "primary" | "accent" | "outline" | "outline-inverse" | "ghost";
type Size = "md" | "lg";

const BASE =
  "group/btn inline-flex items-center justify-center gap-2.5 rounded-[3px] font-medium tracking-wide transition-all duration-300 whitespace-nowrap";

const VARIANTS: Record<Variant, string> = {
  primary:
    "bg-primary text-inverse hover:bg-primary-deep shadow-[0_1px_0_rgba(0,0,0,0.15)]",
  accent: "bg-accent text-ink hover:brightness-105",
  outline: "border border-line text-ink hover:border-accent hover:text-primary",
  "outline-inverse":
    "border border-inverse/30 text-inverse hover:border-accent hover:text-accent",
  ghost: "text-primary hover:text-accent px-0",
};

const SIZES: Record<Size, string> = {
  md: "px-5 py-2.5 text-[0.9rem]",
  lg: "px-7 py-3.5 text-base",
};

type CommonProps = {
  variant?: Variant;
  size?: Size;
  withArrow?: boolean;
  className?: string;
  children: ReactNode;
};

function inner(children: ReactNode, withArrow: boolean) {
  return (
    <>
      {children}
      {withArrow ? (
        <Icon
          name="arrow-right"
          className="size-4 transition-transform duration-300 group-hover/btn:translate-x-1"
        />
      ) : null}
    </>
  );
}

type LinkHref = ComponentProps<typeof Link>["href"];

export function ButtonLink({
  href,
  variant = "primary",
  size = "md",
  withArrow = false,
  className,
  children,
}: CommonProps & { href: LinkHref }) {
  return (
    <Link
      href={href}
      className={cn(BASE, VARIANTS[variant], SIZES[size], className)}
    >
      {inner(children, withArrow)}
    </Link>
  );
}

/** For external/tel/mailto targets. */
export function ButtonAnchor({
  href,
  variant = "primary",
  size = "md",
  withArrow = false,
  className,
  children,
  ...rest
}: CommonProps & { href: string } & Omit<ComponentProps<"a">, "href" | "className" | "children">) {
  return (
    <a
      href={href}
      className={cn(BASE, VARIANTS[variant], SIZES[size], className)}
      {...rest}
    >
      {inner(children, withArrow)}
    </a>
  );
}

export function Button({
  variant = "primary",
  size = "md",
  withArrow = false,
  className,
  children,
  ...rest
}: CommonProps & Omit<ComponentProps<"button">, "className" | "children">) {
  return (
    <button
      className={cn(BASE, VARIANTS[variant], SIZES[size], className)}
      {...rest}
    >
      {inner(children, withArrow)}
    </button>
  );
}
