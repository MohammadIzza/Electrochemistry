import { Children, isValidElement, type ReactElement, type ReactNode } from 'react';
import ResponsiveImage from '@/components/ui/ResponsiveImage';
import { mediaUrl } from '@/lib/images';
import type { MediaImage } from '@/lib/types';
import { Prose } from './Text';

/** Full-width rounded image; with `lightbox` it opens full size on click. */
export function Figure({ image, lightbox = false }: { image: MediaImage; lightbox?: boolean }) {
  if (lightbox) {
    return (
      <div>
        <div className="rounded mb-2 overflow-hidden lightbox">
          <LightboxLink image={image} />
        </div>
      </div>
    );
  }
  return (
    <div>
      <div className="rounded mb-2 overflow-hidden">
        <ResponsiveImage image={image} />
      </div>
    </div>
  );
}

function LightboxLink({ image }: { image: MediaImage }) {
  return (
    <a
      href={mediaUrl(image.src)}
      data-pswp-width={image.width}
      data-pswp-height={image.height}
      className="lightbox-image relative block"
    >
      <ResponsiveImage image={image} />
    </a>
  );
}

/** Grid of images that open in a lightbox. */
export function Gallery({ images, id }: { images: MediaImage[]; id?: string }) {
  return (
    <div id={id} className="pt-content-blocks my-6 tp:my-12 dt:my-16" role="presentation">
      <div role="presentation">
        <div className="grid gap-6 grid-cols-1 tp:grid-cols-2 tp:grid-flow-row tp:gap-8 tl:grid-cols-3 lightbox lightbox-macy">
          {images.map((image) => (
            <LightboxLink key={image.src} image={image} />
          ))}
        </div>
      </div>
    </div>
  );
}

/** Square image beside Markdown text. */
export function ImageText({ image, children }: { image: MediaImage; children: ReactNode }) {
  return (
    <div className="my-6 tp:my-12 tp:flex tp:space-x-8 dt:my-16 first:mt-0">
      <div className="mb-4 tp:mb-0 tp:w-6/16">
        <ResponsiveImage image={image} className="object-cover object-center rounded" />
      </div>
      <div className="tp:w-10/16">
        <Prose>{children}</Prose>
      </div>
    </div>
  );
}

/** Caption for a `FloatImage`. */
export function Caption({ children }: { children: ReactNode }) {
  return <Prose>{children}</Prose>;
}

/** Image floated left with Markdown text wrapping around it. */
export function FloatImage({ image, children }: { image: MediaImage; children: ReactNode }) {
  const items = Children.toArray(children);
  const caption = items.find((c) => isValidElement(c) && c.type === Caption) as ReactElement | undefined;
  const body = items.filter((c) => c !== caption);
  const img = <ResponsiveImage image={image} className="object-cover object-center rounded" />;
  return (
    <div className="cf">
      <div className="mb-4 tp:mb-0 tp:float-left tp:mr-6 tp:w-6/16">
        {caption ? (
          <figure>
            {img}
            <figcaption className="figcaption mt-2 text-right">{caption}</figcaption>
          </figure>
        ) : (
          img
        )}
      </div>
      <div>
        <Prose>{body}</Prose>
      </div>
    </div>
  );
}
