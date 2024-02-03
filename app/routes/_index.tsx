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

  useEffect(() => {
    const searchField = document.getElementById("search");
    if (searchField instanceof HTMLInputElement) {
      searchField.value = search ?? "";
    }
  }, [search]);

  return (
    <div style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.8" }}>
      <h1>Welcome to Movie Search!</h1>
      <Form
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
        <input
          aria-label="Search movies"
          defaultValue={search ?? ""}
          id="search"
          name="search"
          placeholder="Search"
          type="search"
        />
      </Form>
      <ul>
        {movies?.Search?.map((movie: Movie) => (
          // TODO: check if I can prefetch those links so the navigation is faster
          <Link to={`/details/${movie.imdbID}`} key={movie.imdbID}>
            <li>
              <h2>{movie.Title}</h2>
              <img src={movie.Poster} alt={movie.Title} />
            </li>
          </Link>
        ))}
      </ul>
    </div>
  );
}
