import type { ReactNode } from 'react';
import ResponsiveImage from '@/components/ui/ResponsiveImage';
import type { MediaImage } from '@/lib/types';
import { Prose } from './Text';

interface HighlighterProps {
  title: string;
  eyebrow?: string;
  /** One 4:3 image, or two 4:5 images shown as a decorated pair. */
  image?: MediaImage;
  images?: [MediaImage, MediaImage];
  /** Put the image on the right. */
  flip?: boolean;
  /** Tinted background band behind the image. */
  shaded?: boolean;
  children: ReactNode;
}

function Decoration({ color, className }: { color: 'blue' | 'orange'; className: string }) {
  return (
    <div className={`bg-${color} ${className}`} style={{ paddingTop: 'calc(7 / 8 * 100%)' }}>
      <div className="absolute top-0 left-0 w-full h-full"></div>
    </div>
  );
}

/** Large image-and-text feature row used on landing pages. */
export default function Highlighter({ title, eyebrow, image, images, flip = false, shaded = false, children }: HighlighterProps) {
  const pair = images?.length === 2;

  let rootClass: string;
  if (flip) {
    rootClass = 'highlighter--flip pt-6 tp:pt-12 relative tl:py-12 dt:py-16';
    if (shaded) rootClass += ' bg-no-repeat bg-clip-padding bg-opacity-50 highlighter--bg-shaded-flipped';
  } else if (shaded) {
    rootClass = 'highlighter pb-6 tp:pb-12 relative tl:py-12 dt:py-16 bg-no-repeat bg-clip-padding bg-opacity-50 highlighter--bg-shaded';
  } else {
    rootClass = 'highlighter relative my-6 tp:my-12 dt:my-16';
  }

  const imageColClass = flip ? 'mt-6 tl:m-0 tl:w-1/2' : pair || !shaded ? 'mb-6 tp:mb-12 dt:mb-0 tl:m-0 tl:w-1/2' : 'mb-6 tl:m-0 tl:w-1/2';
  const singleImageClass = flip
    ? 'object-cover object-center aspect-[4/3] relative z-10 pb-6 tp:pb-12 tl:pt-0 tl:pb-0'
    : 'object-cover object-center aspect-[4/3] relative z-10 pt-6 tp:pt-12 tl:pt-0 tl:pb-0';

  return (
    <div className={rootClass}>
      <div className="tl:container">
        <div
          className={
            flip
              ? 'flex flex-col tl:flex-row tl:items-center tl:space-x-24 flex-col-reverse tl:flex-row-reverse tl:space-x-reverse'
              : 'flex flex-col tl:flex-row tl:items-center tl:space-x-24'
          }
        >
          <div className={imageColClass}>
            {pair ? (
              <div className="highlighter__img relative px-4 tp:px-8 tl:static tl:px-0 tl:py-16x" data-id="image-container">
                <div className="grid grid-cols-2 gap-2 tp:gap-4 relative">
                  <div className="flex flex-col items-end">
                    <ResponsiveImage image={images![0]} className="object-cover object-center aspect-[4/5] mb-2 tp:mb-4" />
                    <Decoration color="blue" className="w-13/16 overflow-hidden h-0 relative" />
                  </div>
                  <div>
                    <Decoration color="orange" className="overflow-hidden h-0 relative mb-2 mt-4 tp:mt-8 tp:mb-4" />
                    <ResponsiveImage image={images![1]} className="object-cover object-center aspect-[4/5] w-3/4" />
                  </div>
                </div>
              </div>
            ) : (
              <div className="highlighter__img relative px-4 tp:px-8 tl:static tl:px-0" data-id="image-container">
                <ResponsiveImage image={image} className={singleImageClass} />
              </div>
            )}
          </div>
          <div className="py-6x px-4 tp:px-8 tl:px-0 tl:py-16x tl:w-1/2">
            {eyebrow && <div className="text-14 font-medium uppercase text-blue mb-2 tl:text-16">{eyebrow}</div>}
            <h2 className="text-36 tp:text-60">{title}</h2>
            <div className="flow text-18 tp:text-22">
              <Prose>{children}</Prose>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
