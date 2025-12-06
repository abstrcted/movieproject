// Movies API Service
import axios, { AxiosError } from 'axios';

const MOVIES_API_URL = process.env.MOVIES_API_URL || 'https://tcss460-moviewebapi-t961.onrender.com';
const MOVIES_API_KEY = process.env.MOVIES_API_KEY || 'movie_api_key_2025';

console.log('[Movies API] Using base URL:', MOVIES_API_URL);
console.log('[Movies API] Using API key:', MOVIES_API_KEY);

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
  page?: number;
  pageSize?: number;
  totalResults?: number;
  totalPages?: number;
}

/**
 * Get all movies or search movies
 * GET /movies/title?q=&page=
 * Note: Using /movies/title endpoint to get full movie details including poster URLs
 * Server-side pagination - fetches only one page at a time
 */
export const getMovies = async (params?: {
  search?: string;
  genre?: string;
  year?: number;
  page?: number;
  limit?: number;
  offset?: number;
  token?: string;
}): Promise<MoviesResponse> => {
  try {
    const config: any = {
      params: {
        q: params?.search || '', // Empty q to get all movies, or search term
        page: params?.page || 1
      }
    };

    // Add authorization header if token is provided
    if (params?.token) {
      config.headers = {
        Authorization: `Bearer ${params.token}`
      };
    }

    const response = await moviesApi.get('/movies/title', config);
    console.log(`[Movies API] Movies response:`, response.data);

    // Handle response format - API returns {page, pageSize, results: [...]}
    if (response.data.results && Array.isArray(response.data.results)) {
      // Map cast from API format to our format for each movie
      const movies = response.data.results.map((movie: any) => {
        if (movie.cast && Array.isArray(movie.cast)) {
          movie.cast = movie.cast.map((c: any) => ({
            name: c.actor_name,
            character: c.character_name
          }));
        }
        return movie;
      });

      return {
        success: true,
        data: movies,
        page: response.data.page,
        pageSize: response.data.pageSize,
        totalResults: response.data.totalResults || 0, // API doesn't always provide this
        totalPages: response.data.totalPages || 0, // API doesn't always provide this
        message: `Movies fetched successfully`
      };
    }

    return {
      success: true,
      data: [],
      page: 1,
      pageSize: 0,
      totalResults: 0,
      totalPages: 0,
      message: 'No movies found'
    };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('[Movies API] Error:', {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message
      });

      // Return empty result on error
      return {
        success: false,
        data: [],
        page: 1,
        pageSize: 0,
        totalResults: 0,
        totalPages: 0,
        message: error.response?.data?.message || error.response?.data?.error || 'Failed to fetch movies'
      };
    }

    return {
      success: false,
      data: [],
      page: 1,
      pageSize: 0,
      totalResults: 0,
      totalPages: 0,
      message: 'Network error'
    };
  }
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
 * GET /movies/title?q={query}&page=
 * Note: Using fuzzy title search from /movies/title endpoint to get full details with posters
 * Server-side pagination - fetches only one page at a time
 */
export const searchMovies = async (query: string, page: number = 1, token?: string): Promise<MoviesResponse> => {
  // Delegate to getMovies with search parameter
  return getMovies({ search: query, page, token });
};

/**
 * Create a new movie
 * POST /movies
 */
export const createMovie = async (movieData: Partial<Movie>, token?: string): Promise<MoviesResponse> => {
  try {
    const config: any = {};

    // Add authorization header if token is provided
    if (token) {
      config.headers = {
        Authorization: `Bearer ${token}`
      };
    }

    console.log('[Movies API] Creating movie:', movieData);
    const response = await moviesApi.post('/movies', movieData, config);
    console.log('[Movies API] Create response:', response.data);

    return {
      success: true,
      message: 'Movie created successfully',
      data: response.data.data || [response.data]
    };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('[Movies API] Error creating movie:', {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message
      });

      return {
        success: false,
        message: error.response?.data?.message || error.response?.data?.error || 'Failed to create movie'
      };
    }

    console.error('[Movies API] Unexpected error:', error);
    return {
      success: false,
      message: 'Network error'
    };
  }
};

export default moviesApi;
