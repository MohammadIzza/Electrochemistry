import type { ReactNode } from 'react';
import SmartLink from '@/components/ui/SmartLink';
import { isExternal } from '@/lib/navigation';

const VARIANTS = {
  /** Uppercase button with an arrow. */
  arrow: 'btn btn--arrow uppercase',
  /** Outlined button with an envelope icon. */
  envelope: 'btn btn--envelope btn--reverse',
  /** Plain filled button. */
  plain: 'btn',
} as const;

interface ButtonProps {
  href: string;
  children: ReactNode;
  variant?: keyof typeof VARIANTS;
  title?: string;
}

/** Call-to-action link styled as a button. */
export default function Button({ href, children, variant = 'plain', title }: ButtonProps) {
  return (
    <SmartLink className={VARIANTS[variant]} href={href} title={title}>
      {children}
      {isExternal(href) && !href.startsWith('mailto:') && <span className="is-external"></span>}
    </SmartLink>
  );
}
