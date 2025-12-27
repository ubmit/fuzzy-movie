import { ActionFunctionArgs, LoaderFunctionArgs, json } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { ArrowLeft, Calendar, Clock, Star } from "lucide-react";
import invariant from "tiny-invariant";
import { userFavorites } from "../../cookies.server";
import { Card, CardContent } from "~/components/ui/card";
import { getMovieById } from "~/data/get-movie-by-id";
import { Favorite } from "./favorite";

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
  const hasValidPoster = movie.Poster && movie.Poster !== "N/A";

  return (
    <div className="space-y-6">
      <Link
        to="/"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to search
      </Link>

      <div className="flex flex-col lg:flex-row gap-8">
        <div className="relative w-full lg:w-80 shrink-0">
          <Favorite
            movie={{ favorite }}
            className="absolute top-3 right-3 z-10"
          />
          <Card className="overflow-hidden">
            <CardContent className="p-0">
              {hasValidPoster ? (
                <img
                  className="w-full h-auto"
                  src={movie.Poster}
                  alt={movie.Title}
                />
              ) : (
                <div className="w-full aspect-[2/3] bg-muted flex items-center justify-center">
                  <span className="text-muted-foreground">No poster</span>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="flex-1 space-y-6">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
              {movie.Title}
            </h1>
            {movie.Genre && movie.Genre !== "N/A" && (
              <div className="flex flex-wrap gap-2 mt-3">
                {movie.Genre.split(", ").map((genre: string) => (
                  <span
                    key={genre}
                    className="px-2.5 py-0.5 text-xs font-medium bg-secondary text-secondary-foreground rounded-full"
                  >
                    {genre}
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="flex flex-wrap gap-4 text-sm">
            {movie.Year && movie.Year !== "N/A" && (
              <div className="flex items-center gap-1.5 text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <span>{movie.Year}</span>
              </div>
            )}
            {movie.Runtime && movie.Runtime !== "N/A" && (
              <div className="flex items-center gap-1.5 text-muted-foreground">
                <Clock className="h-4 w-4" />
                <span>{movie.Runtime}</span>
              </div>
            )}
            {movie.imdbRating && movie.imdbRating !== "N/A" && (
              <div className="flex items-center gap-1.5">
                <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                <span className="font-medium">{movie.imdbRating}</span>
                <span className="text-muted-foreground">/ 10</span>
              </div>
            )}
          </div>

          {movie.Plot && movie.Plot !== "N/A" && (
            <div>
              <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-2">
                Plot
              </h2>
              <p className="text-base leading-relaxed">{movie.Plot}</p>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            {movie.Director && movie.Director !== "N/A" && (
              <div>
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-1">
                  Director
                </h3>
                <p className="text-sm">{movie.Director}</p>
              </div>
            )}
            {movie.Writer && movie.Writer !== "N/A" && (
              <div>
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-1">
                  Writer
                </h3>
                <p className="text-sm">{movie.Writer}</p>
              </div>
            )}
            {movie.Actors && movie.Actors !== "N/A" && (
              <div className="sm:col-span-2">
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-1">
                  Cast
                </h3>
                <p className="text-sm">{movie.Actors}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
