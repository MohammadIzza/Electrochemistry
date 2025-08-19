import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import EventDetail from '@/components/events/EventDetail';
import { getAllEvents, getEvent } from '@/lib/events';

interface Params {
  params: Promise<{ slug: string }>;
}

export const dynamicParams = false;

export function generateStaticParams() {
  return getAllEvents().map((e) => ({ slug: e.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const event = getEvent((await params).slug);
  return event ? { title: event.title, description: event.summary } : {};
}

export default async function EventPage({ params }: Params) {
  const event = getEvent((await params).slug);
  if (!event) notFound();
  return <EventDetail event={event} />;
}
