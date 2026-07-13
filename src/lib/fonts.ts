import { Source_Serif_4, Source_Sans_3 } from "next/font/google";
import type { CSSProperties } from "react";

/**
 * Brand typography, kept as the template's pinned pair: Source Serif 4 for
 * display (H1-H3, figures) and Source Sans 3 for body/UI. All fontPair
 * keys resolve to this pair.
 */
const sourceSerif = Source_Serif_4({
  subsets: ["latin"],
  weight: ["600", "700"],
  variable: "--font-source-serif",
  display: "swap",
});

const sourceSans = Source_Sans_3({
  subsets: ["latin"],
  weight: ["400", "600"],
  variable: "--font-source-sans",
  display: "swap",
});

const PAIR = {
  display: sourceSerif,
  body: sourceSans,
  displayVar: "--font-source-serif",
  bodyVar: "--font-source-sans",
} as const;

export function getFontTheme(): {
  className: string;
  style: CSSProperties;
} {
  return {
    // .variable is a className that defines the font's CSS custom property.
    className: `${PAIR.display.variable} ${PAIR.body.variable}`,
    // globals.css consumes these two indirections for font-display/font-sans.
    style: {
      "--font-display-active": `var(${PAIR.displayVar})`,
      "--font-body-active": `var(${PAIR.bodyVar})`,
    } as CSSProperties,
  };
}
