import type { EventType } from './types';

/** Attendance types with their URL slug (/events/type/<slug>) and label. */
export const EVENT_TYPES: { type: EventType; slug: string; label: string }[] = [
  { type: 'in_person', slug: 'in-person', label: 'In Person' },
  { type: 'virtual', slug: 'virtual', label: 'Virtual' },
  { type: 'hybrid', slug: 'hybrid', label: 'Hybrid' },
];

export function eventTypeLabel(type?: EventType): string {
  return EVENT_TYPES.find((t) => t.type === type)?.label ?? '';
}
