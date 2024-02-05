import { ActionFunctionArgs, LoaderFunctionArgs, json } from "@remix-run/node";
import { useFetcher, useLoaderData } from "@remix-run/react";
import invariant from "tiny-invariant";
import { userFavorites } from "../cookies.server";

type Cookie = { favorites: string[] };

export async function loader({ params, request }: LoaderFunctionArgs) {
  invariant(params.movieId, "Missing movieId param");
  const apiKey = process.env.OMDB_API_KEY;
  const response = await fetch(
    `https://www.omdbapi.com/?i=${params.movieId}&apikey=${apiKey}`
  );
  const movie = await response.json();
  invariant(movie, "Movie not found");

  const cookieHeader = request.headers.get("Cookie");
  const cookie: Cookie = (await userFavorites.parse(cookieHeader)) ?? {
    favorites: [],
  };

  return json({ movie, favorite: cookie.favorites.includes(params.movieId) });
}

export async function action({ params, request }: ActionFunctionArgs) {
  invariant(params.movieId, "Missing movieId param");

  const cookieHeader = request.headers.get("Cookie");
  const cookie: Cookie = (await userFavorites.parse(cookieHeader)) ?? {
    favorites: [],
  };

  const formData = await request.formData();
  if (formData.get("favorite") === "true") {
    cookie.favorites = [...cookie.favorites, params.movieId];
  } else {
    cookie.favorites = cookie.favorites.filter(
      (id: string) => id !== params.movieId
    );
  }

  return new Response(JSON.stringify({ ok: true }), {
    headers: {
      "Set-Cookie": await userFavorites.serialize(cookie),
    },
  });
}

export default function Details() {
  const { movie, favorite } = useLoaderData<typeof loader>();

  return (
    <div className="flex flex-col gap-3">
      <h1>{movie.Title}</h1>
      <Favorite movie={{ favorite }} />
      <div className="flex gap-2">
        <div className="w-72 h-[432px]">
          <img
            className="w-full h-full object-cover overflow-hidden"
            src={movie.Poster}
            alt={movie.Title}
          />
        </div>
        <p className="m-0 max-w-[576px]">{movie.Plot}</p>
      </div>
    </div>
  );
}

function Favorite({ movie }: { movie: { favorite: boolean } }) {
  const fetcher = useFetcher();
  const favorite = fetcher.formData
    ? fetcher.formData.get("favorite") === "true"
    : movie.favorite;

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
