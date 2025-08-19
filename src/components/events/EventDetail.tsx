import Link from 'next/link';
import { Suspense } from 'react';
import Breadcrumb from '@/components/layout/Breadcrumb';
import ResponsiveImage from '@/components/ui/ResponsiveImage';
import ShareLinks from '@/components/ui/ShareLinks';
import SmartLink from '@/components/ui/SmartLink';
import { calendarLinks, eventUrl } from '@/lib/calendar';
import { eventTypeLabel, getOtherEventsInSeries, getSeries } from '@/lib/events';
import { renderMdx } from '@/lib/mdx';
import type { EventItem } from '@/lib/types';
import DateBadge from './DateBadge';
import { eventTimeRange } from './EventTeaser';
import { OtherEventsFallback, OtherEventsList } from './OtherEvents';

const ORANGE_BADGE = 'bg-orange w-full font-medium text-white text-center';

function TypeLine({ event }: { event: EventItem }) {
  return (
    <>
      {eventTypeLabel(event.type)}{' '}
      <span className="dt:hidden">
        (
        <a href="#details" className="text-orange border-b border-orange">
          view details
        </a>
        )
      </span>
    </>
  );
}

function CostLine({ cost }: { cost?: string }) {
  return cost ? (
    <>
      <span className="font-medium">Cost:</span> {cost}
    </>
  ) : null;
}

export default async function EventDetail({ event }: { event: EventItem }) {
  const series = event.series ? getSeries(event.series) : undefined;
  // Only listing fields are sent to the client component.
  const others = event.hideOtherEvents ? [] : getOtherEventsInSeries(event).map((e) => ({ ...e, body: '' }));
  const body = event.body ? await renderMdx(event.body) : null;
  const caption = event.imageCaption ? await renderMdx(event.imageCaption) : null;
  const locationDetails = event.location?.details ? await renderMdx(event.location.details) : null;
  const cal = calendarLinks(event);
  const time = eventTimeRange(event);
  const calLinkClass = 'border-b-2 border-shade-t40 font-sans font-medium text-shade-s40 ml-2 hover:text-orange hover:border-orange';

  return (
    <>
      <Breadcrumb parent={{ label: 'Events', href: '/events' }} />
      <main id="main-content" className="flex-1 mb-4 tp:mb-8">
        <div className="mb-4 tp:mb-8 dt:mb-16">
          <div className="antialiased text-charcoal bg-shade-t30 pt-16 pb-6 tp:py-20 tp:pb-20">
            <div className="container--inset">
              <div className="text-orange-alt text-14 uppercase font-medium tracking-wider mb-2 tp:text-16">
                {series && (
                  <p className="pt-8 inline text-orange-s20 text-14 uppercase font-medium tracking-wider tp:text-16 tp:pt-0 hover:border-b">
                    <Link href={`/events/series/${series.slug}`} hrefLang="en">
                      {series.title}
                    </Link>
                  </p>
                )}
              </div>
              <h1 className="mb-4 text-32 tp:mb-6 tp:text-60">
                <span>{event.title}</span>
              </h1>
              <div className="hidden gap-4 m-0 p-0 tp:flex">
                <div className="w-21 items-center tp:flex tp:flex-col tp:flex-shrink-0">
                  <span className="visually-hidden">Event starts on this day</span>
                  <DateBadge single date={event.start} className={ORANGE_BADGE} />
                </div>
                <div className="hidden text-16 flow-tight tp:block tp:text-20 tp:mr-32 flex-shrink-0">
                  <div className="font-medium">
                    <span className="visually-hidden">Event Starts at:</span> {time}
                  </div>
                  <div>
                    <CostLine cost={event.cost} />
                  </div>
                  <div>
                    <TypeLine event={event} />
                  </div>
                </div>
                <div className="hidden text-16 flow-tight tp:block tp:text-20 tp:w-full">
                  {event.speakers && (
                    <>
                      <span className="font-medium">Featured Speaker(s):</span> {event.speakers}
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className="container--inset -mt-6 tp:-mt-8">
            <div className="flex flex-col flex-shrink-0 gap-4 m-0 p-0 hidden">
              <div className="w-21 items-center justify-center">
                <span className="visually-hidden">Event starts on this day</span>
                <DateBadge single date={event.start} className="bg-orange w-full font-medium text-white text-center antialiased" />
              </div>
            </div>
            {event.image && (
              <div className="z-0 -mt-8 tp:mt-0">
                <ResponsiveImage image={event.image} />
                {caption && (
                  <div className="text-12 tp:text-14 mt-2">
                    <div className="formatted flow">{caption}</div>
                  </div>
                )}
              </div>
            )}
          </div>
          <div className="container--inset flex mt-6 mb-4 tp:hidden tp:-mt-4">
            <div className="m-0 p-0 tp:hidden">
              <div className="w-21 items-center justify-center">
                <span className="visually-hidden">Event starts on this day</span>
                <DateBadge single date={event.start} className="bg-orange w-full font-medium text-white text-center antialiased" />
              </div>
            </div>
            <div className="ml-4 flow--tight text-16 tp:text-18 tp:hidden tp:m-0">
              <div className="font-medium tp:text-20">
                <span className="visually-hidden">Event starts at this time</span> {time}
              </div>
              <div className="tp:text-20">
                <CostLine cost={event.cost} />
              </div>
              <div className="tp:text-20">
                <TypeLine event={event} />
              </div>
            </div>
          </div>
          <div className="container--inset">
            <div className="flow my-0 tp:flow-none tp:flex tp:items-center tp:gap-1/16 tp:my-6">
              <div className={event.cta ? 'w-full text-18 copy tp:text-20 tp:w-10/16 dt:text-24' : 'w-full text-18 copy tp:text-20 dt:text-24'}>
                {event.summary}
              </div>
              {event.cta && (
                <div className="text-18 tp:w-5/16 dt:text-center">
                  <SmartLink href={event.cta.href} className="btn w-full dt:w-2/3">
                    {event.cta.label}
                  </SmartLink>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="container--inset">
          <hr className="my-6" />
        </div>

        <div className="container--inset">
          <div className="flow-relaxed tl:flow-none tl:flex tl:gap-x-8 tl:gap-x-24">
            <div className="tp:w-full tl:w-11/16">
              <div className="flow w-full max-w-full">
                <div className="flow text-16 tp:text-20">
                  <h2 className="font-bold">{event.descriptionHeading ?? 'Description'}</h2>
                  {body}
                </div>
              </div>
            </div>
            <div className="overflow-hidden tp:w-full tl:w-5/16">
              <div className="flow-relaxed">
                <div className="flow">
                  <h2 className="text-24 font-bold font-serif" id="details">
                    Location
                  </h2>
                  {event.location && (
                    <div className="flow">
                      {locationDetails && <div className="font-medium text-20">{locationDetails}</div>}
                      {event.location.address && (
                        <div className="font-medium text-20">
                          <iframe
                            width="100%"
                            height="100%"
                            title={event.location.address}
                            frameBorder="0"
                            style={{ border: 0 }}
                            src={`https://www.google.com/maps/embed?origin=mfe&pb=!1m4!2m1!1s${encodeURIComponent(event.location.address).replace(/%20/g, '+')}!5e0!6i14!5m1!1sen`}
                          ></iframe>
                        </div>
                      )}
                    </div>
                  )}
                  {event.eventLink && (
                    <div className="flow">
                      <span className="icon-external-link-alt-regular text-orange">
                        <a
                          className="border-b-2 border-shade-t40 font-medium font-sans text-shade-s40 ml-4 hover:text-orange hover:border-orange"
                          href={event.eventLink}
                          target="_blank"
                        >
                          Event Link
                        </a>
                      </span>
                      <p></p>
                    </div>
                  )}
                </div>
                <div className="flow">
                  <h2 className="text-24 font-bold font-serif">Subscribe</h2>
                  <ul className="list-none m-0 flow">
                    <li className="icon-google-brands text-orange">
                      <a href={cal.google} target="_blank" rel="noopener" className={`calendar-link-google-brands ${calLinkClass}`}>
                        Add to Google
                      </a>
                    </li>
                    <li className="icon-calendar-alt-regular text-orange">
                      <a href={cal.ical} target="_blank" rel="noopener" className={`calendar-link-calendar-alt-regular ${calLinkClass}`}>
                        Add to iCal
                      </a>
                    </li>
                    <li className="icon-yahoo-brands text-orange">
                      <a href={cal.yahoo} target="_blank" rel="noopener" className={`calendar-link-yahoo-brands ${calLinkClass}`}>
                        Add to Yahoo!
                      </a>
                    </li>
                    <li className="icon-microsoft-brands text-orange">
                      <a href={cal.office365} target="_blank" rel="noopener" className={`calendar-link-microsoft-brands ${calLinkClass}`}>
                        Add to Office365
                      </a>
                    </li>
                  </ul>
                </div>
                <div className="flow">
                  <ShareLinks url={eventUrl(event)} title={event.title} />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="container--inset">
          <hr className="my-6" />
        </div>

        <div className="mb-8">
          <div className="container--inset">
            <div className="flow pt-4">
              <h3 className="font-bold mb-1 text-24">Audience</h3>
              <ul className="list-none m-0 text-16">
                {event.audience?.map((a) => (
                  <li key={a}>{a}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {others.length > 0 && (
          <div className="bg-gray-light">
            <div className="container--inset">
              <h2 className="font-bold text-36 pt-12">Other Events in This Series</h2>
              <Suspense fallback={<OtherEventsFallback events={others} />}>
                <OtherEventsList events={others} />
              </Suspense>
            </div>
          </div>
        )}
      </main>
    </>
  );
}
