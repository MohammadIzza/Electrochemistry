import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import ContentPage from '@/components/layout/ContentPage';
import { getAllPages, getPage } from '@/lib/pages';

interface Params {
  params: Promise<{ slug: string[] }>;
}

export const dynamicParams = false;

export function generateStaticParams() {
  return getAllPages()
    .filter((page) => page.slug.length > 0)
    .map((page) => ({ slug: page.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const page = getPage((await params).slug);
  if (!page) return {};
  const { title, description, header } = page.frontmatter;
  return { title, description: description ?? header?.intro };
}

export default async function Page({ params }: Params) {
  const page = getPage((await params).slug);
  if (!page) notFound();
  return <ContentPage page={page} />;
}
