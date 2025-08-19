import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { UpcomingEvents } from '@/components/events/EventListing';
import { EVENT_TYPES, getUpcomingEvents } from '@/lib/events';
import type { EventItem } from '@/lib/types';

interface Params {
  params: Promise<{ type: string }>;
}

export const dynamicParams = false;

export function generateStaticParams() {
  return EVENT_TYPES.map((t) => ({ type: t.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { type } = await params;
  const t = EVENT_TYPES.find((x) => x.slug === type);
  return { title: t ? `Events: ${t.label}` : 'Events' };
}

export default async function EventsByType({ params }: Params) {
  const { type } = await params;
  const t = EVENT_TYPES.find((x) => x.slug === type);
  if (!t) notFound();
  // "In Person" and "Virtual" also include hybrid events, as on the original site.
  const matches = (e: EventItem) => e.type === t.type || (t.type !== 'hybrid' && e.type === 'hybrid');
  return <UpcomingEvents events={getUpcomingEvents().filter(matches)} typeLabel={t.label} />;
}
