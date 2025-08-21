import contentRecords from '@content/search/content.json';
import directoryRecords from '@content/search/directory.json';
import type { IndexConfig } from './engine';

/** A person in the directory index (content/search/directory.json). */
export interface DirectoryRecord {
  objectID: string;
  name_first: string;
  name_last: string;
  titles_general?: string | string[];
  titles_additional?: string | string[];
  department?: string | string[];
  fields_of_interest?: string | string[];
  areas_of_research?: string | string[];
  position_type?: string;
  email?: string;
  telephone?: string;
  building?: string;
  building_url?: string;
  room_number?: string;
  image_path?: string;
  profile_link?: string;
  additional_information?: string;
}

/** A page in the site-content index (content/search/content.json). */
export interface ContentRecord {
  objectID: string;
  title?: string;
  event_collection_title?: string;
  url: string;
  content_type?: string;
  incoming_article_source_url?: string;
  article_link_override?: string;
  meta_description?: string;
  event_collecction_meta_description?: string;
  pub_date?: number;
}

export const directoryIndex = {
  records: directoryRecords as unknown as DirectoryRecord[],
  config: {
    searchable: ['name_first', 'name_last', 'areas_of_research', 'fields_of_interest', 'department', null, 'titles_general', 'titles_additional', 'position_type'],
    facetable: ['department', 'department_id', 'position_type', 'hide_on_college', 'areas_of_research', 'fields_of_interest', 'custom_directory_affiliation', 'custom_directory_affiliation_name'],
    typo: { one: 4, two: 8 },
  } satisfies IndexConfig,
  /** Restricts the shared directory to this site's people. */
  filters: 'department_id = 959',
};

export const contentIndex = {
  records: contentRecords as unknown as ContentRecord[],
  config: {
    searchable: ['title', 'meta_description', 'content_blocks_formatted_texts', 'content_blocks_headings', 'content_blocks_list_items', 'content_blocks_person_slug', 'content_blocks_preheadings', 'content_blocks_subheadings', 'article_incoming_content', 'pages_intro'],
    facetable: [],
    typo: { one: 3, two: 8 },
  } satisfies IndexConfig,
  filters: 'NOT event_private:true',
};

/** Directory portrait path (`/sites/default/files/…`) → path under /public/media. */
export function portraitPath(imagePath: string): string {
  return decodeURIComponent(imagePath.replace(/^\/sites\/default\/files\//, ''));
}
