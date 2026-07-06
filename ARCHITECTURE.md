# FlowPilot Architecture

This document describes how FlowPilot is structured, how data moves through the application, and the conventions we follow when adding new features. It is intended for contributors who need to understand the system before making changes.

_Last updated: March 2026 · Applies to v1.1.x_

---

## Table of Contents

1. [System Overview](#system-overview)
2. [Technology Choices](#technology-choices)
3. [Application Layers](#application-layers)
4. [Routing & Access Control](#routing--access-control)
5. [State Management](#state-management)
6. [Data Layer](#data-layer)
7. [Service Simulation](#service-simulation)
8. [Design System Integration](#design-system-integration)
9. [Folder Conventions](#folder-conventions)
10. [Adding a New Feature](#adding-a-new-feature)
11. [Known Limitations](#known-limitations)

---

## System Overview

FlowPilot is a **single-page application (SPA)** with no server component. All business logic, persistence, and authentication run in the browser.

```
User
  │
  ▼
React Router ──► Route Guards (PublicOnly / Protected)
  │
  ▼
Page Components ──► Feature Components ──► UI Primitives
  │
  ▼
Context Hooks (useAuth, useApp, useToast)
  │
  ▼
Service Modules ──► JSON seed / localStorage
```

The architecture optimizes for:

- **Contributor clarity** — each feature maps to a page + optional `components/<feature>/` folder
- **Testability** — services are plain async functions, contexts are isolated providers
- **Future backend swap** — service files are the single integration point for a real API

---

## Technology Choices

| Layer | Choice | Rationale |
|-------|--------|-----------|
| UI | React 19 | Concurrent features, mature ecosystem |
| Language | TypeScript (strict) | Catch errors at compile time; shared interfaces in `src/types/` |
| Build | Vite 8 | Fast HMR, native ESM, Tailwind v4 plugin |
| Styling | Tailwind CSS v4 | Utility-first with `@theme` design tokens in `index.css` |
| Routing | React Router 7 | Nested layouts, location state for auth redirects |
| Forms | React Hook Form + Zod | Performant forms with schema validation |
| Charts | Recharts | Composable React chart primitives |
| DnD | @dnd-kit | Accessible drag-and-drop for Kanban |
| Animation | Framer Motion | Page transitions, modals, counters |

---

## Application Layers

### 1. Entry (`main.tsx` → `App.tsx`)

`App.tsx` composes providers in a specific order:

```tsx
BrowserRouter
  └── ToastProvider
        └── AuthProvider
              └── AppProvider
                    └── Routes
```

**Why this order matters:** `AppProvider` may call `useToast()` for error feedback. `AuthProvider` must wrap routes so both public and protected pages can read auth state. `ToastProvider` sits outermost so any provider can surface notifications.

### 2. Pages (`src/pages/`)

Route-level components. A page should:

- Compose feature and UI components
- Call context hooks for data and actions
- Avoid embedding complex business logic (delegate to hooks/services)

Auth pages live in `src/pages/auth/`. The marketing landing page is `LandingPage.tsx`, which assembles sections from `src/components/landing/`.

### 3. Components (`src/components/`)

| Directory | Responsibility |
|-----------|----------------|
| `ui/` | Design-system primitives (Button, Card, Modal, …) |
| `layouts/` | App shell — Sidebar, Navbar, MainLayout |
| `auth/` | ProtectedRoute, PublicOnlyRoute, AuthLayout |
| `landing/` | Marketing sections (Hero, Features, FAQ, …) |
| `projects/` | ProjectCard, ProjectFormModal |
| `tasks/` | TaskFormModal |

**Rule:** If a component is used by only one page and is >80 lines, it still belongs in `components/<feature>/`, not inside the page file.

### 4. Context (`src/context/`)

| Provider | State | Persists |
|----------|-------|----------|
| `AuthContext` | Current user, login/register/logout | `flowpilot_users`, `flowpilot_session` |
| `AppContext` | Projects, tasks, notifications, files, activity, settings, profile | Multiple `flowpilot_*` keys |
| `ToastContext` | Ephemeral toast queue | No |

`AppContext` is the largest provider (~350 lines). It handles optimistic updates, undo stacks, and syncs subsets of state to `localStorage` via `useEffect` hooks.

### 5. Services (`src/services/`)

Each domain has a service file:

```
projectService.ts
taskService.ts
userService.ts
notificationService.ts
fileService.ts
activityService.ts
```

Services import JSON from `src/data/`, apply `delay()` from helpers, and return Promises. **Pages and components never import JSON directly** — always go through services or context.

### 6. Utilities & Types

- `src/types/index.ts` — all shared interfaces
- `src/constants/index.ts` — routes, storage keys, option enums, defaults
- `src/utils/` — `cn()`, storage helpers, formatters, Zod schemas

---

## Routing & Access Control

Routes are centralized in `src/constants/index.ts` as `ROUTES`.

| Path | Guard | Layout |
|------|-------|--------|
| `/` | None | Landing (standalone) |
| `/login`, `/register`, `/forgot-password` | `PublicOnlyRoute` | AuthLayout |
| `/reset-password` | None (UI demo) | AuthLayout |
| `/dashboard`, `/projects`, … | `ProtectedRoute` | MainLayout |
| `*` | None | NotFoundPage |

`ProtectedRoute` redirects unauthenticated users to `/login`, preserving `location.state.from` for post-login redirect.

`PublicOnlyRoute` redirects authenticated users to `/dashboard` to avoid showing login while logged in.

---

## State Management

We use **React Context** intentionally — the app's state footprint is manageable without Redux, and Context keeps the dependency graph shallow.

### Data flow pattern

```
User action (page)
  → context method (e.g. createTask)
    → optimistic state update (setState)
      → service call (createTaskApi)
        → on success: toast
        → on failure: rollback + error toast
```

### Selector hooks (`src/hooks/useSelectors.ts`)

Thin wrappers to avoid prop-drilling user/project lookups:

```ts
useUser(id)
useProject(id)
useProjectTasks(projectId)
useUnreadNotifications()
```

### Custom hooks

| Hook | Purpose |
|------|---------|
| `useDebounce` | Search input debouncing (300 ms default) |
| `usePagination` | Client-side pagination slice |

---

## Data Layer

### Seed data (`src/data/*.json`)

Initial content ships as static JSON. On first load, `AppContext` fetches via services and falls back to seed data when `localStorage` is empty.

### localStorage keys

Defined in `STORAGE_KEYS` (`src/constants/index.ts`):

| Key | Content |
|-----|---------|
| `flowpilot_projects` | Project array |
| `flowpilot_tasks` | Task array |
| `flowpilot_notifications` | Notification array |
| `flowpilot_settings` | AppSettings object |
| `flowpilot_profile` | UserProfile object |
| `flowpilot_users` | AuthUser array |
| `flowpilot_session` | AuthSession object |

### Auth model

`AuthUser` stores `name`, `email`, `password` (plaintext in localStorage — acceptable for demo only; see SECURITY.md), `avatar`, and `createdAt`. Production deployments must replace this with a real auth backend.

---

## Service Simulation

```ts
// src/services/projectService.ts
export async function fetchProjects(): Promise<Project[]> {
  await delay(API_DELAYS.MEDIUM); // 700 ms
  return projectsData as Project[];
}
```

Delays are defined in `API_DELAYS`: `SHORT` (500 ms), `MEDIUM` (700 ms), `LONG` (1000 ms).

When integrating a real backend, replace service implementations while keeping the same function signatures. Context code should require minimal changes.

---

## Design System Integration

Design tokens live in `src/index.css` under `@theme`:

```css
--color-primary: #3b82f6;
--color-background: #fffdf7;
--color-ink: #111827;
```

Utility classes like `shadow-brutal`, `border-brutal`, and `text-ink` are defined in `@layer utilities`. UI components in `src/components/ui/` consume these tokens — pages should not hardcode hex values.

See [STYLEGUIDE.md](STYLEGUIDE.md) for component API conventions.

---

## Folder Conventions

```
New feature checklist:
□ types added to src/types/index.ts
□ constants (routes, options) in src/constants/
□ service file in src/services/
□ seed JSON in src/data/ (if needed)
□ page in src/pages/
□ feature components in src/components/<feature>/
□ route registered in App.tsx
□ ROUTES constant updated
```

---

## Adding a New Feature

Example: adding a **Milestones** module.

1. Define `Milestone` interface in `types/index.ts`
2. Add `milestones.json` and `milestoneService.ts`
3. Extend `AppContext` with milestones state + CRUD methods
4. Create `MilestonesPage.tsx` and any `components/milestones/*`
5. Add `ROUTES.MILESTONES` and sidebar nav item
6. Update `CHANGELOG.md` under `[Unreleased]`

---

## Known Limitations

| Limitation | Planned resolution |
|------------|------------------|
| No multi-user sync | v2.0 backend |
| Plaintext passwords in localStorage | v2.0 auth service |
| Single-browser data scope | IndexedDB or API in v2.0 |
| No offline service worker | v1.2 PWA exploration |
| Bundle size ~1 MB uncompressed | v1.2 code splitting |

---

## Questions

Architecture discussions belong in [GitHub Discussions](https://github.com/flowpilot/flowpilot/discussions) or issue threads tagged `area: architecture`. For significant design changes, open an issue first to align with maintainers.
