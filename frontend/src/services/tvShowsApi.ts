// TV Shows API Service
import axios, { AxiosError } from 'axios';

const TV_API_URL = process.env.TV_API_URL || 'https://group3-datasetwebapi.onrender.com';

// Create axios instance with default config
const tvShowsApi = axios.create({
  baseURL: TV_API_URL,
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 30000 // Increased to 30 seconds for slow API response
});

// Add request interceptor for logging
tvShowsApi.interceptors.request.use(
  (config) => {
    console.log(`[TV Shows API] ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor for error handling
tvShowsApi.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    console.error('[TV Shows API Error]:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export interface TVShow {
  iD?: number;
  id?: string | number;
  name?: string;
  title?: string;
  originalName?: string;
  firstAirDate?: string;
  lastAirDate?: string;
  seasons?: number | string;
  episodes?: number | string;
  status?: string;
  popularity?: number;
  tMDbRating?: number;
  rating?: string;
  voteCount?: number;
  posterURL?: string;
  posterUrl?: string;
  backdropURL?: string;
  backdropUrl?: string;
  overview?: string;
  description?: string;
  genres?: string[];
  genre?: string[];
  networks?: string;
  network?: string;
  studios?: string;
  studio?: string;
  creators?: string[];
  creator?: string;
  cast?: CastMember[];
  releaseDate?: string;
  year?: string;
}

export interface CastMember {
  name: string;
  character: string;
  profileUrl?: string;
}

export interface TVShowsResponse {
  success: boolean;
  message: string;
  data?: TVShow[];
}

/**
 * Get all TV shows or search TV shows
 * GET /series
 */
export const getTVShows = async (params?: {
  search?: string;
  genre?: string;
  year?: number;
  limit?: number;
  offset?: number;
  token?: string;
}): Promise<TVShowsResponse> => {
  try {
    const config: any = {
      params: {
        limit: params?.limit || 100, // Default to 100 results instead of API's default 10
        ...(params?.search && { search: params.search }),
        ...(params?.genre && { genre: params.genre }),
        ...(params?.year && { year: params.year }),
        ...(params?.offset && { offset: params.offset })
      }
    };

    // Add authorization header if token is provided
    if (params?.token) {
      config.headers = {
        Authorization: `Bearer ${params.token}`
      };
    }

    const response = await tvShowsApi.get('/series', config);
    console.log('[TV Shows API] Series response:', response.data);

    return {
      success: response.data.success !== false,
      message: response.data.message || 'TV shows retrieved successfully',
      data: response.data.data || response.data.series || response.data.results || []
    };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('[TV Shows API] Error details:', {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        message: error.message
      });

      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch TV shows',
        data: []
      };
    }

    console.error('[TV Shows API] Unexpected error:', error);
    return {
      success: false,
      message: 'Network error',
      data: []
    };
  }
};

/**
 * Get a single TV show by ID
 * GET /series/:id
 */
export const getTVShowById = async (id: string | number, token?: string): Promise<TVShow | null> => {
  try {
    const config: any = {};

    // Add authorization header if token is provided
    if (token) {
      config.headers = {
        Authorization: `Bearer ${token}`
      };
    }

    const response = await tvShowsApi.get(`/series/${id}`, config);
    console.log('[TV Shows API] Series detail response:', response.data);

    // Handle different response formats
    if (response.data.data) {
      return response.data.data;
    }

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('[TV Shows API] Error fetching TV show:', {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message
      });
    }

    return null;
  }
};

/**
 * Search TV shows by name
 * GET /series?name=query
 */
export const searchTVShows = async (query: string, token?: string): Promise<TVShowsResponse> => {
  try {
    const config: any = {
      params: {
        name: query // Use 'name' parameter instead of 'search'
      }
    };

    // Add authorization header if token is provided
    if (token) {
      config.headers = {
        Authorization: `Bearer ${token}`
      };
    }

    // Use /series with search parameter (not /series/search)
    const response = await tvShowsApi.get('/series', config);

    console.log('[TV Shows API] Search response:', response.data);

    return {
      success: response.data.success !== false,
      message: response.data.message || 'Search completed successfully',
      data: response.data.data || response.data.series || response.data.results || []
    };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('[TV Shows API] Search error:', {
        status: error.response?.status,
        data: error.response?.data
      });
    }

    return {
      success: false,
      message: 'Failed to search TV shows',
      data: []
    };
  }
};

export default tvShowsApi;
