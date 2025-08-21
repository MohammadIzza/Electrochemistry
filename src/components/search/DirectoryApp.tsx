'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useMemo, useState } from 'react';
import { mediaUrl, PORTRAIT_WIDTHS, variantUrl } from '@/lib/images';
import { search } from '@/lib/search/engine';
import { directoryIndex, portraitPath, type DirectoryRecord } from '@/lib/search/indexes';
import Pagination from './Pagination';

const HITS_PER_PAGE = 10;
const FACET_LIMIT = 10;

interface DirectoryState {
  q: string;
  position: string[];
  foi: string[];
  /** 1-based */
  page: number;
}

function readState(params: URLSearchParams): DirectoryState {
  const list = (key: string) =>
    [...params.entries()]
      .filter(([k]) => k === key || k.startsWith(`${key}[`))
      .map(([, v]) => v);
  return { q: params.get('q') ?? '', position: list('position'), foi: list('foi'), page: Math.max(1, Number(params.get('page') ?? 1) || 1) };
}

function stateToQuery(s: DirectoryState): string {
  const parts: string[] = [];
  const enc = encodeURIComponent;
  if (s.q) parts.push(`q=${enc(s.q)}`);
  s.position.forEach((v, i) => parts.push(`${enc(`position[${i}]`)}=${enc(v)}`));
  s.foi.forEach((v, i) => parts.push(`${enc(`foi[${i}]`)}=${enc(v)}`));
  if (s.page > 1) parts.push(`page=${s.page}`);
  return parts.length ? `?${parts.join('&')}` : '';
}

/** `1-Tenure-Track/Tenured Faculty` → `Tenure-Track/Tenured Faculty` */
const positionLabel = (v: string) => v.replace(/\d+(-)|[^a-zA-Z /-]/g, '');
const attributeLabel = (attr: string) =>
  attr
    .replace(/_/g, ' ')
    .split(' ')
    .map((w) => w[0].toUpperCase() + w.slice(1).toLowerCase())
    .join(' ');
const asList = (v?: string | string[]) => (v == null ? [] : Array.isArray(v) ? v : [v]);

function sortedFacet(counts: Record<string, number> | undefined, refined: string[]) {
  const values = new Set([...Object.keys(counts ?? {}), ...refined]);
  return [...values].sort((a, b) => a.localeCompare(b)).map((value) => ({ value, count: counts?.[value] ?? 0, isRefined: refined.includes(value) }));
}

function Hit({ hit }: { hit: DirectoryRecord }) {
  const name = `${hit.name_first} ${hit.name_last}`;
  const fields = asList(hit.fields_of_interest);
  const hasOffice = hit.building && hit.building_url && hit.room_number;
  const portrait = hit.image_path ? portraitPath(hit.image_path) : null;
  return (
    <li className="ais-Hits-item">
      <div className="bg-shade-t20 p-4 border-b-2 border-shade-t60 flow tp:p-8 tp:pb-4">
        <div className="flow mb-8 tp:mb-8 tp:flow-none tp:flex tp:flex-row-reverse tp:gap-8">
          <div className="w-48 h-48 mx-auto rounded-full overflow-hidden bg-shade-s20 flex items-center justify-center text-80 text-white tp:flex-shrink-0">
            {portrait ? (
              // eslint-disable-next-line @next/next/no-img-element -- pre-resized portrait
              <img
                src={mediaUrl(portrait)}
                srcSet={PORTRAIT_WIDTHS.map((w) => `${variantUrl(portrait, w, { webp: false })} ${w}w`).join(', ')}
                data-sizes="auto"
                loading="lazy"
                width={600}
                height={600}
                alt={`Profile image of ${name}`}
              />
            ) : (
              `${hit.name_first?.[0] ?? ''}${hit.name_last?.[0] ?? ''}`
            )}
          </div>
          <div className="flow w-full">
            <h2 className="font-bold antialiased text-24 tp:text-36">
              {hit.profile_link ? (
                <a href={hit.profile_link} className="hover:border-b">
                  {name}
                </a>
              ) : (
                name
              )}
            </h2>
            <ul className="list-none ml-0 antialiased font-serif text-21 font-bold text-blue antialiased tp:text-24" aria-label="List of associated roles">
              {[...asList(hit.titles_general), ...asList(hit.titles_additional)].map((t, i) => (
                <li key={i}>{t}</li>
              ))}
            </ul>
            {fields.length > 0 && (
              <div className="text-16 tl:text-18">
                <strong className="font-medium">Fields of Interest: </strong>
                {fields.join(', ')}{' '}
              </div>
            )}
            {hit.additional_information && (
              <div className="formatted text-16 tl:text-18" dangerouslySetInnerHTML={{ __html: hit.additional_information }} />
            )}
          </div>
        </div>
        <div className="text-16 font-medium antialiased text-shade-s40 pt-4 border-t-3 border-shade-t40 flow w-full tp:flow-none tp:flex tp:items-start tp:gap-8 dt:items-center">
          <div className="flow nowrap overflow-hidden truncate w-full dt:flow-none dt:flex dt:items-center dt:gap-8">
            {hit.email && (
              <div className="flex items-center dt:overflow-hidden">
                <span className="icon-envelope-regular mr-2 text-shade-s40" aria-hidden="true"></span>
                <a href={`mailto:${hit.email}`} className="inline-block link-in-text--dark truncate">
                  <span className="visually-hidden">Email: </span>
                  {hit.email}
                </a>
              </div>
            )}
            {hit.telephone && (
              <div className="flex items-center flex-shrink-0">
                <span className="icon-phone-alt-solid mr-2 text-shade-s40" aria-hidden="true"></span>
                <span className="font-medium antialiased">
                  <span className="visually-hidden">Telephone: </span>
                  {hit.telephone}
                </span>
              </div>
            )}
            {hasOffice && (
              <div className="flex items-center font-medium gap-2 flex-shrink-0">
                <span className="icon-map-marker-alt-solid mb-0"></span>
                <span className="visually-hidden">Building: </span>
                <a
                  href={`https://utdirect.utexas.edu/apps/campus/buildings/nlogon/maps${hit.building_url!.toUpperCase()}/`}
                  className="inline-block link-in-text--dark"
                >
                  {hit.building}
                </a>
                <div className="inline-block">
                  <span className="visually-hidden">Office: </span>
                  {hit.room_number}
                </div>
              </div>
            )}
          </div>
          {hit.profile_link && (
            <a href={hit.profile_link} className="btn btn--arrow-right-long uppercase flex-shrink-0" tabIndex={-1}>
              See Profile
            </a>
          )}
        </div>
      </div>
    </li>
  );
}

function UpdateProfileBox() {
  return (
    <div className="border-t-6 border-orange">
      <div className="border border-t-0 border-shade-t40 p-4 text-center dt:p-8">
        <h3 className="font-bold text-24">
          Update Your
          <br />
          Directory Profile
        </h3>
        <p className="text-18 antialiased mb-4">Need or want to update your directory profile?</p>
        <p>
          <a href="https://wikis.utexas.edu/x/JJ97FQ" className="uppercase btn btn--arrow-right-long">
            Learn How
          </a>
        </p>
      </div>
    </div>
  );
}

function DirectoryView({ state, setState }: { state: DirectoryState; setState?: (s: DirectoryState) => void }) {
  const [input, setInput] = useState(state.q);
  useEffect(() => setInput(state.q), [state.q]);
  const update = (patch: Partial<DirectoryState>) => setState?.({ ...state, page: 1, ...patch });

  const { records, config, filters } = directoryIndex;
  const positionFilter = state.position.map((v) => `position_type:${v}`);
  const foiFilter = state.foi.map((v) => `fields_of_interest:${v}`);
  const base = { query: state.q, filters, maxValuesPerFacet: FACET_LIMIT };

  const results = useMemo(
    () => search(records, config, { ...base, facetFilters: [positionFilter, foiFilter].filter((f) => f.length), hitsPerPage: HITS_PER_PAGE, page: state.page - 1 }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [state],
  );
  const positionFacet = useMemo(
    () => search(records, config, { ...base, facetFilters: foiFilter.length ? [foiFilter] : [], facets: ['position_type'], hitsPerPage: 0 }).facets.position_type,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [state],
  );
  const foiFacet = useMemo(
    () => search(records, config, { ...base, facetFilters: positionFilter.length ? [positionFilter] : [], facets: ['fields_of_interest'], hitsPerPage: 0 }).facets.fields_of_interest,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [state],
  );
  const positions = sortedFacet(positionFacet, state.position);
  const fields = sortedFacet(foiFacet, state.foi);
  const toggle = (list: string[], value: string) => (list.includes(value) ? list.filter((v) => v !== value) : [...list, value]);
  const hasRefinements = state.position.length + state.foi.length > 0;

  const refinementGroups = [
    { attribute: 'position_type', values: state.position, counts: positionFacet, label: positionLabel, key: 'position' as const },
    { attribute: 'fields_of_interest', values: state.foi, counts: foiFacet, label: (v: string) => v.replace(/\d+(-)|[^a-zA-Z /-]/g, ''), key: 'foi' as const },
  ].filter((g) => g.values.length);

  return (
    <main id="main-content" className="flex-1 mb-4 tp:mb-8">
      <div className="bg-shade-t30 relative">
        <div className="container dt:pr-16 pt-12 pb-10 tp:pt-18 tp:pb-12 dt:pt-24 dt:pb-16">
          <h1 className="font-bold text-36 h-ul tp:text-72 dt:text-72">Directory</h1>
          <form
            id="ag_search"
            className="w-full max-w-lg"
            aria-label="Search for people"
            onSubmit={(e) => {
              e.preventDefault();
              update({ q: input });
            }}
          >
            <div className="w-full relative flex floating-label-container">
              <input
                id="ag_search_query"
                className="input-text input-search w-full relative pr-14 bg-white rounded-tr-none rounded-br-none border-r-0 mb-0"
                type="search"
                role="searchbox"
                placeholder=" "
                required
                value={input}
                onChange={(e) => {
                  setInput(e.target.value);
                  if (!e.target.value && state.q) update({ q: '' });
                }}
              />
              <label htmlFor="ag_search_query" className="floating-label">
                Search by name
              </label>
              <button id="ag_submit_search" className="btn btn--input-to-left flex-shrink-0 w-14 leading-none" type="submit" aria-label="Submit search request">
                <span className="icon-search-regular text-20"></span>
              </button>
              <button
                id="ag_clear_search"
                className="text-24 absolute h-12 top-0 right-0 w-14 text-orange right-14"
                role="button"
                aria-label="clear search query"
                disabled={!input}
                onClick={(e) => {
                  e.preventDefault();
                  setInput('');
                  document.getElementById('ag_search_query')?.focus();
                  update({ q: '' });
                }}
              >
                <span aria-hidden="true">×</span>
              </button>
            </div>
          </form>
        </div>
      </div>
      <div className="my-6 tp:my-12 dt:my-16">
        <div className="container">
          <div className="flow tl:flex tl:space-x-8 dt:space-x-12 dt:flow-none">
            <div className="w-full tl:w-4/16">
              <div>
                <div className="pb-6 flex items-center border-b-3 border-shade-t60">
                  <div className="w-full font-medium">
                    <div>Filter by</div>
                  </div>
                  <div className="flex-shrink-0">
                    <div id="clearRefinements">
                      <div className="ais-ClearRefinements">
                        <button
                          className={`ais-ClearRefinements-button underline font-medium${hasRefinements ? '' : ' ais-ClearRefinements-button--disabled'}`}
                          disabled={!hasRefinements}
                          onClick={() => update({ position: [], foi: [] })}
                        >
                          Clear All Filters
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flow mb-8 tl:flow-none dt:block dt:flow">
                  <div className="dt:block dt:w-full">
                    <details className="overflow-hidden" open>
                      <summary
                        id="directory_client_position_type_refinement"
                        className="font-bold p-4 pr-12 border-b border-shade-t60 w-full text-left relative flex items-center bg-white cursor-pointer transition-transform focus:bg-shade-t20 hover:text-orange focus:text-orange"
                      >
                        Position Type
                      </summary>
                      <div
                        id="directory_client_position_type_toggle"
                        className="bg-white border-b border-shade-t60 py-4"
                        role="group"
                        aria-labelledby="directory_client_position_type_refinement"
                      >
                        <ul className="flow px-4 py-2">
                          {positions.map((item, i) => (
                            <li key={item.value}>
                              <span>
                                <label htmlFor={`directory_client_position_type_${i}`} className="flex items-top">
                                  <input
                                    id={`directory_client_position_type_${i}`}
                                    type="checkbox"
                                    name={positionLabel(item.value)}
                                    value={item.value.replace(/[^0-9a-zA-Z /-]/g, '')}
                                    checked={item.isRefined}
                                    onChange={() => update({ position: toggle(state.position, item.value) })}
                                    className="checkbox flex-shrink-0"
                                  />
                                  <span className="font-medium">{positionLabel(item.value)}</span>
                                </label>
                              </span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </details>
                    <details id="fieldsOfInterestToggle" className={fields.length ? '' : 'hidden'}>
                      <summary
                        id="directory_client_fields_of_interest_refinement"
                        className="font-bold p-4 pr-12 border-b border-shade-t60 w-full text-left relative flex items-center bg-white cursor-pointer transition-transform focus:bg-shade-t20 hover:text-orange focus:text-orange"
                      >
                        Fields of Interest
                      </summary>
                      <div
                        id="directory_client_fields_of_interest"
                        className="bg-white border-b border-shade-t60 py-4"
                        role="group"
                        aria-labelledby="directory_client_fields_of_interest_refinement"
                      >
                        <ul className="flow px-4 py-2">
                          {fields.map((item, i) => (
                            <li key={item.value}>
                              <span>
                                <label htmlFor={`directory_client_fields_of_interest_${i}`} className="flex items-center">
                                  <input
                                    id={`directory_client_fields_of_interest_${i}`}
                                    type="checkbox"
                                    name={item.value}
                                    value={item.value}
                                    checked={item.isRefined}
                                    onChange={() => update({ foi: toggle(state.foi, item.value) })}
                                    className="checkbox flex-shrink-0"
                                  />
                                  <span className="font-medium">{item.value}</span>
                                </label>
                              </span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </details>
                  </div>
                </div>
              </div>
              <div className="hidden tl:block">
                <UpdateProfileBox />
              </div>
            </div>
            <div className="w-full tl:w-12/16">
              <div id="directory_client_stats" aria-live="polite" className="font-medium text-14"></div>
              <div id="directory_client_current_refinements" aria-live="polite">
                <ul>
                  {refinementGroups.flatMap((group) =>
                    group.values.map((value) => (
                      <li key={`${group.attribute}:${value}`} className="text-14 font-medium text-orange rounded-full py-2 px-4 border border-shade-t40 inline-flex items-center mb-4">
                        <span className="mr-6">
                          {attributeLabel(group.attribute)}: {group.label(value)}
                        </span>
                        <button
                          data-attribute={group.attribute}
                          data-type="disjunctive"
                          data-value={value}
                          data-label={value}
                          data-count={group.counts?.[value] ?? 0}
                          data-exhaustive="true"
                          className="leading-zero text-18"
                          onClick={() => update({ [group.key]: state[group.key].filter((v) => v !== value) })}
                        >
                          <span className="icon-times-light font-bold">
                            <span className="visually-hidden">Remove the filter for {group.label(value)}</span>
                          </span>
                        </button>
                      </li>
                    )),
                  )}
                </ul>
              </div>
              <div id="ag_results" aria-live="polite">
                <div>
                  {results.hits.length ? (
                    <div className="ais-Hits">
                      <ol className="ais-Hits-list flow-relaxed">
                        {results.hits.map((hit) => (
                          <Hit key={hit.objectID} hit={hit} />
                        ))}
                      </ol>
                    </div>
                  ) : (
                    <div className="ais-Hits ais-Hits--empty">
                      <p className="text-20">
                        No profiles found matching{' '}
                        <strong>
                          <q>{state.q}</q>
                        </strong>
                      </p>
                    </div>
                  )}
                </div>
              </div>
              <nav id="ag_pager" className="pager" aria-label="search pagination">
                <div
                  className={`ais-Panel pager__panel mt-8${results.nbPages <= 1 ? ' ais-Panel--noRefinement pager__panel--empty' : ''}`}
                  hidden={results.nbPages <= 1}
                >
                  <div className="ais-Panel-body">
                    <div>
                      <Pagination
                        page={results.page}
                        nbPages={results.nbPages}
                        padding={1}
                        href={(p) => stateToQuery({ ...state, page: p + 1 }) || '?'}
                        onChange={(p) => {
                          setState?.({ ...state, page: p + 1 });
                          document.getElementById('main-content')?.scrollIntoView();
                        }}
                        classes={{
                          list: 'pager__items',
                          item: 'pager__item',
                          previousPageItem: 'pager__item--previous',
                          nextPageItem: 'pager__item--next',
                          selectedItem: 'is-active',
                          disabledItem: 'pager__item--disabled',
                          link: 'pager__link',
                        }}
                        previousLabel={
                          <>
                            <span aria-hidden="true">←</span>
                            <span className="visually-hidden ml-1 dt:visually-unhidden"> Previous</span>
                          </>
                        }
                        nextLabel={
                          <>
                            <span className="visually-hidden mr-1 dt:visually-unhidden">Next </span>
                            <span aria-hidden="true">→</span>
                          </>
                        }
                      />
                    </div>
                  </div>
                </div>
              </nav>
              <div className="mt-8 tl:hidden">
                <UpdateProfileBox />
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

function DirectoryWithRouting() {
  const params = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const state = readState(new URLSearchParams(params.toString()));
  return <DirectoryView state={state} setState={(s) => router.push(`${pathname}${stateToQuery(s)}`, { scroll: false })} />;
}

/** People directory with search, position/field filters and pagination. */
export default function DirectoryApp() {
  return (
    <Suspense fallback={<DirectoryView state={{ q: '', position: [], foi: [], page: 1 }} />}>
      <DirectoryWithRouting />
    </Suspense>
  );
}
