import type { ActionFunctionArgs, MetaFunction } from "@remix-run/node";
import { Link } from "@remix-run/react";
import { useFetcher } from "react-router-dom";
import invariant from "tiny-invariant";
import { getMovies } from "~/data/get-movies";

export const meta: MetaFunction = () => {
  return [
    { title: "Movie Search App" },
    { name: "description", content: "Welcome to Movie Search!" },
  ];
};

type Movie = {
  Title: string;
  Year: string;
  imdbID: string;
  Type: string;
  Poster: string;
};

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const search = String(formData.get("search"));
  invariant(search, "Missing search, please fill the search field.");
  return getMovies(search);
}

export default function Index() {
  const fetcher = useFetcher();

  return (
    <div style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.8" }}>
      <h1>Welcome to Movie Search!</h1>
      <fetcher.Form method="post">
        <label htmlFor="search">Search for a movie:</label>
        <input type="text" id="search" name="search" />
        <button type="submit">Search</button>
      </fetcher.Form>
      <ul>
        {fetcher.data?.Search?.map((movie: Movie) => (
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
