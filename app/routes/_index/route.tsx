import { LoaderFunctionArgs, defer } from "@remix-run/node";
import { Await, Form, useLoaderData } from "@remix-run/react";
import { Film, Search, Heart } from "lucide-react";
import { Suspense, useEffect } from "react";
import { useDebounceSubmit } from "remix-utils/use-debounce-submit";
import { Skeleton } from "~/components/skeleton";
import { Input } from "~/components/ui/input";
import { getMovies, Movie } from "~/data/get-movies";
import { MovieLink } from "./movie-link";

export async function loader({ request }: LoaderFunctionArgs) {
  const userAgent = request.headers.get("User-Agent");
  const isMacOS = userAgent?.includes("Mac") ?? false;

  const url = new URL(request.url);
  const search = url.searchParams.get("search");
  const movies = getMovies(search ?? "");

  return defer({ movies, search, isMacOS });
}

export default function Index() {
  const { movies, search, isMacOS } = useLoaderData<typeof loader>();
  const submit = useDebounceSubmit();

  useEffect(() => {
    const listener = (event: KeyboardEvent) => {
      const modifierKey = isMacOS ? event.metaKey : event.ctrlKey;
      if (modifierKey && event.key === "k") {
        event.preventDefault();
        const searchField = document.getElementById("search");
        if (searchField instanceof HTMLInputElement) {
          searchField.focus();
        }
      }
    };

    window.addEventListener("keydown", listener);
    return () => window.removeEventListener("keydown", listener);
  }, [isMacOS]);

  useEffect(() => {
    const searchField = document.getElementById("search");
    if (searchField instanceof HTMLInputElement) {
      searchField.value = search ?? "";
    }
  }, [search]);

  return (
    <section className="flex flex-col">
      <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between border-b border-white/10 pb-4 mb-8">
        <h2 className="text-[14px] font-bold tracking-[0.2em] uppercase text-muted-foreground">
          {search ? `Search results for "${search}"` : "Find your next favorite film"}
        </h2>

        <Form
          className="w-full sm:max-w-xs mt-4 sm:mt-0"
          id="search-form"
          onChange={(event) => {
            const isFirstSearch = search === null;
            submit(event.currentTarget, {
              replace: !isFirstSearch,
              debounceTimeout: 300,
            });
          }}
          role="search"
        >
          <div className="relative group">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <Search className="h-3.5 w-3.5 text-muted-darker group-focus-within:text-primary transition-colors" />
            </div>
            <Input
              aria-label="Search movies"
              defaultValue={search ?? ""}
              id="search"
              name="search"
              placeholder="Search..."
              type="search"
              className="h-9 pl-9 bg-secondary border-transparent focus-visible:bg-brand-focus focus-visible:text-white transition-all rounded-sm text-sm"
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <kbd className="hidden sm:inline-flex h-5 select-none items-center gap-1 rounded border border-white/10 bg-card px-1.5 font-mono text-[10px] font-medium text-muted-darker">
                <span className="text-xs">{isMacOS ? "⌘" : "Ctrl"}</span>K
              </kbd>
            </div>
          </div>
        </Form>
      </div>

      {search ? (
        <ul className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-x-4 gap-y-8 w-full">
          <Suspense fallback={<MoviesSkeleton />}>
            <Await resolve={movies}>{(movies) => <Movies movies={movies} search={search} />}</Await>
          </Suspense>
        </ul>
      ) : (
        <EmptyState />
      )}
    </section>
  );
}

function Movies({ movies, search }: { movies: { Search: Array<Movie> }; search: string }) {
  if (!movies?.Search?.length) {
    return (
      <li className="col-span-full flex flex-col items-center justify-center py-16 text-center">
        <Film className="h-12 w-12 text-muted-foreground/50 mb-4" />
        <p className="text-lg font-medium text-muted-foreground">No movies found</p>
        <p className="text-sm text-muted-foreground/70 mt-1">
          No results for &ldquo;{search}&rdquo;
        </p>
      </li>
    );
  }

  return movies.Search.map((movie) => (
    <li key={movie.imdbID}>
      <MovieLink movie={movie} />
    </li>
  ));
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center border-2 border-dashed border-white/5 rounded-lg bg-card/50">
      <div className="flex mb-6">
        <div className="h-12 w-12 rounded-full bg-accent/20 flex items-center justify-center ring-2 ring-background z-30">
          <Film className="h-6 w-6 text-accent" />
        </div>
        <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center ring-2 ring-background -ml-2 z-20">
          <Search className="h-6 w-6 text-primary" />
        </div>
        <div className="h-12 w-12 rounded-full bg-info/20 flex items-center justify-center ring-2 ring-background -ml-2 z-10">
          <Heart className="h-6 w-6 text-info" />
        </div>
      </div>
      <h3 className="text-xl font-black text-white uppercase tracking-widest mb-2">
        Track films you&apos;ve watched.
      </h3>
      <p className="text-muted-foreground max-w-sm mx-auto text-[15px]">
        Search for your favorite movies, explore details, and save them to your personal collection.
      </p>
    </div>
  );
}

function MoviesSkeleton() {
  return Array.from({ length: 10 }).map((_, index) => (
    <div key={index} className="flex flex-col gap-3">
      <Skeleton className="aspect-[2/3] w-full rounded-sm bg-secondary" />
      <div className="flex flex-col gap-2">
        <Skeleton className="h-4 w-3/4 bg-secondary" />
        <Skeleton className="h-3 w-1/4 bg-secondary" />
      </div>
    </div>
  ));
}
