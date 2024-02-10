import { Link } from "@remix-run/react";
import { Movie } from "./types";

export function MovieLink({ movie }: { movie: Movie }) {
  return (
    <Link
      to={`/details/${movie.imdbID}`}
      prefetch="intent"
      unstable_viewTransition
      className="flex flex-col h-72 border-2 border-gray-100 rounded-md transition-transform transform hover:scale-105 hover:shadow-md"
    >
      <h2 className="px-2 py-1 text-base text-gray-700">{movie.Title}</h2>
      <img
        src={movie.Poster}
        alt={`Poster of ${movie.Title}.`}
        className="w-full h-full object-cover overflow-hidden"
      />
    </Link>
  );
}
