/**
 * Small client-side search engine that reproduces the behaviour of the Algolia
 * indexes the original site used (typo tolerance, ranking, filters, facets).
 * Data lives in content/search/*.json; settings per index are in ./indexes.ts.
 */

export interface IndexConfig {
  /** Searchable attributes in ranking order (`null` keeps a slot for an unused attribute). */
  searchable: (string | null)[];
  /** Attributes usable in facet filters and facet counts. */
  facetable: string[];
  /** Minimum word length for one / two typos. */
  typo: { one: number; two: number };
}

export interface SearchParams {
  query?: string;
  /** Algolia-style filter expression, e.g. `department_id = 959`. */
  filters?: string;
  /** AND of ORs, e.g. `[["position_type:Staff"], ["fields_of_interest:Materials"]]`. */
  facetFilters?: (string | string[])[];
  facets?: string[];
  maxValuesPerFacet?: number;
  hitsPerPage?: number;
  /** 0-based page. */
  page?: number;
}

export interface SearchResult<T> {
  hits: T[];
  nbHits: number;
  nbPages: number;
  page: number;
  hitsPerPage: number;
  facets: Record<string, Record<string, number>>;
}

type Rec = Record<string, unknown>;

// ---------------------------------------------------------------- text
function norm(s: string): string {
  return s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
}

export function tokens(s: unknown): string[] {
  return norm(String(s).replace(/<[^>]*>/g, ' ')).match(/[a-z0-9]+/g) ?? [];
}

function values(v: unknown): unknown[] {
  if (v == null) return [];
  if (Array.isArray(v)) return v.flatMap(values);
  if (typeof v === 'object') return Object.values(v as Rec).flatMap(values);
  return [v];
}

/** Damerau-Levenshtein (optimal string alignment) distance. */
function dl(a: string, b: string): number {
  const d: number[][] = [];
  for (let i = 0; i <= a.length; i++) d[i] = [i];
  for (let j = 0; j <= b.length; j++) d[0][j] = j;
  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + cost);
      if (i > 1 && j > 1 && a[i - 1] === b[j - 2] && a[i - 2] === b[j - 1]) d[i][j] = Math.min(d[i][j], d[i - 2][j - 2] + 1);
    }
  }
  return d[a.length][b.length];
}

/**
 * Matches a query word against a token. Like Algolia, a typo on the first letter
 * fits the typo budget but is ranked as two typos; the last word matches prefixes.
 */
function matchWord(qw: string, tok: string, isLast: boolean, typo: IndexConfig['typo']) {
  if (tok === qw) return { typos: 0, exact: true };
  if (isLast && tok.startsWith(qw)) return { typos: 0, exact: false };
  const max = qw.length >= typo.two ? 2 : qw.length >= typo.one ? 1 : 0;
  if (!max) return null;
  let best: { e: number; first: boolean } | null = null;
  const consider = (t: string) => {
    if (Math.abs(t.length - qw.length) > max) return;
    const e = dl(qw, t);
    if (e > 0 && e <= max && (!best || e < best.e)) best = { e, first: qw[0] !== t[0] };
  };
  consider(tok);
  if (isLast) {
    for (let n = Math.max(1, qw.length - max); n <= Math.min(tok.length - 1, qw.length + max); n++) consider(tok.slice(0, n));
  }
  if (!best) return null;
  const b = best as { e: number; first: boolean };
  return { typos: b.e + (b.first ? 1 : 0), exact: false };
}

// ---------------------------------------------------------------- filters
type Pred = (r: Rec) => boolean;

function getAttr(r: Rec, attr: string): unknown {
  return attr.split('.').reduce<unknown>((o, k) => (o == null ? undefined : (o as Rec)[k]), r);
}

function eqValue(r: Rec, attr: string, val: string) {
  return values(getAttr(r, attr)).some((v) => String(v).toLowerCase() === val.toLowerCase());
}

function numCmp(r: Rec, attr: string, op: string, n: number) {
  return values(getAttr(r, attr)).some((raw) => {
    const v = Number(raw);
    switch (op) {
      case '=': return v === n;
      case '!=': return v !== n;
      case '<': return v < n;
      case '<=': return v <= n;
      case '>': return v > n;
      case '>=': return v >= n;
      default: return false;
    }
  });
}

/** Parses an Algolia `filters` string (`AND`, `OR`, `NOT`, `attr:value`, `attr = n`, ranges). */
function parseFilters(str: string | undefined, facetable: string[]): Pred {
  const re = /\s*(\(|\)|AND\b|OR\b|NOT\b|"(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'|<=|>=|!=|=|<|>|:|TO\b|[^\s():"'<>=!]+)/y;
  const toks: string[] = [];
  const s = (str ?? '').trim();
  let m: RegExpExecArray | null;
  re.lastIndex = 0;
  while (re.lastIndex < s.length && (m = re.exec(s))) toks.push(m[1]);
  if (!toks.length) return () => true;
  let pos = 0;
  const peek = () => toks[pos];
  const next = () => toks[pos++];
  const unq = (t: string) => (/^["']/.test(t) ? t.slice(1, -1).replace(/\\(.)/g, '$1') : t);

  const parseAtom = (): Pred => {
    if (peek() === '(') {
      next();
      const e = parseOr();
      if (peek() === ')') next();
      return e;
    }
    const attr = unq(next());
    const op = next();
    if (op === ':') {
      const v1 = unq(next());
      if (peek() === 'TO') {
        next();
        const v2 = Number(unq(next()));
        return (r) => numCmp(r, attr, '>=', Number(v1)) && numCmp(r, attr, '<=', v2);
      }
      // Facet filters on non-faceted attributes never match, as in Algolia.
      if (!facetable.includes(attr)) return () => false;
      return (r) => eqValue(r, attr, v1);
    }
    const n = Number(unq(next()));
    return (r) => numCmp(r, attr, op, n);
  };
  const parseNot = (): Pred => {
    if (peek() === 'NOT') {
      next();
      const p = parseNot();
      return (r) => !p(r);
    }
    return parseAtom();
  };
  const parseAnd = (): Pred => {
    let left = parseNot();
    while (peek() === 'AND') {
      next();
      const l = left;
      const r2 = parseNot();
      left = (r) => l(r) && r2(r);
    }
    return left;
  };
  function parseOr(): Pred {
    let left = parseAnd();
    while (peek() === 'OR') {
      next();
      const l = left;
      const r2 = parseAnd();
      left = (r) => l(r) || r2(r);
    }
    return left;
  }
  return parseOr();
}

function parseFacetFilters(list: SearchParams['facetFilters'], facetable: string[]): Pred {
  if (!list?.length) return () => true;
  const groups = list.map((g) =>
    (Array.isArray(g) ? g : [g]).map((f): Pred => {
      const neg = f.startsWith('-');
      const body = neg ? f.slice(1) : f;
      const i = body.indexOf(':');
      const attr = body.slice(0, i);
      const val = body.slice(i + 1);
      if (!facetable.includes(attr)) return () => neg;
      return (r) => eqValue(r, attr, val) !== neg;
    }),
  );
  return (r) => groups.every((ors) => ors.some((p) => p(r)));
}

// ---------------------------------------------------------------- ranking
const MAX_PROXIMITY = 8;
/** Tokens of one searchable attribute, plus each value as a whole (for exact matching). */
type AttrTokens = { t: string; pos: number }[] & { whole?: string[] };
const tokenCache = new WeakMap<object, AttrTokens[]>();

function tokenize(r: Rec, searchable: (string | null)[]): AttrTokens[] {
  const cached = tokenCache.get(r);
  if (cached) return cached;
  const attrs = searchable.map((attr) => {
    const list: AttrTokens = [];
    let pos = 0;
    const vals = values(attr ? r[attr] : null);
    list.whole = vals.map((v) => tokens(v).join(' '));
    for (const v of vals) {
      for (const t of tokens(v)) list.push({ t, pos: pos++ });
      pos += 8;
    }
    return list;
  });
  tokenCache.set(r, attrs);
  return attrs;
}

interface Score {
  typos: number;
  prox: number;
  attr: number;
  exact: number;
}

/** Algolia tie-breaking: typo, proximity, attribute (unordered), exact, custom ranking. */
function score(r: Rec, qwords: string[], cfg: IndexConfig): Score | null {
  if (!qwords.length) return { typos: 0, prox: 0, attr: 0, exact: 0 };
  const attrs = tokenize(r, cfg.searchable);
  const total: Score = { typos: 0, prox: 0, attr: Infinity, exact: 0 };
  const occ: { attr: number; pos: number; typos: number }[][] = [];
  qwords.forEach((qw, wi) => {
    const isLast = wi === qwords.length - 1;
    let minTypos = Infinity;
    let exact = false;
    let list: { attr: number; pos: number; typos: number }[] = [];
    attrs.forEach((toks, ai) => {
      for (const tok of toks) {
        const m = matchWord(qw, tok.t, isLast, cfg.typo);
        if (!m) continue;
        list.push({ attr: ai, pos: tok.pos, typos: m.typos });
        if (m.typos < minTypos) minTypos = m.typos;
        if (m.exact) exact = true;
      }
    });
    list = list.filter((o) => o.typos === minTypos);
    list.forEach((o) => {
      if (o.attr < total.attr) total.attr = o.attr;
    });
    total.typos += minTypos;
    total.exact += exact ? 1 : 0;
    occ.push(list);
  });
  if (occ.some((l) => l.length === 0)) return null;

  let proxAttr = Infinity;
  for (let i = 0; i + 1 < occ.length; i++) {
    let best = MAX_PROXIMITY;
    let bestAttr = Infinity;
    for (const a of occ[i]) {
      for (const b of occ[i + 1]) {
        if (a.attr !== b.attr) continue;
        const d = Math.min(MAX_PROXIMITY, Math.max(1, Math.abs(b.pos - a.pos)));
        if (d < best || (d === best && a.attr < bestAttr)) {
          best = d;
          bestAttr = a.attr;
        }
      }
    }
    if (best === MAX_PROXIMITY) for (const o of [...occ[i], ...occ[i + 1]]) if (o.attr < bestAttr) bestAttr = o.attr;
    total.prox += best;
    proxAttr = Math.min(proxAttr, bestAttr);
  }
  if (occ.length > 1) total.attr = proxAttr;
  // exactOnSingleWordQuery = attribute
  if (qwords.length === 1) total.exact = attrs.some((a) => a.whole?.includes(qwords[0])) ? 1 : 0;
  return total;
}

// ---------------------------------------------------------------- search
export function search<T extends object>(records: T[], cfg: IndexConfig, params: SearchParams = {}): SearchResult<T> {
  const recs = records as unknown as Rec[];
  const f1 = parseFilters(params.filters, cfg.facetable);
  const f2 = parseFacetFilters(params.facetFilters, cfg.facetable);
  const qwords = tokens(params.query ?? '');

  const scored: { r: Rec; s: Score; i: number }[] = [];
  recs.forEach((r, i) => {
    if (!f1(r) || !f2(r)) return;
    const s = score(r, qwords, cfg);
    if (s) scored.push({ r, s, i });
  });
  scored.sort((a, b) => a.s.typos - b.s.typos || a.s.prox - b.s.prox || a.s.attr - b.s.attr || b.s.exact - a.s.exact || a.i - b.i);
  const matches = scored.map((x) => x.r);

  const facets: SearchResult<T>['facets'] = {};
  const max = params.maxValuesPerFacet ?? 100;
  for (const name of (params.facets ?? []).filter((n) => cfg.facetable.includes(n))) {
    const counts: Record<string, number> = {};
    for (const r of matches) {
      for (const v of new Set(values(getAttr(r, name)).map(String))) counts[v] = (counts[v] ?? 0) + 1;
    }
    const keys = Object.keys(counts)
      .sort((a, b) => counts[b] - counts[a] || (a < b ? -1 : 1))
      .slice(0, max);
    if (keys.length) facets[name] = Object.fromEntries(keys.map((k) => [k, counts[k]]));
  }

  const hitsPerPage = params.hitsPerPage ?? 20;
  const page = params.page ?? 0;
  return {
    hits: matches.slice(page * hitsPerPage, (page + 1) * hitsPerPage) as T[],
    nbHits: matches.length,
    nbPages: Math.ceil(matches.length / hitsPerPage),
    page,
    hitsPerPage,
    facets,
  };
}
