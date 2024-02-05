import { LoaderFunctionArgs } from "@remix-run/node";
import { Form, Link, json, useLoaderData } from "@remix-run/react";
import { useEffect } from "react";
import { useDebounceSubmit } from "remix-utils/use-debounce-submit";
import { getMovies } from "~/data/get-movies";

type Movie = {
  Title: string;
  imdbID: string;
  Poster: string;
};

export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const search = url.searchParams.get("search");
  if (!search) return json({ movies: [], search });
  const movies = await getMovies(search ?? "batman");
  return json({ movies, search });
}

export default function Index() {
  const { movies, search } = useLoaderData<typeof loader>();
  const submit = useDebounceSubmit();
  const isMacOS = window.navigator.platform.includes("Mac");

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
        top picks with our <Link to="/favorites">favorites feature</Link>. Dive
        into the world of cinema now!
      </p>
      <Form
        className="w-72 mt-4"
        id="search-form"
        onChange={(event) => {
          const isFirstSearch = search === null;
          submit(event.currentTarget, {
            replace: !isFirstSearch,
            debounceTimeout: 500,
          });
        }}
        role="search"
      >
        <div className="relative mt-2 rounded-md shadow-sm">
          <input
            className="w-full rounded-md border-0 py-1.5 px-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            aria-label="Search movies"
            defaultValue={search ?? ""}
            id="search"
            name="search"
            placeholder="Search"
            type="search"
          />
          <div className="absolute inset-y-1.5 right-1.5 flex items-center bg-gray-200 rounded-md h-2/3">
            <span className="p-1 font-mono text-sm sm:text-xs sm:leading-6 tracking-tight text-gray-500">
              {isMacOS ? "CMD" : "CTRL"}+K
            </span>
          </div>
        </div>
      </Form>
      <ul>
        {movies?.Search?.map((movie: Movie) => (
          <li key={movie.imdbID}>
            <MovieLink movie={movie} />
          </li>
        ))}
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
    >
      <h2>{movie.Title}</h2>
      <img src={movie.Poster} alt={`Poster of ${movie.Title}.`} />
    </Link>
  );
}
