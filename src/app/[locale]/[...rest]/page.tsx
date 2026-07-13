import { notFound } from "next/navigation";

/** Catch-all: any unmatched path renders the branded [locale] 404. */
export default function CatchAllPage() {
  notFound();
}
