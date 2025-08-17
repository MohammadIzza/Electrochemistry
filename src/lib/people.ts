import peopleData from '@content/people/people.json';
import profilesData from '@content/people/profiles.json';
import type { Person, PersonProfile } from './types';

const people = peopleData as Record<string, Omit<Person, 'slug'>>;
const profiles = profilesData as Record<string, Omit<PersonProfile, 'slug'>>;

/** A person from content/people/people.json. Throws for unknown slugs so typos fail the build. */
export function getPerson(slug: string): Person {
  const person = people[slug];
  if (!person) throw new Error(`Unknown person "${slug}" – add it to content/people/people.json`);
  return { slug, ...person };
}

/** People with their own profile page under /directory/<slug>. */
export function getProfiles(): PersonProfile[] {
  return Object.entries(profiles).map(([slug, p]) => ({ slug, ...p }));
}

export function getProfile(slug: string): PersonProfile | undefined {
  const p = profiles[slug];
  return p ? { slug, ...p } : undefined;
}
