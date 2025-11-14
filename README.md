# LIA — Life's an Adventure!

Gamified productivity platform composed of a Next.js frontend and a NestJS + Prisma backend. The goal is to let players manage "missions" (boards/tasks) inside collaborative workspaces while tracking XP progression.

---

## 📦 Tech Stack

### Frontend
- **Next.js 16 App Router** with server/client components
- **React 19** + **TypeScript**
- **Tailwind CSS 4** + shadcn/ui primitives
- **Zustand** for local persistence of workspaces/boards/tasks
- **Framer Motion** and `@hello-pangea/dnd` reserved for interaction polish

### Backend
- **NestJS 11** modular architecture
- **Prisma ORM** targeting PostgreSQL
- **Passport JWT** authentication + bcrypt hashing
- **Class-Validator/Transformer** guarded DTOs

### Tooling
- ESLint + Prettier configs per package
- Seed script via Prisma Client
- pnpm/npm scripts (repository currently uses npm lockfiles)

---

## 🧭 Architecture Overview

```
apps/
├── backend/          # NestJS monolith (REST API)
│   ├── src/
│   │   ├── auth/       # JWT auth, guards, strategies
│   │   ├── workspaces/ # Workspace CRUD + membership rules
│   │   ├── boards/     # Boards within a workspace
│   │   ├── tasks/      # Tasks, movement and XP awarding
│   │   ├── progress/   # XP history and summaries
│   │   ├── users/      # Profile and admin endpoints
│   │   └── common/     # PrismaService (global provider)
│   └── prisma/       # Schema & seed data
└── frontend/        # Next.js App Router application
    └── src/
        ├── app/        # Route segments: public landing + private workspace
        ├── components/ # Layouts, UI kit, workspace widgets
        ├── hooks/      # Zustand-powered selectors (workspaces, boards, lists)
        ├── store/      # `useLiaStore` with persisted mock data
        └── types/      # Shared view models (Workspace/Board/List/Task)
```

High-level flow:

1. **Authentication** – handled by `/auth` endpoints (register/login/profile). Tokens guard every other controller via `JwtAuthGuard`.
2. **Workspace domain** – `/workspaces` orchestrates membership checks and ensures only owners can mutate or delete.
3. **Boards & Tasks** – nested resources under a workspace; all mutations double-check membership before writing.
4. **Progress tracking** – tasks call into `/progress` to store XP events and provide summaries.
5. **Frontend state** – the App Router consumes a persisted Zustand store (`useLiaStore`). Hooks like `useWorkspaces` and `useBoards` expose store selectors to components.

---

## 🧩 Module Breakdown

### Frontend

#### `src/app`
- `(public)` – marketing landing page plus placeholders for login/register.
- `(private)` – dashboard shell with workspace listing and `[id]` view.
  - `layout.tsx` fixes the navbar/sidebar scaffold and injects `<AppMenu>` for both desktop and mobile.

#### `src/components`
- **layouts** – `Navbar`, `AppMenu`, shared shell pieces.
- **sections** – marketing hero/cards.
- **workspace** – domain widgets (board grid, header, sidebar, cards).
- **ui** – shadcn-derived primitives (button, card, sheet, etc.).

#### `src/hooks`
- `useWorkspaces` centralizes reads/writes against `useLiaStore`. Swapping the store for React Query would only require changes here.
- `useBoards`/`useList` provide focused selectors used by workspace views.
- `useMediaQuery` remains available for responsive behaviours.

#### `src/store`
- `UseLiaStore.ts` wraps Zustand with persistence, seeded from `src/data/mock.ts`. It owns creation/mutation logic for workspaces, boards, lists and tasks.

### Backend

#### `auth`
- `AuthService` handles registration/login (bcrypt + JWT) and exposes a profile check endpoint. Remember to configure `JWT_SECRET`, `JWT_EXPIRES_IN`, and `WEB_ORIGIN`.

#### `workspaces`
- Service validates uniqueness per owner and enforces OWNER role for destructive actions.
- Controller wraps everything with `JwtAuthGuard` and extracts the user id from the JWT decorator.

#### `boards`
- Verifies membership before allowing board creation/deletion. Returns tasks inline for quick dashboard summaries.

#### `tasks`
- CRUD plus move/complete flows. Each mutator revalidates workspace membership and awards XP upon completion.

#### `progress`
- Summaries and XP history; includes a seed-friendly admin endpoint (protect it before production).

#### `users`
- Non-auth profile endpoints (list, get by id, update name/avatar, delete placeholder) prepared for future role guards.

#### Prisma Layer
- `schema.prisma` defines Postgres models, enums and relations.
- `seed.ts` bootstraps an admin user, workspace, board, task and progress entry.

---

## 🚀 Getting Started

### Prerequisites
- Node.js 20+
- PostgreSQL 14+
- npm (lockfiles assume npm; adjust if you standardize on pnpm/yarn)

### 1. Backend Setup

```bash
cd backend
npm install

# 1.1 Configure environment
cp .env.example .env   # crea el archivo si no existe (ver variables abajo)

# 1.2 Provision database
npx prisma db push      # o `prisma migrate dev` cuando exista historial de migraciones
npx prisma db seed

# 1.3 Ejecutar API
npm run start:dev
```

### 2. Frontend Setup

```bash
cd frontend
npm install

# Variables de entorno (ver sección inferior)
cp .env.local.example .env.local

npm run dev
```

La aplicación web vive en `http://localhost:3000` y espera que el backend corra en `http://localhost:3001` (configurable vía variable).

---

## 🔐 Environment Variables

| Scope    | Variable              | Description                                                  |
|----------|-----------------------|--------------------------------------------------------------|
| Backend  | `DATABASE_URL`        | PostgreSQL connection string                                 |
| Backend  | `JWT_SECRET`          | Secret key for signing access tokens                         |
| Backend  | `JWT_EXPIRES_IN`      | Token TTL in seconds (default `3600`)                        |
| Backend  | `WEB_ORIGIN`          | Allowed CORS origin for Next.js frontend                     |
| Frontend | `NEXT_PUBLIC_API_URL` | Base URL for backend API requests (e.g. `http://localhost:3001`) |

> 💡 Crea archivos ejemplo (`.env.example`, `.env.local.example`) para facilitar onboarding futuro.

---

## 📜 Useful Scripts

### Backend
- `npm run start:dev` – NestJS dev server with TS paths.
- `npm run build && npm run start:prod` – production build + run.
- `npm run lint` – ESLint autofix for `src`, `apps`, `libs`, `test`.
- `npm run test` / `test:e2e` – Jest unit & e2e suites (requieren configuración extra).

### Frontend
- `npm run dev` – Next.js dev server.
- `npm run build` / `npm run start` – production build & serve.
- `npm run lint` – run ESLint against the project.

---

## 🚢 Deployment Notes

1. **Backend**
   - Build with `npm run build` and serve `dist/main.js` (Node 20 runtime).
   - Provide all env vars (DATABASE_URL, JWT_SECRET, WEB_ORIGIN, etc.).
   - Run `npx prisma migrate deploy` during CI/CD to sync the schema.

2. **Frontend**
   - Configure `NEXT_PUBLIC_API_URL` against the deployed backend.
   - Use Next.js standalone output or containerize with `Dockerfile` (pending).

3. **Observability**
   - Add structured logging (Pino) and request tracing (OpenTelemetry) as part of production hardening.

---

## 🗺️ TODO / Roadmap

- [ ] Completar pantallas de `login` y `register` (actualmente vacías).
- [ ] Conectar el frontend con el backend (hoy el store usa mock data local).
- [ ] Implementar guards de roles (ADMIN) para `/users` y `/progress`.
- [ ] Agregar migraciones Prisma versionadas y CI checks.
- [ ] Añadir tests unitarios/e2e mínimos para dominios críticos.
- [ ] Centralizar manejo de errores y notificaciones en el frontend (toasts).
- [ ] Reemplazar `console.log` por capa de telemetry/observability.

---

## 🤝 Contribución

1. Crea una rama descriptiva (`feat/feature-name`).
2. Asegura lint/tests antes del PR.
3. Documenta en el PR cualquier ajuste a modelo de datos o API contract.

¡Que LIA te acompañe en cada aventura! 🗺️

