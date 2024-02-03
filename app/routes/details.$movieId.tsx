import { LoaderFunctionArgs, json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import invariant from "tiny-invariant";

export async function loader({ params }: LoaderFunctionArgs) {
  const apiKey = process.env.OMDB_API_KEY;
  const response = await fetch(
    `https://www.omdbapi.com/?i=${params.movieId}&apikey=${apiKey}`
  );
  const movie = await response.json();
  invariant(movie, "Movie not found");
  return json(movie);
}

export default function Details() {
  const movie = useLoaderData<typeof loader>();

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <h1>{movie.Title}</h1>
      <button style={{ width: 80 }}>Favorite</button>
      <div style={{ display: "flex", gap: 8 }}>
        <div style={{ width: 280, height: 420 }}>
          <img
            src={movie.Poster}
            alt={movie.Title}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              overflow: "hidden",
            }}
          />
        </div>
        <p style={{ margin: 0, maxWidth: 560 }}>{movie.Plot}</p>
      </div>
    </div>
  );
}
