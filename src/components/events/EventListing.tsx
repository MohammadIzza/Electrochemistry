import Link from 'next/link';
import Breadcrumb from '@/components/layout/Breadcrumb';
import NavDropdown from '@/components/ui/NavDropdown';
import Pager from '@/components/ui/Pager';
import { EVENT_TYPES, EVENTS_PER_PAGE } from '@/lib/events';
import { pageCount, paginate } from '@/lib/pagination';
import type { EventItem } from '@/lib/types';
import EventTeaser from './EventTeaser';

const typeLinks = [{ label: '- Any -', href: '/events' }, ...EVENT_TYPES.map((t) => ({ label: t.label, href: `/events/type/${t.slug}` }))];

function Rows({ events }: { events: EventItem[] }) {
  if (events.length === 0) return <p>No events to display</p>;
  return (
    <>
      {events.map((event) => (
        <EventTeaser key={event.slug} event={event} />
      ))}
    </>
  );
}

/** Upcoming events, optionally filtered by attendance type. */
export function UpcomingEvents({ events, typeLabel }: { events: EventItem[]; typeLabel?: string }) {
  return (
    <main id="main-content" className="flex-1">
      <div className="bg-shade-t30">{typeLabel && <Breadcrumb parent={{ label: 'Events', href: '/events' }} />}</div>
      <div className="min-h-view-header w-full bg-shade-t30">
        <div className="flow container">
          <h1 className="pt-24 font-bold text-36 h-ul tp:pt-28 tp:text-72 dt:text-72">{typeLabel ? `Events: ${typeLabel}` : 'Events'}</h1>
          <p className="text-24"></p>
        </div>
      </div>
      <div className="view-id-events">
        <div className="container">
          <div className="flex pt-6 pb-3 border-b-3 border-shade-t40 tp:py-8">
            <div className="flow w-1/2">
              <span className="font-bold border-b-3 border-orange mr-2 pb-1">Upcoming</span>{' '}
              <Link href="/events/past" className="hover:border-b-3 pb-1">
                Past
              </Link>
            </div>
            <div className="flow w-1/2">
              <div className="flex flex-row-reverse flex-wrap gap-2.5">
                {!typeLabel && events.length === 0 && (
                  <div className="flex justify-end">
                    <p>No events to display</p>
                  </div>
                )}
                <NavDropdown label="By Event Type" ariaLabel="Events category menu" links={typeLinks} />
              </div>
            </div>
          </div>
          <Rows events={events} />
        </div>
      </div>
    </main>
  );
}

export function pastEventsHref(page: number) {
  return page <= 1 ? '/events/past' : `/events/past/page/${page}`;
}

/** Past events, most recent first, paginated. */
export function PastEvents({ events, page }: { events: EventItem[]; page: number }) {
  return (
    <main id="main-content" className="flex-1">
      <div className="bg-shade-t30">
        <Breadcrumb parent={{ label: 'Events', href: '/events' }} />
      </div>
      <div className="view-id-events">
        <div className="min-h-view-header w-full bg-shade-t30">
          <div className="container flow view-page-header">
            <h1>Past Events</h1>
            <p className="text-24"></p>
          </div>
        </div>
        <div className="container">
          <div className="flex pt-6 pb-3 border-b-3 border-shade-t40 tp:py-8">
            <div className="flow w-1/2">
              <Link href="/events" className="hover:border-b-3 mr-2 pb-1">
                Upcoming
              </Link>{' '}
              <span className="font-bold border-b-3 border-orange pb-1">Past</span>
            </div>
            <div className="flow w-1/2"></div>
          </div>
          <Rows events={paginate(events, page, EVENTS_PER_PAGE)} />
          <Pager page={page} totalPages={pageCount(events.length, EVENTS_PER_PAGE)} href={pastEventsHref} />
        </div>
      </div>
    </main>
  );
}
