export async function getMovies(search: string) {
  const apiKey = process.env.OMDB_API_KEY;
  
  try {
    const response = await fetch(
      `https://www.omdbapi.com/?s=${search}&type=movie&apikey=${apiKey}`
    );
    return response.json();
  } catch (error) {
    // Return mock data for development/demo purposes
    return {
      Search: [
        {
          Title: "The Matrix",
          Year: "1999",
          imdbID: "tt0133093",
          Type: "movie",
          Poster: "https://m.media-amazon.com/images/M/MV5BN2NmN2VhMTQtMDNiOS00NDlhLTliMjgtODE2ZTY0ODQyNDRhXkEyXkFqcGc@._V1_SX300.jpg"
        },
        {
          Title: "Inception",
          Year: "2010",
          imdbID: "tt1375666",
          Type: "movie",
          Poster: "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg"
        },
        {
          Title: "Interstellar",
          Year: "2014",
          imdbID: "tt0816692",
          Type: "movie",
          Poster: "https://m.media-amazon.com/images/M/MV5BYzdjMDAxZGItMjI2My00ODA1LTlkNzItOWFjMDU5ZDJlYWY3XkEyXkFqcGc@._V1_SX300.jpg"
        },
        {
          Title: "The Shawshank Redemption",
          Year: "1994",
          imdbID: "tt0111161",
          Type: "movie",
          Poster: "https://m.media-amazon.com/images/M/MV5BMDAyY2FhYjctNDc5OS00MDNlLThiMGUtY2UxYWVkNGY2ZjljXkEyXkFqcGc@._V1_SX300.jpg"
        },
        {
          Title: "The Dark Knight",
          Year: "2008",
          imdbID: "tt0468569",
          Type: "movie",
          Poster: "https://m.media-amazon.com/images/M/MV5BMTMxNTMwODM0NF5BMl5BanBnXkFtZTcwODAyMTk2Mw@@._V1_SX300.jpg"
        },
        {
          Title: "Pulp Fiction",
          Year: "1994",
          imdbID: "tt0110912",
          Type: "movie",
          Poster: "https://m.media-amazon.com/images/M/MV5BYTViYTE3ZGQtNDBlMC00ZTAyLTkyODMtZGRiZDg0MjA2YThkXkEyXkFqcGc@._V1_SX300.jpg"
        },
        {
          Title: "Forrest Gump",
          Year: "1994",
          imdbID: "tt0109830",
          Type: "movie",
          Poster: "https://m.media-amazon.com/images/M/MV5BNDYwNzVjMTItZmU5YS00YjQ5LTljYjgtMjY2NDVmYWMyNWFmXkEyXkFqcGc@._V1_SX300.jpg"
        },
        {
          Title: "The Godfather",
          Year: "1972",
          imdbID: "tt0068646",
          Type: "movie",
          Poster: "https://m.media-amazon.com/images/M/MV5BYTJkNGQyZDgtZDQ0NC00MDM0LWEzZWQtYzUzZDEwMDljZWNjXkEyXkFqcGc@._V1_SX300.jpg"
        },
        {
          Title: "Fight Club",
          Year: "1999",
          imdbID: "tt0137523",
          Type: "movie",
          Poster: "https://m.media-amazon.com/images/M/MV5BOTgyOGQ1NDItNGU3Ny00MjU3LTg2YWEtNmEyYjBiMjI1Y2M5XkEyXkFqcGc@._V1_SX300.jpg"
        },
        {
          Title: "The Lord of the Rings: The Fellowship of the Ring",
          Year: "2001",
          imdbID: "tt0120737",
          Type: "movie",
          Poster: "https://m.media-amazon.com/images/M/MV5BNzIxMDQ2YTctNDY4MC00ZTRhLTk4ODQtMTVlOWY4NTdiYmMwXkEyXkFqcGc@._V1_SX300.jpg"
        }
      ],
      totalResults: "10",
      Response: "True"
    };
  }
}
