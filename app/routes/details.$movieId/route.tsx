import { ActionFunctionArgs, LoaderFunctionArgs, json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import invariant from "tiny-invariant";
import { userFavorites } from "../../cookies.server";
import { getMovieById } from "~/data/get-movie-by-id";
import { Favorite } from "./favorite";
import { Card, CardContent } from "~/components/ui/card";

type Cookie = { favorites: string[] };

export async function loader({ params, request }: LoaderFunctionArgs) {
  invariant(params.movieId, "Missing movieId param");

  const movie = await getMovieById(params.movieId);
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
    <div className="flex flex-col items-center">
      <h1 className="text-4xl sm:text-5xl font-bold mb-8">{movie.Title}</h1>

      <div className="flex flex-col md:flex-row gap-8 w-full max-w-4xl">
        <Card className="relative w-full md:w-80 h-[480px] overflow-hidden">
          <Favorite
            movie={{ favorite }}
            className="absolute top-3 right-3 z-10"
          />
          <CardContent className="p-0 h-full">
            <img
              className="w-full h-full object-cover"
              src={movie.Poster}
              alt={movie.Title}
            />
          </CardContent>
        </Card>
        <div className="flex-1">
          <p className="text-base leading-relaxed text-muted-foreground">
            {movie.Plot}
          </p>
        </div>
      </div>
    </div>
  );
}
