import { Children, isValidElement, type ReactElement, type ReactNode } from 'react';
import ResponsiveImage from '@/components/ui/ResponsiveImage';
import SmartLink from '@/components/ui/SmartLink';
import type { MediaImage } from '@/lib/types';
import { Prose } from './Text';

interface CardProps {
  href: string;
  title?: string;
  image?: MediaImage;
  /** Text of the underlined link at the bottom of the card. */
  linkText?: string;
  children?: ReactNode;
}

/** Linked card with an image, title and optional Markdown summary. */
export function Card({ href, title, image, linkText = 'Learn more', children }: CardProps) {
  return (
    <SmartLink href={href} className="flex group">
      <div className="block bg-white shadow-md rounded border-t border-gray-light overflow-hidden w-full hover:shadow-xl">
        <ResponsiveImage image={image} className="object-cover object-center aspect-[3/2]" />
        <div className="flow copy p-6">
          <h2 className="font-bold mt-0 text-24 leading-normal border-b border-shade-t40 pb-4 mb-4">{title}</h2>
          <div className="flow">{children && <Prose>{children}</Prose>}</div>
          <div className="inline-block text-orange border-b border-transparent group-hover:border-orange">
            <div className="inline-block border-b border-orange">{linkText}</div>
          </div>
        </div>
      </div>
    </SmartLink>
  );
}

/** Markdown shown under the heading of a `CardGrid`. */
export function CardGridIntro({ children }: { children: ReactNode }) {
  return <Prose>{children}</Prose>;
}

interface CardGridProps {
  /** Columns on desktop. */
  columns?: 3 | 4;
  heading?: string;
  centered?: boolean;
  /** Tinted full-width band (used with a heading). */
  shaded?: boolean;
  /** Constrain the grid to the page container (landing pages). */
  contained?: boolean;
  id?: string;
  children: ReactNode;
}

/** Grid of `Card`s, optionally with a heading and intro. */
export default function CardGrid({ columns = 3, heading, centered = false, shaded = false, contained = false, id, children }: CardGridProps) {
  const items = Children.toArray(children);
  const intro = items.find((c) => isValidElement(c) && c.type === CardGridIntro) as ReactElement | undefined;
  const cards = items.filter((c) => c !== intro);

  const grid =
    columns === 4 ? (
      <div className="grid gap-6 grid-cols-1 tp:grid-cols-2 tp:grid-flow-row tp:gap-8 tl:grid-cols-3 dt:grid-cols-4">{cards}</div>
    ) : (
      <div className="grid gap-6 grid-cols-1 tp:grid-cols-2 tp:grid-flow-row tp:gap-8 tl:grid-cols-3  ">{cards}</div>
    );

  if (shaded || heading) {
    return (
      <div id={id} className={shaded ? 'pt-content-blocks bg-shade-t20 my-6 tp:my-12 dt:my-16' : 'pt-content-blocks my-6 tp:my-12 dt:my-16'} role="presentation">
        <div className="py-6 tp:py-12 dt:py-16 container" role="presentation">
          <div>
            <div className={centered ? 'mb-12 tp:mb-14 dt:mb-18 text-center' : 'mb-12 tp:mb-14 dt:mb-18'}>
              <h2 className="text-48 tp:text-60">{heading}</h2>
              {intro && <div className="flow text-21 tp:text-24">{intro}</div>}
            </div>
          </div>
          <div>{grid}</div>
        </div>
      </div>
    );
  }

  return (
    <div id={id} className="pt-content-blocks my-6 tp:my-12 dt:my-16" role="presentation">
      <div role="presentation">{contained ? <div className="container">{grid}</div> : <div>{grid}</div>}</div>
    </div>
  );
}
