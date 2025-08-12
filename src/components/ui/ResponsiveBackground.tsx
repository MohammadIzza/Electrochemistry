'use client';

import { useEffect, useRef } from 'react';
import { IMAGE_WIDTHS, variantUrl } from '@/lib/images';

interface ResponsiveBackgroundProps {
  /** Image path relative to /public/media. */
  image: string;
  className?: string;
  gradient?: string;
}

/** Picks the image variant matching the element's width and pixel density. */
function pickWidth(elementWidth: number, dpr: number): number {
  let width: number = IMAGE_WIDTHS[IMAGE_WIDTHS.length - 1];
  for (const w of IMAGE_WIDTHS) {
    if (elementWidth < w) {
      width = w;
      if (dpr === 2) {
        if (width <= 1200) width *= 2;
        if (width === 1800) width = 2400;
      }
      if (dpr >= 3) {
        if (width <= 600) width *= 3;
        if (width >= 900) width = 2400;
      }
      break;
    }
  }
  return width;
}

/** Element with a background image sized to fit, re-evaluated on resize. */
export default function ResponsiveBackground({ image, className, gradient }: ResponsiveBackgroundProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const apply = () => {
      const url = variantUrl(image, pickWidth(el.offsetWidth, window.devicePixelRatio));
      el.style.backgroundImage = `${gradient ? `${gradient}, ` : ''}url("${url}")`;
    };
    apply();
    window.addEventListener('resize', apply);
    return () => window.removeEventListener('resize', apply);
  }, [image, gradient]);

  return <div ref={ref} data-id="responsive-bg-img" className={className} />;
}
