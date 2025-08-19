import Link from 'next/link';
import ResponsiveImage from '@/components/ui/ResponsiveImage';
import { formatTime } from '@/lib/dates';
import { eventTypeLabel } from '@/lib/event-types';
import type { EventItem } from '@/lib/types';
import DateBadge from './DateBadge';

export function eventTimeRange(event: EventItem): string {
  const start = formatTime(event.start);
  return event.end && !event.hideEndTime ? `${start} – ${formatTime(event.end)}` : start;
}

/** Event row used in event listings. */
export default function EventTeaser({ event }: { event: EventItem }) {
  const href = `/events/${event.slug}`;
  return (
    <div className="views-row last:mb-8">
      <div className="flex space-x-4 border-b border-shade-t40 py-6 antialiased tp:flex tp:space-x-64 tp:py-8">
        <div className="tp:w-11/16">
          <Link href={href}>
            <DateBadge date={event.start} className="bg-orange flex items-center justify-center w-21 float-left" />
          </Link>
          <div className="ml-26 mb-4">
            <h3 className="text-22 -mt-1 mb-4">
              <Link href={href} rel="bookmark">
                <span className="hover:border-b hover:border-charcoal">
                  <span>{event.title}</span>{' '}
                </span>
              </Link>
            </h3>
            <div className="flow text-18">
              {event.summary && <p className="text-shade-s40">{event.summary}</p>}
              <p className="font-bold text-shade-s40">
                {eventTimeRange(event)}
                {event.type && (
                  <>
                    {' '}
                    <span className="px-1">&bull;</span> {eventTypeLabel(event.type)}
                  </>
                )}
              </p>
              {event.speakers && <p>Speaker(s): {event.speakers}</p>}
            </div>
          </div>
        </div>
        <div className="hidden tp:block tp:w-5/16">
          {(event.teaserImage ?? event.image) && (
            <Link href={href}>
              <ResponsiveImage image={event.teaserImage ?? event.image} className="object-cover object-center aspect-[3/2]" />
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}

/** Compact event row used on series pages. */
export function EventTeaserCompact({ event }: { event: EventItem }) {
  const href = `/events/${event.slug}`;
  return (
    <div className="views-row last:mb-8">
      <div className="flex antialiased pt-6">
        <div className="bg-orange flex flex-initial w-21 h-21 items-center justify-center">
          <Link href={href}>
            <DateBadge date={event.start} className="bg-orange flex items-center justify-center w-21 float-left" />
          </Link>
        </div>
        <div className="w-9/16 flex-auto pl-6 tp:w-10/16 dt:w-12/16 dt:pr-4">
          <h3 className="text-22 mt-2">
            <Link href={href} rel="bookmark">
              <span className="hover:border-b hover:border-charcoal">
                <span>{event.title}</span>{' '}
              </span>
            </Link>
          </h3>
          <div className="flow text-18">
            <p className="byline font-bold">
              {eventTimeRange(event)}
              {event.type && (
                <>
                  {' '}
                  <span className="px-1">&bull;</span> {eventTypeLabel(event.type)}
                </>
              )}
            </p>
            {event.speakers && <p className="byline-color">Speakers: {event.speakers}</p>}
          </div>
        </div>
      </div>
    </div>
  );
}
