type Props = {
  data: Record<string, unknown> | Array<Record<string, unknown>>;
};

/** Renders a JSON-LD script tag (XSS-safe serialization). */
export function JsonLd({ data }: Props) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, "\\u003c"),
      }}
    />
  );
}
