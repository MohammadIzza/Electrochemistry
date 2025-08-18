'use client';

import Link from 'next/link';
import { useEffect, useId, useRef, useState } from 'react';
import type { NavLink } from '@/lib/types';

interface NavDropdownProps {
  label: string;
  ariaLabel: string;
  links: NavLink[];
}

/** Small "By Category" style dropdown menu. */
export default function NavDropdown({ label, ariaLabel, links }: NavDropdownProps) {
  const [open, setOpen] = useState(false);
  const id = `nds-${useId().replace(/:/g, '')}`;
  const toggler = useRef<HTMLButtonElement>(null);
  const menu = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!open) return;
    const inside = (target: EventTarget | null) =>
      target === toggler.current || (target instanceof Node && menu.current?.contains(target));
    const onClick = (e: MouseEvent) => {
      if (!inside(e.target)) setOpen(false);
    };
    const onFocus = (e: FocusEvent) => {
      if (!inside(e.target)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false);
        toggler.current?.focus();
      }
    };
    document.addEventListener('click', onClick, true);
    document.addEventListener('focus', onFocus, true);
    document.addEventListener('keydown', onKey, true);
    return () => {
      document.removeEventListener('click', onClick, true);
      document.removeEventListener('focus', onFocus, true);
      document.removeEventListener('keydown', onKey, true);
    };
  }, [open]);

  return (
    <div className="nds relative" data-id="nav-dropdown--simple">
      <button
        ref={toggler}
        className={`expander expander--bordered expander--r-2 w-full rounded bg-white border border-shade-t60 text-16 text-left text-shade-s40 font-medium pl-3 py-2 dt:mb-0 dt:text-14${open ? ' expander--active' : ''}`}
        aria-controls={id}
        aria-expanded={open}
        onClick={() => setOpen(!open)}
      >
        {label}
      </button>
      <nav
        ref={menu}
        id={id}
        className={`absolute bg-white shadow-md border border-shade-t40 rounded text-14 font-medium w-40${open ? '' : ' hidden'} z-20 dt:w-48 dt:mt-4 right-0`}
        aria-label={ariaLabel}
      >
        <ul>
          {links.map((link) => (
            <li key={link.href}>
              <Link href={link.href} hrefLang="en">
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}
