import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import type { PageFrontmatter } from './types';

const PAGES_DIR = path.join(process.cwd(), 'content', 'pages');

export interface Page {
  /** URL segments, e.g. `['about', 'history']`; empty for the home page. */
  slug: string[];
  frontmatter: PageFrontmatter;
  body: string;
}

function walk(dir: string): string[] {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name);
    return entry.isDirectory() ? walk(full) : entry.name.endsWith('.mdx') ? [full] : [];
  });
}

function slugFromFile(file: string): string[] {
  const rel = path.relative(PAGES_DIR, file).replace(/\\/g, '/').replace(/\.mdx$/, '');
  return rel === 'index' ? [] : rel.split('/');
}

/** All MDX pages under content/pages. `index.mdx` is the home page. */
export function getAllPages(): Page[] {
  return walk(PAGES_DIR).map((file) => {
    const { data, content } = matter(fs.readFileSync(file, 'utf8'));
    return { slug: slugFromFile(file), frontmatter: data as PageFrontmatter, body: content };
  });
}

export function getPage(slug: string[]): Page | undefined {
  const key = slug.join('/');
  return getAllPages().find((page) => page.slug.join('/') === key);
}
