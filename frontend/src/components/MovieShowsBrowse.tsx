'use client';

import { MovieTvShow, normalizeMovie, normalizeTVShow } from '@/types/data/movieTvShowData';
import MovieTvShowCard from './MovieTvShowCard';
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
  const { data: session } = useSession();

  const token = (session?.user as any)?.accessToken;

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Fetch data
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [moviesResponse, tvShowsResponse] = await Promise.all([
          debouncedSearchQuery ? searchMovies(debouncedSearchQuery, token) : getMovies({ token }),
          debouncedSearchQuery ? searchTVShows(debouncedSearchQuery, token) : getTVShows({ token })
        ]);

        const normalizedMovies = (moviesResponse.data || []).map(normalizeMovie);
        const normalizedTVShows = (tvShowsResponse.data || []).map(normalizeTVShow);

        const combined = [...normalizedMovies, ...normalizedTVShows].sort((a, b) => a.title.localeCompare(b.title));

        setAllMoviesShows(combined);
      } catch (error) {
        console.error('Error fetching movies and TV shows:', error);
        setAllMoviesShows([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [debouncedSearchQuery, token]);

  // Pagination Logic
  const handlePageChange = (page: number) => setCurrentPage(page);
  useEffect(() => setCurrentPage(1), [debouncedSearchQuery]);

  const totalPages = Math.ceil(allMoviesShows.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedMovies = allMoviesShows.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const goNextPage = () => handlePageChange(currentPage + 1);
  const goPreviousPage = () => handlePageChange(currentPage - 1);

  return (
    <div className="w-full min-h-screen bg-[#1B1A1A] font-sans text-white">
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
            {/* Results Header */}
            <div className="flex justify-between items-end mb-6 border-b border-white/10 pb-4">
              <div>
                <h2 className="text-gray-400 text-sm font-medium uppercase tracking-wider">
                  {debouncedSearchQuery ? `Search Results for "${debouncedSearchQuery}"` : 'All Movies & TV Shows'}
                </h2>
                <p className="text-white text-xl font-semibold mt-1">{allMoviesShows.length} titles found</p>
              </div>

              {/* Top Pagination Controls */}
              <div className="flex items-center gap-4">
                <span className="text-sm text-gray-400 hidden sm:inline">
                  Page {currentPage} of {totalPages}
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
                    disabled={currentPage === totalPages}
                    className="p-2 rounded-full bg-white/5 hover:bg-white/20 disabled:opacity-30 disabled:hover:bg-white/5 transition-all"
                  >
                    <ChevronRight size={20} />
                  </button>
                </div>
              </div>
            </div>

            {/* Movies Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
              {paginatedMovies.length > 0 ? (
                paginatedMovies.map((movie: MovieTvShow) => <MovieTvShowCard key={movie.id} movie={movie} />)
              ) : (
                <div className="col-span-full py-32 text-center text-gray-500">
                  <p className="text-xl">No movies found matching your search.</p>
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
                  {currentPage} <span className="text-gray-500 font-normal mx-1">/</span> {totalPages}
                </span>

                <button
                  type="button"
                  onClick={goNextPage}
                  disabled={currentPage === totalPages}
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
    </div>
  );
};

export default MovieShowsBrowse;
