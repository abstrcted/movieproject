// Movies API Service
import axios, { AxiosError } from 'axios';

const MOVIES_API_URL = process.env.MOVIES_API_URL || 'https://tcss460-moviewebapi.onrender.com';
const MOVIES_API_KEY = process.env.MOVIES_API_KEY || 'movie_api_key_2025';

// Create axios instance with default config
const moviesApi = axios.create({
  baseURL: MOVIES_API_URL,
  headers: {
    'Content-Type': 'application/json',
    'x-api-key': MOVIES_API_KEY
  },
  timeout: 30000 // Increased to 30 seconds for slow API response
});

// Add request interceptor for logging and auth
moviesApi.interceptors.request.use(
  (config) => {
    console.log(`[Movies API] ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor for error handling
moviesApi.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    console.error('[Movies API Error]:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export interface Movie {
  movie_id?: number;
  id?: string | number;
  title: string;
  original_title?: string;
  year?: number;
  director?: string;
  genre?: string[];
  genres?: string[];
  rating?: string;
  mpa_rating?: string;
  runtime?: number | string;
  runtime_in_minutes?: number;
  studio?: string;
  boxOffice?: string;
  budget?: number;
  revenue?: number;
  releaseDate?: string;
  release_date?: string;
  description?: string;
  overview?: string;
  posterUrl?: string;
  backdropUrl?: string;
  poster_url?: string;
  backdrop_url?: string;
  collection?: string | null;
  cast?: CastMember[];
}

export interface CastMemberDetailed {
  actor_name: string;
  character_name: string;
}

export interface CastMember {
  name: string;
  character: string;
  profileUrl?: string;
}

export interface MoviesResponse {
  success?: boolean;
  message?: string;
  data?: Movie[];
  movies?: Movie[];
  results?: Movie[];
}

/**
 * Get all movies or search movies
 * GET /movies/title?q=
 * Note: Using /movies/title endpoint to get full movie details including poster URLs
 * Fetches multiple pages to get more than 10 movies (default pageSize)
 */
export const getMovies = async (params?: {
  search?: string;
  genre?: string;
  year?: number;
  limit?: number;
  offset?: number;
  token?: string;
}): Promise<MoviesResponse> => {
  const movieMap = new Map<number, Movie>(); // Use Map to deduplicate by movie_id
  const maxPages = 10; // Fetch first 10 pages (100 movies total)

  // Fetch multiple pages
  for (let page = 1; page <= maxPages; page++) {
    try {
      const config: any = {
        params: {
          q: '', // Empty q to get all movies
          page: page
        }
      };

      // Add authorization header if token is provided
      if (params?.token) {
        config.headers = {
          Authorization: `Bearer ${params.token}`
        };
      }

      const response = await moviesApi.get('/movies/title', config);
      console.log(`[Movies API] Movies response page ${page}:`, response.data);

      // Handle response format - API returns {page, pageSize, results: [...]}
      if (response.data.results && Array.isArray(response.data.results)) {
        if (response.data.results.length === 0) {
          // No more results, stop fetching
          break;
        }

        // Track if we found any new movies on this page
        let newMoviesFound = false;

        // Map cast from API format to our format for each movie
        for (const movie of response.data.results) {
          const movieId = movie.movie_id || movie.id;

          // Only add if not already in the map (deduplicate)
          if (movieId && !movieMap.has(movieId)) {
            if (movie.cast && Array.isArray(movie.cast)) {
              movie.cast = movie.cast.map((c: any) => ({
                name: c.actor_name,
                character: c.character_name
              }));
            }
            movieMap.set(movieId, movie);
            newMoviesFound = true;
          }
        }

        // If no new movies were found on this page, stop fetching more pages
        if (!newMoviesFound) {
          console.log(`[Movies API] No new movies on page ${page}, stopping fetch`);
          break;
        }
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        // If we get a 404 "No movies found", it means we've exhausted all pages
        if (error.response?.status === 404 && error.response?.data?.error === 'No movies found') {
          console.log(`[Movies API] No more results on page ${page}, stopping fetch`);
          break; // Stop pagination but return what we have
        }

        // For other errors, log and stop
        console.error(`[Movies API] Error on page ${page}:`, {
          status: error.response?.status,
          data: error.response?.data,
          message: error.message
        });
        break; // Stop on any other error
      }
    }
  }

  const allMovies = Array.from(movieMap.values());

  return {
    success: true,
    data: allMovies,
    message: `Movies fetched successfully (${allMovies.length} unique movies)`
  };
};

/**
 * Get a single movie by ID
 * GET /movies/title?q={movie_id}
 */
export const getMovieById = async (id: string | number, token?: string): Promise<Movie | null> => {
  try {
    const config: any = {
      params: {
        q: id // Use numeric ID for exact match
      }
    };

    // Add authorization header if token is provided
    if (token) {
      config.headers = {
        Authorization: `Bearer ${token}`
      };
    }

    const response = await moviesApi.get('/movies/title', config);
    console.log('[Movies API] Movie detail response:', response.data);

    // Handle response format - API returns {page, pageSize, results: [...]}
    if (response.data.results && response.data.results.length > 0) {
      const movie = response.data.results[0];

      // Map cast from API format to our format
      if (movie.cast && Array.isArray(movie.cast)) {
        movie.cast = movie.cast.map((c: any) => ({
          name: c.actor_name,
          character: c.character_name
        }));
      }

      return movie;
    }

    return null;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('[Movies API] Error fetching movie:', {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message
      });
    }

    return null;
  }
};

/**
 * Search movies by title
 * GET /movies/title?q={query}
 * Note: Using fuzzy title search from /movies/title endpoint to get full details with posters
 */
export const searchMovies = async (query: string, token?: string): Promise<MoviesResponse> => {
  const movieMap = new Map<number, Movie>(); // Use Map to deduplicate by movie_id
  const maxPages = 10; // Search across first 10 pages

  // Fetch multiple pages for search results
  for (let page = 1; page <= maxPages; page++) {
    try {
      // Only add trailing space if query is purely numeric (to prevent ID lookup)
      const isNumeric = /^\d+$/.test(query);
      const searchQuery = isNumeric ? query + ' ' : query;

      const config: any = {
        params: {
          q: searchQuery,
          page: page
        }
      };

      // Add authorization header if token is provided
      if (token) {
        config.headers = {
          Authorization: `Bearer ${token}`
        };
      }

      console.log(`[Movies API] Searching for "${searchQuery}" on page ${page}`);
      const response = await moviesApi.get('/movies/title', config);
      console.log(`[Movies API] Search response page ${page}:`, response.data);

      // Handle response format - API returns {page, pageSize, results: [...]}
      if (response.data.results && Array.isArray(response.data.results)) {
        if (response.data.results.length === 0) {
          // No more results, stop fetching
          break;
        }

        // Track if we found any new movies on this page
        let newMoviesFound = false;

        // Map cast from API format to our format for each movie
        for (const movie of response.data.results) {
          const movieId = movie.movie_id || movie.id;

          // Only add if not already in the map (deduplicate)
          if (movieId && !movieMap.has(movieId)) {
            if (movie.cast && Array.isArray(movie.cast)) {
              movie.cast = movie.cast.map((c: any) => ({
                name: c.actor_name,
                character: c.character_name
              }));
            }
            movieMap.set(movieId, movie);
            newMoviesFound = true;
          }
        }

        // If no new movies were found on this page, stop fetching more pages
        if (!newMoviesFound) {
          console.log(`[Movies API] No new movies on page ${page}, stopping search`);
          break;
        }
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        // If we get a 404 "No movies found", it means we've exhausted all pages
        if (error.response?.status === 404 && error.response?.data?.error === 'No movies found') {
          console.log(`[Movies API] No more results on page ${page}, stopping search`);
          break; // Stop pagination but return what we have
        }

        // For other errors, log and continue to next page
        console.error(`[Movies API] Error on page ${page}:`, {
          status: error.response?.status,
          data: error.response?.data,
          message: error.message
        });
        break; // Stop on any other error
      }
    }
  }

  const allMovies = Array.from(movieMap.values());

  return {
    success: true,
    data: allMovies,
    message: `Search completed (${allMovies.length} unique results)`
  };
};

export default moviesApi;
