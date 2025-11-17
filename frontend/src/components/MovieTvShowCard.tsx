'use client';
import { MovieTvShow } from '@/types/data/movieTvShowData';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

const MovieTvShowCard = ({ movie }: { movie: MovieTvShow }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Link
      href={`/browse/${movie.type}/${movie.id}`}
      className="w-full group cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Card Container with aspect ratio */}
      <div className="relative w-full aspect-2/3 overflow-hidden bg-gray-800 shadow-lg transition-all duration-300 group-hover:scale-105 group-hover:shadow-2xl">
        <Image
          src={movie.image}
          alt={movie.title}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, (max-width: 1280px) 20vw, 16vw"
          className="object-cover transition-all duration-300 group-hover:brightness-75"
          priority={false}
        />

        {/* Overlay on hover */}
        <div
          className={`absolute inset-0 bg-linear-to-t from-black/80 via-black/40 to-transparent transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`}
        >
          <div className="absolute bottom-0 left-0 right-0 p-4">
            <h3 className="text-white font-semibold text-sm md:text-base line-clamp-2">{movie.title}</h3>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default MovieTvShowCard;
