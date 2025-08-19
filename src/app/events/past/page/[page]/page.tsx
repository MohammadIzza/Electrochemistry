import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { PastEvents } from '@/components/events/EventListing';
import { EVENTS_PER_PAGE, getPastEvents } from '@/lib/events';
import { pageCount } from '@/lib/pagination';

interface Params {
  params: Promise<{ page: string }>;
}

export const dynamicParams = false;

export function generateStaticParams() {
  const total = pageCount(getPastEvents().length, EVENTS_PER_PAGE);
  return Array.from({ length: total - 1 }, (_, i) => ({ page: String(i + 2) }));
}

export const metadata: Metadata = { title: 'Past Events' };

export default async function PastEventsPaged({ params }: Params) {
  const page = Number((await params).page);
  const events = getPastEvents();
  if (!(page >= 2 && page <= pageCount(events.length, EVENTS_PER_PAGE))) notFound();
  return <PastEvents events={events} page={page} />;
}
