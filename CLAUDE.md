# CLAUDE.md

Notes for Claude Code sessions working on this repository.

## What this is

A Next.js 15 (App Router, TypeScript, static export) rebuild of the Drupal site
electrochemistry.utexas.edu (Allen J. Bard Center for Electrochemistry, UT Austin).
The goal is a **pixel-identical** copy of the original that is easy to customise.
See README.md for the folder structure and how content is edited.

The original site mirror (reference only, not in git) lives at
`D:\CLONE\electrochemistry.utexas.edu`. Serve it with
`python -m http.server 8080` from that folder and open `/index.htm`.

## Commands

```bash
npm ci               # install (see warning below)
npm run dev          # http://localhost:3000
npm run build        # static site in ./out
npm run images       # create missing resized image variants in public/media/styles
npm run lint
npm run typecheck
```

## Rules

- **Fidelity first.** Components reproduce the original Drupal markup and class names
  exactly (the compiled theme CSS depends on them). When changing a component, compare
  the result with the original page (same text, same layout height, same images).
- Do not edit `src/styles/theme.css` (compiled university theme); put overrides in
  `src/styles/custom.css`.
- Content lives in `content/` (MDX pages, news, events, people, search data). Prefer
  editing content files over hard-coding text in components.
- The commercial fonts Benton Sans and GT Sectra were removed on purpose (licensed, and
  unused by the theme). Do not add them back to this public repository.
- The Directory and Search pages run fully in the browser on `content/search/*.json`
  using `src/lib/search/engine.ts`, which reproduces the original Algolia ranking.
- Upcoming vs. past events are decided at build time; rebuild after an event passes.

## Known differences from the original

- Google Maps and Vimeo embeds still load from the internet.
- Some resized images come from the local server instead of the CNS server, so a few
  pages differ by under 4% of pixels (same layout, same images).

## Environment warning

An AI cleaning tool on this machine has deleted `node_modules` and `.next` before.
If a command fails because they are missing, run `npm ci` and rebuild.

## Git

- Remote: https://github.com/MohammadIzza/Electrochemistry (branch `main`).
- Author every commit as `MOHAMMAD IZZA HAKIKI <m.izza.hakiki@gmail.com>`; the owner must
  be the only contributor, so do not add `Co-Authored-By` or other trailers.
- Commit messages: one line in English using Conventional Commits prefixes
  (`feat:`, `fix:`, `style:`, `refactor:`, `docs:`, `chore:`, `build:`).
