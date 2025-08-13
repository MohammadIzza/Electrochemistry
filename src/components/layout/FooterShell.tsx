'use client';

import { usePathname } from 'next/navigation';
import type { ReactNode } from 'react';

/** Listing pages (news and events) leave extra space above the footer. */
const SPACED = [/^\/news(\/page\/\d+)?$/, /^\/events(\/past(\/page\/\d+)?|\/type\/[^/]+)?$/];

export default function FooterShell({ children }: { children: ReactNode }) {
  const pathname = usePathname().replace(/\/$/, '') || '/';
  const spaced = SPACED.some((re) => re.test(pathname));
  return <footer className={spaced ? 'bg-shade-s60 text-white mt-8 py-8' : 'bg-shade-s60 text-white py-8'}>{children}</footer>;
}
