export async function getMovies(search: string) {
  const apiKey = process.env.OMDB_API_KEY;
  const response = await fetch(
    `https://www.omdbapi.com/?s=${search}&type=movie&apikey=${apiKey}`
  );
  return response.json();
}
