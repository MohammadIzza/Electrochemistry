import site from '@content/site';
import type { NavItem } from './types';

/** Normalises a path for comparison: no trailing slash, no query or hash. */
export function normalizePath(path: string): string {
  const p = path.split(/[?#]/)[0].replace(/\/+$/, '');
  return p === '' ? '/' : p;
}

export function isExternal(href: string): boolean {
  return /^(https?:)?\/\//.test(href) || href.startsWith('mailto:') || href.startsWith('tel:');
}

/** Every href inside a nav item, including nested children. */
function hrefsOf(item: NavItem): string[] {
  return [item.href, ...(item.children ?? []).flatMap(hrefsOf)].filter(Boolean) as string[];
}

/** True when `pathname` is the item itself or one of its descendants. */
export function isInTrail(item: NavItem, pathname: string): boolean {
  const current = normalizePath(pathname);
  return hrefsOf(item).some((href) => normalizePath(href) === current);
}

/**
 * Main-menu item to highlight for a path: an exact match anywhere in the item's
 * tree wins; otherwise the item whose link is the longest prefix of the path
 * (e.g. `/news/category/research` → News).
 */
export function activeTopItem(items: NavItem[], pathname: string): NavItem | undefined {
  const current = normalizePath(pathname);
  const exact = items.find((item) => isInTrail(item, current));
  if (exact) return exact;
  let best: { item: NavItem; length: number } | undefined;
  for (const item of items) {
    for (const href of hrefsOf(item).map(normalizePath)) {
      if (href !== '/' && current.startsWith(`${href}/`) && (!best || href.length > best.length)) best = { item, length: href.length };
    }
  }
  return best?.item;
}

/** DOM id used by the theme for a submenu, e.g. `aboutSubmenu`. */
export function submenuId(label: string): string {
  return `${label.toLowerCase()}Submenu`;
}

/**
 * Section menu items for a page: the dropdown entries of the main-menu item whose
 * label matches `section` (e.g. `About` → About Overview with its sub-pages).
 */
export function getSectionMenu(section: string): NavItem[] {
  const top = site.mainNav.find((item) => item.label.toLowerCase() === section.toLowerCase());
  return top?.children ?? [];
}
