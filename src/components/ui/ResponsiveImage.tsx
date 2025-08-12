import { IMAGE_WIDTHS, mediaUrl, srcSet } from '@/lib/images';
import type { MediaImage } from '@/lib/types';

interface ResponsiveImageProps extends Partial<MediaImage> {
  image?: MediaImage;
  className?: string;
  widths?: readonly number[];
  /** Set to false for images whose variants are not WebP (directory portraits). */
  webp?: boolean;
  /** Load immediately, e.g. for the hero image above the fold. */
  priority?: boolean;
}

/**
 * Lazy-loaded responsive image. `AutoSizes` fills in `sizes` with the rendered
 * width so the browser picks the best pre-generated variant.
 */
export default function ResponsiveImage({
  image,
  src = image?.src,
  alt = image?.alt ?? '',
  width = image?.width,
  height = image?.height,
  className = 'object-cover object-center',
  widths = IMAGE_WIDTHS,
  webp = true,
  priority = false,
}: ResponsiveImageProps) {
  if (!src) return null;
  const set = srcSet(src, widths, { webp });
  return (
    // eslint-disable-next-line @next/next/no-img-element -- images ship pre-resized
    <img
      src={mediaUrl(src)}
      srcSet={set || undefined}
      data-sizes={set ? 'auto' : undefined}
      loading={priority ? 'eager' : 'lazy'}
      decoding="async"
      className={className}
      width={width}
      height={height}
      alt={alt}
    />
  );
}
