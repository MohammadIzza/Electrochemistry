/**
 * "Add to calendar" links, in the same format as the spatie/calendar-links
 * library used by the original Drupal site.
 */
import { createHash } from 'node:crypto';
import site from '@content/site';
import { localToUtc, toLocalStamp, toUtcIso, toUtcStamp } from './dates';
import type { EventItem } from './types';

/** PHP `rawurlencode`. */
function rawUrlEncode(s: string): string {
  return encodeURIComponent(s).replace(/[!'()*]/g, (c) => `%${c.charCodeAt(0).toString(16).toUpperCase()}`);
}

/** PHP `urlencode` (spaces as `+`). */
function urlEncode(s: string): string {
  return rawUrlEncode(s).replace(/%20/g, '+').replace(/~/g, '%7E');
}

/** ISO-8601 with the site's UTC offset, like PHP's DateTimeInterface::ATOM. */
function atom(value: string): string {
  const utc = localToUtc(value).getTime();
  const [date, time] = value.split('T');
  const localMs = Date.UTC(+date.slice(0, 4), +date.slice(5, 7) - 1, +date.slice(8, 10), +time.slice(0, 2), +time.slice(3, 5));
  const offset = Math.round((localMs - utc) / 60000);
  const sign = offset < 0 ? '-' : '+';
  const abs = Math.abs(offset);
  return `${value}:00${sign}${String(Math.floor(abs / 60)).padStart(2, '0')}:${String(abs % 60).padStart(2, '0')}`;
}

function icsEscape(s: string): string {
  return s.replace(/\\/g, '\\\\').replace(/,/g, '\\,').replace(/;/g, '\\;').replace(/\r?\n/g, '\\n');
}

export function eventUrl(event: EventItem): string {
  return `${site.url}/events/${event.slug}`;
}

export function calendarLinks(event: EventItem) {
  const url = eventUrl(event);
  const start = event.start;
  const end = event.end ?? event.start;
  const address = event.location?.address;
  const description = event.calendarDescription ?? '';

  const htmlDetails = `${description}<br /><br />For complete event details, please visit:<br /><a href='${url}'>${url}</a>`;

  const google =
    `https://calendar.google.com/calendar/render?action=TEMPLATE&dates=${toLocalStamp(start)}/${toLocalStamp(end)}` +
    `&ctz=${site.timeZone}&text=${urlEncode(event.title)}&details=${urlEncode(htmlDetails)}` +
    (address ? `&location=${urlEncode(address)}` : '');

  const uid = createHash('md5')
    .update(`${atom(start)}${atom(end)}${event.title}${address ?? ''}`)
    .digest('hex');
  const ics = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:Spatie calendar-links',
    'BEGIN:VEVENT',
    `UID:${uid}`,
    `SUMMARY:${icsEscape(event.title)}`,
    `DTSTAMP:${toUtcStamp(start)}`,
    `DTSTART:${toUtcStamp(start)}`,
    `DTEND:${toUtcStamp(end)}`,
    `DESCRIPTION:${icsEscape(`${description}\n\nFor complete event details, please visit:\n${url}`)}`,
    ...(address ? [`LOCATION:${icsEscape(address)}`] : []),
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n');
  const ical = `data:text/calendar;charset=utf8;base64,${Buffer.from(ics).toString('base64')}`;

  const yahoo =
    `https://calendar.yahoo.com/?v=60&view=d&type=20&ST=${toUtcStamp(start)}&ET=${toUtcStamp(end)}` +
    `&TITLE=${rawUrlEncode(event.title)}&DESC=${rawUrlEncode(`${description} For complete event details, please visit: ${url}`)}` +
    (address ? `&in_loc=${rawUrlEncode(address)}` : '');

  const office365 =
    `https://outlook.office.com/calendar/deeplink/compose?path=/calendar/action/compose&rru=addevent` +
    `&startdt=${toUtcIso(start)}&enddt=${toUtcIso(end)}&subject=${rawUrlEncode(event.title)}&body=${rawUrlEncode(htmlDetails)}` +
    (address ? `&location=${rawUrlEncode(address)}` : '');

  return { google, ical, yahoo, office365 };
}
