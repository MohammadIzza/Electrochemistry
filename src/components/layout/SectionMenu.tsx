'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { normalizePath } from '@/lib/navigation';
import type { NavItem } from '@/lib/types';

/** Matches the theme's `tp` breakpoint (tablet portrait). */
const TABLET_MIN_WIDTH = 600;

function slugify(label: string) {
  return label.toLowerCase().replace(/&/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

function MenuLink({ item, level, pathname }: { item: NavItem; level: number; pathname: string }) {
  const active = item.href && normalizePath(item.href) === normalizePath(pathname);
  return (
    <span data-menu-level={level} data-item-below={item.children?.length ? 'true' : 'false'}>
      <Link
        href={item.href ?? '#'}
        className={active ? 'menu-standalone__link is-active' : 'menu-standalone__link'}
        aria-current={active ? 'page' : undefined}
      >
        {item.label}
      </Link>
    </span>
  );
}

interface SectionMenuProps {
  items: NavItem[];
  /** `horizontal` is the sticky dropdown used on landing pages. */
  variant?: 'sidebar' | 'horizontal';
}

/** "In This Section" menu listing the pages of the current section. */
export default function SectionMenu({ items, variant = 'sidebar' }: SectionMenuProps) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const toggle = () => {
    const next = !open;
    setOpen(next);
    if (next && window.innerWidth < TABLET_MIN_WIDTH) {
      document.getElementById('region-sidebar-left')?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className={variant === 'horizontal' ? 'menu-standalone menu-standalone--sticky-dropdown' : 'menu-standalone '}>
      <div className="menu-standalone__heading px-6">In This Section</div>
      <div id="sectionMenuContainer" className="menu-standalone__inner">
        <button className="menu-standalone__toggler px-6" aria-controls="sectionMenu" aria-expanded={open} onClick={toggle}>
          <span className="visually-hidden">Show and hide menu items</span>
          <span className="w-full">In This Section</span>
          <span className="font-icon icon-chevron-down-regular leading-none" aria-hidden="true"></span>
        </button>
        <nav id="sectionMenu" aria-label="Section menu">
          <ul className="menu-standalone__list z-20 menu-standalone__list--parent">
            {items.map((item) => (
              <li className="menu-standalone__list-item" key={item.label}>
                <div className="menu-standalone__link-wrapper menu-standalone__link-wrapper--parent">
                  <MenuLink item={item} level={0} pathname={pathname} />
                </div>
                {item.children && (
                  <ul className="menu-standalone__list z-20 menu-standalone__list--child" id={`progeny-of-${slugify(item.label)}`}>
                    {item.children.map((child) => (
                      <li className="menu-standalone__list-item--child" key={child.label}>
                        <div className="menu-standalone__link-wrapper menu-standalone__link-wrapper--child">
                          <MenuLink item={child} level={1} pathname={pathname} />
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </div>
  );
}
