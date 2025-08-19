import type { Metadata } from 'next';
import { PastEvents } from '@/components/events/EventListing';
import { getPastEvents } from '@/lib/events';

export const metadata: Metadata = { title: 'Past Events' };

export default function PastEventsPage() {
  return <PastEvents events={getPastEvents()} page={1} />;
}
