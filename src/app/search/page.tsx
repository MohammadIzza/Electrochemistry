import type { Metadata } from 'next';
import SiteSearch from '@/components/search/SiteSearch';

export const metadata: Metadata = { title: 'Search' };

export default function SearchPage() {
  return <SiteSearch />;
}
