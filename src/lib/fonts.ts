import { Archivo, Inter, IBM_Plex_Mono } from "next/font/google";
import type { CSSProperties } from "react";

/**
 * Brand typography, the "Dispatch" pinned trio:
 *   Archivo        -> display (H1-H3, figures), industrial-confident grotesque
 *   Inter          -> body/UI, operational and highly legible
 *   IBM Plex Mono  -> the "readout" language (phone numbers, live-status
 *                     lines, eyebrows-as-log-labels, process-step numerals,
 *                     stats). All fontPair keys resolve to this trio.
 */
const archivo = Archivo({
  subsets: ["latin"],
  weight: ["600", "700", "800"],
  variable: "--font-archivo",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-inter",
  display: "swap",
});

const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["500", "600"],
  variable: "--font-plex-mono",
  display: "swap",
});

const PAIR = {
  display: archivo,
  body: inter,
  mono: plexMono,
  displayVar: "--font-archivo",
  bodyVar: "--font-inter",
  monoVar: "--font-plex-mono",
} as const;

export function getFontTheme(): {
  className: string;
  style: CSSProperties;
} {
  return {
    // .variable is a className that defines the font's CSS custom property.
    className: `${PAIR.display.variable} ${PAIR.body.variable} ${PAIR.mono.variable}`,
    // globals.css consumes these indirections for font-display/font-sans/font-mono.
    style: {
      "--font-display-active": `var(${PAIR.displayVar})`,
      "--font-body-active": `var(${PAIR.bodyVar})`,
      "--font-mono-active": `var(${PAIR.monoVar})`,
    } as CSSProperties,
  };
}
