import { Link } from "@remix-run/react";
import { Movie } from "~/data/get-movies";

export function MovieLink({ movie }: { movie: Movie }) {
  const hasValidPoster = movie.Poster && movie.Poster !== "N/A";

  return (
    <Link
      to={`/details/${movie.imdbID}`}
      prefetch="intent"
      className="group block relative"
    >
      <div className="relative aspect-[2/3] rounded-sm overflow-hidden ring-1 ring-white/10 group-hover:ring-[3px] group-hover:ring-primary transition-all duration-150">
        {hasValidPoster ? (
          <img
            src={movie.Poster}
            alt={`Poster of ${movie.Title}`}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-secondary flex items-center justify-center p-4">
            <span className="text-muted-darker text-xs font-bold uppercase tracking-widest text-center">{movie.Title}</span>
          </div>
        )}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
      </div>
      <div className="mt-2 flex flex-col gap-0.5">
        <h3 className="text-[13px] font-bold text-white group-hover:text-info transition-colors line-clamp-1 leading-tight">
          {movie.Title}
        </h3>
        <p className="text-[11px] font-medium text-muted-darker">
          {movie.Year}
        </p>
      </div>
    </Link>
  );
}
