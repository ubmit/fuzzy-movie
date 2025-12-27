export async function getMovieById(movieId: string) {
  const apiKey = process.env.OMDB_API_KEY;
  
  try {
    const response = await fetch(
      `https://www.omdbapi.com/?i=${movieId}&plot=full&apikey=${apiKey}`
    );
    return response.json();
  } catch (error) {
    // Return mock data for development/demo purposes
    const mockMovies: Record<string, any> = {
      "tt0133093": {
        Title: "The Matrix",
        Year: "1999",
        Rated: "R",
        Released: "31 Mar 1999",
        Runtime: "136 min",
        Genre: "Action, Sci-Fi",
        Director: "Lana Wachowski, Lilly Wachowski",
        Writer: "Lilly Wachowski, Lana Wachowski",
        Actors: "Keanu Reeves, Laurence Fishburne, Carrie-Anne Moss",
        Plot: "A computer hacker learns from mysterious rebels about the true nature of his reality and his role in the war against its controllers. When a beautiful stranger leads computer hacker Neo to a forbidding underworld, he discovers the shocking truth--the life he knows is the elaborate deception of an evil cyber-intelligence.",
        Language: "English",
        Country: "United States, Australia",
        Poster: "https://m.media-amazon.com/images/M/MV5BN2NmN2VhMTQtMDNiOS00NDlhLTliMjgtODE2ZTY0ODQyNDRhXkEyXkFqcGc@._V1_SX300.jpg",
        imdbID: "tt0133093",
        Type: "movie"
      }
    };
    
    return mockMovies[movieId] || {
      Title: "Sample Movie",
      Year: "2024",
      Plot: "This is a sample movie description. In a world where UI components matter, one developer must choose between Radix and Base UI. Experience the thrilling journey of modern web development with Tailwind CSS v4 and shadcn/ui components.",
      Poster: "https://via.placeholder.com/300x450/4A5568/FFFFFF?text=Movie+Poster",
      imdbID: movieId,
      Type: "movie"
    };
  }
}
