import type { ComponentProps, ReactNode } from "react";

/** GitHub-style anchor slugs for in-page linking from headings. */
function slugify(children: ReactNode): string {
  return String(children)
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}

function H2(props: ComponentProps<"h2">) {
  return <h2 id={slugify(props.children)} {...props} />;
}

function H3(props: ComponentProps<"h3">) {
  return <h3 id={slugify(props.children)} {...props} />;
}

/** Body copy must never introduce a second H1: demote to H2. */
function H1AsH2(props: ComponentProps<"h1">) {
  return <h2 id={slugify(props.children)} {...props} />;
}

/** External links open safely in a new tab. */
function A(props: ComponentProps<"a">) {
  const isExternal = /^https?:\/\//.test(props.href ?? "");
  return isExternal ? (
    <a target="_blank" rel="noopener noreferrer" {...props} />
  ) : (
    <a {...props} />
  );
}

/** Editorial callout for key facts / safety notes / deadlines. */
function Note({ title, children }: { title?: string; children: ReactNode }) {
  return (
    <aside className="my-8 border-l-2 border-accent bg-accent-soft/60 px-6 py-5 text-[0.97rem]">
      {title ? (
        <p className="eyebrow-bare mb-2 !text-[0.7rem]">{title}</p>
      ) : null}
      <div className="[&>*+*]:mt-2">{children}</div>
    </aside>
  );
}

/**
 * Components available inside every MDX file. Keep this map small:
 * content authors rely on it.
 */
export const mdxComponents = {
  h1: H1AsH2,
  h2: H2,
  h3: H3,
  a: A,
  Note,
};
