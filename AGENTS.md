# AGENTS.md

Guidelines for AI coding agents working in this repository.

## Project Overview

Remix v2 movie search app using OMDB API. React 18, Tailwind CSS v4, shadcn/ui components.

## Commands

**Package Manager: `bun`**

```bash
# Development
bun dev              # Start dev server (remix dev --manual)

# Build & Production
bun build            # Build for production
bun start            # Run production server

# Code Quality
bun lint             # ESLint
bun typecheck        # TypeScript type checking
```

No test framework configured.

## Tech Stack

| Category   | Technology                                   |
| ---------- | -------------------------------------------- |
| Framework  | Remix v2.6, React 18                         |
| Styling    | Tailwind CSS v4, shadcn/ui (base-vega style) |
| Variants   | class-variance-authority (cva)               |
| Classes    | clsx + tailwind-merge via `cn()` helper      |
| Icons      | lucide-react                                 |
| Validation | tiny-invariant, zod                          |
| Runtime    | Node.js >= 18, ES modules                    |

## Project Structure

```
app/
├── components/
│   ├── ui/           # shadcn/ui primitives (Button, Card, Input)
│   └── *.tsx         # Shared components
├── data/             # Data fetching functions
├── lib/
│   └── utils.ts      # cn() utility
├── routes/
│   ├── _index/       # Index route with co-located components
│   ├── details.$movieId/  # Dynamic route
│   └── *.tsx         # Simple routes
├── cookies.server.ts # Server-only modules use .server.ts
├── root.tsx
└── tailwind.css      # Tailwind v4 config + CSS variables
```

## Code Style

### General

- Be extremely concise; sacrifice grammar for brevity
- Only create abstractions when actually needed
- Prefer clear function/variable names over comments
- Avoid helper functions when inline expressions suffice

### TypeScript

- Strict mode enabled
- Don't cast to `any`
- Don't add unnecessary `try`/`catch`
- Types inline or in co-located `types.ts` files
- Use `satisfies` for type assertions where appropriate
- No explicit return types unless necessary

### Imports

- Path alias: `~/*` maps to `./app/*`
- Order: external deps first, then internal (`~/...`), then relative (`./...`)
- Named exports preferred
- Relative imports for co-located files

```typescript
// External
import { json, LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import invariant from "tiny-invariant";

// Internal (path alias)
import { getMovieById } from "~/data/get-movie-by-id";
import { Button } from "~/components/ui/button";

// Relative (co-located)
import { Movie } from "./types";
import { MovieLink } from "./movie-link";
```

### Naming

| Type       | Convention | Example                           |
| ---------- | ---------- | --------------------------------- |
| Files      | kebab-case | `get-movies.ts`, `movie-link.tsx` |
| Components | PascalCase | `MovieLink`, `SearchIcon`         |
| Functions  | camelCase  | `getMovies`, `getMovieById`       |
| Types      | PascalCase | `Movie`, `Cookie`                 |
| Routes     | Remix flat | `details.$movieId`, `_index`      |

### React Components

- Avoid massive JSX blocks; compose smaller components
- Colocate code that changes together
- Avoid `useEffect` unless absolutely needed
- Use `React.forwardRef` for UI primitives
- Set `displayName` on forwardRef components
- Props spreading: `...props` at the end

```typescript
function Movies({ movies }: { movies: { Search: Array<Movie> } }) {
  return movies?.Search?.map((movie) => (
    <li key={movie.imdbID}>
      <MovieLink movie={movie} />
    </li>
  ));
}
```

### Error Handling

- Use `tiny-invariant` for runtime assertions
- Minimal try/catch; let errors propagate to error boundaries

```typescript
invariant(params.movieId, "Missing movieId param");
```

### Tailwind CSS

- Use Tailwind v4 format with global CSS file
- Mostly use built-in values
- Occasionally allow dynamic values
- Rarely use globals
- Use `cn()` for conditional classes

```typescript
import { cn } from "~/lib/utils";

cn("base-class", condition && "conditional-class", className);
```

### shadcn/ui Components

Located in `app/components/ui/`. Use cva for variants:

```typescript
const buttonVariants = cva("inline-flex items-center...", {
  variants: {
    variant: { default: "...", destructive: "..." },
    size: { default: "...", sm: "...", lg: "..." },
  },
  defaultVariants: { variant: "default", size: "default" },
});
```

## Remix Patterns

### Loaders & Actions

```typescript
export async function loader({ params, request }: LoaderFunctionArgs) {
  invariant(params.movieId, "Missing movieId param");
  const movie = await getMovieById(params.movieId);
  return json({ movie });
}

export async function action({ params, request }: ActionFunctionArgs) {
  const formData = await request.formData();
  // Handle mutation
  return json({ ok: true });
}
```

### Server-only Code

Use `.server.ts` suffix for server-only modules:

```typescript
// cookies.server.ts
import { createCookie } from "@remix-run/node";
export const userFavorites = createCookie("user-favorites", {
  maxAge: 604_800,
});
```

### Optimistic UI

Use `fetcher.formData` for optimistic updates:

```typescript
const fetcher = useFetcher();
const favorite = fetcher.formData
  ? fetcher.formData.get("favorite") === "true"
  : movie.favorite;
```

## Git Conventions

- Use Conventional Commits: `feat:`, `fix:`, `refactor:`, `docs:`, etc.
- Branch prefix: `gui/` (e.g., `gui/add-search-feature`)
- Commit messages: extremely concise

## Environment Variables

- `OMDB_API_KEY` - Required for movie API calls
