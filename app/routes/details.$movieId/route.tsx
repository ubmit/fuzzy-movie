import { ActionFunctionArgs, LoaderFunctionArgs, json } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { ArrowLeft, Calendar, Clock, Star } from "lucide-react";
import invariant from "tiny-invariant";
import { userFavorites } from "../../cookies.server";
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
    <div className="flex flex-col gap-8">
      <Link
        to="/"
        className="inline-flex items-center gap-2 text-[11px] font-bold tracking-[0.2em] uppercase text-muted-darker hover:text-white transition-colors"
      >
        <ArrowLeft className="h-3 w-3" />
        Back to search
      </Link>

      <div className="flex flex-col md:flex-row gap-8 lg:gap-12">
        {/* Left: Poster */}
        <div className="w-full md:w-60 lg:w-[230px] shrink-0">
          <div className="relative aspect-[2/3] rounded-sm overflow-hidden ring-1 ring-white/20">
            {hasValidPoster ? (
              <img
                className="w-full h-full object-cover"
                src={movie.Poster}
                alt={movie.Title}
              />
            ) : (
              <div className="w-full h-full bg-secondary flex items-center justify-center p-4">
                <span className="text-muted-darker text-xs font-bold uppercase tracking-widest text-center">
                  {movie.Title}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Center: Info */}
        <div className="flex-1 min-w-0 flex flex-col gap-8">
          <section>
            <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
              <h1 className="text-3xl lg:text-4xl font-black text-white leading-tight">
                {movie.Title}
              </h1>
              <span className="text-2xl font-medium text-muted-darker">
                {movie.Year}
              </span>
            </div>
            
            {movie.Director && movie.Director !== "N/A" && (
              <p className="mt-2 text-[14px] font-medium text-muted-foreground">
                Directed by <span className="text-white font-bold hover:text-info cursor-default">{movie.Director}</span>
              </p>
            )}
          </section>

          {movie.Plot && movie.Plot !== "N/A" && (
            <section className="border-t border-white/5 pt-6">
              <h2 className="text-[11px] font-bold tracking-[0.2em] uppercase text-muted-darker mb-4">
                Synopsis
              </h2>
              <p className="text-muted-foreground leading-relaxed text-[15px]">
                {movie.Plot}
              </p>
            </section>
          )}

          <section className="border-t border-white/5 pt-6 flex flex-col gap-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              {movie.Actors && movie.Actors !== "N/A" && (
                <div>
                  <h3 className="text-[11px] font-bold tracking-[0.2em] uppercase text-muted-darker mb-3">
                    Cast
                  </h3>
                  <div className="flex flex-wrap gap-1.5">
                    {movie.Actors.split(", ").map((actor: string) => (
                      <span key={actor} className="text-[13px] px-2 py-0.5 bg-secondary text-muted-foreground rounded-sm">
                        {actor}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {movie.Genre && movie.Genre !== "N/A" && (
                <div>
                  <h3 className="text-[11px] font-bold tracking-[0.2em] uppercase text-muted-darker mb-3">
                    Genres
                  </h3>
                  <div className="flex flex-wrap gap-1.5">
                    {movie.Genre.split(", ").map((genre: string) => (
                      <span key={genre} className="text-[13px] px-2 py-0.5 bg-secondary text-muted-foreground rounded-sm">
                        {genre}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </section>
        </div>

        {/* Right: Actions */}
        <div className="w-full md:w-64 lg:w-72 shrink-0">
          <div className="bg-card rounded-md border border-white/5 overflow-hidden">
            <div className="p-5 flex flex-col gap-4">
              <div className="flex items-center justify-between pb-4 border-b border-white/5">
                <span className="text-[11px] font-bold tracking-[0.15em] uppercase text-muted-darker">
                  Ratings
                </span>
                <div className="flex items-center gap-1.5 text-white">
                  <Star className="h-4 w-4 text-accent fill-accent" />
                  <span className="text-lg font-black">{movie.imdbRating}</span>
                  <span className="text-xs text-muted-darker">/10</span>
                </div>
              </div>

              <Favorite movie={{ favorite }} />
              
              <div className="flex flex-col gap-3 pt-2">
                <div className="flex items-center gap-3 text-[13px] text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  <span>{movie.Runtime}</span>
                </div>
                <div className="flex items-center gap-3 text-[13px] text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span>Released {movie.Year}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
