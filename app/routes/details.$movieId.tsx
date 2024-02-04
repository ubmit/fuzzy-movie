import { ActionFunctionArgs, LoaderFunctionArgs, json } from "@remix-run/node";
import { useFetcher, useLoaderData } from "@remix-run/react";
import invariant from "tiny-invariant";
import { userFavorites } from "../cookies.server";

const DEFAULT_COOKIE_VALUE = { favorites: new Set() };

async function getCookieValue(
  request: LoaderFunctionArgs["request"] | ActionFunctionArgs["request"]
) {
  const cookieHeader = request.headers.get("Cookie");
  return (await userFavorites.parse(cookieHeader)) ?? DEFAULT_COOKIE_VALUE;
}

export async function loader({ params, request }: LoaderFunctionArgs) {
  const apiKey = process.env.OMDB_API_KEY;
  const response = await fetch(
    `https://www.omdbapi.com/?i=${params.movieId}&apikey=${apiKey}`
  );
  const movie = await response.json();
  invariant(movie, "Movie not found");

  const cookie = await getCookieValue(request);
  invariant(cookie.favorites, "Missing favorites in cookie");

  return json({ movie, favorite: cookie.favorites.has(params.movieId) });
}

export async function action({ params, request }: ActionFunctionArgs) {
  invariant(params.movieId, "Missing movieId param");

  const cookie = await getCookieValue(request);
  invariant(cookie.favorites, "Missing favorites in cookie");

  const formData = await request.formData();
  if (formData.get("favorite") === "false") {
    cookie.favorites.delete(params.movieId);
  } else {
    cookie.favorites.add(params.movieId);
  }

  return json({ ok: true });
}

export default function Details() {
  const { movie, favorite } = useLoaderData<typeof loader>();

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <h1>{movie.Title}</h1>
      <Favorite movie={{ favorite }} />
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

function Favorite({ movie }: { movie: { favorite: boolean } }) {
  const fetcher = useFetcher();
  const favorite = movie.favorite;

  return (
    <fetcher.Form method="post">
      <button
        aria-label={favorite ? "Remove from favorites" : "Add to favorites"}
        name="favorite"
        value={favorite ? "false" : "true"}
      >
        {favorite ? "★" : "☆"}
      </button>
    </fetcher.Form>
  );
}
