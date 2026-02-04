import { LoaderFunctionArgs, json } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { Heart } from "lucide-react";
import { userFavorites } from "~/cookies.server";
import { getMovieById, MovieDetails } from "~/data/get-movie-by-id";
import { MovieLink } from "./_index/movie-link";

type Cookie = { favorites: string[] };

export async function loader({ request }: LoaderFunctionArgs) {
  const cookieHeader = request.headers.get("Cookie");
  const cookie: Cookie = (await userFavorites.parse(cookieHeader)) ?? {
    favorites: [],
  };

  const results = await Promise.all(cookie.favorites.map((id) => getMovieById(id)));

  const movies = results
    .filter((m): m is MovieDetails => m !== null)
    .sort((a, b) => a.Title.localeCompare(b.Title));

  return json({ movies });
}

export default function Favorites() {
  const { movies } = useLoaderData<typeof loader>();

  if (movies.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center border-2 border-dashed border-white/5 rounded-lg bg-card/50">
        <Heart className="h-12 w-12 text-muted-darker/50 mb-4" />
        <h1 className="text-xl font-bold text-white mb-2 uppercase tracking-widest">No favorites yet</h1>
        <p className="text-muted-foreground mb-8 max-w-xs">
          Your favorites list is currently empty. Start exploring films to add some.
        </p>
        <Link
          to="/"
          className="inline-flex h-11 items-center justify-center rounded-sm bg-primary px-8 text-[13px] font-black uppercase tracking-widest text-primary-foreground hover:bg-primary/90 transition-colors"
        >
          Find Films
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between border-b border-white/10 pb-4">
        <h1 className="text-[14px] font-bold tracking-[0.2em] uppercase text-muted-foreground">
          My Favorite Films
        </h1>
        <p className="text-[13px] font-medium text-muted-darker mt-1 sm:mt-0">
          You have saved {movies.length} {movies.length === 1 ? "film" : "films"}
        </p>
      </div>

      <ul className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-x-4 gap-y-8">
        {movies.map((movie) => (
          <li key={movie.imdbID}>
            <MovieLink movie={movie} />
          </li>
        ))}
      </ul>
    </div>
  );
}
