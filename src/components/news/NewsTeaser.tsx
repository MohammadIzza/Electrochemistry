import Link from 'next/link';
import LinkTo from '@/components/ui/LinkTo';
import ResponsiveImage from '@/components/ui/ResponsiveImage';
import { formatLongDate } from '@/lib/dates';
import { renderMdx } from '@/lib/mdx';
import { getCategory } from '@/lib/news';
import { isExternal } from '@/lib/navigation';
import type { NewsItem } from '@/lib/types';

/** One row of a news listing. */
export default async function NewsTeaser({ item }: { item: NewsItem }) {
  const category = item.category ? getCategory(item.category) : undefined;
  const external = isExternal(item.url);
  const summary = item.summary ? await renderMdx(item.summary) : null;

  return (
    <div>
      <div className="border-b border-shade-t40 py-6 antialiased tp:flex tp:space-x-16">
        <div className="text-18 pr-4 tp:w-11/16">
          {item.source || !category ? (
            <p className="font-medium text-blue text-14 leading-none tracking-wider uppercase pt-6 pb-2">{item.source}</p>
          ) : (
            <p className="font-medium category-tag text-14 leading-none tracking-wider uppercase pt-6 pb-2">
              <Link href={`/news/category/${category.slug}`} className="hover:border-b">
                {category.label}
              </Link>
            </p>
          )}
          <h3 className="text-22 text-charcoal max-w-prose pt-2">
            <a href={item.url} rel="bookmark" {...(external ? { 'data-id': 'external-link', target: '_blank' } : {})}>
              <span className="hover:border-b hover:border-charcoal">
                <span>{item.title}</span>{' '}
              </span>
              {external && <span className="is-external"></span>}
            </a>
          </h3>
          <LinkTo href={item.url}>
            <p className="text-14 byline-color font-normal uppercase pb-2 tracking-wider">
              {formatLongDate(item.date)}
              {item.author && (
                <>
                  {' '}
                  <span className="px-2">&bull;</span> by {item.author}
                </>
              )}
            </p>
            <p className="text-18 max-w-prose"></p>
            {summary && <div className="formatted flow">{summary}</div>}
          </LinkTo>
        </div>
        <LinkTo href={item.url} className="pt-4 tp:w-5/16 tp:pt-0">
          <ResponsiveImage image={item.image} className="object-cover object-center aspect-[3/2]" />
        </LinkTo>
      </div>
    </div>
  );
}
