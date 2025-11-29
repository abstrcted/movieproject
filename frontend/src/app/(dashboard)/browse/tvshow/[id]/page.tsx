'use client';

import { MovieTvShow, normalizeTVShow } from '@/types/data/movieTvShowData';
import Image from 'next/image';
import { notFound, useParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { getTVShowById } from '@/services/tvShowsApi';

const TvShowDetailPage = () => {
  const params = useParams();
  const id = params.id as string;
  const [showAllCast, setShowAllCast] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [tvShow, setTvShow] = useState<MovieTvShow | null>(null);
  const [loading, setLoading] = useState(true);
  const { data: session } = useSession();

  const token = (session?.user as any)?.accessToken;

  useEffect(() => {
    const fetchTVShow = async () => {
      setLoading(true);
      try {
        const tvShowData = await getTVShowById(id, token);
        if (tvShowData) {
          setTvShow(normalizeTVShow(tvShowData));
        } else {
          setTvShow(null);
        }
      } catch (error) {
        console.error('Error fetching TV show:', error);
        setTvShow(null);
      } finally {
        setLoading(false);
      }
    };

    fetchTVShow();
  }, [id, token]);

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-[#1B1A1A] flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

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

              {/* Delete Button - Design Only (Non-functional) */}
              <div className="mt-8">
                <button
                  onClick={() => setShowDeleteModal(true)}
                  className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-colors duration-200 flex items-center gap-2"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path
                      fillRule="evenodd"
                      d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Delete TV Show
                </button>
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

      {/* Delete Confirmation Modal - Design Only (Non-functional) */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-[#2A2929] rounded-lg shadow-2xl max-w-md w-full p-6 border border-red-500/30">
            {/* Modal Header */}
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-red-600/20 rounded-full">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-red-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white">Delete TV Show</h3>
            </div>

            {/* Modal Content */}
            <p className="text-gray-300 mb-6">
              Are you sure you want to delete <span className="font-semibold text-white">&quot;{tvShow.title}&quot;</span>? This action
              cannot be undone.
            </p>

            {/* Modal Actions */}
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-5 py-2.5 bg-gray-600 hover:bg-gray-700 text-white font-medium rounded-lg transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  // Design only - no actual delete functionality
                  alert('This is a design-only feature. Delete functionality is not implemented.');
                  setShowDeleteModal(false);
                }}
                className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors duration-200 flex items-center gap-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path
                    fillRule="evenodd"
                    d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TvShowDetailPage;
