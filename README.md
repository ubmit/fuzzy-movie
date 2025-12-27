# Fuzzy Movie

Movie search app built with Remix, React 18, Tailwind CSS v4, and shadcn/ui.

## Setup

1. Clone the repository
2. Install dependencies: `bun install`
3. Create `.env` file with your OMDB API key (get one at [omdbapi.com](https://www.omdbapi.com/apikey.aspx))

```env
OMDB_API_KEY=your_api_key_here
```

## Development

```sh
bun dev
```

Starts the dev server in manual mode with hot reload.

## Production

Build and start:

```sh
bun build
bun start
```

Or deploy with [fly.io](https://fly.io):

```sh
flyctl deploy
```

## Code Quality

```sh
bun lint        # ESLint
bun typecheck   # TypeScript type checking
```

## Tech Stack

- **Framework**: Remix v2.6, React 18
- **Styling**: Tailwind CSS v4, shadcn/ui with Base UI primitives
- **Icons**: lucide-react
- **Validation**: zod, tiny-invariant
- **Package Manager**: bun

## Features

- Search movies using OMDB API
- Save favorite movies
- Detailed movie information (plot, cast, runtime, rating)
- Responsive design with Tailwind CSS v4
- shadcn/ui components (Button, Card, Input)
- Server-side validation with zod
