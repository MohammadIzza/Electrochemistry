import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import NewsListing from '@/components/news/NewsListing';
import { getCategory, getNewsByCategory, newsCategories, newsPageCount as pageCount } from '@/lib/news';

interface Params {
  params: Promise<{ category: string; page: string }>;
}

export const dynamicParams = false;

export function generateStaticParams() {
  return newsCategories.flatMap((c) => {
    const total = pageCount(getNewsByCategory(c.slug).length);
    return Array.from({ length: total - 1 }, (_, i) => ({ category: c.slug, page: String(i + 2) }));
  });
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const category = getCategory((await params).category);
  return { title: category ? `News: ${category.label}` : 'News' };
}

export default async function NewsCategoryPaged({ params }: Params) {
  const { category: slug, page: pageParam } = await params;
  const category = getCategory(slug);
  const page = Number(pageParam);
  if (!category) notFound();
  const items = getNewsByCategory(category.slug);
  if (!(page >= 2 && page <= pageCount(items.length))) notFound();
  return <NewsListing items={items} page={page} category={category} />;
}
