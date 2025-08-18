import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import NewsListing from '@/components/news/NewsListing';
import { getAllNews, newsPageCount as pageCount } from '@/lib/news';

interface Params {
  params: Promise<{ page: string }>;
}

export const dynamicParams = false;

export function generateStaticParams() {
  const total = pageCount(getAllNews().length);
  return Array.from({ length: total - 1 }, (_, i) => ({ page: String(i + 2) }));
}

export const metadata: Metadata = { title: 'News' };

export default async function NewsPaged({ params }: Params) {
  const page = Number((await params).page);
  const items = getAllNews();
  if (!(page >= 2 && page <= pageCount(items.length))) notFound();
  return <NewsListing items={items} page={page} />;
}
