import { LoaderFunctionArgs, json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import invariant from "tiny-invariant";

export async function loader({ params }: LoaderFunctionArgs) {
  const apiKey = process.env.OMDB_API_KEY;
  const response = await fetch(
    `https://www.omdbapi.com/?i=${params.id}&apikey=${apiKey}`
  );
  const movie = await response.json();
  invariant(movie, "Movie not found");
  return json(movie);
}

export default function Details() {
  const movie = useLoaderData<typeof loader>();

  return (
    <div>
      <h1>{movie.Title}</h1>
      <img src={movie.Poster} alt={movie.Title} />
      <p>{movie.Plot}</p>
    </div>
  );
}
