import { env } from "~/env";

export async function getMovieById(movieId: string) {
  const response = await fetch(
    `https://www.omdbapi.com/?i=${movieId}&plot=full&apikey=${env.OMDB_API_KEY}`
  );

  if (!response.ok) {
    throw new Error(
      `Failed to fetch movie with id "${movieId}": ${response.status} ${response.statusText}`
    );
  }

  return response.json();
}
