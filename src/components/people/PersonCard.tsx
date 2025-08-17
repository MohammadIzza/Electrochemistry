import { Fragment } from 'react';
import ResponsiveImage from '@/components/ui/ResponsiveImage';
import { PORTRAIT_WIDTHS } from '@/lib/images';
import type { Person } from '@/lib/types';

const BUILDING_MAP_URL = 'https://utdirect.utexas.edu/apps/campus/buildings/nlogon/maps';

/** Contact card for a faculty or staff member. */
export default function PersonCard({ person }: { person: Person }) {
  const hasOffice = person.building || person.room;
  return (
    <div className="bg-shade-t20 p-4 border-b-2 border-shade-t60 flow tp:p-8 tp:pb-4">
      <div className="tp:flex tp:flex-row-reverse tp:gap-8">
        <div className="w-48 h-48 mx-auto rounded-full overflow-hidden bg-shade-s20 flex items-center justify-center text-80 text-white tp:flex-shrink-0">
          {person.image ? (
            <ResponsiveImage
              image={{ ...person.image, alt: person.image.alt ?? `Profile image of ${person.name}` }}
              widths={PORTRAIT_WIDTHS}
              className=""
              width={600}
              height={600}
            />
          ) : (
            person.name
              .split(/\s+/)
              .map((part) => part[0])
              .join('')
          )}
        </div>
        <div className="w-full flow">
          <h2 className="font-bold antialiased text-24 tp:text-36">{person.name}</h2>
          <ul className="list-none ml-0 antialiased font-serif text-21 font-bold text-blue antialiased tp:text-24" aria-label="List of associated roles">
            {person.roles.map((role) => (
              <li key={role}>{role}</li>
            ))}
          </ul>
          <div className="text-16 font-medium tl:text-18">{person.department}</div>
          {person.bio && (
            <div className="copy copy--on-dark-bg text-18">
              {/* Paragraphs are separated by blank lines, line breaks by single newlines. */}
              {person.bio.split(/\n{2,}/).map((para, i) => (
                <p key={i}>
                  {para.split('\n').map((line, j) => (
                    <Fragment key={j}>
                      {j > 0 && <br />}
                      {line}
                    </Fragment>
                  ))}
                </p>
              ))}
            </div>
          )}
        </div>
      </div>
      <div className="text-16 font-medium antialiased text-shade-s40 pt-4 border-t-3 border-shade-t40 flow tp:flow-none tp:flex tp:items-center tp:gap-8">
        {person.email && (
          <div className="flex items-center">
            <span className="icon-envelope-regular mr-2 text-shade-s40" aria-hidden="true"></span>
            <a href={`mailto:${person.email}`} className="link-in-text--dark truncate">
              <span className="visually-hidden">Email Address:</span>
              {person.email}
            </a>
          </div>
        )}
        {person.phone && (
          <div className="flex items-center">
            <span className="icon-phone-alt-solid mr-2 text-shade-s40" aria-hidden="true"></span>
            <span className="font-medium antialiased">
              <span className="visually-hidden">Telephone Number:</span>
              {person.phone}
            </span>
          </div>
        )}
        {hasOffice && (
          <div className="flex items-center font-medium gap-2">
            <span className="icon-map-marker-alt-solid mb-0"></span>
            <span className="visually-hidden">Building:</span>{' '}
            <a href={`${BUILDING_MAP_URL}${person.buildingUrl ?? `/UTM/${person.building}`}/`} className="inline-block link-in-text--dark">
              {person.building}
            </a>
            <div className="inline-block">
              <span className="visually-hidden">Room Number:</span>
              {person.room}
            </div>
          </div>
        )}
        {person.profileUrl && (
          <a href={person.profileUrl} className="btn btn--arrow-right-long ml-auto uppercase">
            View Profile
          </a>
        )}
      </div>
    </div>
  );
}
