// TV Shows API Service
import axios, { AxiosError } from 'axios';

const TV_API_URL = process.env.NEXT_PUBLIC_TV_API_URL || 'https://group3-datasetwebapi.onrender.com';

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
  page?: number;
  pageSize?: number;
  totalResults?: number;
  totalPages?: number;
}

/**
 * Get all TV shows or search TV shows
 * GET /series
 * Server-side pagination - fetches only one page at a time
 */
export const getTVShows = async (params?: {
  search?: string;
  genre?: string;
  year?: number;
  page?: number;
  limit?: number;
  offset?: number;
  token?: string;
}): Promise<TVShowsResponse> => {
  try {
    const pageSize = params?.limit || 20; // Default to 20 items per page
    const currentPage = params?.page || 1;
    const offset = (currentPage - 1) * pageSize;

    const config: any = {
      params: {
        limit: pageSize,
        offset: offset,
        ...(params?.search && { name: params.search }), // TV Shows API uses 'name' parameter for search
        ...(params?.genre && { genre: params.genre }),
        ...(params?.year && { year: params.year })
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

    const shows = response.data.data || response.data.series || response.data.results || [];
    const total = response.data.total || response.data.totalResults || shows.length;
    const totalPages = Math.ceil(total / pageSize);

    return {
      success: response.data.success !== false,
      message: response.data.message || 'TV shows retrieved successfully',
      data: shows,
      page: currentPage,
      pageSize: pageSize,
      totalResults: total,
      totalPages: totalPages
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
        data: [],
        page: 1,
        pageSize: 0,
        totalResults: 0,
        totalPages: 0
      };
    }

    console.error('[TV Shows API] Unexpected error:', error);
    return {
      success: false,
      message: 'Network error',
      data: [],
      page: 1,
      pageSize: 0,
      totalResults: 0,
      totalPages: 0
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
 * Server-side pagination - fetches only one page at a time
 */
export const searchTVShows = async (query: string, page: number = 1, token?: string): Promise<TVShowsResponse> => {
  // Delegate to getTVShows with search parameter
  return getTVShows({ search: query, page, token });
};

/**
 * Create a new TV show
 * POST /series
 */
export const createTVShow = async (tvShowData: Partial<TVShow>, token?: string): Promise<TVShowsResponse> => {
  try {
    const config: any = {};

    // Add authorization header if token is provided
    if (token) {
      config.headers = {
        Authorization: `Bearer ${token}`
      };
    }

    console.log('[TV Shows API] Creating TV show:', tvShowData);
    const response = await tvShowsApi.post('/series', tvShowData, config);
    console.log('[TV Shows API] Create response:', response.data);

    return {
      success: true,
      message: 'TV show created successfully',
      data: response.data.data || [response.data]
    };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('[TV Shows API] Error creating TV show:', {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message
      });

      return {
        success: false,
        message: error.response?.data?.message || error.response?.data?.error || 'Failed to create TV show'
      };
    }

    console.error('[TV Shows API] Unexpected error:', error);
    return {
      success: false,
      message: 'Network error'
    };
  }
};

export default tvShowsApi;
