<div align="center">

# FlowPilot

**Manage projects. Collaborate better.**

A lightweight project management platform for startups, college teams, and small companies — built with React, TypeScript, and a design system that prioritizes clarity over complexity.

<br />

[![CI](https://img.shields.io/github/actions/workflow/status/flowpilot/flowpilot/ci.yml?branch=main&label=CI&style=flat-square)](https://github.com/flowpilot/flowpilot/actions)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg?style=flat-square)](LICENSE)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react&logoColor=white)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-6.0-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-8-646CFF?style=flat-square&logo=vite&logoColor=white)](https://vitejs.dev)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen?style=flat-square)](CONTRIBUTING.md)

[Live Demo](#quick-start) · [Documentation](#documentation) · [Roadmap](ROADMAP.md) · [Report Bug](.github/ISSUE_TEMPLATE/bug_report.yml) · [Request Feature](.github/ISSUE_TEMPLATE/feature_request.yml)

</div>

---

## Why FlowPilot?

Most project management tools fall into two camps: **enterprise suites** that require a week of onboarding, or **spreadsheet hacks** that collapse under real team load. FlowPilot exists in the middle — opinionated enough to keep teams aligned, flexible enough to adapt to how small groups actually work.

We started FlowPilot after watching three early-stage teams abandon Jira within a month and outgrow Notion boards within a quarter. The goal was never to replace every PM tool; it was to ship a focused frontend experience that teams could run locally, fork freely, and extend without fighting the codebase.

**What makes it different:**

- **Frontend-only architecture** — no backend required for development or demos; data persists via `localStorage` with simulated API delays
- **Modern Soft Brutalism UI** — thick borders, offset shadows, and bright accents that feel handcrafted, not templated
- **Modular codebase** — feature-separated folders, strict TypeScript, and reusable primitives designed for contributors

> FlowPilot is actively developed. v1.0 established the core workspace; v1.1 added authentication and a marketing landing page. See [CHANGELOG.md](CHANGELOG.md) for the full history.

---

## Screenshots

| Landing | Dashboard | Kanban |
|:---:|:---:|:---:|
| ![Landing page](docs/screenshots/landing.png) | ![Dashboard](docs/screenshots/dashboard.png) | ![Kanban board](docs/screenshots/kanban.png) |

<sub>Screenshots are placeholders — capture your own and drop them in <code>docs/screenshots/</code>.</sub>

---

## Features

### Workspace

| Module | Description |
|--------|-------------|
| **Dashboard** | Personalized greeting, animated stat cards, weekly velocity chart, spotlight project, due-soon tasks, and team activity pulse |
| **Projects** | Full CRUD with search, status/priority filters, sorting, progress tracking, and member avatars |
| **Tasks** | Rich task model — priorities, labels, checklists, comments, attachments, assignees, and due dates |
| **Kanban** | Four-column drag-and-drop board (`@dnd-kit`) with per-project filtering |
| **Calendar** | Monthly deadline view with day-level task drawer |
| **Analytics** | Completion trends, priority breakdown, and per-project performance charts |

### Collaboration

| Module | Description |
|--------|-------------|
| **Team** | Member cards with roles, skills, workload indicators, and contact info |
| **Activity** | Filterable timeline of task, project, file, and team events |
| **Files** | Grid/list file manager with upload simulation and preview |
| **Notifications** | Categorized inbox with read/unread state and bulk actions |

### Platform

| Module | Description |
|--------|-------------|
| **Auth** | Register, login, forgot/reset password — session persisted in `localStorage` |
| **Landing** | Marketing page with hero, features, testimonials, FAQ, and CTA sections |
| **Settings** | General, notifications, appearance, security, and preference tabs |
| **Profile** | Editable personal details, skills, bio, and recent activity |

---

## Quick Start

### Prerequisites

- **Node.js** 18 or later
- **npm** 9 or later

### Install & run

```bash
git clone https://github.com/flowpilot/flowpilot.git
cd flowpilot
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173). Register an account on the landing page, then explore the workspace at `/dashboard`.

### Production build

```bash
npm run build    # type-check + Vite production bundle
npm run preview  # serve the dist/ output locally
npm run lint     # run oxlint
```

---

## Architecture at a Glance

```
┌─────────────────────────────────────────────────────────┐
│                      Browser (SPA)                      │
├──────────────┬──────────────────┬───────────────────────┤
│   Pages      │   Components     │   Context Providers   │
│  (routes)    │  layouts / ui    │  Auth · App · Toast   │
├──────────────┴──────────────────┴───────────────────────┤
│              Services (simulated async APIs)            │
├─────────────────────────────────────────────────────────┤
│         JSON seed data  ↔  localStorage persistence     │
└─────────────────────────────────────────────────────────┘
```

FlowPilot deliberately keeps all state on the client. Service modules return `Promise`-based responses with configurable delays (500–1000 ms) to mimic network latency. `AppContext` hydrates from JSON seed files on first load, then reads/writes `localStorage` on subsequent visits.

For the full breakdown — routing guards, context boundaries, data flow, and folder conventions — see **[ARCHITECTURE.md](ARCHITECTURE.md)**.

---

## Design Philosophy

FlowPilot follows a **Modern Soft Brutalism** aesthetic: roughly 70% polished SaaS, 30% playful brutalist accents.

| Principle | Implementation |
|-----------|----------------|
| Strong hierarchy | Manrope type scale, extrabold headings, generous whitespace |
| Tactile surfaces | 2.5px `#111827` borders, offset `shadow-brutal` boxes |
| Energetic palette | Blue, orange, yellow, emerald, pink, purple on `#FFFDF7` |
| Motion with purpose | Framer Motion for page transitions, counters, and modals — not decoration |
| Accessible contrast | High-contrast ink-on-cream; interactive elements always bordered |

Component-level rules live in **[STYLEGUIDE.md](STYLEGUIDE.md)**.

---

## Project Structure

```
flowpilot/
├── .github/              # CI, issue templates, Dependabot, metadata
├── docs/screenshots/     # README and marketing captures
├── public/               # Static assets (favicon, etc.)
├── src/
│   ├── components/
│   │   ├── auth/         # Route guards, auth layout
│   │   ├── landing/      # Marketing page sections
│   │   ├── layouts/      # Sidebar, navbar, main shell
│   │   ├── projects/     # Project cards, forms
│   │   ├── tasks/        # Task forms
│   │   └── ui/           # Design-system primitives
│   ├── context/          # Auth, App, Toast providers
│   ├── data/             # JSON seed files
│   ├── hooks/            # useDebounce, usePagination, selectors
│   ├── pages/            # Route-level views
│   ├── services/         # Simulated API layer
│   ├── types/            # Shared TypeScript interfaces
│   ├── constants/        # Routes, enums, defaults
│   └── utils/            # Helpers, storage, validation schemas
├── ARCHITECTURE.md
├── CHANGELOG.md
├── CONTRIBUTING.md
├── ROADMAP.md
├── SECURITY.md
└── STYLEGUIDE.md
```

---

## Performance Goals

FlowPilot targets a snappy client-side experience on mid-range hardware:

| Metric | Target | Notes |
|--------|--------|-------|
| First Contentful Paint | < 1.2 s | Vite code-splitting planned for v1.2 |
| Time to Interactive | < 2.5 s | On 4G, uncached |
| Production JS bundle | < 400 KB gzip | Currently ~326 KB — tracked in CI |
| Lighthouse Performance | ≥ 90 | Landing and dashboard pages |
| Route transition | < 200 ms | Framer Motion page fade |

See [ROADMAP.md](ROADMAP.md) for bundle-splitting and lazy-loading milestones.

---

## Roadmap

High-level milestones (detailed timeline in [ROADMAP.md](ROADMAP.md)):

- [x] **v1.0** — Core workspace, simulated APIs, localStorage persistence
- [x] **v1.1** — Landing page, client-side auth, dashboard redesign
- [ ] **v1.2** — Route-level code splitting, E2E test suite (Playwright)
- [ ] **v2.0** — Optional REST/GraphQL backend adapter layer
- [ ] **v2.1** — Real-time sync (WebSockets), OAuth providers

---

## Documentation

| Document | Purpose |
|----------|---------|
| [ARCHITECTURE.md](ARCHITECTURE.md) | System design, data flow, context boundaries |
| [CONTRIBUTING.md](CONTRIBUTING.md) | Development setup, PR process, commit conventions |
| [STYLEGUIDE.md](STYLEGUIDE.md) | UI patterns, naming, component conventions |
| [ROADMAP.md](ROADMAP.md) | Release timeline and feature priorities |
| [CHANGELOG.md](CHANGELOG.md) | Version history |
| [SECURITY.md](SECURITY.md) | Vulnerability reporting |
| [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md) | Community standards |

---

## Contributing

We welcome bug fixes, documentation improvements, UI polish, and feature proposals. Please read [CONTRIBUTING.md](CONTRIBUTING.md) before opening a PR.

**Good first issues** are tagged [`good first issue`](.github/LABELS.md) in our label taxonomy. If you're unsure where to start, open a [Question issue](.github/ISSUE_TEMPLATE/question.yml) and we'll point you in the right direction.

---

## Security

Found a vulnerability? Please **do not** open a public issue. Follow the process in [SECURITY.md](SECURITY.md).

---

## License

FlowPilot is [MIT licensed](LICENSE). Copyright © 2024–2026 FlowPilot Contributors.

---

## Acknowledgments

Built with [React](https://react.dev), [Vite](https://vitejs.dev), [Tailwind CSS](https://tailwindcss.com), [Recharts](https://recharts.org), [@dnd-kit](https://dndkit.com), [Framer Motion](https://www.framer.com/motion/), and [Lucide](https://lucide.dev). Avatar art via [DiceBear](https://www.dicebear.com).

---

<div align="center">
  <sub>Made with care by contributors who believe small teams deserve great tools.</sub>
</div>
