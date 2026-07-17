# Library Events

A browsable directory of library events, built with React, TypeScript, and Vite.

**Live site:** [storytimes.denisewalter.com](https://storytimes.denisewalter.com)

## Features

- Browse and filter library events by type, location, and date
- Clean, responsive Material UI design with custom theming
- **Daily automated data pipeline** — a scheduled GitHub Action scrapes new events each morning at 6 AM UTC and commits them directly to the repo
- Fast client-side rendering with Vite

## Tech Stack

- **React 18** — UI
- **TypeScript** — type safety
- **Vite** — build tool
- **Material UI (MUI)** — component library
- **GitHub Actions** — CI

## Local Development

```bash
npm install
npm run dev
```

## CI
Two GitHub Actions workflows:
- scrape.yml — runs daily on a cron schedule (0 6 * * *). Executes scripts/scrape.ts via tsx and commits any updated event data to src/data/events.json.
- Lint on push — Oxlint checks TypeScript source on every push.
