'use client';
import { MovieTvShow } from '@/types/data/movieTvShowData';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { Plus, Check } from 'lucide-react';
import { useWatchlist } from '@/contexts/WatchlistContext';

const MovieTvShowCard = ({ movie }: { movie: MovieTvShow }) => {
  const [isHovered, setIsHovered] = useState(false);
  const { addToWatchlist, removeFromWatchlist, isInWatchlist } = useWatchlist();
  const inWatchlist = isInWatchlist(movie.id);
  const [imageError, setImageError] = useState(false);
  const fallbackImage = 'https://placehold.co/500x750/1a1a1a/808080.png?text=No+Poster';
  // Ensure image src is a valid string that Next/Image can handle. If not, use fallback.
  let imageSrc = fallbackImage;
  if (movie && typeof movie.image === 'string' && movie.image.trim()) {
    const src = movie.image.trim();
    // Accept absolute URLs or root-relative paths
    if (src.startsWith('http://') || src.startsWith('https://') || src.startsWith('/')) {
      imageSrc = src;
    }
  }
  if (imageError) imageSrc = fallbackImage;

  const handleWatchlistToggle = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent navigation to detail page
    e.stopPropagation();

    if (inWatchlist) {
      removeFromWatchlist(movie.id);
    } else {
      addToWatchlist(movie);
    }
  };

  return (
    <div
      className="w-full group cursor-pointer relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link href={`/browse/${movie.type}/${movie.id}`} className="block">
        {/* Card Container with aspect ratio */}
        <div className="relative w-full aspect-2/3 overflow-hidden bg-gray-800 shadow-lg transition-all duration-300 group-hover:scale-105 group-hover:shadow-2xl rounded-lg">
          <Image
            src={imageSrc}
            alt={movie.title}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, (max-width: 1280px) 20vw, 16vw"
            className="object-cover transition-all duration-300 group-hover:brightness-75"
            priority={false}
            onError={() => setImageError(true)}
            // If using an external placeholder, avoid Next.js optimization to prevent loader errors
            unoptimized={imageSrc === fallbackImage}
          />

          {/* Watchlist Button - Top Right */}
          <button
            type="button"
            onClick={handleWatchlistToggle}
            className={`absolute top-2 right-2 z-10 p-2 rounded-full transition-all duration-200 ${
              inWatchlist
                ? 'bg-green-600 hover:bg-green-700 text-white'
                : 'bg-black/60 hover:bg-black/80 text-white backdrop-blur-sm'
            } ${isHovered ? 'opacity-100 scale-100' : 'opacity-0 scale-90'}`}
            aria-label={inWatchlist ? `Remove ${movie.title} from watchlist` : `Add ${movie.title} to watchlist`}
            title={inWatchlist ? 'Remove from watchlist' : 'Add to watchlist'}
          >
            {inWatchlist ? <Check size={18} strokeWidth={3} /> : <Plus size={18} strokeWidth={3} />}
          </button>

          {/* Overlay on hover */}
          <div
            className={`absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`}
          >
            <div className="absolute bottom-0 left-0 right-0 p-4">
              <h3 className="text-white font-semibold text-sm md:text-base line-clamp-2">{movie.title}</h3>
              <p className="text-gray-300 text-xs mt-1">
                {movie.year} • {movie.type === 'movie' ? 'Movie' : 'TV Show'}
              </p>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default MovieTvShowCard;
