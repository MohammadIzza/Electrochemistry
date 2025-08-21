'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { mediaUrl, PORTRAIT_WIDTHS, variantUrl } from '@/lib/images';
import { search } from '@/lib/search/engine';
import { contentIndex, directoryIndex, portraitPath, type ContentRecord, type DirectoryRecord } from '@/lib/search/indexes';
import Pagination, { type PaginationClasses } from './Pagination';

const smallPager: PaginationClasses = {
  list: 'pager__items',
  previousPageItem: 'pager__item pager__item--small pager__item--previous',
  nextPageItem: 'pager__item pager__item--small pager__item--next',
  pageItem: 'hidden',
  selectedItem: 'is-active',
  disabledItem: 'pager__item pager__item--disabled',
  link: 'pager__link pager__link--small',
};
const prevLabel = (
  <>
    <span aria-hidden="true">←</span>
    <span className="visually-hidden ml-1"> Previous</span>
  </>
);
const nextLabel = (
  <>
    <span className="visually-hidden mr-1">Next </span>
    <span aria-hidden="true">→</span>
  </>
);

function Stats({ nbHits, query, noun }: { nbHits: number; query: string; noun: string }) {
  let text: ReactNode;
  if (nbHits === 0)
    text = (
      <>
        No matching {noun} for <strong>&quot;{query}&quot;</strong>
      </>
    );
  else if (nbHits === 1) text = '1 result';
  else text = `${nbHits.toLocaleString('en-US')} results`;
  return (
    <div className="ais-Stats">
      <span className="ais-Stats-text">{text}</span>
    </div>
  );
}

function contentUrl(n: ContentRecord): string {
  let url = n.content_type === 'article_incoming' || n.content_type === 'event_incoming' ? n.incoming_article_source_url ?? n.url : n.url;
  if (n.content_type === 'article' && n.article_link_override) url = n.article_link_override;
  return url;
}

function ContentHit({ hit }: { hit: ContentRecord }) {
  const external = hit.content_type === 'article_incoming' || hit.content_type === 'event_incoming' || (hit.content_type === 'article' && !!hit.article_link_override);
  const isPrivate = new URL(hit.url, 'https://example.org').pathname.startsWith('/faculty-staff');
  let pubDate = '';
  if (hit.pub_date && (hit.content_type === 'article' || hit.content_type === 'article_incoming')) {
    const d = new Date(hit.pub_date * 1000);
    pubDate = `${d.toLocaleString('en-US', { month: 'short' })} ${d.toLocaleString('en-US', { day: 'numeric' })}, ${d.toLocaleString('en-US', { year: 'numeric' })}`;
  }
  const description = hit.event_collecction_meta_description || hit.meta_description || '';
  return (
    <li>
      <a
        href={contentUrl(hit)}
        className={`text-18 text-orange font-medium antialiased block hover:underline${isPrivate ? ' is-private' : ''}${external ? ' is-external' : ''}`}
      >
        {hit.event_collection_title || hit.title}
      </a>
      <p className="text-16">
        {pubDate}
        {pubDate && hit.meta_description ? '—' : ''}
        {description}
      </p>
    </li>
  );
}

function PersonHit({ hit }: { hit: DirectoryRecord }) {
  const additional = typeof hit.titles_additional === 'string' ? [hit.titles_additional] : Array.isArray(hit.titles_additional) ? hit.titles_additional : [];
  const portrait = hit.image_path ? portraitPath(hit.image_path) : null;
  return (
    <li>
      <a href={hit.profile_link} className="block flex space-x-8 bg-shade-t20 px-4 py-6 rounded border border-transparent antialiased hover:border-shade-t60">
        <div className="w-full">
          <h3 className="text-18 tl:text-21">
            {hit.name_first} {hit.name_last}
          </h3>
          <ul className="text-16 font-medium text-blue tl:text-18">
            {' '}
            {Array.isArray(hit.titles_general) ? hit.titles_general.join(',') : hit.titles_general}{' '}
            {additional.map((t, i) => (
              <li key={i}>{t}</li>
            ))}
          </ul>
        </div>
        <div className="w-16 h-16 flex-shrink-0 rounded-full bg-shade-t60 flex items-center justify-center text-24 overflow-hidden">
          {portrait ? (
            // eslint-disable-next-line @next/next/no-img-element -- pre-resized portrait
            <img
              src={mediaUrl(portrait)}
              srcSet={PORTRAIT_WIDTHS.map((w) => `${variantUrl(portrait, w)} ${w}w`).join(', ')}
              data-sizes="auto"
              loading="lazy"
              width={600}
              height={600}
              alt={`Profile image of ${hit.name_first} ${hit.name_last}`}
            />
          ) : (
            `${hit.name_first[0]}${hit.name_last[0]}`
          )}
        </div>
      </a>
    </li>
  );
}

function SearchView({ query, onSearch }: { query: string; onSearch?: (q: string) => void }) {
  const [input, setInput] = useState(query);
  const [paneVisible, setPaneVisible] = useState(!!query);
  const [contentPage, setContentPage] = useState(0);
  const [peoplePage, setPeoplePage] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setInput(query);
    setContentPage(0);
    setPeoplePage(0);
    setPaneVisible(!!query);
    inputRef.current?.focus();
  }, [query]);

  const content = useMemo(
    () => search(contentIndex.records, contentIndex.config, { query, filters: contentIndex.filters, hitsPerPage: 10, page: contentPage }),
    [query, contentPage],
  );
  const people = useMemo(
    () => search(directoryIndex.records, directoryIndex.config, { query, filters: 'department_id:"959"', hitsPerPage: 6, page: peoplePage }),
    [query, peoplePage],
  );

  const clear = () => {
    setInput('');
    inputRef.current?.focus();
    setPaneVisible(false);
    onSearch?.('');
  };

  const href = () => (query ? `?q=${encodeURIComponent(query)}` : '?');

  return (
    <main id="main-content" className="flex-1 mb-4 tp:mb-8">
      <div className="container mt-8 tl:mt-16 ">
        <div className="mx-auto dt:max-w-screen-dt">
          <h1 className="text-21 antialiased tl:text-24">Your search starts here.</h1>
          <form
            id="ag_search"
            className="mb-16"
            onSubmit={(e) => {
              e.preventDefault();
              onSearch?.(input);
              setTimeout(() => setPaneVisible(true), 250);
            }}
          >
            <div className="w-full relative">
              <input
                ref={inputRef}
                id="ag_search_query"
                className="sitewide-search bg-shade-t30 border-none w-full relative tl:py-8 px-12 tl:px-16 tl:text-21"
                type="search"
                role="searchbox"
                placeholder=""
                aria-label="Enter the text with which you want to search the site."
                value={input}
                onChange={(e) => {
                  setInput(e.target.value);
                  if (!e.target.value) clear();
                }}
                onKeyUp={(e) => {
                  if (e.key === 'Escape' || e.key === 'Esc') clear();
                }}
              />
              <button
                id="ag_submit_search"
                className="icon-search-regular text-orange-s20 absolute left-0 bg-transparent w-12 h-12 tl:w-16 tl:h-16"
                type="submit"
                aria-label="Submit search request"
              ></button>
              <button
                id="ag_clear_search"
                className="text-24 absolute top-0 right-0 text-orange w-12 h-12 tl:w-16 tl:h-16 "
                role="button"
                aria-label="clear search query"
                disabled={!input}
                onClick={(e) => {
                  e.preventDefault();
                  clear();
                }}
              >
                <span aria-hidden="true">×</span>
              </button>
            </div>
          </form>
          <div id="resultsPane" className={paneVisible ? '' : 'hidden'}>
            <div className="tl:flex tl:space-x-8">
              <div className="mb-8 tl:w-1/2">
                <h2 className="text-21 mb-2 font-medium relative">
                  <span className="relative z-10 bg-white pr-2">Website content</span>
                </h2>
                <hr className="mb-4" />
                <div className="flex w-full items-center">
                  <div id="countResultsContent" className="ml-auto mb-8">
                    <Stats nbHits={content.nbHits} query={query} noun="content" />
                  </div>
                  <div id="pagerContent" className="flex-shrink-0 mb-8 ml-2">
                    <Pagination
                      page={content.page}
                      nbPages={content.nbPages}
                      href={href}
                      onChange={setContentPage}
                      classes={smallPager}
                      previousLabel={prevLabel}
                      nextLabel={nextLabel}
                    />
                  </div>
                </div>
                <ol id="resultsContent" className="flow-relaxed">
                  {content.hits.map((hit) => (
                    <ContentHit key={hit.objectID} hit={hit} />
                  ))}
                </ol>
              </div>
              <div className="tl:w-1/2 dt:pl-12">
                <h2 className="text-21 mb-2 font-medium relative">
                  <span className="relative z-10 bg-white pr-2">People</span>
                </h2>
                <hr className="mb-4" />
                <div className="flex w-full items-center">
                  <div id="countResultsPeople" className="ml-auto mb-8">
                    <Stats nbHits={people.nbHits} query={query} noun="profiles" />
                  </div>
                  <div id="pagerPeople" className="flex-shrink-0 mb-8 ml-2">
                    <Pagination
                      page={people.page}
                      nbPages={people.nbPages}
                      href={href}
                      onChange={setPeoplePage}
                      classes={smallPager}
                      previousLabel={prevLabel}
                      nextLabel={nextLabel}
                    />
                  </div>
                </div>
                <ol id="resultsPeople" className="flow-relaxed">
                  {people.hits.map((hit) => (
                    <PersonHit key={hit.objectID} hit={hit} />
                  ))}
                </ol>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

function SearchWithRouting() {
  const params = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const query = params.get('q') ?? '';
  return <SearchView query={query} onSearch={(q) => router.push(q ? `${pathname}?q=${encodeURIComponent(q)}` : pathname, { scroll: false })} />;
}

/** Site-wide search over pages and people. */
export default function SiteSearch() {
  return (
    <Suspense fallback={<SearchView query="" />}>
      <SearchWithRouting />
    </Suspense>
  );
}
