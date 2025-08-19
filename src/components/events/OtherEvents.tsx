'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import Pager from '@/components/ui/Pager';
import type { EventItem } from '@/lib/types';
import EventTeaser from './EventTeaser';

const PER_PAGE = 10;

/** Paginated list of the other events in a series; the page lives in `?page=` (0-based). */
export function OtherEventsList({ events }: { events: EventItem[] }) {
  const params = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const totalPages = Math.ceil(events.length / PER_PAGE);
  const page = Math.min(Math.max(Number(params.get('page') ?? 0) + 1, 1), Math.max(totalPages, 1));
  const href = (n: number) => `${pathname}?page=${n - 1}`;

  return (
    <div className="mb-12">
      {events.slice((page - 1) * PER_PAGE, page * PER_PAGE).map((event) => (
        <EventTeaser key={event.slug} event={event} />
      ))}
      <Pager page={page} totalPages={totalPages} href={href} onNavigate={(n) => router.push(href(n), { scroll: false })} />
    </div>
  );
}

/** Server-rendered first page, shown before the client reads the query string. */
export function OtherEventsFallback({ events }: { events: EventItem[] }) {
  return (
    <div className="mb-12">
      {events.slice(0, PER_PAGE).map((event) => (
        <EventTeaser key={event.slug} event={event} />
      ))}
    </div>
  );
}
