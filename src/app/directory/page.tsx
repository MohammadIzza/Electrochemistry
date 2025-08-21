import type { Metadata } from 'next';
import DirectoryApp from '@/components/search/DirectoryApp';

export const metadata: Metadata = { title: 'Directory' };

export default function DirectoryPage() {
  return <DirectoryApp />;
}
