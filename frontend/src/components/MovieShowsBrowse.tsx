'use client';

import { MovieTvShow, normalizeMovie, normalizeTVShow } from '@/types/data/movieTvShowData';
import MovieTvShowCard from './MovieTvShowCard';
import WatchlistPanel from './WatchlistPanel';
import { ChevronLeft, ChevronRight, Search, SlidersHorizontal, Plus, Film, Tv } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { getMovies, searchMovies } from '@/services/moviesApi';
import { getTVShows, searchTVShows } from '@/services/tvShowsApi';
import Link from 'next/link';

/**
 * Renders the hero section with title, search bar, and action buttons
 */
function getHeader(searchQuery: string, setSearchQuery: (query: string) => void) {
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
            className="hidden sm:flex items-center gap-2 bg-white/10 backdrop-blur-md hover:bg-white/20 text-white px-6 py-3 rounded-full font-medium transition-colors border border-white/10"
            aria-label="Open filters"
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
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('');
  const [allMoviesShows, setAllMoviesShows] = useState<MovieTvShow[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalResults, setTotalResults] = useState(0);
  const [moviePages, setMoviePages] = useState(0);
  const [tvPages, setTvPages] = useState(0);
  const [apiErrors, setApiErrors] = useState<{ movies?: string; tvShows?: string }>({});
  const { data: session } = useSession();

  const token = (session?.user as any)?.accessToken;

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
      setLoading(true);
      setApiErrors({});

      try {
        // Fetch movies and TV shows separately to handle individual failures
        const moviesPromise = debouncedSearchQuery
          ? searchMovies(debouncedSearchQuery, currentPage, token)
          : getMovies({ page: currentPage, limit: ITEMS_PER_PAGE, token });

        const tvShowsPromise = debouncedSearchQuery
          ? searchTVShows(debouncedSearchQuery, currentPage, token)
          : getTVShows({ page: currentPage, limit: ITEMS_PER_PAGE, token });

        const [moviesResponse, tvShowsResponse] = await Promise.allSettled([
          moviesPromise,
          tvShowsPromise
        ]);

        let normalizedMovies: any[] = [];
        let normalizedTVShows: any[] = [];
        let movieTotal = 0;
        let tvTotal = 0;
        let moviePageCount = 0;
        let tvPageCount = 0;
        const errors: { movies?: string; tvShows?: string } = {};

        // Handle movies response
        if (moviesResponse.status === 'fulfilled' && moviesResponse.value.success) {
          normalizedMovies = (moviesResponse.value.data || []).map(normalizeMovie);
          movieTotal = moviesResponse.value.totalResults || 0;
          moviePageCount = moviesResponse.value.totalPages || 0;
          console.log('[Browse] Movies pagination:', {
            page: moviesResponse.value.page,
            pageSize: moviesResponse.value.pageSize,
            totalResults: movieTotal,
            totalPages: moviePageCount,
            itemsReceived: normalizedMovies.length
          });
        } else {
          errors.movies = 'Movies API is currently unavailable';
          console.error('Movies API error:', moviesResponse.status === 'rejected' ? moviesResponse.reason : moviesResponse.value.message);
        }

        // Handle TV shows response
        if (tvShowsResponse.status === 'fulfilled' && tvShowsResponse.value.success) {
          normalizedTVShows = (tvShowsResponse.value.data || []).map(normalizeTVShow);
          tvTotal = tvShowsResponse.value.totalResults || 0;
          tvPageCount = tvShowsResponse.value.totalPages || 0;
          console.log('[Browse] TV Shows pagination:', {
            page: tvShowsResponse.value.page,
            pageSize: tvShowsResponse.value.pageSize,
            totalResults: tvTotal,
            totalPages: tvPageCount,
            itemsReceived: normalizedTVShows.length
          });
        } else {
          errors.tvShows = 'TV Shows API is currently unavailable';
          console.error('TV Shows API error:', tvShowsResponse.status === 'rejected' ? tvShowsResponse.reason : tvShowsResponse.value.message);
        }

        // Combine and sort by title
        const combined = [...normalizedMovies, ...normalizedTVShows].sort((a, b) => a.title.localeCompare(b.title));

        const combinedTotalResults = movieTotal + tvTotal;
        console.log('[Browse] Combined results:', {
          moviesCount: normalizedMovies.length,
          tvShowsCount: normalizedTVShows.length,
          combinedCount: combined.length,
          movieTotal,
          tvTotal,
          combinedTotalResults,
          moviePages: moviePageCount,
          tvPages: tvPageCount
        });

        setAllMoviesShows(combined);
        setTotalResults(combinedTotalResults);
        setMoviePages(moviePageCount);
        setTvPages(tvPageCount);
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
  }, [debouncedSearchQuery, currentPage, token]);

  // Reset to page 1 when search query changes
  useEffect(() => setCurrentPage(1), [debouncedSearchQuery]);

  // Calculate total pages - only if we have reliable data from BOTH APIs
  // Note: Movies API doesn't provide totalPages/totalResults, only TV Shows API does
  const hasBothPaginationInfo = moviePages > 0 && tvPages > 0;
  const hasAnyPaginationInfo = moviePages > 0 || tvPages > 0;

  // If both APIs provide pagination info, we can show accurate total pages
  // Otherwise, we can only estimate or not show total
  let totalPages = 0;

  if (hasBothPaginationInfo) {
    // Both APIs provide info - use the max
    totalPages = Math.max(moviePages, tvPages);
  } else if (hasAnyPaginationInfo && totalResults > 0) {
    // Only one API provides info - estimate from total results
    // This won't be accurate since Movies API doesn't provide total
    totalPages = Math.ceil(totalResults / ITEMS_PER_PAGE);
  }

  // Enable next page logic:
  // Since Movies API doesn't provide pagination info, we need to be lenient:
  // - If we DON'T have complete pagination info from both APIs, allow next as long as we got results
  // - If we DO have complete pagination info, use the calculated totalPages
  // - Only disable next if we got 0 results (clearly at the end)
  const hasNextPage = !hasBothPaginationInfo
    ? allMoviesShows.length > 0  // No complete pagination info: allow next if we got any results
    : currentPage < totalPages;   // Complete pagination info: use calculated total pages

  const goNextPage = () => setCurrentPage(prev => prev + 1);
  const goPreviousPage = () => setCurrentPage(prev => prev - 1);

  return (
    <div className="w-full min-h-screen bg-[#1B1A1A] font-sans text-white pb-24">
      {/* --- HERO SECTION --- */}
      {getHeader(searchQuery, setSearchQuery)}

      {/* --- MAIN CONTENT SECTION --- */}
      <div className="max-w-[1920px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 pb-20 -mt-10 relative z-20">
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
                  {!hasBothPaginationInfo && <span className="text-sm text-gray-400 ml-2">(pagination info unavailable)</span>}
                </p>
              </div>

              {/* Top Pagination Controls */}
              <div className="flex items-center gap-4">
                <span className="text-sm text-gray-400 hidden sm:inline">
                  Page {currentPage}
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
                  Page {currentPage}
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
