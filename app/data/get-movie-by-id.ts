export async function getMovieById(movieId: string) {
  const apiKey = process.env.OMDB_API_KEY;
  const response = await fetch(
    `https://www.omdbapi.com/?i=${movieId}&plot=full&apikey=${apiKey}`
  );
  return response.json();
}
