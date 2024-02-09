import { LoaderFunctionArgs, defer } from "@remix-run/node";
import { Await, Form, Link, useLoaderData } from "@remix-run/react";
import { SVGProps, Suspense, useEffect } from "react";
import { useDebounceSubmit } from "remix-utils/use-debounce-submit";
import { getMovies } from "~/data/get-movies";

type Movie = {
  Title: string;
  imdbID: string;
  Poster: string;
};

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
    <section className="flex flex-col items-center text-gray-900">
      <h1 className="text-5xl sm:text-6xl font-bold tracking-wide">
        Fuzzy Movie
      </h1>
      <p className="max-w-prose text-lg text-center text-gray-700 mt-6">
        Find your next film favorite with our fuzzy search. Keep track of your
        top picks with our{" "}
        <Link to="/favorites" className="hover:opacity-70 transition-opacity">
          favorites feature
        </Link>
        . Dive into the world of cinema now!
      </p>
      <Form
        className="w-72 mt-4"
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
        <div className="relative mt-2 rounded-md shadow-sm">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-2">
            <SearchIcon className="stroke-gray-400 w-4 h-4" />
          </div>
          <input
            className="w-full rounded-md border-0 py-2 px-8 text-gray-700 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:outline-none focus:ring-gray-500 sm:text-sm sm:leading-6 [&::-webkit-search-cancel-button]:hidden "
            aria-label="Search movies"
            defaultValue={search ?? ""}
            id="search"
            name="search"
            placeholder="Search"
            type="search"
          />
          <div className="absolute inset-y-0 right-0 flex items-center gap-1 pr-2">
            <span className="px-2 font-mono flex place-items-center rounded-md text-sm sm:text-xs sm:leading-6 tracking-widest text-gray-400 bg-gray-200/40">
              {isMacOS ? "CMD" : "CTRL"}+K
            </span>
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

function MovieLink({ movie }: { movie: Movie }) {
  return (
    <Link
      to={`/details/${movie.imdbID}`}
      prefetch="intent"
      unstable_viewTransition
      className="flex flex-col h-72 border-2 border-gray-100 rounded-md transition-transform transform hover:scale-105 hover:shadow-md"
    >
      <h2 className="px-2 py-1 text-base text-gray-700">{movie.Title}</h2>
      <img
        src={movie.Poster}
        alt={`Poster of ${movie.Title}.`}
        className="w-full h-full object-cover overflow-hidden"
      />
    </Link>
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
    <Skeleton key={index} className="h-72 w-full bg-gray-400/10" />
  ));
}

function SearchIcon({ className }: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={24}
      height={24}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <circle cx={11} cy={11} r={8} />
      <path d="M21 21l-4.3-4.3" />
    </svg>
  );
}

function Skeleton({ className }: { className?: string }) {
  return (
    <div
      className={["animate-pulse rounded-md bg-primary/10", className]
        .filter(Boolean)
        .join(" ")}
    />
  );
}
