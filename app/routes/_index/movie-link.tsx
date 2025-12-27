import { Link } from "@remix-run/react";
import { Card } from "~/components/ui/card";
import { Movie } from "./types";

export function MovieLink({ movie }: { movie: Movie }) {
  const hasValidPoster = movie.Poster && movie.Poster !== "N/A";

  return (
    <Link
      to={`/details/${movie.imdbID}`}
      prefetch="intent"
      className="group block"
    >
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
              <span className="text-muted-foreground text-sm">No poster</span>
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
  );
}
