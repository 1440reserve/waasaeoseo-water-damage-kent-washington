import { evaluate } from "@mdx-js/mdx";
import * as runtime from "react/jsx-runtime";
import remarkGfm from "remark-gfm";
import { mdxComponents } from "@/components/mdx/mdx-components";

type Props = {
  source: string;
  /** Extra components merged over the default MDX map. */
  components?: Record<string, React.ComponentType<never>>;
};

/**
 * Async server component that compiles + renders an MDX string at build
 * time (all pages are SSG). Content lives outside src/, so runtime
 * compilation via @mdx-js/mdx keeps the pipeline bundler-agnostic.
 */
export async function MdxContent({ source, components }: Props) {
  const { default: Content } = await evaluate(source, {
    ...(runtime as Record<string, unknown>),
    remarkPlugins: [remarkGfm],
  } as Parameters<typeof evaluate>[1]);

  return <Content components={{ ...mdxComponents, ...components }} />;
}
