import { LoaderFunctionArgs, json } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { Heart } from "lucide-react";
import { Card } from "~/components/ui/card";
import { userFavorites } from "~/cookies.server";
import { getMovieById, MovieDetails } from "~/data/get-movie-by-id";

type Cookie = { favorites: string[] };

export async function loader({ request }: LoaderFunctionArgs) {
  const cookieHeader = request.headers.get("Cookie");
  const cookie: Cookie = (await userFavorites.parse(cookieHeader)) ?? {
    favorites: [],
  };

  const results = await Promise.all(
    cookie.favorites.map((id) => getMovieById(id))
  );

  const movies = results
    .filter((m): m is MovieDetails => m !== null)
    .sort((a, b) => a.Title.localeCompare(b.Title));

  return json({ movies });
}

export default function Favorites() {
  const { movies } = useLoaderData<typeof loader>();

  if (movies.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <Heart className="h-12 w-12 text-muted-foreground/50 mb-4" />
        <h1 className="text-2xl font-bold mb-2">No favorites yet</h1>
        <p className="text-muted-foreground mb-6">
          Start adding movies to your favorites list
        </p>
        <Link
          to="/"
          className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
        >
          Browse movies
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Favorites</h1>
        <p className="text-muted-foreground mt-1">
          {movies.length} {movies.length === 1 ? "movie" : "movies"} saved
        </p>
      </div>

      <ul className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6">
        {movies.map((movie) => {
          const hasValidPoster = movie.Poster && movie.Poster !== "N/A";
          return (
            <li key={movie.imdbID}>
              <Link to={`/details/${movie.imdbID}`} className="group block">
                <Card className="overflow-hidden transition-all duration-300 hover:ring-2 hover:ring-primary/50 hover:shadow-lg">
                  <div className="relative aspect-[2/3]">
                    {hasValidPoster ? (
                      <img
                        src={movie.Poster}
                        alt={`Poster of ${movie.Title}`}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    ) : (
                      <div className="w-full h-full bg-muted flex items-center justify-center">
                        <span className="text-muted-foreground text-sm">
                          No poster
                        </span>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-3">
                      <span className="inline-block px-2 py-0.5 mb-2 text-xs font-medium bg-primary text-primary-foreground rounded">
                        {movie.Year}
                      </span>
                      <h3 className="text-sm font-medium text-white line-clamp-2 leading-tight">
                        {movie.Title}
                      </h3>
                    </div>
                  </div>
                </Card>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
