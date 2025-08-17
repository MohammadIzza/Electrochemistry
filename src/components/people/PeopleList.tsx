import { getPerson } from '@/lib/people';
import PersonCard from './PersonCard';

/** Stack of contact cards. `people` are slugs from content/people/people.json. */
export default function PeopleList({ people }: { people: string[] }) {
  return (
    <div className="flow">
      {people.map((slug) => (
        <PersonCard key={slug} person={getPerson(slug)} />
      ))}
    </div>
  );
}
