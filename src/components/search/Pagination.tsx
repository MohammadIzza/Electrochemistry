'use client';

import type { ReactNode } from 'react';

export interface PaginationClasses {
  list: string;
  item?: string;
  previousPageItem: string;
  nextPageItem: string;
  pageItem?: string;
  selectedItem: string;
  disabledItem: string;
  link: string;
}

interface PaginationProps {
  /** 0-based current page. */
  page: number;
  nbPages: number;
  /** Pages shown on each side of the current one. */
  padding?: number;
  href: (page: number) => string;
  onChange: (page: number) => void;
  classes: PaginationClasses;
  previousLabel: ReactNode;
  nextLabel: ReactNode;
}

const cx = (...c: (string | false | undefined)[]) => c.filter(Boolean).join(' ');

/** Pagination with the same markup as the InstantSearch.js `pagination` widget. */
export default function Pagination({ page, nbPages, padding = 3, href, onChange, classes, previousLabel, nextLabel }: PaginationProps) {
  const total = Math.max(nbPages, 1);
  const shown = Math.min(2 * padding + 1, total);
  const first = Math.max(0, Math.min(page - padding, total - shown));
  const pages = Array.from({ length: shown }, (_, i) => first + i);

  const link = (target: number, label: string, children: ReactNode, disabled: boolean) =>
    disabled ? (
      <span className={cx('ais-Pagination-link', classes.link)}>{children}</span>
    ) : (
      <a
        className={cx('ais-Pagination-link', classes.link)}
        aria-label={label}
        href={href(target)}
        onClick={(e) => {
          if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
          e.preventDefault();
          onChange(target);
        }}
      >
        {children}
      </a>
    );

  const isFirst = page <= 0;
  const isLast = page >= total - 1;

  return (
    <div className={cx('ais-Pagination', nbPages <= 1 && 'ais-Pagination--noRefinement')}>
      <ul className={cx('ais-Pagination-list', classes.list)}>
        <li
          className={cx(
            'ais-Pagination-item',
            classes.item,
            'ais-Pagination-item--previousPage',
            classes.previousPageItem,
            isFirst && 'ais-Pagination-item--disabled',
            isFirst && classes.disabledItem,
          )}
        >
          {link(page - 1, 'Previous', previousLabel, isFirst)}
        </li>
        {pages.map((p) => (
          <li
            key={p}
            className={cx(
              'ais-Pagination-item',
              classes.item,
              'ais-Pagination-item--page',
              classes.pageItem,
              p === page && 'ais-Pagination-item--selected',
              p === page && classes.selectedItem,
            )}
          >
            {link(p, String(p + 1), p + 1, false)}
          </li>
        ))}
        <li
          className={cx(
            'ais-Pagination-item',
            classes.item,
            'ais-Pagination-item--nextPage',
            classes.nextPageItem,
            isLast && 'ais-Pagination-item--disabled',
            isLast && classes.disabledItem,
          )}
        >
          {link(page + 1, 'Next', nextLabel, isLast)}
        </li>
      </ul>
    </div>
  );
}
