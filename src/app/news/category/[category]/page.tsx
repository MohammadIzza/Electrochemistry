import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import NewsListing from '@/components/news/NewsListing';
import { getCategory, getNewsByCategory, newsCategories } from '@/lib/news';

interface Params {
  params: Promise<{ category: string }>;
}

export const dynamicParams = false;

export function generateStaticParams() {
  return newsCategories.map((c) => ({ category: c.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const category = getCategory((await params).category);
  return { title: category ? `News: ${category.label}` : 'News' };
}

export default async function NewsCategoryPage({ params }: Params) {
  const category = getCategory((await params).category);
  if (!category) notFound();
  return <NewsListing items={getNewsByCategory(category.slug)} page={1} category={category} />;
}
