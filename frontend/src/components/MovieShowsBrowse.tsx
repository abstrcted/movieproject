'use client';

import { MovieTvShow, normalizeMovie, normalizeTVShow } from '@/types/data/movieTvShowData';
import MovieTvShowCard from './MovieTvShowCard';
import { ChevronLeft, ChevronRight, Search } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { getMovies, searchMovies } from '@/services/moviesApi';
import { getTVShows, searchTVShows } from '@/services/tvShowsApi';

function getHeader(searchQuery: string, setSearchQuery: (query: string) => void) {
  return (
    <div className="flex flex-col gap-6 mb-8 md:mb-12">
      <h1 className="text-3xl sm:text-3xl lg:text-5xl font-bold text-white">Movies &amp; TV Shows</h1>

      {/* Search Bar */}
      <div className="relative max-w-2xl w-full">
        <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none z-10">
          <Search size={24} className="text-gray-400" />
        </div>
        <input
          type="text"
          placeholder="Search movies and TV shows..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-white/10 text-white placeholder:text-gray-400 rounded-full pl-14 pr-6 py-3 md:py-4 border border-white/20 focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-transparent transition-all"
        />
      </div>
    </div>
  );
}

function getMoviesGrid(movies: MovieTvShow[], searchQuery: string) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7 gap-3 sm:gap-4 md:gap-5 lg:gap-6">
      {movies.length > 0 ? (
        movies.map((movie: MovieTvShow) => <MovieTvShowCard key={movie.id} movie={movie} />)
      ) : (
        <div className="col-span-full text-center py-20">
          <p className="text-gray-400 text-lg">No movies found matching &quot;{searchQuery}&quot;</p>
        </div>
      )}
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
    }, 500); // Wait 500ms after user stops typing

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Fetch data when search query changes
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

        const combined = [...normalizedMovies, ...normalizedTVShows].sort((a, b) =>
          a.title.localeCompare(b.title)
        );

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

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Reset to page 1 when search query changes
  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearchQuery]);

  const totalPages = Math.ceil(allMoviesShows.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;

  const goNextPage = () => {
    handlePageChange(currentPage + 1);
  };

  const goPreviousPage = () => {
    handlePageChange(currentPage - 1);
  };

  const paginatedMovies = allMoviesShows.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  return (
    <section className="w-full min-h-screen bg-[#1B1A1A] px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 py-8 md:py-12">
      <div className="max-w-[1920px] mx-auto">
        {/* Header Section */}
        {getHeader(searchQuery, setSearchQuery)}

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-20">
            <div className="text-white text-lg">Loading...</div>
          </div>
        )}

        {/* Pagination */}
        {!loading && (
          <div className="flex flex-col gap-4">
            <div className="flex justify-between text-[#878787]">
              <h1 className="text-sm font-normal">
                Showing {allMoviesShows.length} result{allMoviesShows.length !== 1 ? 's' : ''}
                {debouncedSearchQuery && ` for "${debouncedSearchQuery}"`}
              </h1>
              <div className="flex gap-px items-center">
              <p>
                Page {currentPage} of {totalPages}
              </p>
              <button
                type="button"
                onClick={goPreviousPage}
                disabled={currentPage === 1}
                aria-label="Previous Page"
                className={`hover:scale-110 hover:text-white/60 ${currentPage === 1 ? 'hidden' : ''}`}
              >
                <ChevronLeft size={24} />
              </button>
              <button
                type="button"
                onClick={goNextPage}
                disabled={currentPage === totalPages}
                aria-label="Next Page"
                className={`hover:scale-110 hover:text-white/60 ${currentPage === totalPages ? 'hidden' : ''}`}
              >
                <ChevronRight size={24} />
              </button>
            </div>
          </div>

            {/* Movies Grid */}
            {getMoviesGrid(paginatedMovies, searchQuery)}
          </div>
        )}
      </div>
    </section>
  );
};

export default MovieShowsBrowse;
