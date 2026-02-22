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
  backend/   – Fastify REST API + SQLite database
  frontend/  – React 19 + Vite SPA
```

### Backend (`packages/backend/`)

Single-file server at `server.js`. Uses **Fastify** with **better-sqlite3** (synchronous SQLite). Two tables: `games` (id, name, year, platform FK, genre) and `platforms` (id, name, year). Listens on **port 5000**.

REST API endpoints:
- `GET/POST /api/games` — supports `?$expand=platform`, `?$filter=platform eq <id>`, `?$search=<term>`
- `GET/PUT/DELETE /api/games/:id`
- `GET/POST /api/platforms`
- `GET/PUT/DELETE /api/platforms/:id`

The SQLite database file (`games.db`) lives in `packages/backend/`.

### Frontend (`packages/frontend/`)

**React 19** + **Vite** SPA. The Vite dev server proxies `/api` requests to `http://localhost:5000`.

Key architecture points:
- **No router** — single-page app with all state managed in `App.jsx`
- **MUI v7** for all UI components; custom theme defined in `src/styles/theme.jsx`
- **i18next** for internationalization (EN/FR); translation files in `public/locales/{en,fr}/translation.json`; loaded at runtime via HTTP backend
- **PropTypes** used for component prop validation (no TypeScript)
- All API calls are direct `fetch()` calls inside component files (no centralized API service layer despite the `src/services/` directory existing)

Component structure in `src/components/`:
- `GameForm.jsx` — add/edit game form with validation
- `GameList.jsx`, `GameItem.jsx`, `GameDetail.jsx` — game display
- `ListControl.jsx`, `ConfirmationDialog.jsx` — shared UI
- `settings/Platforms.jsx` — platform CRUD dialog

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
