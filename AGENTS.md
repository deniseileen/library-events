# Project agent memory

This file is the project's committed home for project-intrinsic agent knowledge: build, test, release, architecture, and sharp-edge notes that should travel with the code.

## What this is

Static React + Vite site (storytimes.denisewalter.com) that lists library events. `src/data/events.json` is the data source; the Library filter and colors are derived from the events and from `LIBRARY_COLORS` in `src/colors.ts`.

## Commands

- `npm install` then `npm run scrape` — regenerate `src/data/events.json` (runs `tsx scripts/scrape.ts`)
- `npm run lint` — oxlint
- `npm run build` — `tsc -b && vite build`

## Adding or fixing a library

Two required edits, then regenerate data:

1. Add/replace the entry in the `scrapers` array in `scripts/scrape.ts`.
2. Add a distinct hex color in `LIBRARY_COLORS` in `src/colors.ts`.
3. Run `npm run scrape`. The daily GitHub Action (`.github/workflows/scrape.yml`) commits the refreshed `src/data/events.json`, so commit the regenerated data alongside code changes.

Keep every library's display `name` exactly stable — it is the identity key used for colors and the `library` field.

## Scraper platforms

- `scrapeAssabet` — Assabet Interactive HTML (Melrose, Wakefield, Saugus, Malden). Audience comes from `category-*` classes matched through `ASSABET_AUDIENCE_MAP` (keys are lowercased with non-alphanumerics stripped).
- `scrapeBpl` — Bibliocommons JSON API. API-backed scrapers ignore `html`; set `fetchHtml: false` on their `scrapers` entry so `scrapeLibrary` skips the page fetch.
- `scrapeStoneham` — GetLocalHop Parse API (`api.getlocalhop.com/1`, `EventInstance` class). Dates' `iso` time-of-day is already the library's local wall-clock; do not timezone-convert.

## Maintaining this file

Keep this file for knowledge useful to almost every future agent session in this project.
Do not repeat what the codebase already shows; point to the authoritative file or command instead.
Prefer rewriting or pruning existing entries over appending new ones.
When updating this file, preserve this bar for all agents and keep entries concise.
