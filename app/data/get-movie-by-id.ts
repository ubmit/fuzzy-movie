import { env } from "~/env";

export async function getMovieById(movieId: string) {
  const response = await fetch(
    `https://www.omdbapi.com/?i=${movieId}&plot=full&apikey=${env.OMDB_API_KEY}`
  );
  return response.json();
}
