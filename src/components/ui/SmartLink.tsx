import Link from 'next/link';
import type { AnchorHTMLAttributes } from 'react';
import { isExternal } from '@/lib/navigation';

type SmartLinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & { href: string };

/** Uses client-side navigation for internal links and a plain anchor otherwise. */
export default function SmartLink({ href, children, ...rest }: SmartLinkProps) {
  if (isExternal(href) || href.startsWith('#') || href.startsWith('data:') || /\.(pdf|png|jpe?g|webp|gif|svg)$/i.test(href)) {
    return (
      <a href={href} {...rest}>
        {children}
      </a>
    );
  }
  return (
    <Link href={href} {...rest}>
      {children}
    </Link>
  );
}
