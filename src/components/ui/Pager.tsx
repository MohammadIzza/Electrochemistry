import Link from 'next/link';

interface PagerProps {
  page: number;
  totalPages: number;
  /** URL of a given page number (1-based). */
  href: (page: number) => string;
  /** Use plain anchors (e.g. when pages differ only by query string). */
  onNavigate?: (page: number) => void;
}

/** Numbered pagination matching the theme's `.pager` styles. */
export default function Pager({ page, totalPages, href, onNavigate }: PagerProps) {
  if (totalPages <= 1) return null;
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  const link = (target: number, props: { title?: string; rel?: string; 'aria-current'?: 'page' }, children: React.ReactNode) =>
    onNavigate ? (
      <a
        href={href(target)}
        className="pager__link"
        {...props}
        onClick={(e) => {
          e.preventDefault();
          onNavigate(target);
        }}
      >
        {children}
      </a>
    ) : (
      <Link href={href(target)} className="pager__link" {...props}>
        {children}
      </Link>
    );

  return (
    <nav className="pager" role="navigation" aria-label="pagination-heading">
      <ul className="pager__items js-pager__items">
        {page > 1 ? (
          <li className="pager__item pager__item--previous">
            {link(
              page - 1,
              { title: 'Go to previous page', rel: 'prev' },
              <>
                <span aria-hidden="true">←</span>
                <span className="visually-hidden ml-1 dt:visually-unhidden">Previous</span>
              </>,
            )}
          </li>
        ) : (
          <li className="pager__item pager__item--previous pager__item--disabled">
            <span className="pager__link">
              <span aria-hidden="true">←</span>
              <span className="visually-hidden ml-1 dt:visually-unhidden">Previous</span>
            </span>
          </li>
        )}
        {pages.map((n) => (
          <li key={n} className={n === page ? 'pager__item is-active' : 'pager__item'}>
            {link(
              n,
              n === page ? { title: 'Current page', 'aria-current': 'page' } : { title: `Go to page ${n}` },
              <>
                <span className="visually-hidden">{n === page ? 'Current page' : 'Page'}</span>
                {n}
              </>,
            )}
          </li>
        ))}
        {page < totalPages ? (
          <li className="pager__item pager__item--next">
            {link(
              page + 1,
              { title: 'Go to next page', rel: 'next' },
              <>
                <span className="visually-hidden mr-1 dt:visually-unhidden">Next</span>
                <span aria-hidden="true">→</span>
              </>,
            )}
          </li>
        ) : (
          <li className="pager__item pager__item--next pager__item--disabled">
            <span className="pager__link">
              <span className="visually-hidden mr-1 dt:visually-unhidden">Next</span>
              <span aria-hidden="true">→</span>
            </span>
          </li>
        )}
      </ul>
    </nav>
  );
}
