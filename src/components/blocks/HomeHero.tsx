import type { ReactNode } from 'react';
import ResponsiveImage from '@/components/ui/ResponsiveImage';
import type { MediaImage } from '@/lib/types';
import { Prose } from './Text';

interface HomeHeroProps {
  title: string;
  eyebrow?: string;
  image: MediaImage;
  children?: ReactNode;
}

/** Full-bleed hero with an overlapping text card, used on the home page. */
export default function HomeHero({ title, eyebrow, image, children }: HomeHeroProps) {
  return (
    <div>
      <div className="relative">
        <ResponsiveImage
          image={image}
          priority
          className="object-cover object-center aspect-[3:2] dt:absolute dt:object-cover dt:h-full dt:w-9/16 dt:top-0 dt:right-0"
        />
        <div className="dt:bg-shade-t60 dt:py-32">
          <div className="dt:container">
            <div className="copy relative p-4 bg-shade-t60 tp:p-8 dt:p-0 dt:bg-transparent dt:w-9/16">
              <div className="bg-white p-4 -mt-12 tp:p-8 tp:-mt-24 dt:mt-0 dt:py-16 dt:px-20">
                <div className="tp:w-3/4 dt:w-full">
                  {eyebrow && <div className="text-14 text-blue uppercase font-medium mb-2 tp:text-16">{eyebrow}</div>}
                  <h1 className="text-36 h-ul font-bold mb-0 tp:text-72">{title}</h1>
                  {children && (
                    <div className="flow text-20 mt-4 tp:text-24">
                      <Prose>{children}</Prose>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
