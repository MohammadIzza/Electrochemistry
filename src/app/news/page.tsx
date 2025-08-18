import type { Metadata } from 'next';
import NewsListing from '@/components/news/NewsListing';
import { getAllNews } from '@/lib/news';

export const metadata: Metadata = { title: 'News' };

export default function NewsPage() {
  return <NewsListing items={getAllNews()} page={1} />;
}
