import type { ActionFunctionArgs, MetaFunction } from "@remix-run/node";
import { useFetcher } from "react-router-dom";
import invariant from "tiny-invariant";

export const meta: MetaFunction = () => {
  return [
    { title: "Movie Search App" },
    { name: "description", content: "Welcome to Movie Search!" },
  ];
};

type Movie = {
  imdbID: string;
  Title: string;
  Poster: string;
};

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const search = String(formData.get("search"));
  invariant(search, "Missing search, please fill the search field.");

  const apiKey = process.env.OMDB_API_KEY;
  const response = await fetch(
    `http://www.omdbapi.com/?s=${search}&apikey=${apiKey}`
  );
  const data = await response.json();

  return data;
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
          <li key={movie.imdbID}>
            <h2>{movie.Title}</h2>
            <img src={movie.Poster} alt={movie.Title} />
          </li>
        ))}
      </ul>
    </div>
  );
}
