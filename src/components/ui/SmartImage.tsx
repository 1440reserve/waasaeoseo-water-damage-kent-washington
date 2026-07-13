import Image from "next/image";
import type { ResolvedImage } from "@/lib/images";
import { isSvg } from "@/lib/images";

type Props = {
  image: ResolvedImage;
  alt: string;
  className?: string;
  sizes?: string;
  priority?: boolean;
  /** Optimizer quality (default 75). Drop for photos under heavy overlays. */
  quality?: number;
};

/**
 * next/image with build-time dimensions (zero CLS). SVGs skip the
 * optimizer (they're already resolution-independent).
 */
export function SmartImage({ image, alt, className, sizes, priority, quality }: Props) {
  return (
    <Image
      src={image.src}
      alt={alt}
      width={image.width}
      height={image.height}
      className={className}
      sizes={sizes}
      priority={priority}
      quality={quality}
      unoptimized={isSvg(image.src)}
      {...(priority ? { fetchPriority: "high" as const } : {})}
    />
  );
}
