import GithubSlugger from "github-slugger";

export type TocItem = { text: string; id: string };

/**
 * Pull the H2 section headings out of an MDX source for an in-page table of
 * contents. Ids are generated with github-slugger, the same library
 * rehype-slug uses on the rendered headings, so the anchor links line up.
 * Only H2s are collected, matching the section structure of the guides.
 */
export function extractToc(source: string): TocItem[] {
  const slugger = new GithubSlugger();
  const items: TocItem[] = [];
  let inCode = false;
  for (const raw of source.split("\n")) {
    const line = raw.trim();
    if (line.startsWith("```")) {
      inCode = !inCode;
      continue;
    }
    if (inCode) continue;
    const m = line.match(/^##\s+(.+?)\s*#*$/);
    if (!m) continue;
    const text = m[1]
      .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1") // [text](url) -> text
      .replace(/[*_`]/g, "")
      .trim();
    items.push({ text, id: slugger.slug(text) });
  }
  return items;
}
