import { Link } from "@remix-run/react";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Movie } from "./types";

export function MovieLink({ movie }: { movie: Movie }) {
  return (
    <Link
      to={`/details/${movie.imdbID}`}
      prefetch="intent"
      className="block transition-transform transform hover:scale-105"
    >
      <Card className="h-72 overflow-hidden">
        <CardHeader className="p-0 pb-2">
          <CardTitle className="px-3 py-2 text-base font-medium line-clamp-2">
            {movie.Title}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <img
            src={movie.Poster}
            alt={`Poster of ${movie.Title}.`}
            className="w-full h-full object-cover"
          />
        </CardContent>
      </Card>
    </Link>
  );
}
