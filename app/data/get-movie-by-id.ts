const OMDB_API_URL = "https://www.omdbapi.com";

export type MovieDetails = {
  Title: string;
  Year: string;
  Rated: string;
  Released: string;
  Runtime: string;
  Genre: string;
  Director: string;
  Writer: string;
  Actors: string;
  Plot: string;
  Language: string;
  Country: string;
  Awards: string;
  Poster: string;
  imdbRating: string;
  imdbID: string;
};

type MovieResponse =
  | (MovieDetails & { Response: "True" })
  | { Response: "False"; Error: string };

export async function getMovieById(movieId: string): Promise<MovieDetails | null> {
  const url = new URL(OMDB_API_URL);
  url.searchParams.set("i", movieId);
  url.searchParams.set("plot", "full");
  url.searchParams.set("apikey", process.env.OMDB_API_KEY!);

  const response = await fetch(url);
  const data: MovieResponse = await response.json();

  if (data.Response === "False") {
    return null;
  }

  return data;
}
