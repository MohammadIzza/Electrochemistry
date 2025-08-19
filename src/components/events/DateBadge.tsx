import { dateBadge } from '@/lib/dates';

/**
 * Orange month/day/year block. Listings wrap the date in an extra inner box;
 * event pages (`single`) put it straight into `className`.
 */
export default function DateBadge({ date, className, single = false }: { date: string; className: string; single?: boolean }) {
  const { month, day, year } = dateBadge(date);
  const parts = (
    <>
      <p className="text-16 m-0 pt-2 pb-0 leading-none uppercase dt:text-18">{month}</p>
      <p className="text-32 m-0 p-0 leading-none tp:text-36">{day}</p>
      <p className="text-16 m-0 p-0 bg-orange-s20 tp:text-18">{year}</p>
    </>
  );
  if (single) return <div className={className}>{parts}</div>;
  return (
    <div className={className}>
      <div className="w-full font-medium text-white text-center">{parts}</div>
    </div>
  );
}
