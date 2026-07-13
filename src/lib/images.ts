import fs from "node:fs";
import path from "node:path";
import { imageSize } from "image-size";
import { CLIENT_ID } from "./site";

export type ResolvedImage = {
  src: string;
  width: number;
  height: number;
};

const cache = new Map<string, ResolvedImage>();

/**
 * Resolves an image reference from the client's assets/ folder into a
 * served URL (/client/...) plus intrinsic dimensions read at build time,
 * so every <Image> gets explicit width/height (CLS = 0 by construction).
 * Server/build only.
 */
export function resolveImage(ref: string): ResolvedImage {
  const cached = cache.get(ref);
  if (cached) return cached;

  const abs = path.join(process.cwd(), "clients", CLIENT_ID, "assets", ref);
  if (!fs.existsSync(abs)) {
    throw new Error(
      `Image "${ref}" not found in clients/${CLIENT_ID}/assets/. ` +
        `Check the reference in your config/frontmatter.`
    );
  }
  const { width, height } = imageSize(new Uint8Array(fs.readFileSync(abs)));
  if (!width || !height) {
    throw new Error(`Could not read dimensions of clients/${CLIENT_ID}/assets/${ref}`);
  }
  const resolved = { src: `/client/${ref}`, width, height };
  cache.set(ref, resolved);
  return resolved;
}

export function isSvg(ref: string): boolean {
  return ref.toLowerCase().endsWith(".svg");
}
