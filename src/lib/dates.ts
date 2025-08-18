/**
 * Date helpers. Event times are stored as local wall-clock strings in the site's
 * time zone (e.g. `2024-11-01T14:00`), so formatting never depends on the
 * visitor's or the build machine's time zone.
 */
import site from '@content/site';

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

interface Parts {
  year: number;
  month: number; // 1-12
  day: number;
  hour: number;
  minute: number;
}

export function parseLocal(value: string): Parts {
  const [date, time = '00:00'] = value.split('T');
  const [year, month, day] = date.split('-').map(Number);
  const [hour, minute] = time.split(':').map(Number);
  return { year, month, day, hour, minute };
}

/** `February 4, 2026` */
export function formatLongDate(value: string): string {
  const p = parseLocal(value);
  return `${MONTHS[p.month - 1]} ${p.day}, ${p.year}`;
}

/** `Dec 4, 2023` */
export function formatShortDate(value: string): string {
  const p = parseLocal(value);
  return `${MONTHS[p.month - 1].slice(0, 3)} ${p.day}, ${p.year}`;
}

/** `{ month: 'Nov', day: '1', year: '2024' }` for date badges. */
export function dateBadge(value: string) {
  const p = parseLocal(value);
  return { month: MONTHS[p.month - 1].slice(0, 3), day: String(p.day), year: String(p.year) };
}

/** `2:00 pm` */
export function formatTime(value: string): string {
  const { hour, minute } = parseLocal(value);
  const h = hour % 12 === 0 ? 12 : hour % 12;
  return `${h}:${String(minute).padStart(2, '0')} ${hour < 12 ? 'am' : 'pm'}`;
}

/** Offset in minutes of the site time zone from UTC at a given instant. */
function tzOffsetMinutes(utcMillis: number): number {
  const dtf = new Intl.DateTimeFormat('en-US', {
    timeZone: site.timeZone,
    hourCycle: 'h23',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
  const parts = Object.fromEntries(dtf.formatToParts(new Date(utcMillis)).map((p) => [p.type, p.value]));
  const asUtc = Date.UTC(+parts.year, +parts.month - 1, +parts.day, +parts.hour, +parts.minute, +parts.second);
  return (asUtc - utcMillis) / 60000;
}

/** Converts a local wall-clock string in the site time zone to a UTC Date. */
export function localToUtc(value: string): Date {
  const p = parseLocal(value);
  const guess = Date.UTC(p.year, p.month - 1, p.day, p.hour, p.minute);
  const offset = tzOffsetMinutes(guess);
  return new Date(guess - offset * 60000);
}

/** `20241101T190000Z` */
export function toUtcStamp(value: string): string {
  return localToUtc(value).toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
}

/** `2024-11-01T19:00:00Z` */
export function toUtcIso(value: string): string {
  return localToUtc(value).toISOString().replace(/\.\d{3}/, '');
}

/** `20241101T140000` (local, no zone) */
export function toLocalStamp(value: string): string {
  const p = parseLocal(value);
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${p.year}${pad(p.month)}${pad(p.day)}T${pad(p.hour)}${pad(p.minute)}00`;
}

/** Current wall-clock time in the site time zone, as a local string. */
export function nowLocal(): string {
  const now = Date.now();
  const local = new Date(now + tzOffsetMinutes(now) * 60000);
  return local.toISOString().slice(0, 16);
}
