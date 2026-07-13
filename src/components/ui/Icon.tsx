import { cn } from "@/lib/utils";

/**
 * Single inline-SVG icon set (stroke-based, geometric): no icon library
 * dependency, no layout shift, themeable via currentColor.
 * Domain icons match ICON_KEYS in lib/schemas.ts.
 */
const PATHS: Record<string, React.ReactNode> = {
  /* Water-damage domain icons */
  droplet: (
    <path d="M12 3.5c3.6 4.3 6 7.7 6 10.6a6 6 0 0 1-12 0c0-2.9 2.4-6.3 6-10.6Z" />
  ),
  waves: (
    <>
      <path d="M3 8c1.5-1.6 3-1.6 4.5 0s3 1.6 4.5 0 3-1.6 4.5 0 3 1.6 4.5 0" />
      <path d="M3 12.5c1.5-1.6 3-1.6 4.5 0s3 1.6 4.5 0 3-1.6 4.5 0 3 1.6 4.5 0" />
      <path d="M3 17c1.5-1.6 3-1.6 4.5 0s3 1.6 4.5 0 3-1.6 4.5 0 3 1.6 4.5 0" />
    </>
  ),
  pipe: (
    <>
      <path d="M4 6h6a6 6 0 0 1 6 6v6" />
      <path d="M4 10h6a2 2 0 0 1 2 2v6" />
      <path d="M4 4v8M12 18h8" />
    </>
  ),
  mold: (
    <>
      <circle cx="9.5" cy="10" r="4.5" />
      <circle cx="16" cy="14.5" r="3" />
      <circle cx="9" cy="17.5" r="1.7" />
      <path d="M17 6.5h.01M19.5 9.5h.01" />
    </>
  ),
  storm: (
    <>
      <path d="M7 14.5a4 4 0 0 1-.4-8A5.5 5.5 0 0 1 17.3 7.7 3.6 3.6 0 0 1 18 14.8" />
      <path d="m12.5 11.5-2.5 4.5h3.5L11 20.5" />
    </>
  ),
  snowflake: (
    <>
      <path d="M12 3v18M4.2 7.5l15.6 9M19.8 7.5l-15.6 9" />
      <path d="M12 3l-2 2M12 3l2 2M12 21l-2-2M12 21l2-2" />
    </>
  ),
  home: (
    <>
      <path d="m4 11 8-7 8 7" />
      <path d="M6 9.5V20h12V9.5M10 20v-5h4v5" />
    </>
  ),
  building: (
    <>
      <path d="M5 20.5V4.5h9v16M14 8.5h5v12M5 20.5h16" />
      <path d="M8 8h3M8 11.5h3M8 15h3M16.5 11.5h.01M16.5 15h.01" />
    </>
  ),
  truck: (
    <>
      <path d="M3 7h11v10H3V7Z" />
      <path d="M14 10.5h3.5L21 14v3h-7" />
      <circle cx="7" cy="17.5" r="1.8" />
      <circle cx="17" cy="17.5" r="1.8" />
    </>
  ),
  wrench: (
    <>
      <path d="M20.5 6.7a4.6 4.6 0 0 1-6.1 5.6l-6.8 6.8a2 2 0 0 1-2.8-2.8l6.8-6.8a4.6 4.6 0 0 1 5.6-6.1l-2.9 2.9 3.3 3.3 2.9-2.9Z" />
    </>
  ),
  alert: (
    <>
      <path d="M12 4 2.8 19.5h18.4L12 4Z" />
      <path d="M12 10v4.5M12 17.5h.01" />
    </>
  ),
  fan: (
    <>
      <circle cx="12" cy="12" r="2" />
      <path d="M12 10c0-3-1-6-4-6a3 3 0 0 0 0 6h4ZM14 12c3 0 6-1 6-4a3 3 0 0 0-6 0v4ZM12 14c0 3 1 6 4 6a3 3 0 0 0 0-6h-4ZM10 12c-3 0-6 1-6 4a3 3 0 0 0 6 0v-4Z" />
    </>
  ),
  /* Generic icons */
  shield: (
    <>
      <path d="M12 3 5 6v5c0 4.5 3 8.2 7 10 4-1.8 7-5.5 7-10V6l-7-3Z" />
      <path d="m9 11.5 2 2 4-4.5" />
    </>
  ),
  clock: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 7v5l3.5 2" />
    </>
  ),
  document: (
    <>
      <path d="M6 3.5h8l4 4V20.5H6V3.5Z" />
      <path d="M14 3.5v4h4M9 12h6M9 15.5h6" />
    </>
  ),
  clipboard: (
    <>
      <rect x="5" y="4.5" width="14" height="16" rx="1.5" />
      <path d="M9 4.5V3h6v1.5M9 10.5h6M9 14h6M9 17.5h3.5" />
    </>
  ),
  activity: <path d="M3 12h4l2.5-6 4 12 2.5-6h5" />,
  /* UI glyphs */
  "arrow-right": <path d="M4 12h16m0 0-6-6m6 6-6 6" />,
  "arrow-up-right": <path d="M7 17 17 7m0 0H8m9 0v9" />,
  phone: (
    <path d="M5 4h4l1.5 4.5-2 1.5a12 12 0 0 0 5.5 5.5l1.5-2L20 15v4a1.5 1.5 0 0 1-1.7 1.5C10.5 19.6 4.4 13.5 3.5 5.7A1.5 1.5 0 0 1 5 4Z" />
  ),
  mail: (
    <>
      <rect x="3.5" y="5.5" width="17" height="13" rx="1.5" />
      <path d="m4 7 8 6 8-6" />
    </>
  ),
  "map-pin": (
    <>
      <path d="M12 21s7-5.8 7-11a7 7 0 1 0-14 0c0 5.2 7 11 7 11Z" />
      <circle cx="12" cy="10" r="2.5" />
    </>
  ),
  star: (
    <path d="m12 3.5 2.5 5.3 5.8.7-4.3 4 1.1 5.7L12 16.4l-5.1 2.8L8 13.5l-4.3-4 5.8-.7L12 3.5Z" />
  ),
  quote: (
    <path d="M5 16.5c-.8-1-1.5-2.4-1.5-4.2C3.5 8.6 6 6 9 5l.7 1.5c-1.8 1-2.6 2.3-2.7 3.7 1.7 0 3 1.3 3 3.1a3.1 3.1 0 0 1-5 3.2Zm9.5 0c-.8-1-1.5-2.4-1.5-4.2 0-3.7 2.5-6.3 5.5-7.3l.7 1.5c-1.8 1-2.6 2.3-2.7 3.7 1.7 0 3 1.3 3 3.1a3.1 3.1 0 0 1-5 3.2Z" />
  ),
  menu: <path d="M4 7h16M4 12h16M4 17h16" />,
  close: <path d="m6 6 12 12M18 6 6 18" />,
  "chevron-down": <path d="m6 9.5 6 6 6-6" />,
  check: <path d="m5 12.5 4.5 4.5L19 7.5" />,
  plus: <path d="M12 5v14M5 12h14" />,
};

export type IconName = keyof typeof PATHS & string;

type Props = {
  name: string;
  className?: string;
  strokeWidth?: number;
};

export function Icon({ name, className, strokeWidth = 1.5 }: Props) {
  const glyph = PATHS[name] ?? PATHS.droplet;
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={cn("size-5", className)}
    >
      {glyph}
    </svg>
  );
}
