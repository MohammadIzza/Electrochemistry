import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { EventTeaserCompact } from '@/components/events/EventTeaser';
import Breadcrumb from '@/components/layout/Breadcrumb';
import ResponsiveImage from '@/components/ui/ResponsiveImage';
import ShareLinks from '@/components/ui/ShareLinks';
import site from '@content/site';
import { formatShortDate } from '@/lib/dates';
import { getAllSeries, getSeries, getSeriesEvents } from '@/lib/events';
import { renderMdx } from '@/lib/mdx';

interface Params {
  params: Promise<{ slug: string }>;
}

export const dynamicParams = false;

export function generateStaticParams() {
  return getAllSeries().map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const series = getSeries((await params).slug);
  return series ? { title: series.title } : {};
}

export default async function SeriesPage({ params }: Params) {
  const series = getSeries((await params).slug);
  if (!series) notFound();
  const intro = series.intro ? await renderMdx(series.intro) : null;
  const body = series.body ? await renderMdx(series.body) : null;
  const events = series.eventsHeading ? getSeriesEvents(series.slug) : [];

  return (
    <>
      <Breadcrumb parent={{ label: 'Events', href: '/events' }} />
      <main id="main-content" className="flex-1 mb-4 tp:mb-8">
        <div className="mb-4 tp:mb-8 dt:mb-16">
          <div className="antialiased text-charcoal bg-shade-t30 pt-16 pb-6 tp:py-20 tp:pb-20">
            <div className="container--inset">
              <div className="text-orange-alt text-14 uppercase font-medium tracking-wider mb-2 tp:text-16">
                <p className="text-orange-s20 text-14 uppercase font-medium tp:text-16">
                  <Link href={`/events/series/${series.slug}`} className="hover:border-b"></Link>
                </p>
              </div>
              <h1 className="text-36 mb-8 tp:text-72">{series.title}</h1>
              <div className="text-16 flow-tight tp:text-18 tp:mr-32">
                {series.date && (
                  <div className="text-22 font-bold tp:text-24">
                    <span className="visually-hidden">Event starts at this time</span> {formatShortDate(series.date)}
                  </div>
                )}
                <div className="tp:text-20"></div>
              </div>
            </div>
          </div>
          <div className="container--inset -mt-4 tp:-mt-12">
            <div className="flex justify-end bg-orange">
              <div className="w-full tp:w-6/16">
                <ResponsiveImage image={series.image} className="object-cover object-center aspect-[4/3]" />
              </div>
            </div>
          </div>
          <div className="container--inset">
            <div className="flow my-6 tp:flow-none tp:flex tp:items-center tp:gap-1/16">
              <div className="w-full text-18 copy tp:text-20 dt:text-24">{intro && <div className="formatted flow">{intro}</div>}</div>
            </div>
          </div>
        </div>
        <div className="container--inset">
          <hr className="my-6" />
        </div>
        <div className="container--inset">
          <div className="flow-relaxed tl:flow-none tl:flex tl:gap-x-8 tl:gap-x-24">
            <div className="tp:w-full tl:w-11/16">
              <div className="flow">
                <div className="flow text-16 tp:text-20">{body && <div className="formatted flow">{body}</div>}</div>
                {series.eventsHeading && (
                  <>
                    <h2 className="mb-8 mt-0 text-36 leading-none font-bold font-serif">{series.eventsHeading}</h2>
                    <div>
                      {events.map((event) => (
                        <EventTeaserCompact key={event.slug} event={event} />
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>
            <div className="overflow-hidden tp:w-full tl:w-5/16">
              <div className="flow-relaxed">
                <div className="flow">
                  <ShareLinks url={`${site.url}/events/series/${series.slug}`} title="" />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="container--inset">
          <hr className="my-6" />
        </div>
        <div className="mb-8">
          <div className="container--inset"></div>
        </div>
      </main>
    </>
  );
}
