# AGENTS.md — tution-tracker-client

## Quickstart

| Command | Description |
|---|---|
| `npm run dev` | Start Vite dev server |
| `npm run build` | Type-check (`tsc -b`) then bundle with Vite |
| `npm run lint` | Run ESLint on all `.ts`/`.tsx` files |
| `npm run preview` | Preview the production build |

## Environment

- `VITE_SERVER_URL` must be set in `.env` (see `.env.example`). The API client (`src/api/client.ts`) reads it as `baseURL`.
- Never commit `.env` — it is gitignored.

## Path aliases

- `@/` resolves to `src/` (configured in `tsconfig.app.json`). Import via ` "@/feature/path" `.

## Architecture

- **Entry point**: `src/main.tsx` — creates React root, wraps `App` with `Provider` (Redux) and `BrowserRouter`.
- **App shell**: `src/App.tsx` renders `AuthInitializer` (restores auth on reload) then `AppRoutes`.
- **Routing** (`src/routes/AppRoutes.tsx`):
  - `PublicRoute` — renders auth page if not logged in.
  - `ProtectedRoute` — renders DashboardLayout if logged in, otherwise redirects to `/auth`.
- **Auth flow**: Token stored in `localStorage.getItem("token")`. Api interceptor (`src/api/client.ts`) injects `Authorization: Bearer <token>` on every request and redirects to `/auth` on 401.
- **Redux Toolkit**: Store at `src/store/store.ts` (auth + students reducers). Use `useAppDispatch` / `useAppSelector` from `src/store/hook.ts`. All async API calls are `createAsyncThunk` wrappers.
- **Features** (each owns its slice under `src/features/`):
  - `auth` — login, signup, logout, current user.
  - `students` — CRUD for students via `src/features/students/api.ts`.
  - `sessions` — slice at `src/features/sessions/sessionSlice.ts` (currently empty; add thunks as needed).
- **Tailwind CSS v4** — using `@tailwindcss/vite` v4 plugin. Class names follow the project's `stone`, `emerald` palette.

## Conventions to avoid mistakes

- **Imports**: Use ` "@/..." ` path aliases, not relative `../../../...` paths.
- **Auth checks**: Always check `localStorage.getItem("token")` or `state.auth.user` — the api interceptor handles 401 → redirect, but the UI also needs its own guard (via `ProtectedRoute`/`PublicRoute`).
- **Redux selectors**: Use `useAppSelector` with typed state; avoid raw `state.auth` access without the typed hook.
- **Form submissions**: In `AuthForm`, always `dispatch(clearAuthError())` before dispatching a thunk to clear stale errors.
- **ESLint**: Runs on all `.ts`/`.tsx` files. Extends `eslint/recommended`, `typescript-eslint/recommended`, `eslint-plugin-react-hooks`, `eslint-plugin-react-refresh`.
- **No test framework** is configured in `package.json`. If tests are added, configure Vitest or Jest alongside the Vite setup.