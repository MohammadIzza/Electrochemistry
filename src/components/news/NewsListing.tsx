import Breadcrumb from '@/components/layout/Breadcrumb';
import NavDropdown from '@/components/ui/NavDropdown';
import Pager from '@/components/ui/Pager';
import { NEWS_PER_PAGE, newsCategories } from '@/lib/news';
import { pageCount, paginate } from '@/lib/pagination';
import type { NewsCategory, NewsItem } from '@/lib/types';
import NewsTeaser from './NewsTeaser';

interface NewsListingProps {
  items: NewsItem[];
  page: number;
  /** When set, the listing is filtered to this category. */
  category?: NewsCategory;
}

export function newsPageHref(page: number, category?: string) {
  const base = category ? `/news/category/${category}` : '/news';
  return page <= 1 ? base : `${base}/page/${page}`;
}

/** News index or category page with category filter and pagination. */
export default function NewsListing({ items, page, category }: NewsListingProps) {
  const totalPages = pageCount(items.length, NEWS_PER_PAGE);
  const view = (
    <div className="view-id-news">
      <div className="container">
        <div className="pt-6 pb-3 border-b-3 border-shade-t40 tp:py-8">
          <div className="flow pb-1">
            <div className="flex justify-end">
              <NavDropdown
                label="By Category"
                ariaLabel="News category menu"
                links={newsCategories.map((c) => ({ label: c.label, href: `/news/category/${c.slug}` }))}
              />
            </div>
          </div>
        </div>
        {paginate(items, page, NEWS_PER_PAGE).map((item) => (
          <NewsTeaser key={item.slug} item={item} />
        ))}
        <Pager page={page} totalPages={totalPages} href={(n) => newsPageHref(n, category?.slug)} />
      </div>
    </div>
  );

  if (category) {
    return (
      <>
        <Breadcrumb parent={{ label: 'News', href: '/news' }} />
        <main id="main-content" className="flex-1 mb-4 tp:mb-8">
          <div className="min-h-view-header w-full bg-shade-t30">
            <div className="copy flow view-page-header container">
              <header>
                <h1>{`News: ${category.label}`}</h1>
              </header>
            </div>
          </div>
          {view}
        </main>
      </>
    );
  }

  return (
    <main id="main-content" className="flex-1">
      <div className="bg-shade-t30"></div>
      <div className="min-h-view-header w-full bg-shade-t30">
        <div className="flow container">
          <h1 className="pt-24 font-bold text-36 h-ul tp:pt-28 tp:text-72 dt:text-72">News</h1>
          <p className="text-24"></p>
        </div>
      </div>
      {view}
    </main>
  );
}
