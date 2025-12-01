'use client';

import { useWatchlist } from '@/contexts/WatchlistContext';
import { ChevronDown, ChevronUp, X, Film, Tv } from 'lucide-react';
import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

const WatchlistPanel = () => {
  const { watchlist, removeFromWatchlist } = useWatchlist();
  const [isExpanded, setIsExpanded] = useState(false);

  // Don't render if watchlist is empty
  if (watchlist.length === 0) {
    return null;
  }

  const togglePanel = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-50 bg-[#1B1A1A] border-t border-white/20 shadow-2xl transition-all duration-300"
      role="region"
      aria-label="Watchlist panel"
    >
      {/* Header - Always Visible */}
      <button
        type="button"
        onClick={togglePanel}
        className="w-full px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 py-4 flex items-center justify-between hover:bg-white/5 transition-colors"
        aria-expanded={isExpanded}
        aria-controls="watchlist-content"
      >
        <div className="flex items-center gap-3">
          <div className="p-2 bg-red-600 rounded-full">
            <Film size={20} className="text-white" />
          </div>
          <div className="text-left">
            <h2 className="text-white font-semibold text-lg">My Watchlist</h2>
            <p className="text-gray-400 text-sm">
              {watchlist.length} {watchlist.length === 1 ? 'item' : 'items'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-gray-400 text-sm hidden sm:inline">
            {isExpanded ? 'Hide' : 'Show'} watchlist
          </span>
          {isExpanded ? (
            <ChevronDown size={24} className="text-white" aria-hidden="true" />
          ) : (
            <ChevronUp size={24} className="text-white" aria-hidden="true" />
          )}
        </div>
      </button>

      {/* Expandable Content */}
      <div
        id="watchlist-content"
        className={`overflow-hidden transition-all duration-300 ${
          isExpanded ? 'max-h-[400px] opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 pb-6 overflow-y-auto max-h-[350px]">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {watchlist.map((item) => (
              <div key={`${item.type}-${item.id}`} className="relative group">
                <Link
                  href={`/browse/${item.type}/${item.id}`}
                  className="block relative aspect-2/3 rounded-lg overflow-hidden bg-gray-800 hover:scale-105 transition-transform duration-200"
                >
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 200px"
                    className="object-cover"
                  />

                  {/* Type Badge */}
                  <div className="absolute top-2 left-2 px-2 py-1 bg-black/70 backdrop-blur-sm rounded text-xs text-white flex items-center gap-1">
                    {item.type === 'movie' ? <Film size={12} /> : <Tv size={12} />}
                    {item.type === 'movie' ? 'Movie' : 'TV'}
                  </div>

                  {/* Title Overlay */}
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-3">
                    <h3 className="text-white text-sm font-semibold line-clamp-2">{item.title}</h3>
                    <p className="text-gray-300 text-xs mt-1">{item.year}</p>
                  </div>
                </Link>

                {/* Remove Button */}
                <button
                  type="button"
                  onClick={() => removeFromWatchlist(item.id)}
                  className="absolute -top-2 -right-2 p-1.5 bg-red-600 hover:bg-red-700 text-white rounded-full shadow-lg transition-all duration-200 opacity-0 group-hover:opacity-100 z-10"
                  aria-label={`Remove ${item.title} from watchlist`}
                  title="Remove from watchlist"
                >
                  <X size={16} strokeWidth={3} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WatchlistPanel;

