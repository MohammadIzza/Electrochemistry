import type { Metadata } from 'next';
import { UpcomingEvents } from '@/components/events/EventListing';
import { getUpcomingEvents } from '@/lib/events';

export const metadata: Metadata = { title: 'Events' };

export default function EventsPage() {
  return <UpcomingEvents events={getUpcomingEvents()} />;
}
