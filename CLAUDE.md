# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A full-stack video game manager with a React/Vite frontend and a Fastify/SQLite backend, organized as an npm workspace monorepo.

## Commands

### Development

```bash
# Start both backend (port 5000) and frontend dev server (port 5173) concurrently
npm start

# Start only the backend
npm run start --workspace=backend

# Start only the frontend dev server
npm run dev --host --workspace=frontend
```

### Build & Lint

```bash
# Build frontend for production
npm run build --workspace=frontend

# Lint frontend
npm run lint --workspace=frontend
npm run lint:fix --workspace=frontend

# Lint backend
npm run lint --workspace=backend
npm run lint:fix --workspace=backend
```

### Testing

```bash
# Run frontend unit tests (Jest, currently no tests defined)
npm test --workspace=frontend

# Open Cypress E2E tests interactively (requires both servers running)
npm run cypress:open

# Run Cypress E2E tests headlessly (local)
npm run cy:run:local:headless --workspace=frontend
```

## Architecture

### Monorepo Structure

```
packages/
  backend/   – Fastify REST API + SQLite database (TypeScript)
  frontend/  – React 19 + Vite SPA (TypeScript)
  types/     – Shared TypeScript interfaces used by both backend and frontend
```

### Backend (`packages/backend/`)

Modular TypeScript server. Entry point is `src/server.ts`; database setup is in `src/db.ts`; routes are split into `src/routes/games.ts` and `src/routes/platforms.ts`. Uses **Fastify** with **better-sqlite3** (synchronous SQLite) and runs via `tsx`. Two tables: `games` (id, name, year, platform FK, genre, status, rating) and `platforms` (id, name, year). Listens on **port 5000**.

REST API endpoints:
- `GET/POST /api/games` — supports `?$expand=platform`, `?$filter=platform eq <id>`, `?$search=<term>`
- `GET/PUT/DELETE /api/games/:id` — supports `?$expand=platform`
- `GET/POST /api/platforms`
- `GET/PUT/DELETE /api/platforms/:id`

The SQLite database file (`games.db`) lives in `packages/backend/`.

### Frontend (`packages/frontend/`)

**React 19** + **Vite** SPA written in **TypeScript**. The Vite dev server proxies `/api` requests to `http://localhost:5000`.

Key architecture points:
- **react-router-dom** for client-side routing; routes defined in `App.tsx`
- **MUI v7** for all UI components; custom theme defined in `src/styles/theme.ts`
- **i18next** for internationalization (EN/FR); translation files in `public/locales/{en,fr}/translation.json`; loaded at runtime via HTTP backend
- **TypeScript** used throughout; shared types come from the `@vgm/types` workspace package
- All API calls are direct `fetch()` calls inside page components

Component structure:
- `src/components/`: `ConfirmationDialog.tsx`, `DataTable.tsx`, `GameForm.tsx`, `Layout.tsx`
- `src/pages/`: `GamesPage.tsx`, `GameFormPage.tsx`, `PlatformsPage.tsx`, `PlatformFormPage.tsx`

### E2E Tests

Cypress tests live in `packages/frontend/cypress/e2e/`. Local config at `cypress/config/cypress.config.local.js` targets `http://localhost:5173`. CI config targets `http://localhost:4173` (Vite preview server after build).

### CI/CD

- **Node.js CI** (`.github/workflows/node.js.yml`): runs on push/PR to `main`, tests Node 22.x and 23.x, builds frontend, runs unit tests.
- **Cypress Tests** (`.github/workflows/cypress.yml`): runs on PRs to `main` (skips dependabot), starts backend + Vite preview, runs E2E tests against Cypress Cloud.

## Code Conventions

- **Import order** is enforced by ESLint (`eslint-plugin-import`): builtin → external → internal → sibling/parent → index, alphabetized, with newlines between groups.
- **Prettier** is enforced as an ESLint error.
- Components use `data-testid` attributes (e.g., `app.gameForm.name`) for Cypress selectors.
- All user-visible strings go through `useTranslation()` / `t()` — never hardcode UI text.
