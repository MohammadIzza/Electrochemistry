import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import { nowLocal } from './dates';
import type { EventItem, EventSeries, EventType } from './types';

export { EVENT_TYPES, eventTypeLabel } from './event-types';

const EVENTS_DIR = path.join(process.cwd(), 'content', 'events');
const SERIES_DIR = path.join(EVENTS_DIR, 'series');

/** Rows per page on event listings. */
export const EVENTS_PER_PAGE = 10;

function readMdx<T>(dir: string, file: string): T {
  const { data, content } = matter(fs.readFileSync(path.join(dir, file), 'utf8'));
  return { ...data, slug: file.replace(/\.mdx$/, ''), body: content.trim() } as T;
}

/** All events, oldest first. */
export function getAllEvents(): EventItem[] {
  return fs
    .readdirSync(EVENTS_DIR)
    .filter((f) => f.endsWith('.mdx'))
    .map((f) => readMdx<EventItem>(EVENTS_DIR, f))
    .sort((a, b) => a.start.localeCompare(b.start));
}

export function getEvent(slug: string): EventItem | undefined {
  return getAllEvents().find((e) => e.slug === slug);
}

function endOf(e: EventItem) {
  return e.end ?? e.start;
}

/** Events that have not ended yet (evaluated at build time), soonest first. */
export function getUpcomingEvents(type?: EventType): EventItem[] {
  const now = nowLocal();
  return getAllEvents().filter((e) => endOf(e) >= now && (!type || e.type === type));
}

/** Events that have ended, most recent first. */
export function getPastEvents(): EventItem[] {
  const now = nowLocal();
  return getAllEvents()
    .filter((e) => endOf(e) < now)
    .reverse();
}

/** Other events of the same series, oldest first. */
export function getOtherEventsInSeries(event: EventItem): EventItem[] {
  if (!event.series) return [];
  return getAllEvents().filter((e) => e.series === event.series && e.slug !== event.slug);
}

export function getAllSeries(): EventSeries[] {
  return fs
    .readdirSync(SERIES_DIR)
    .filter((f) => f.endsWith('.mdx'))
    .map((f) => readMdx<EventSeries>(SERIES_DIR, f));
}

export function getSeries(slug: string) {
  return getAllSeries().find((s) => s.slug === slug);
}

/** Events of a series, most recent first. */
export function getSeriesEvents(slug: string): EventItem[] {
  return getAllEvents()
    .filter((e) => e.series === slug)
    .reverse();
}
