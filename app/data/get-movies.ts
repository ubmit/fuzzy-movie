import { env } from "~/env";

const OMDB_API_URL = "https://www.omdbapi.com";

export type Movie = {
  Title: string;
  Year: string;
  imdbID: string;
  Poster: string;
};

type SearchResponse =
  | { Search: Movie[]; totalResults: string; Response: "True" }
  | { Response: "False"; Error: string };

export async function getMovies(search: string): Promise<{ Search: Movie[] }> {
  if (!search.trim()) {
    return { Search: [] };
  }

  const url = new URL(OMDB_API_URL);
  url.searchParams.set("s", search);
  url.searchParams.set("type", "movie");
  url.searchParams.set("apikey", env.OMDB_API_KEY);

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`OMDb request failed with status ${response.status}`);
  }

  const data: SearchResponse = await response.json();

  if (data.Response === "False") {
    return { Search: [] };
  }

  return { Search: data.Search };
}
