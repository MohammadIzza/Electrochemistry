import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import site from '@content/site';
import ContentPage from '@/components/layout/ContentPage';
import { getPage } from '@/lib/pages';

export const metadata: Metadata = { title: { absolute: `Home | ${site.name}` } };

export default function HomePage() {
  const page = getPage([]);
  if (!page) notFound();
  return <ContentPage page={page} />;
}
