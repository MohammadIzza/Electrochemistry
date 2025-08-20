import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Breadcrumb from '@/components/layout/Breadcrumb';
import ResponsiveImage from '@/components/ui/ResponsiveImage';
import { PORTRAIT_WIDTHS } from '@/lib/images';
import { getProfile, getProfiles } from '@/lib/people';

interface Params {
  params: Promise<{ slug: string }>;
}

const BUILDING_MAP_URL = 'https://utdirect.utexas.edu/apps/campus/buildings/nlogon/maps';

export const dynamicParams = false;

export function generateStaticParams() {
  return getProfiles().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const p = getProfile((await params).slug);
  return p ? { title: p.name } : {};
}

export default async function ProfilePage({ params }: Params) {
  const person = getProfile((await params).slug);
  if (!person) notFound();

  return (
    <>
      <Breadcrumb parent={{ label: 'Directory', href: '/directory' }} />
      <main id="main-content" className="flex-1 mb-4 tp:mb-8">
        <div className="mb-4 tp:mb-8 dt:mb-16">
          <div className="antialiased">
            <div className="bg-shade-t30 mb-0.5 pt-24 pb-6 tp:py-24">
              <div className="container content w-full flex flex-col-reverse tp:flex-row">
                <div className="tp:flex-grow">
                  <h1 className="text-48 font-bold">{person.name}</h1>
                  <ul className="list-none ml-0 antialiased font-serif text-21 font-bold text-blue antialiased mb-4 tp:text-24 tp:mb-8" aria-label="List of associated roles">
                    {person.roles.map((r) => (
                      <li key={r}>{r}</li>
                    ))}
                  </ul>
                  <ul className="list-none ml-0 leading-relaxed dt:text-18" aria-label="List of department affiliations">
                    {person.affiliations?.map((a) => (
                      <li key={a}>{a}</li>
                    ))}
                  </ul>
                </div>
                <div className="mb-8 tp:mb-0">
                  <div className="w-2/3 mx-auto rounded-full overflow-hidden tp:mx-0 tp:w-48 tp:h-48 dt:w-56 dt:h-56">
                    <ResponsiveImage
                      image={{ ...person.image!, alt: `Profile image of ${person.name}` }}
                      widths={PORTRAIT_WIDTHS}
                      className=""
                      width={600}
                      height={600}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="py-6 font-medium antialiased bg-shade-t30 text-shade-s40 text-14 border-t border-white tp:text-16">
              <div className="container">
                <h2 className="visually-hidden">Contact Information</h2>
                <div className="flow tp:flow-none tp:flex tp:items-center tp:gap-8">
                  <div className="flow tp:flow-none tp:flex tp:items-start tp:gap-16 tp:flex-grow">
                    <div className="flow text-shade-s40">
                      {person.email && (
                        <div className="flex items-center">
                          <span className="icon-envelope-regular text-18 mr-2" aria-hidden="true"></span>
                          <a href={`mailto:${person.email}`} className="link-in-text--dark">
                            <span className="visually-hidden">Email Address:</span>
                            {person.email}
                          </a>
                        </div>
                      )}
                      {person.phone && (
                        <div className="flex items-center">
                          <span className="icon-phone-alt-solid text-16 mr-2" aria-hidden="true"></span>
                          <span>{person.phone}</span>
                        </div>
                      )}
                    </div>
                    {person.building && (
                      <div className="flow">
                        <div className="flex items-center gap-2">
                          <span className="icon-map-marker-alt-solid mb-0" aria-hidden="true"></span>
                          <a href={`${BUILDING_MAP_URL}/UTM/${person.building}/`} className="link-in-text--dark">
                            {person.building}
                          </a>
                          <div className="inline-block">
                            <span className="visually-hidden">Room Number:</span>
                            {person.room}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="flex-shrink-0 dt:w-56">
                    <div className="flow flex flex-col items-center">
                      {person.links?.map((l) => (
                        <a key={l.href} href={l.href} className="btn text-16 block w-full text-center">
                          {l.label}
                        </a>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="container">
          <div className="flow-relaxed tl:flow-none tl:flex tl:gap-x-8 tl:gap-x-24">
            <div className="tp:w-full tl:w-11/16">
              <div className="flow-wide text-18 dt:text-20">
                {person.sections?.map((s) => (
                  <section key={s.heading}>
                    <h2 className="text-30 text-blue font-serif font-medium">{s.heading}</h2>
                    <div>
                      <ul className="bullet-list flow">
                        {s.items.map((i) => (
                          <li key={i}>{i}</li>
                        ))}
                      </ul>
                    </div>
                  </section>
                ))}
              </div>
            </div>
            <div className="overflow-hidden tp:w-full tl:w-5/16"></div>
          </div>
        </div>
        <div className="mb-8">
          <div className="container"></div>
        </div>
      </main>
    </>
  );
}
