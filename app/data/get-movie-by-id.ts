import { env } from "~/env";

export type MovieDetails = {
  Title: string;
  Year: string;
  imdbID: string;
  Poster: string;
  Plot: string;
  Rated?: string;
  Released?: string;
  Runtime?: string;
  Genre?: string;
  Director?: string;
  Writer?: string;
  Actors?: string;
  Language?: string;
  Country?: string;
  Awards?: string;
  Ratings?: Array<{ Source: string; Value: string }>;
  Metascore?: string;
  imdbRating?: string;
  imdbVotes?: string;
  Type: string;
  DVD?: string;
  BoxOffice?: string;
  Production?: string;
  Website?: string;
  Response?: string;
};

export async function getMovieById(movieId: string): Promise<MovieDetails | null> {
  const response = await fetch(
    `https://www.omdbapi.com/?i=${movieId}&plot=full&apikey=${env.OMDB_API_KEY}`
  );

  if (!response.ok) {
    throw new Error(
      `Failed to fetch movie with id "${movieId}": ${response.status} ${response.statusText}`
    );
  }

  const data = await response.json();
  
  if (data.Response === "False") {
    return null;
  }

  return data;
}
