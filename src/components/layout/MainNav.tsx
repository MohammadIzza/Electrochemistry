'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Fragment, useCallback, useEffect, useRef, useState } from 'react';
import { activeTopItem, normalizePath, submenuId } from '@/lib/navigation';
import type { NavItem } from '@/lib/types';

/** Matches the theme's `dt` breakpoint (desktop). */
const DESKTOP_MIN_WIDTH = 1200;

function cx(...classes: (string | false | undefined)[]) {
  return classes.filter(Boolean).join(' ');
}

interface SubmenuProps {
  items: NavItem[];
  level: number;
  id: string;
  className: string;
  pathname: string;
}

function Submenu({ items, level, id, className, pathname }: SubmenuProps) {
  return (
    <ul className={className} id={id} data-menu-level={level}>
      {items.map((item, index) => {
        const active = item.href && normalizePath(item.href) === normalizePath(pathname);
        const wrapper = item.children
          ? 'flex py-4 border-b-3 border-shade-t40'
          : cx('flex py-4 border-shade-t40', index > 0 ? 'border-t' : '');
        return (
          <li className="" key={item.label}>
            <div className={index === 0 && !item.children ? `${wrapper} ` : wrapper} menu-level={level}>
              <div className="flex items-center">
                {item.href && (
                  <Link
                    href={item.href}
                    className={cx('dt:hover:text-orange', active && 'is-active')}
                    aria-current={active ? 'page' : undefined}
                  >
                    {item.label}
                  </Link>
                )}
              </div>
            </div>
            {item.children && (
              <Submenu
                items={item.children}
                level={level + 1}
                id={submenuId(item.label)}
                className="list-none ml-0"
                pathname={pathname}
              />
            )}
          </li>
        );
      })}
    </ul>
  );
}

/**
 * Main menu with dropdowns on desktop and a slide-in panel on mobile.
 * Keyboard and click-outside behaviour matches the original theme script.
 */
export default function MainNav({ items }: { items: NavItem[] }) {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [innerVisible, setInnerVisible] = useState(false);
  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null);
  const togglerRef = useRef<HTMLButtonElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const openMenu = useCallback(() => {
    setInnerVisible(true);
    setMenuOpen(true);
  }, []);

  const closeMenu = useCallback(() => {
    setMenuOpen(false);
    setOpenSubmenu(null);
  }, []);

  // The panel content is hidden after the 250ms slide-out transition.
  useEffect(() => {
    if (menuOpen) return;
    const t = setTimeout(() => setInnerVisible(false), 250);
    return () => clearTimeout(t);
  }, [menuOpen]);

  // Close everything on navigation.
  useEffect(() => {
    setMenuOpen(false);
    setOpenSubmenu(null);
  }, [pathname]);

  // Mobile panel: Escape, click outside, focus trap between toggler and last link.
  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeMenu();
        if (window.innerWidth < DESKTOP_MIN_WIDTH) togglerRef.current?.focus();
        return;
      }
      if (e.key !== 'Tab' || !containerRef.current) return;
      const focusables = containerRef.current.querySelectorAll<HTMLElement>('button, a');
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (e.shiftKey && e.target === first) {
        e.preventDefault();
        closeMenu();
        togglerRef.current?.focus();
      } else if (!e.shiftKey && e.target === togglerRef.current) {
        e.preventDefault();
        first?.focus();
      } else if (!e.shiftKey && e.target === last) {
        e.preventDefault();
        closeMenu();
        togglerRef.current?.focus();
      }
    };
    const onClick = (e: MouseEvent) => {
      const target = e.target as Node;
      if (togglerRef.current?.contains(target)) return;
      if (!containerRef.current?.contains(target)) closeMenu();
    };
    const onResize = () => closeMenu();
    document.addEventListener('keydown', onKey);
    document.addEventListener('click', onClick);
    window.addEventListener('resize', onResize);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('click', onClick);
      window.removeEventListener('resize', onResize);
    };
  }, [menuOpen, closeMenu]);

  // Dropdowns: Escape and click outside close the open submenu.
  useEffect(() => {
    if (!openSubmenu) return;
    const button = () => document.querySelector<HTMLButtonElement>(`[aria-controls="${openSubmenu}"]`);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        button()?.focus();
        setOpenSubmenu(null);
      } else if (e.key === 'Tab') {
        const links = document.getElementById(openSubmenu)?.querySelectorAll('a');
        if (!links?.length) return;
        if ((e.shiftKey && document.activeElement === links[0]) || (!e.shiftKey && document.activeElement === links[links.length - 1])) {
          setOpenSubmenu(null);
        }
      }
    };
    const onClick = (e: MouseEvent) => {
      const target = e.target as Node;
      if (document.getElementById(openSubmenu)?.contains(target) || button()?.contains(target)) return;
      setOpenSubmenu(null);
    };
    document.addEventListener('keydown', onKey);
    document.addEventListener('click', onClick);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('click', onClick);
    };
  }, [openSubmenu]);

  return (
    <div className="flex-shrink-0 flex justify-end items-center">
      <div
        ref={containerRef}
        className={cx(
          'bg-white w-screen h-auto transform transition-transform duration-200 absolute left-0 right-0 top-full shadow-md border-t border-shade-t40 dt:transform-none dt:relative dt:w-auto dt:border-0 dt:shadow-none dt:z-10',
          menuOpen ? 'translate-x-0' : 'translate-x-full',
        )}
        id="mainMenuContainer"
      >
        <div id="mainMenuInner" className={cx(!innerVisible && 'hidden', 'dt:block')}>
          <div className="container bg-white dt:container--unset dt:mb-0">
            <nav aria-label="Main menu">
              <ul className="list-none ml-0 menu-main font-medium dt:block dt:mt-1" id="navMainMenu" data-menu-level="0">
                {items.map((item) => {
                  const id = submenuId(item.label);
                  const inTrail = activeTopItem(items, pathname) === item;
                  const border = inTrail ? 'dt:border-shade-t40' : 'dt:border-transparent';
                  const expanded = openSubmenu === id;
                  // The space between items matters: they are inline-blocks on desktop.
                  return (
                    <Fragment key={item.label}>
                    {' '}
                    <li className="dt:inline-block dt:ml-6">
                      <div className="flex py-4 border-b border-shade-t40 dt:border-0" menu-level={0}>
                        {item.children ? (
                          <button
                            className={cx(
                              `w-full text-left transition-colors expander dt:border-b-3 ${border} dt:hover:border-shade-t40 dt:expander--unset`,
                              expanded && 'expander--active',
                            )}
                            aria-controls={id}
                            aria-expanded={expanded}
                            type="button"
                            onClick={(e) => {
                              setOpenSubmenu(expanded ? null : id);
                              e.currentTarget.focus();
                            }}
                            onKeyDown={(e) => {
                              if (e.shiftKey && e.key === 'Tab' && expanded) setOpenSubmenu(null);
                            }}
                          >
                            {item.label}
                          </button>
                        ) : (
                          <Link
                            href={item.href!}
                            className={`w-full text-left transition-colors dt:border-b-3 ${border} dt:hover:border-shade-t40`}
                            aria-controls={id}
                            aria-expanded="false"
                          >
                            {item.label}
                          </Link>
                        )}
                      </div>
                      {item.children && (
                        <Submenu
                          items={item.children}
                          level={1}
                          id={id}
                          pathname={pathname}
                          className={cx(
                            'list-none ml-0',
                            expanded ? 'block' : 'hidden',
                            'bg-shade-t20 border-b border-shade-t40 -ml-4 -mr-4 px-4 dt:absolute dt:-ml-8 dt:py-2 dt:px-8 dt:bg-white dt:border dt:rounded dt:shadow-xl dt:w-80',
                          )}
                        />
                      )}
                    </li>
                    </Fragment>
                  );
                })}{' '}
              </ul>
            </nav>
          </div>
        </div>
      </div>
      <Link
        href="/search"
        className="icon-search-regular h-8 w-8 border border-shade-t60 rounded-full flex items-center justify-center mr-3 text-14 dt:mr-0 dt:bg-orange dt:text-white dt:border-0 dt:ml-8"
      >
        <span className="sr-only">Search the site</span>
      </Link>
      <button
        ref={togglerRef}
        id="mainMenuToggler"
        className={cx(
          'icon-bars-regular h-8 w-8 border border-shade-t60 rounded-sm flex items-center justify-center text-18 dt:hidden ',
          menuOpen && 'icon-times-light bg-orange border-orange text-white',
        )}
        aria-controls="mainMenuContainer"
        aria-expanded={menuOpen}
        onClick={() => (menuOpen ? closeMenu() : openMenu())}
      >
        <span className="sr-only">Toggle the main menu</span>
      </button>
    </div>
  );
}
