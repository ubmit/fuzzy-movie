import { LoaderFunctionArgs, defer } from "@remix-run/node";
import { Await, Form, Link, useLoaderData } from "@remix-run/react";
import { Suspense, useEffect } from "react";
import { useDebounceSubmit } from "remix-utils/use-debounce-submit";
import { getMovies } from "~/data/get-movies";
import { Movie } from "./types";
import { MovieLink } from "./movie-link";
import { SearchIcon } from "./search-icon";
import { Skeleton } from "~/components/skeleton";
import { Input } from "~/components/ui/input";

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
    <section className="flex flex-col items-center">
      <h1 className="text-5xl sm:text-6xl font-bold tracking-wide">
        Fuzzy Movie
      </h1>
      <p className="max-w-prose text-lg text-center text-muted-foreground mt-6">
        Find your next film favorite with our fuzzy search. Keep track of your
        top picks with our{" "}
        <Link to="/favorites" className="text-primary hover:underline">
          favorites feature
        </Link>
        . Dive into the world of cinema now!
      </p>
      <Form
        className="w-full max-w-md mt-6"
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
        <div className="relative">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <SearchIcon className="h-4 w-4 text-muted-foreground" />
          </div>
          <Input
            aria-label="Search movies"
            defaultValue={search ?? ""}
            id="search"
            name="search"
            placeholder="Search movies..."
            type="search"
            className="pl-9 pr-24 [&::-webkit-search-cancel-button]:hidden"
          />
          <div className="absolute inset-y-0 right-0 flex items-center pr-3">
            <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
              <span className="text-xs">{isMacOS ? "⌘" : "Ctrl"}</span>K
            </kbd>
          </div>
        </div>
      </Form>
      <ul className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6 pt-8 w-full">
        <Suspense fallback={<MoviesSkeleton />}>
          <Await resolve={movies}>
            {(movies) => <Movies movies={movies} />}
          </Await>
        </Suspense>
      </ul>
    </section>
  );
}

function Movies({ movies }: { movies: { Search: Array<Movie> } }) {
  return movies?.Search?.map((movie) => (
    <li key={movie.imdbID}>
      <MovieLink movie={movie} />
    </li>
  ));
}

function MoviesSkeleton() {
  return Array.from({ length: 10 }).map((_, index) => (
    <Skeleton key={index} className="h-72 w-full" />
  ));
}
