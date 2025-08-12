/**
 * Image URL helpers.
 *
 * Originals live in /public/media/<path>. Resized WebP variants live in
 * /public/media/styles/<width>w/public/<path>.webp and are produced by
 * `npm run images` (scripts/generate-images.mjs) for any image that lacks them.
 */

/** Widths generated for content images. */
export const IMAGE_WIDTHS = [300, 600, 900, 1200, 1800, 2400] as const;

/** Widths generated for directory portraits. */
export const PORTRAIT_WIDTHS = [200, 400, 600] as const;

function clean(path: string): string {
  return path.replace(/^\/?(media\/)?/, '');
}

function encode(path: string): string {
  return path.split('/').map(encodeURIComponent).join('/');
}

/** Public URL of an original image. Absolute URLs are returned unchanged. */
export function mediaUrl(path: string): string {
  if (/^https?:\/\//.test(path)) return path;
  return `/media/${encode(clean(path))}`;
}

/** Public URL of the resized WebP variant of an image. */
export function variantUrl(path: string, width: number, { webp = true } = {}): string {
  return `/media/styles/${width}w/public/${encode(clean(path))}${webp ? '.webp' : ''}`;
}

/** `srcset` attribute listing every resized variant of an image. */
export function srcSet(path: string, widths: readonly number[] = IMAGE_WIDTHS, options?: { webp?: boolean }): string {
  if (/^https?:\/\//.test(path)) return '';
  return widths.map((w) => `${variantUrl(path, w, options)} ${w}w`).join(', ');
}
