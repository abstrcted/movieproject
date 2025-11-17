'use client';

import { movieTvShowData } from '@/types/data/movieTvShowData';
import Image from 'next/image';
import { notFound, useParams } from 'next/navigation';
import { useState } from 'react';

const TvShowDetailPage = () => {
  const params = useParams();
  const id = params.id as string;
  const [showAllCast, setShowAllCast] = useState(false);

  // Find the TV show by ID
  const tvShow = movieTvShowData.find((item) => item.id === id && item.type === 'tvshow');

  // If TV show not found, show 404
  if (!tvShow) {
    notFound();
  }

  // Determine how many cast members to show
  const displayedCast = showAllCast ? tvShow.cast : tvShow.cast.slice(0, 4);

  return (
    <div className="min-h-screen bg-[#1B1A1A] text-white">
      {/* Background with blurred poster */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#1B1A1A]/80 to-[#1B1A1A]" />
        <Image src={tvShow.image} alt={tvShow.title} fill className="object-cover blur-3xl opacity-20" priority />
      </div>

      {/* Content */}
      <div className="relative z-10 px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 py-8 md:py-12">
        <div className="max-w-7xl mx-auto">
          {/* Top Section: Poster + Info */}
          <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 mb-12">
            {/* Poster */}
            <div className="flex-shrink-0">
              <div className="relative w-full lg:w-[280px] xl:w-[320px] aspect-[2/3] rounded-lg overflow-hidden shadow-2xl">
                <Image
                  src={tvShow.image}
                  alt={tvShow.title}
                  fill
                  className="object-cover"
                  priority
                  sizes="(max-width: 1024px) 100vw, 320px"
                />
              </div>
            </div>

            {/* TV Show Info */}
            <div className="flex-1">
              {/* Title */}
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">{tvShow.title}</h1>

              {/* Meta Info */}
              <div className="text-gray-300 text-base md:text-lg mb-4">
                <p>Created by {tvShow.creator}</p>
                <p>{tvShow.network}</p>
                <p>{tvShow.year}</p>
                <p>{tvShow.seasons}</p>
              </div>

              {/* Genre Tags */}
              <div className="flex flex-wrap gap-2 mb-6">
                {tvShow.genre.map((genre, index) => (
                  <span key={index} className="px-4 py-2 bg-white/10 rounded-full text-sm border border-white/20">
                    {genre}
                  </span>
                ))}
              </div>

              {/* Overview */}
              <div>
                <h2 className="text-2xl font-semibold mb-3">Overview</h2>
                <p className="text-gray-300 leading-relaxed text-base md:text-lg">{tvShow.description}</p>
              </div>
            </div>
          </div>

          {/* Bottom Section: 3 Columns */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
            {/* Casts & Credits */}
            <div>
              <h3 className="text-xl font-semibold mb-4">Casts & Credits</h3>
              <div className="space-y-2">
                {displayedCast.map((member, index) => (
                  <p key={index} className="text-gray-300">
                    {member.actor} - {member.character}
                  </p>
                ))}
                {tvShow.cast.length > 4 && (
                  <button onClick={() => setShowAllCast(!showAllCast)} className="text-blue-400 hover:text-blue-300 transition-colors mt-2">
                    {showAllCast ? 'Show Less' : 'Show All'}
                  </button>
                )}
              </div>
            </div>

            {/* TV Rating */}
            <div>
              <h3 className="text-xl font-semibold mb-4">TV Rating</h3>
              <p className="text-gray-300 text-lg">{tvShow.rating}</p>
            </div>

            {/* Network Info */}
            <div>
              <h3 className="text-xl font-semibold mb-4">Network</h3>
              <p className="text-gray-300 text-lg">{tvShow.network}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TvShowDetailPage;
