'use client';

import { MovieTvShow, normalizeMovie, normalizeTVShow } from '@/types/data/movieTvShowData';
import MovieTvShowCard from './MovieTvShowCard';
import WatchlistPanel from './WatchlistPanel';
import { ChevronLeft, ChevronRight, Search, SlidersHorizontal, Plus, Film, Tv, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { getMovies, Genre } from '@/services/moviesApi';
import { getTVShows, searchTVShows } from '@/services/tvShowsApi';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';

/**
 * Renders the hero section with title, search bar, and action buttons
 */
function getHeader(
  searchQuery: string, 
  setSearchQuery: (query: string) => void,
  showFilters: boolean,
  setShowFilters: (show: boolean) => void
) {
  return (
    <div className="relative w-full h-[500px] flex flex-col justify-center">
      {/* Background Image with Fade Overlay */}
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `url('https://www.wallpaperflare.com/static/436/228/997/movies-mad-max-the-dark-knight-interstellar-movie-wallpaper.jpg')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center 20%'
        }}
      >
        {/* Gradient: Darkens top, and fades bottom into the page background color (#1B1A1A) */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-[#1B1A1A]"></div>
      </div>

      {/* Content Overlay */}
      <div className="relative z-10 w-full max-w-[1920px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <h1 className="text-5xl font-bold text-white tracking-wide drop-shadow-lg">Explore</h1>

          {/* Create Buttons */}
          <div className="flex gap-3">
            <Link
              href="/browse/movie/new"
              className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-800 text-white font-semibold rounded-lg transition-colors duration-200 shadow-lg"
              aria-label="Add new movie"
            >
              <Plus className="w-5 h-5" />
              <Film className="w-5 h-5" />
              <span className="hidden sm:inline">Add Movie</span>
            </Link>
            <Link
              href="/browse/tvshow/new"
              className="flex items-center gap-2 px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white font-semibold rounded-lg transition-colors duration-200 shadow-lg"
              aria-label="Add new TV show"
            >
              <Plus className="w-5 h-5" />
              <Tv className="w-5 h-5" />
              <span className="hidden sm:inline">Add TV Show</span>
            </Link>
          </div>
        </div>

        {/* Search Bar Container */}
        <div className="flex flex-col sm:flex-row gap-4 max-w-2xl">
          <div className="relative flex-grow">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
              <Search size={20} />
            </div>
            <input
              type="text"
              placeholder="Search movies and TV shows..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white text-gray-900 placeholder:text-gray-500 rounded-full pl-12 pr-6 py-4 text-lg focus:outline-none focus:ring-4 focus:ring-red-600/30 shadow-xl transition-all"
              aria-label="Search movies and TV shows"
            />
          </div>

          {/* Filters Button */}
          <button
            type="button"
            onClick={() => setShowFilters(!showFilters)}
            className={`hidden sm:flex items-center gap-2 backdrop-blur-md px-6 py-3 rounded-full font-medium transition-colors border ${
              showFilters 
                ? 'bg-blue-600 hover:bg-blue-700 text-white border-blue-600' 
                : 'bg-white/10 hover:bg-white/20 text-white border-white/10'
            }`}
            aria-label="Toggle filters"
          >
            Filters <SlidersHorizontal size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}

const MovieShowsBrowse = () => {
  const ITEMS_PER_PAGE = 20;
  const router = useRouter();
  const searchParams = useSearchParams();

  // Initialize state from URL parameters
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('');
  const [allMoviesShows, setAllMoviesShows] = useState<MovieTvShow[]>([]);
  const [allFilteredResults, setAllFilteredResults] = useState<MovieTvShow[]>([]); // Store all filtered results for client-side pagination
  const [loading, setLoading] = useState(true);
  const [totalResults, setTotalResults] = useState(0);
  const [moviePages, setMoviePages] = useState(0);
  const [tvPages, setTvPages] = useState(0);
  const [clientFilterPages, setClientFilterPages] = useState(0);
  const [apiErrors, setApiErrors] = useState<{ movies?: string; tvShows?: string }>({});
  const [showFilters, setShowFilters] = useState(false);
  const [selectedGenre, setSelectedGenre] = useState<string>(searchParams.get('genre') || '');
  const [selectedYear, setSelectedYear] = useState<string>(searchParams.get('year') || '');
  const [selectedRating, setSelectedRating] = useState<string>(searchParams.get('rating') || '');
  const [selectedRuntime, setSelectedRuntime] = useState<string>(searchParams.get('runtime') || '');
  const [selectedStatus, setSelectedStatus] = useState<string>(searchParams.get('status') || '');
  const [genres, setGenres] = useState<Genre[]>([]);
  const [unfilteredMoviesShows, setUnfilteredMoviesShows] = useState<MovieTvShow[]>([]);
  const { data: session } = useSession();

  const token = (session?.user as any)?.accessToken;

  // Update URL when filters change
  useEffect(() => {
    const params = new URLSearchParams();
    if (searchQuery) params.set('search', searchQuery);
    if (selectedGenre) params.set('genre', selectedGenre);
    if (selectedYear) params.set('year', selectedYear);
    if (selectedRating) params.set('rating', selectedRating);
    if (selectedRuntime) params.set('runtime', selectedRuntime);
    if (selectedStatus) params.set('status', selectedStatus);

    const queryString = params.toString();
    const newUrl = queryString ? `/browse?${queryString}` : '/browse';
    router.replace(newUrl, { scroll: false });
  }, [searchQuery, selectedGenre, selectedYear, selectedRating, selectedRuntime, selectedStatus, router]);

  // Extract unique genres from ALL movies (not filtered ones)
  useEffect(() => {
    const uniqueGenres = new Set<string>();
    unfilteredMoviesShows.forEach(item => {
      if (item.genre && Array.isArray(item.genre)) {
        item.genre.forEach(g => uniqueGenres.add(g));
      }
    });
    const genresArray = Array.from(uniqueGenres).sort().map((name, index) => ({ 
      genre_id: index + 1, 
      name 
    }));
    setGenres(genresArray);
  }, [unfilteredMoviesShows]);

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Fetch data with server-side pagination
  useEffect(() => {
    const fetchData = async () => {
      // Check if we have client-side filters active
      const hasClientSideFilter = selectedGenre || selectedRating || selectedRuntime || selectedStatus;

      // If client-side filters are active AND we already have cached results, skip fetching
      // (we only refetch when filters change, not when page changes)
      if (hasClientSideFilter && allFilteredResults.length > 0 && currentPage > 1) {
        // Already have cached filtered results, pagination is handled by separate useEffect
        return;
      }

      setLoading(true);
      setApiErrors({});

      try {
        // When any client-side filter is active, fetch multiple pages to ensure we get enough results
        // since these filters are done client-side
        const pagesToFetch = hasClientSideFilter ? 5 : 1; // Fetch 5 pages (100 items) when filtering
        const fetchPromises = [];
        
        for (let i = 0; i < pagesToFetch; i++) {
          const pageNum = currentPage + i;
          
          // Build filter params
          const movieParams: any = { 
            page: pageNum, 
            limit: ITEMS_PER_PAGE, 
            token 
          };
          
          // Add year filter if selected - API will return only movies from that year
          if (selectedYear) {
            movieParams.year = parseInt(selectedYear);
          }
          
          // Add search query if provided (not compatible with year filter on this API)
          if (debouncedSearchQuery && !selectedYear) {
            movieParams.search = debouncedSearchQuery;
          }

          // Fetch movies
          const moviesPromise = getMovies(movieParams);

          // Don't fetch TV shows when year filter is active (year filter is movie-specific)
          const tvShowsPromise = debouncedSearchQuery
            ? searchTVShows(debouncedSearchQuery, pageNum, token)
            : getTVShows({ page: pageNum, limit: ITEMS_PER_PAGE, token });

          fetchPromises.push(
            Promise.allSettled([
              moviesPromise,
              selectedYear ? Promise.resolve({ success: true, data: [] }) : tvShowsPromise
            ])
          );
        }

        const allPagesResults = await Promise.all(fetchPromises);

        let normalizedMovies: any[] = [];
        let normalizedTVShows: any[] = [];
        let movieTotal = 0;
        let tvTotal = 0;
        let moviePageCount = 0;
        let tvPageCount = 0;
        const errors: { movies?: string; tvShows?: string } = {};

        // Process all fetched pages
        for (const [moviesResponse, tvShowsResponse] of allPagesResults) {
          // Handle movies response
          if (moviesResponse.status === 'fulfilled' && moviesResponse.value.success) {
            const movies = (moviesResponse.value.data || []).map(normalizeMovie);
            normalizedMovies.push(...movies);
            movieTotal = moviesResponse.value.totalResults || 0;
            moviePageCount = moviesResponse.value.totalPages || 0;
          } else if (!errors.movies) {
            errors.movies = 'Movies API is currently unavailable';
            console.error('Movies API error:', moviesResponse.status === 'rejected' ? moviesResponse.reason : moviesResponse.value.message);
          }

          // Handle TV shows response
          if (tvShowsResponse.status === 'fulfilled' && tvShowsResponse.value.success) {
            const shows = (tvShowsResponse.value.data || []).map(normalizeTVShow);
            normalizedTVShows.push(...shows);
            // Only set totals if the response has pagination info (not from the empty placeholder)
            if ('totalResults' in tvShowsResponse.value) {
              tvTotal = tvShowsResponse.value.totalResults || 0;
              tvPageCount = tvShowsResponse.value.totalPages || 0;
            }
          } else if (!errors.tvShows) {
            errors.tvShows = 'TV Shows API is currently unavailable';
            console.error('TV Shows API error:', tvShowsResponse.status === 'rejected' ? tvShowsResponse.reason : (tvShowsResponse.value as any).message);
          }
        }

        console.log('[Browse] Fetched data:', {
          moviesCount: normalizedMovies.length,
          tvShowsCount: normalizedTVShows.length,
          pagesFetched: pagesToFetch,
          filters: {
            genre: selectedGenre || 'none',
            year: selectedYear || 'none',
            rating: selectedRating || 'none',
            runtime: selectedRuntime || 'none',
            status: selectedStatus || 'none'
          }
        });

        // Remove duplicates by movie_id/id before any filtering
        // This is important when year filter is active because /moviesbyyear returns all movies
        // for that year regardless of page number, causing duplicates when fetching multiple pages
        const uniqueMoviesMap = new Map();
        normalizedMovies.forEach(movie => {
          const key = movie.id;
          if (!uniqueMoviesMap.has(key)) {
            uniqueMoviesMap.set(key, movie);
          }
        });
        normalizedMovies = Array.from(uniqueMoviesMap.values());

        const uniqueTVShowsMap = new Map();
        normalizedTVShows.forEach(show => {
          const key = show.id;
          if (!uniqueTVShowsMap.has(key)) {
            uniqueTVShowsMap.set(key, show);
          }
        });
        normalizedTVShows = Array.from(uniqueTVShowsMap.values());

        console.log('[Browse] After deduplication:', {
          moviesCount: normalizedMovies.length,
          tvShowsCount: normalizedTVShows.length
        });

        // Store unfiltered results first for genre extraction
        const unfilteredCombined = [...normalizedMovies, ...normalizedTVShows].sort((a, b) => a.title.localeCompare(b.title));
        setUnfilteredMoviesShows(unfilteredCombined);
        
        // Apply client-side filters
        // Note: Year filtering is done by the API when selectedYear is active
        
        // Apply search filter client-side if year filter is active
        // (because /moviesbyyear doesn't support search parameter)
        if (selectedYear && debouncedSearchQuery) {
          const searchLower = debouncedSearchQuery.toLowerCase();
          normalizedMovies = normalizedMovies.filter((movie) =>
            movie.title.toLowerCase().includes(searchLower)
          );
          normalizedTVShows = normalizedTVShows.filter((show) =>
            show.title.toLowerCase().includes(searchLower)
          );
        }

        // Apply genre filter client-side
        if (selectedGenre) {
          normalizedMovies = normalizedMovies.filter(
            (movie) => movie.genre && movie.genre.some((g: string) => g.toLowerCase() === selectedGenre.toLowerCase())
          );
          normalizedTVShows = normalizedTVShows.filter(
            (show) => show.genre && show.genre.some((g: string) => g.toLowerCase() === selectedGenre.toLowerCase())
          );
        }

        // Apply rating filter client-side (for movies ONLY - MPA rating)
        if (selectedRating) {
          normalizedMovies = normalizedMovies.filter(
            (movie) => movie.rating && movie.rating.toUpperCase() === selectedRating.toUpperCase()
          );
          // When rating filter is active, exclude ALL TV shows since rating only applies to movies
          normalizedTVShows = [];
        }

        // Apply status filter client-side (for TV shows ONLY)
        if (selectedStatus) {
          normalizedTVShows = normalizedTVShows.filter(
            (show: any) => show.status && show.status.toLowerCase() === selectedStatus.toLowerCase()
          );
          // When status filter is active, exclude ALL movies since status only applies to TV shows
          normalizedMovies = [];
        }

        // Apply runtime filter client-side
        if (selectedRuntime) {
          normalizedMovies = normalizedMovies.filter((movie: any) => {
            const runtime = typeof movie.runtime === 'string' ? parseInt(movie.runtime) : movie.runtime;
            if (!runtime || isNaN(runtime)) return false;

            switch (selectedRuntime) {
              case 'short':
                return runtime < 90;
              case 'medium':
                return runtime >= 90 && runtime <= 150;
              case 'long':
                return runtime > 150;
              default:
                return true;
            }
          });

          normalizedTVShows = normalizedTVShows.filter((show: any) => {
            // For TV shows, we'll use episode count as a proxy for "runtime"
            const episodes = typeof show.episodes === 'string' ? parseInt(show.episodes) : show.episodes;
            if (!episodes || isNaN(episodes)) return false;

            switch (selectedRuntime) {
              case 'short':
                return episodes < 20;
              case 'medium':
                return episodes >= 20 && episodes <= 100;
              case 'long':
                return episodes > 100;
              default:
                return true;
            }
          });
        }

        // Combine filtered results and sort by title
        const combined = [...normalizedMovies, ...normalizedTVShows].sort((a, b) => a.title.localeCompare(b.title));

        // When any client-side filter is active, store all filtered results and paginate locally
        let displayResults = combined;
        let clientSidePages = 1;

        if (hasClientSideFilter) {
          // Store ALL filtered results for client-side pagination
          setAllFilteredResults(combined);

          // Calculate total pages based on filtered results
          clientSidePages = Math.ceil(combined.length / ITEMS_PER_PAGE);

          // Show only the current page's worth of filtered results
          const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
          const endIndex = startIndex + ITEMS_PER_PAGE;
          displayResults = combined.slice(startIndex, endIndex);
        } else {
          // No client-side filter: clear the cached filtered results
          setAllFilteredResults([]);
        }

        const combinedTotalResults = movieTotal + tvTotal;
        console.log('[Browse] Combined results:', {
          moviesCount: normalizedMovies.length,
          tvShowsCount: normalizedTVShows.length,
          combinedCount: combined.length,
          displayCount: displayResults.length,
          currentPage,
          movieTotal,
          tvTotal,
          combinedTotalResults,
          moviePages: moviePageCount,
          tvPages: tvPageCount
        });

        setAllMoviesShows(displayResults);
        setTotalResults(combinedTotalResults);
        setMoviePages(moviePageCount);
        setTvPages(tvPageCount);
        setClientFilterPages(clientSidePages);
        setApiErrors(errors);
      } catch (error) {
        console.error('Error fetching movies and TV shows:', error);
        setAllMoviesShows([]);
        setTotalResults(0);
        setApiErrors({ movies: 'Failed to load content', tvShows: 'Failed to load content' });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [debouncedSearchQuery, currentPage, selectedYear, selectedGenre, selectedRating, selectedRuntime, selectedStatus, token, allFilteredResults.length]);

  // Reset to page 1 when search query or filters change
  useEffect(() => setCurrentPage(1), [debouncedSearchQuery, selectedYear, selectedGenre, selectedRating, selectedRuntime, selectedStatus]);

  // Handle client-side pagination: when page changes and we have cached filtered results, just re-paginate
  useEffect(() => {
    const hasClientSideFilter = selectedRating || selectedStatus || selectedRuntime;
    if (hasClientSideFilter && allFilteredResults.length > 0) {
      // We have cached filtered results, just paginate them locally without re-fetching
      const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
      const endIndex = startIndex + ITEMS_PER_PAGE;
      const paginatedResults = allFilteredResults.slice(startIndex, endIndex);
      setAllMoviesShows(paginatedResults);
    }
  }, [currentPage, allFilteredResults, selectedRating, selectedStatus, selectedRuntime]);

  // Calculate total pages
  const hasClientSideFilter = selectedRating || selectedStatus || selectedRuntime;
  const hasBothPaginationInfo = moviePages > 0 && tvPages > 0;
  const hasAnyPaginationInfo = moviePages > 0 || tvPages > 0;

  let totalPages = 0;
  let showTotalPages = false; // Only show "of X" when we have reliable page count

  if (hasClientSideFilter && clientFilterPages > 0) {
    // Client-side filter active: use the calculated pages from filtered results
    totalPages = clientFilterPages;
    showTotalPages = true; // We know exact page count for filtered results
  } else if (hasBothPaginationInfo) {
    // Both APIs provide info - use the max
    totalPages = Math.max(moviePages, tvPages);
    showTotalPages = true; // Both APIs provided reliable info
  } else if (hasAnyPaginationInfo && totalResults > 0) {
    // Only one API provides info - estimate from total results
    totalPages = Math.ceil(totalResults / ITEMS_PER_PAGE);
    showTotalPages = false; // Don't show "of X" when we're estimating (Movies API doesn't provide total)
  }

  // Enable next page logic
  const hasNextPage = hasClientSideFilter
    ? currentPage < clientFilterPages  // Client-side filters: use filtered page count
    : !hasBothPaginationInfo
      ? allMoviesShows.length >= ITEMS_PER_PAGE  // No complete pagination info: allow next if we got a full page
      : currentPage < totalPages;   // Complete pagination info: use calculated total pages

  const goNextPage = () => setCurrentPage(prev => prev + 1);
  const goPreviousPage = () => setCurrentPage(prev => Math.max(prev - 1, 1));

  const clearFilters = () => {
    setSelectedGenre('');
    setSelectedYear('');
    setSelectedRating('');
    setSelectedRuntime('');
    setSelectedStatus('');
  };

  const hasActiveFilters = selectedGenre || selectedYear || selectedRating || selectedRuntime || selectedStatus;

  // Generate year options (last 100 years)
  const currentYear = new Date().getFullYear();
  const yearOptions = Array.from({ length: 100 }, (_, i) => currentYear - i);

  return (
    <div className="w-full min-h-screen bg-[#1B1A1A] font-sans text-white pb-24">
      {/* --- HERO SECTION --- */}
      {getHeader(searchQuery, setSearchQuery, showFilters, setShowFilters)}

      {/* --- MAIN CONTENT SECTION --- */}
      <div className="max-w-[1920px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 pb-20 -mt-10 relative z-20">
        
        {/* Filters Panel */}
        {showFilters && (
          <div className="mb-6 bg-white/5 backdrop-blur-md rounded-lg p-6 border border-white/10">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Filters</h3>
              {hasActiveFilters && (
                <button
                  type="button"
                  onClick={clearFilters}
                  className="flex items-center gap-2 text-sm text-blue-400 hover:text-blue-300 transition-colors"
                >
                  <X size={16} />
                  Clear Filters
                </button>
              )}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Year Filter */}
              <div>
                <label htmlFor="year-filter" className="block text-sm font-medium text-gray-300 mb-2">
                  Release Year
                </label>
                <select
                  id="year-filter"
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(e.target.value)}
                  className="w-full bg-white/10 text-white border border-white/20 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600/50"
                  style={{ colorScheme: 'dark' }}
                >
                  <option value="" className="bg-gray-800 text-white">All Years</option>
                  {yearOptions.map(year => (
                    <option key={year} value={year} className="bg-gray-800 text-white">{year}</option>
                  ))}
                </select>
              </div>

              {/* Genre Filter */}
              <div>
                <label htmlFor="genre-filter" className="block text-sm font-medium text-gray-300 mb-2">
                  Genre
                </label>
                <select
                  id="genre-filter"
                  value={selectedGenre}
                  onChange={(e) => setSelectedGenre(e.target.value)}
                  className="w-full bg-white/10 text-white border border-white/20 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600/50"
                  style={{ colorScheme: 'dark' }}
                  disabled={genres.length === 0}
                >
                  <option value="" className="bg-gray-800 text-white">All Genres</option>
                  {genres.map(genre => (
                    <option key={genre.genre_id} value={genre.name} className="bg-gray-800 text-white">{genre.name}</option>
                  ))}
                </select>
              </div>

              {/* Rating Filter */}
              <div>
                <label htmlFor="rating-filter" className="block text-sm font-medium text-gray-300 mb-2">
                  Movie Rating
                </label>
                <select
                  id="rating-filter"
                  value={selectedRating}
                  onChange={(e) => setSelectedRating(e.target.value)}
                  className="w-full bg-white/10 text-white border border-white/20 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600/50"
                  style={{ colorScheme: 'dark' }}
                >
                  <option value="" className="bg-gray-800 text-white">All Ratings</option>
                  <option value="G" className="bg-gray-800 text-white">G - General Audiences</option>
                  <option value="PG" className="bg-gray-800 text-white">PG - Parental Guidance</option>
                  <option value="PG-13" className="bg-gray-800 text-white">PG-13 - Parents Cautioned</option>
                  <option value="R" className="bg-gray-800 text-white">R - Restricted</option>
                  <option value="NC-17" className="bg-gray-800 text-white">NC-17 - Adults Only</option>
                  <option value="NR" className="bg-gray-800 text-white">NR - Not Rated</option>
                </select>
              </div>

              {/* Status Filter (for TV Shows) */}
              <div>
                <label htmlFor="status-filter" className="block text-sm font-medium text-gray-300 mb-2">
                  TV Show Status
                </label>
                <select
                  id="status-filter"
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="w-full bg-white/10 text-white border border-white/20 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600/50"
                  style={{ colorScheme: 'dark' }}
                >
                  <option value="" className="bg-gray-800 text-white">All Status</option>
                  <option value="Ended" className="bg-gray-800 text-white">Ended</option>
                  <option value="Returning Series" className="bg-gray-800 text-white">Returning Series</option>
                  <option value="Canceled" className="bg-gray-800 text-white">Canceled</option>
                  <option value="In Production" className="bg-gray-800 text-white">In Production</option>
                  <option value="Planned" className="bg-gray-800 text-white">Planned</option>
                </select>
              </div>

              {/* Runtime/Length Filter */}
              <div>
                <label htmlFor="runtime-filter" className="block text-sm font-medium text-gray-300 mb-2">
                  Length
                </label>
                <select
                  id="runtime-filter"
                  value={selectedRuntime}
                  onChange={(e) => setSelectedRuntime(e.target.value)}
                  className="w-full bg-white/10 text-white border border-white/20 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600/50"
                  style={{ colorScheme: 'dark' }}
                >
                  <option value="" className="bg-gray-800 text-white">All Lengths</option>
                  <option value="short" className="bg-gray-800 text-white">Short (&lt;90min / &lt;20 episodes)</option>
                  <option value="medium" className="bg-gray-800 text-white">Medium (90-150min / 20-100 episodes)</option>
                  <option value="long" className="bg-gray-800 text-white">Long (&gt;150min / &gt;100 episodes)</option>
                </select>
              </div>
            </div>

            {/* Active Filters Display */}
            {hasActiveFilters && (
              <div className="mt-4 flex flex-wrap gap-2">
                {selectedYear && (
                  <span className="inline-flex items-center gap-2 bg-blue-600/20 text-blue-300 px-3 py-1 rounded-full text-sm">
                    Year: {selectedYear}
                    <button
                      type="button"
                      onClick={() => setSelectedYear('')}
                      className="hover:text-white"
                    >
                      <X size={14} />
                    </button>
                  </span>
                )}
                {selectedGenre && (
                  <span className="inline-flex items-center gap-2 bg-blue-600/20 text-blue-300 px-3 py-1 rounded-full text-sm">
                    Genre: {selectedGenre}
                    <button
                      type="button"
                      onClick={() => setSelectedGenre('')}
                      className="hover:text-white"
                    >
                      <X size={14} />
                    </button>
                  </span>
                )}
                {selectedRating && (
                  <span className="inline-flex items-center gap-2 bg-blue-600/20 text-blue-300 px-3 py-1 rounded-full text-sm">
                    Rating: {selectedRating}
                    <button
                      type="button"
                      onClick={() => setSelectedRating('')}
                      className="hover:text-white"
                    >
                      <X size={14} />
                    </button>
                  </span>
                )}
                {selectedStatus && (
                  <span className="inline-flex items-center gap-2 bg-blue-600/20 text-blue-300 px-3 py-1 rounded-full text-sm">
                    Status: {selectedStatus}
                    <button
                      type="button"
                      onClick={() => setSelectedStatus('')}
                      className="hover:text-white"
                    >
                      <X size={14} />
                    </button>
                  </span>
                )}
                {selectedRuntime && (
                  <span className="inline-flex items-center gap-2 bg-blue-600/20 text-blue-300 px-3 py-1 rounded-full text-sm">
                    Length: {selectedRuntime.charAt(0).toUpperCase() + selectedRuntime.slice(1)}
                    <button
                      type="button"
                      onClick={() => setSelectedRuntime('')}
                      className="hover:text-white"
                    >
                      <X size={14} />
                    </button>
                  </span>
                )}
              </div>
            )}
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
          </div>
        )}

        {!loading && (
          <>
            {/* API Error Messages */}
            {(apiErrors.movies || apiErrors.tvShows) && (
              <div className="mb-6 space-y-2">
                {apiErrors.movies && (
                  <div className="p-4 bg-red-500/10 border border-red-500/50 rounded-lg text-red-400 text-sm">
                    <strong>Movies API:</strong> {apiErrors.movies}
                  </div>
                )}
                {apiErrors.tvShows && (
                  <div className="p-4 bg-red-500/10 border border-red-500/50 rounded-lg text-red-400 text-sm">
                    <strong>TV Shows API:</strong> {apiErrors.tvShows}
                  </div>
                )}
              </div>
            )}

            {/* Results Header */}
            <div className="flex justify-between items-end mb-6 border-b border-white/10 pb-4">
              <div>
                <h2 className="text-gray-400 text-sm font-medium uppercase tracking-wider">
                  {debouncedSearchQuery ? `Search Results for "${debouncedSearchQuery}"` : 'All Movies & TV Shows'}
                </h2>
                <p className="text-white text-xl font-semibold mt-1">
                  Showing {allMoviesShows.length} {allMoviesShows.length === 1 ? 'title' : 'titles'} on this page
                </p>
              </div>

              {/* Top Pagination Controls */}
              <div className="flex items-center gap-4">
                <span className="text-sm text-gray-400 hidden sm:inline">
                  Page {currentPage}{showTotalPages && totalPages > 0 ? ` of ${totalPages}` : ''}
                </span>
                <div className="flex gap-2">
                  <button
                    type="button"
                    aria-label="Previous Page"
                    onClick={goPreviousPage}
                    disabled={currentPage === 1}
                    className="p-2 rounded-full bg-white/5 hover:bg-white/20 disabled:opacity-30 disabled:hover:bg-white/5 transition-all"
                  >
                    <ChevronLeft size={20} />
                  </button>
                  <button
                    type="button"
                    aria-label="Next Page"
                    onClick={goNextPage}
                    disabled={!hasNextPage}
                    className="p-2 rounded-full bg-white/5 hover:bg-white/20 disabled:opacity-30 disabled:hover:bg-white/5 transition-all"
                  >
                    <ChevronRight size={20} />
                  </button>
                </div>
              </div>
            </div>

            {/* Movies Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
              {allMoviesShows.length > 0 ? (
                allMoviesShows.map((movie: MovieTvShow) => <MovieTvShowCard key={movie.id} movie={movie} />)
              ) : (
                <div className="col-span-full py-32 text-center text-gray-500">
                  <p className="text-xl">No movies or TV shows found matching your search.</p>
                </div>
              )}
            </div>

            {/* Bottom Pagination */}
            <div className="mt-12 flex justify-center">
              <div className="flex items-center gap-6 bg-white/5 px-6 py-3 rounded-full backdrop-blur-sm border border-white/5">
                <button
                  type="button"
                  onClick={goPreviousPage}
                  disabled={currentPage === 1}
                  className="flex items-center gap-2 text-sm font-medium text-gray-300 hover:text-white disabled:text-gray-600 transition-colors"
                  aria-label="Previous Page"
                >
                  <ChevronLeft size={16} /> Previous
                </button>

                <span className="text-sm font-semibold text-white">
                  Page {currentPage}{showTotalPages && totalPages > 0 ? ` of ${totalPages}` : ''}
                </span>

                <button
                  type="button"
                  onClick={goNextPage}
                  disabled={!hasNextPage}
                  className="flex items-center gap-2 text-sm font-medium text-gray-300 hover:text-white disabled:text-gray-600 transition-colors"
                  aria-label="Next Page"
                >
                  Next <ChevronRight size={16} />
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* --- WATCHLIST PANEL --- */}
      <WatchlistPanel />
    </div>
  );
};

export default MovieShowsBrowse;
