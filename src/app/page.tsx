import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import ContentPage from '@/components/layout/ContentPage';
import { getPage } from '@/lib/pages';

export const metadata: Metadata = { title: { absolute: 'Home | Allen J. Bard Center for Electrochemistry' } };

export default function HomePage() {
  const page = getPage([]);
  if (!page) notFound();
  return <ContentPage page={page} />;
}
