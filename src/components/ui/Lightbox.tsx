'use client';

import { usePathname } from 'next/navigation';
import { useEffect } from 'react';

/**
 * Opens images inside any `.lightbox` container in a PhotoSwipe gallery.
 * Rendered once in the root layout; re-binds after each navigation.
 */
export default function Lightbox() {
  const pathname = usePathname();

  useEffect(() => {
    if (!document.querySelector('.lightbox')) return;
    let destroyed = false;
    let lightbox: { destroy: () => void } | undefined;

    import('photoswipe/lightbox').then(({ default: PhotoSwipeLightbox }) => {
      if (destroyed) return;
      const instance = new PhotoSwipeLightbox({
        gallery: '.lightbox',
        children: 'a',
        pswpModule: () => import('photoswipe'),
      });
      instance.on('uiRegister', () => {
        instance.pswp?.ui?.registerElement({
          name: 'bulletsIndicator',
          className: 'pswp__bullets-indicator',
          appendTo: 'wrapper',
          onInit: (el, pswp) => {
            const bullets: HTMLDivElement[] = [];
            let prev = -1;
            for (let i = 0; i < pswp.getNumItems(); i++) {
              const bullet = document.createElement('div');
              bullet.className = 'pswp__bullet';
              bullet.onclick = (e) => pswp.goTo(bullets.indexOf(e.target as HTMLDivElement));
              el.appendChild(bullet);
              bullets.push(bullet);
            }
            pswp.on('change', () => {
              if (prev >= 0) bullets[prev].classList.remove('pswp__bullet--active');
              bullets[pswp.currIndex].classList.add('pswp__bullet--active');
              prev = pswp.currIndex;
            });
          },
        });
      });
      instance.init();
      lightbox = instance;
    });

    return () => {
      destroyed = true;
      lightbox?.destroy();
    };
  }, [pathname]);

  return null;
}
