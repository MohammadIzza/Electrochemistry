'use client';

import { usePathname } from 'next/navigation';
import { useEffect } from 'react';

/**
 * Sets `sizes` on responsive images (`data-sizes="auto"`) to their rendered width,
 * so the browser picks the smallest suitable variant — the same thing the theme's
 * lazysizes script did. (Native `sizes="auto"` is avoided on purpose: browsers then
 * apply `contain: size`, which squashes portrait images to their width/height attributes.)
 */
export default function AutoSizes() {
  const pathname = usePathname();

  useEffect(() => {
    const update = () => {
      document.querySelectorAll<HTMLImageElement>('img[data-sizes="auto"]').forEach((img) => {
        const width = img.offsetWidth;
        if (width > 0) img.sizes = `${Math.round(width)}px`;
      });
    };
    update();
    const observer = new MutationObserver(update);
    observer.observe(document.body, { childList: true, subtree: true });
    window.addEventListener('resize', update);
    return () => {
      observer.disconnect();
      window.removeEventListener('resize', update);
    };
  }, [pathname]);

  return null;
}
