# Allen J. Bard Center for Electrochemistry — website

Next.js 15 (App Router, TypeScript) rebuild of electrochemistry.utexas.edu. The site is
exported as plain static files and looks the same as the original Drupal site.

## Getting started

```bash
npm install
npm run dev        # http://localhost:3000 with live reload
npm run build      # static site in ./out
npm start          # serve ./out locally
```

Other scripts: `npm run images` (create resized image variants), `npm run lint`,
`npm run typecheck`.

## Project structure

```
content/                 ← everything editors change
  site.ts                  site name, main menu, footer links, social links
  pages/**.mdx             landing and basic pages (URL = file path; index.mdx = home)
  news/*.md                news items (frontmatter only, body = summary)
  news/categories.json     news categories
  events/*.mdx             events (frontmatter + description body)
  events/series/*.mdx      event series pages
  people/people.json       people shown on People and research pages
  people/profiles.json     people with their own /directory/<slug> page
  search/*.json            data for the Directory and Search pages
public/
  media/                   images (originals); media/styles/ holds resized variants
  fonts/, images/          theme fonts and logos
scripts/generate-images.mjs  builds missing image variants
src/
  app/                     routes (one folder per URL pattern)
  components/
    layout/                header, main menu, footer, page header, section menu, breadcrumb
    blocks/                content blocks usable in MDX (see below)
    news/, events/         listings and detail pages
    people/                person cards
    search/                Directory and site Search (runs in the browser, no external service)
    ui/                    small shared pieces (images, pager, dropdown, share links…)
  lib/                     content loaders, types, dates, calendar links, search engine
  styles/
    theme.css              compiled university theme — do not edit
    custom.css             your style overrides
```

## Editing content

### Pages

Each file in `content/pages` is a page. Frontmatter controls the layout:

```mdx
---
title: "History"
parent: { label: "About", href: "/about" }   # breadcrumb (optional)
sectionMenu: "About"                          # "In This Section" menu from the main menu (optional)
header:
  intro: "Short text under the title"
  image: "uploads/images/default/photo.jpg"   # background image (optional)
  variant: "gradient"                          # orange header instead of an image (optional)
---

<Text>

## A heading

Normal **Markdown** text, [links](/about) and lists.

</Text>
```

`layout: landing` gives a full-width landing page (About, Research); `layout: home` is used
by the home page. Without `layout` the page gets the article layout.

### Content blocks

| Block | Use |
| --- | --- |
| `<Text>` | Markdown text (`spaced` adds vertical margins) |
| `<Button href variant="arrow\|envelope\|plain">` | Button link inside text |
| `<Highlighter title eyebrow image flip shaded>` | Large image + text row |
| `<HomeHero title eyebrow image>` | Home page hero |
| `<Callout>` | Centered text on a tinted panel |
| `<CalloutFancy>` | Decorated box inside text |
| `<CardGrid columns heading shaded centered>` + `<Card href title image linkText>` | Grid of link cards (`<CardGridIntro>` for text under the heading) |
| `<ImageText image>` / `<FloatImage image>` (+ `<Caption>`) | Image beside / floated in text |
| `<Figure image lightbox>` / `<Gallery images>` | Images, optionally opening in a lightbox |
| `<ArrowList>` + `<ArrowItem>` | List with arrow icons |
| `<Accordion>` + `<AccordionItem title>` | Collapsible panels |
| `<PeopleList people={["michael-rose"]} />` | Person cards from `content/people/people.json` |
| `<VideoEmbed src title>` | Responsive video player |

Markdown tables become responsive tables automatically.

### Images

Put new images in `public/media/uploads/images/default/` and reference them by their path
relative to `public/media`, e.g. `image={{ src: "uploads/images/default/new.jpg", alt: "…", width: 1200, height: 800 }}`.
Then run `npm run images` to create the resized variants.

### News and events

Add a Markdown file to `content/news` or `content/events`; copy an existing file as a template.
Listings, category pages, "Past events", event-type filters, pagination and calendar links
are generated automatically. Upcoming vs. past is decided at build time, so rebuild the site
when an event has passed.

### Menus and footer

Edit `content/site.ts`.

## Deploying

`npm run build` writes a fully static site to `out/`; upload it to any static host
(Netlify, Vercel, GitHub Pages, S3, a plain web server…).
