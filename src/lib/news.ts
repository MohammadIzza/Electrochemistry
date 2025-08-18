import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import categoriesData from '@content/news/categories.json';
import { pageCount } from './pagination';
import type { NewsCategory, NewsItem } from './types';

const NEWS_DIR = path.join(process.cwd(), 'content', 'news');

/** Items shown per page on news listings. */
export const NEWS_PER_PAGE = 10;

export const newsCategories = categoriesData as NewsCategory[];

/** All news items, newest first. */
export function getAllNews(): NewsItem[] {
  return fs
    .readdirSync(NEWS_DIR)
    .filter((f) => f.endsWith('.md'))
    .map((file) => {
      const { data, content } = matter(fs.readFileSync(path.join(NEWS_DIR, file), 'utf8'));
      const date = data.date instanceof Date ? data.date.toISOString().slice(0, 10) : String(data.date);
      return { ...data, date, slug: file.replace(/\.md$/, ''), summary: content.trim() || undefined } as NewsItem;
    })
    .sort((a, b) => b.date.localeCompare(a.date) || a.slug.localeCompare(b.slug));
}

export function getNewsByCategory(category: string): NewsItem[] {
  return getAllNews().filter((item) => item.category === category);
}

export function getCategory(slug: string): NewsCategory | undefined {
  return newsCategories.find((c) => c.slug === slug);
}

export function newsPageCount(total: number): number {
  return pageCount(total, NEWS_PER_PAGE);
}
