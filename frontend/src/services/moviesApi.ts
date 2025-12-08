// Movies API Service
import axios, { AxiosError } from 'axios';

const MOVIES_API_URL = process.env.NEXT_PUBLIC_MOVIES_API_URL || 'https://tcss460-moviewebapi-t961.onrender.com';
const MOVIES_API_KEY = process.env.NEXT_PUBLIC_MOVIES_API_KEY || 'movie_api_key_2025';

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
    // More detailed error logging to capture empty response bodies and request info
    const info: any = {
      message: error.message,
      url: (error.config as any)?.url,
      method: (error.config as any)?.method,
      status: error.response?.status,
      data: error.response?.data
    };

    // If Axios provided no response data, include the raw error object for debugging
    if (!error.response?.data) {
      console.error('[Movies API Error]: no response data; full error:', error);
    }

    console.error('[Movies API Error]:', info);
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

export interface Genre {
  genre_id: number;
  name: string;
}

export interface GenresResponse {
  success: boolean;
  data: Genre[];
  message?: string;
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
    // If year filter is provided, use /moviesbyyear to get the list, 
    // then fetch full details with posters from /movies/title
    if (params?.year) {
      const yearResponse = await moviesApi.get('/moviesbyyear', {
        params: { year: params.year },
        headers: params.token ? { Authorization: `Bearer ${params.token}` } : {}
      });
      
      console.log(`[Movies API] /moviesbyyear response for ${params.year}:`, yearResponse.data);
      
      if (yearResponse.data.movies && Array.isArray(yearResponse.data.movies)) {
        const yearMovies = yearResponse.data.movies;
        const requestedYear = params.year;
        
        console.log(`[Movies API] /moviesbyyear returned ${yearMovies.length} movies for ${requestedYear}`);
        
        // Create a Set of valid movie IDs from the year response
        const validMovieIds = new Set(yearMovies.map((m: any) => m.movie_id));
        
        // Fetch full details for each movie to get poster URLs
        const detailPromises = yearMovies.map((movie: any) => 
          moviesApi.get('/movies/title', {
            params: { q: movie.movie_id },
            headers: params.token ? { Authorization: `Bearer ${params.token}` } : {}
          }).catch(err => {
            console.warn(`Failed to fetch details for movie ${movie.movie_id}:`, err.message);
            return null;
          })
        );
        
        const detailResponses = await Promise.all(detailPromises);
        
        // Merge the detailed data and filter strictly
        const moviesWithDetails = detailResponses
          .filter(res => res && res.data.results && res.data.results.length > 0)
          .flatMap(res => res.data.results) // Get all results from the response
          .filter(movie => {
            // STRICT FILTER: Only include if movie_id is in our valid set from /moviesbyyear
            const isValid = validMovieIds.has(movie.movie_id);
            if (!isValid) {
              console.warn(`Filtered out movie "${movie.title}" (ID: ${movie.movie_id}) - not in year ${requestedYear} response`);
            }
            return isValid;
          })
          .map(movie => {
            // Map cast format
            if (movie.cast && Array.isArray(movie.cast)) {
              movie.cast = movie.cast.map((c: any) => ({
                name: c.actor_name,
                character: c.character_name
              }));
            }
            return movie;
          });
        
        // Remove duplicates by movie_id
        const uniqueMovies = Array.from(
          new Map(moviesWithDetails.map(m => [m.movie_id, m])).values()
        );
        
        console.log(`[Movies API] Enriched ${uniqueMovies.length} unique movies with poster details for year ${requestedYear}`);
        
        return {
          success: true,
          data: uniqueMovies,
          page: 1,
          pageSize: uniqueMovies.length,
          totalResults: yearResponse.data.count || uniqueMovies.length,
          totalPages: 1,
          message: `Movies fetched successfully for year ${params.year}`
        };
      }
    }
    
    // Use /movies/title for all other cases (includes full details with posters)
    const endpoint = '/movies/title';
    
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

    const response = await moviesApi.get(endpoint, config);
    console.log(`[Movies API] ${endpoint} response:`, response.data);

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
        page: response.data.page || 1,
        pageSize: response.data.pageSize || movies.length,
        totalResults: response.data.totalResults || 0,
        totalPages: response.data.totalPages || 0,
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
 * Get all genres
 * GET /genres
 */
export const getGenres = async (token?: string): Promise<GenresResponse> => {
  try {
    const config: any = {};

    // Add authorization header if token is provided
    if (token) {
      config.headers = {
        Authorization: `Bearer ${token}`
      };
    }

    const response = await moviesApi.get('/genres', config);
    console.log('[Movies API] Genres response:', response.data);

    return {
      success: true,
      data: response.data.data || response.data.results || response.data || [],
      message: 'Genres fetched successfully'
    };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('[Movies API] Error fetching genres:', {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message
      });
    }

    return {
      success: false,
      data: [],
      message: 'Failed to fetch genres'
    };
  }
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

/**
 * Delete a movie by ID
 * DELETE /movies/:movie_id
 */
export const deleteMovie = async (movieId: string | number, token?: string): Promise<MoviesResponse> => {
  try {
    const config: any = {};

    // Add authorization header if token is provided
    if (token) {
      config.headers = {
        Authorization: `Bearer ${token}`
      };
    }

    console.log('[Movies API] Deleting movie:', movieId);
    const response = await moviesApi.delete(`/movies/${movieId}`, config);
    console.log('[Movies API] Delete response:', response.data);

    return {
      success: true,
      message: response.data?.message || 'Movie deleted successfully',
      data: []
    };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('[Movies API] Error deleting movie:', {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message
      });

      return {
        success: false,
        message: error.response?.data?.message || error.response?.data?.error || 'Failed to delete movie'
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
