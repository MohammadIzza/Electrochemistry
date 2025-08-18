'use client';

import type { ReactNode } from 'react';

/** Makes a whole area clickable, navigating to `href` (like the theme's `data-link-to`). */
export default function LinkTo({ href, className, children }: { href: string; className?: string; children: ReactNode }) {
  return (
    <div
      data-link-to={href}
      className={className ? `${className} cursor-pointer` : 'cursor-pointer'}
      onClick={() => {
        window.location.href = href;
      }}
    >
      {children}
    </div>
  );
}
