'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useFormik } from 'formik';
import { createMovieSchema } from '@/utils/validation';
import { createMovie, searchMovies } from '@/services/moviesApi';
import { Film, Calendar, Clock, DollarSign, Image as ImageIcon } from 'lucide-react';

const GENRES = [
  'Action', 'Adventure', 'Animation', 'Comedy', 'Crime', 'Documentary',
  'Drama', 'Family', 'Fantasy', 'History', 'Horror', 'Music',
  'Mystery', 'Romance', 'Science Fiction', 'Thriller', 'War', 'Western'
];

const MPA_RATINGS = ['G', 'PG', 'PG-13', 'R', 'NC-17', 'NR'];

const CreateMovieForm = () => {
  const router = useRouter();
  const { data: session } = useSession();
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const token = (session?.user as any)?.accessToken;

  const formik = useFormik({
    initialValues: {
      title: '',
      original_title: '',
      year: new Date().getFullYear(),
      director: '',
      genres: [] as string[],
      mpa_rating: 'PG-13',
      runtime_in_minutes: 0,
      studio: '',
      budget: 0,
      revenue: 0,
      release_date: '',
      overview: '',
      poster_url: '',
      backdrop_url: ''
    },
    validationSchema: createMovieSchema,
    onSubmit: async (values) => {
      setIsLoading(true);
      setErrorMessage('');
      setSuccessMessage('');

      try {

        const searchResult = await searchMovies(values.title, token);
        if (searchResult.success && searchResult.data?.find(
          m => m.title.toLowerCase() === values.title.toLowerCase()
        )) {
          setErrorMessage('Movie already exists in the database.');
          setIsLoading(false);
          return;
        }

        const response = await createMovie(values, token);

        if (response.success) {
          setSuccessMessage('Movie created successfully!');
          setTimeout(() => {
            router.push('/browse');
          }, 2000);
        } else {
          setErrorMessage(response.message || 'Failed to create movie');
        }
      } catch (err: unknown) {
        console.error(err);
        setErrorMessage('An unexpected error occurred.');
      } finally {
        setIsLoading(false);
      }
    }
  });

  const toggleGenre = (genre: string) => {
    const currentGenres = formik.values.genres;
    if (currentGenres.includes(genre)) {
      formik.setFieldValue('genres', currentGenres.filter(g => g !== genre));
    } else {
      formik.setFieldValue('genres', [...currentGenres, genre]);
    }
  };

  return (
    <div className="min-h-screen bg-[#1B1A1A] text-white px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 py-8 md:py-12">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-2 flex items-center gap-3">
            <Film className="w-8 h-8" />
            Create New Movie
          </h1>
          <p className="text-gray-400">Add a new movie to the database</p>
        </div>

        {/* Messages */}
        {errorMessage && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/50 rounded-lg text-red-400">
            {errorMessage}
          </div>
        )}
        {successMessage && (
          <div className="mb-6 p-4 bg-green-500/10 border border-green-500/50 rounded-lg text-green-400">
            {successMessage}
          </div>
        )}

        {/* Form */}
        <form onSubmit={formik.handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="bg-white/5 rounded-lg p-6 border border-white/10">
            <h2 className="text-xl font-semibold mb-4">Basic Information</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Title */}
              <div className="md:col-span-2">
                <label htmlFor="title" className="block text-sm font-medium mb-2">
                  Title <span className="text-red-400">*</span>
                </label>
                <input
                  id="title"
                  name="title"
                  type="text"
                  placeholder="Enter movie title"
                  value={formik.values.title}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className={`w-full bg-white/10 text-white placeholder:text-gray-400 rounded-lg px-4 py-3 border ${
                    formik.touched.title && formik.errors.title
                      ? 'border-red-500'
                      : 'border-white/20'
                  } focus:outline-none focus:ring-2 focus:ring-white/30`}
                  disabled={isLoading}
                />
                {formik.touched.title && formik.errors.title && (
                  <p className="mt-1 text-sm text-red-400">{formik.errors.title}</p>
                )}
              </div>

              {/* Original Title */}
              <div className="md:col-span-2">
                <label htmlFor="original_title" className="block text-sm font-medium mb-2">
                  Original Title
                </label>
                <input
                  id="original_title"
                  name="original_title"
                  type="text"
                  placeholder="Enter original title (if different)"
                  value={formik.values.original_title}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className="w-full bg-white/10 text-white placeholder:text-gray-400 rounded-lg px-4 py-3 border border-white/20 focus:outline-none focus:ring-2 focus:ring-white/30"
                  disabled={isLoading}
                />
              </div>

              {/* Director */}
              <div>
                <label htmlFor="director" className="block text-sm font-medium mb-2">
                  Director <span className="text-red-400">*</span>
                </label>
                <input
                  id="director"
                  name="director"
                  type="text"
                  placeholder="Enter director name"
                  value={formik.values.director}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className={`w-full bg-white/10 text-white placeholder:text-gray-400 rounded-lg px-4 py-3 border ${
                    formik.touched.director && formik.errors.director
                      ? 'border-red-500'
                      : 'border-white/20'
                  } focus:outline-none focus:ring-2 focus:ring-white/30`}
                  disabled={isLoading}
                />
                {formik.touched.director && formik.errors.director && (
                  <p className="mt-1 text-sm text-red-400">{formik.errors.director}</p>
                )}
              </div>

              {/* Studio */}
              <div>
                <label htmlFor="studio" className="block text-sm font-medium mb-2">
                  Studio
                </label>
                <input
                  id="studio"
                  name="studio"
                  type="text"
                  placeholder="Enter studio name"
                  value={formik.values.studio}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className="w-full bg-white/10 text-white placeholder:text-gray-400 rounded-lg px-4 py-3 border border-white/20 focus:outline-none focus:ring-2 focus:ring-white/30"
                  disabled={isLoading}
                />
              </div>

              {/* Year */}
              <div>
                <label htmlFor="year" className="flex items-center gap-2 text-sm font-medium mb-2">
                  <Calendar className="w-4 h-4" />
                  Year <span className="text-red-400">*</span>
                </label>
                <input
                  id="year"
                  name="year"
                  type="number"
                  placeholder="2024"
                  value={formik.values.year}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className={`w-full bg-white/10 text-white placeholder:text-gray-400 rounded-lg px-4 py-3 border ${
                    formik.touched.year && formik.errors.year
                      ? 'border-red-500'
                      : 'border-white/20'
                  } focus:outline-none focus:ring-2 focus:ring-white/30`}
                  disabled={isLoading}
                />
                {formik.touched.year && formik.errors.year && (
                  <p className="mt-1 text-sm text-red-400">{formik.errors.year}</p>
                )}
              </div>

              {/* Release Date */}
              <div>
                <label htmlFor="release_date" className="block text-sm font-medium mb-2">
                  Release Date <span className="text-red-400">*</span>
                </label>
                <input
                  id="release_date"
                  name="release_date"
                  type="date"
                  value={formik.values.release_date}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className={`w-full bg-white/10 text-white placeholder:text-gray-400 rounded-lg px-4 py-3 border ${
                    formik.touched.release_date && formik.errors.release_date
                      ? 'border-red-500'
                      : 'border-white/20'
                  } focus:outline-none focus:ring-2 focus:ring-white/30`}
                  disabled={isLoading}
                />
                {formik.touched.release_date && formik.errors.release_date && (
                  <p className="mt-1 text-sm text-red-400">{formik.errors.release_date}</p>
                )}
              </div>

              {/* Runtime */}
              <div>
                <label htmlFor="runtime_in_minutes" className="flex items-center gap-2 text-sm font-medium mb-2">
                  <Clock className="w-4 h-4" />
                  Runtime (minutes) <span className="text-red-400">*</span>
                </label>
                <input
                  id="runtime_in_minutes"
                  name="runtime_in_minutes"
                  type="number"
                  placeholder="120"
                  value={formik.values.runtime_in_minutes}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className={`w-full bg-white/10 text-white placeholder:text-gray-400 rounded-lg px-4 py-3 border ${
                    formik.touched.runtime_in_minutes && formik.errors.runtime_in_minutes
                      ? 'border-red-500'
                      : 'border-white/20'
                  } focus:outline-none focus:ring-2 focus:ring-white/30`}
                  disabled={isLoading}
                />
                {formik.touched.runtime_in_minutes && formik.errors.runtime_in_minutes && (
                  <p className="mt-1 text-sm text-red-400">{formik.errors.runtime_in_minutes}</p>
                )}
              </div>

              {/* MPA Rating */}
              <div>
                <label htmlFor="mpa_rating" className="block text-sm font-medium mb-2">
                  MPA Rating <span className="text-red-400">*</span>
                </label>
                <select
                  id="mpa_rating"
                  name="mpa_rating"
                  value={formik.values.mpa_rating}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className={`w-full bg-white/10 text-white rounded-lg px-4 py-3 border ${
                    formik.touched.mpa_rating && formik.errors.mpa_rating
                      ? 'border-red-500'
                      : 'border-white/20'
                  } focus:outline-none focus:ring-2 focus:ring-white/30`}
                  disabled={isLoading}
                >
                  {MPA_RATINGS.map(rating => (
                    <option key={rating} value={rating} className="bg-gray-800">
                      {rating}
                    </option>
                  ))}
                </select>
                {formik.touched.mpa_rating && formik.errors.mpa_rating && (
                  <p className="mt-1 text-sm text-red-400">{formik.errors.mpa_rating}</p>
                )}
              </div>

              {/* Budget */}
              <div>
                <label htmlFor="budget" className="flex items-center gap-2 text-sm font-medium mb-2">
                  <DollarSign className="w-4 h-4" />
                  Budget (USD)
                </label>
                <input
                  id="budget"
                  name="budget"
                  type="number"
                  placeholder="0"
                  value={formik.values.budget}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className="w-full bg-white/10 text-white placeholder:text-gray-400 rounded-lg px-4 py-3 border border-white/20 focus:outline-none focus:ring-2 focus:ring-white/30"
                  disabled={isLoading}
                />
              </div>

              {/* Revenue */}
              <div>
                <label htmlFor="revenue" className="flex items-center gap-2 text-sm font-medium mb-2">
                  <DollarSign className="w-4 h-4" />
                  Revenue (USD)
                </label>
                <input
                  id="revenue"
                  name="revenue"
                  type="number"
                  placeholder="0"
                  value={formik.values.revenue}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className="w-full bg-white/10 text-white placeholder:text-gray-400 rounded-lg px-4 py-3 border border-white/20 focus:outline-none focus:ring-2 focus:ring-white/30"
                  disabled={isLoading}
                />
              </div>
            </div>
          </div>

          {/* Genres */}
          <div className="bg-white/5 rounded-lg p-6 border border-white/10">
            <h2 className="text-xl font-semibold mb-4">
              Genres <span className="text-red-400">*</span>
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {GENRES.map(genre => (
                <button
                  key={genre}
                  type="button"
                  onClick={() => toggleGenre(genre)}
                  className={`px-4 py-2 rounded-lg border transition-all ${
                    formik.values.genres.includes(genre)
                      ? 'bg-blue-600 border-blue-500 text-white'
                      : 'bg-white/5 border-white/20 text-gray-300 hover:bg-white/10'
                  }`}
                  disabled={isLoading}
                >
                  {genre}
                </button>
              ))}
            </div>
            {formik.touched.genres && formik.errors.genres && (
              <p className="mt-2 text-sm text-red-400">{formik.errors.genres}</p>
            )}
          </div>

          {/* Overview */}
          <div className="bg-white/5 rounded-lg p-6 border border-white/10">
            <h2 className="text-xl font-semibold mb-4">
              Overview <span className="text-red-400">*</span>
            </h2>
            <textarea
              id="overview"
              name="overview"
              rows={6}
              placeholder="Enter a detailed description of the movie..."
              value={formik.values.overview}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={`w-full bg-white/10 text-white placeholder:text-gray-400 rounded-lg px-4 py-3 border ${
                formik.touched.overview && formik.errors.overview
                  ? 'border-red-500'
                  : 'border-white/20'
              } focus:outline-none focus:ring-2 focus:ring-white/30 resize-none`}
              disabled={isLoading}
            />
            {formik.touched.overview && formik.errors.overview && (
              <p className="mt-1 text-sm text-red-400">{formik.errors.overview}</p>
            )}
          </div>

          {/* Images */}
          <div className="bg-white/5 rounded-lg p-6 border border-white/10">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <ImageIcon className="w-5 h-5" />
              Images
            </h2>
            <div className="space-y-4">
              {/* Poster URL */}
              <div>
                <label htmlFor="poster_url" className="block text-sm font-medium mb-2">
                  Poster URL
                </label>
                <input
                  id="poster_url"
                  name="poster_url"
                  type="url"
                  placeholder="https://example.com/poster.jpg"
                  value={formik.values.poster_url}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className={`w-full bg-white/10 text-white placeholder:text-gray-400 rounded-lg px-4 py-3 border ${
                    formik.touched.poster_url && formik.errors.poster_url
                      ? 'border-red-500'
                      : 'border-white/20'
                  } focus:outline-none focus:ring-2 focus:ring-white/30`}
                  disabled={isLoading}
                />
                {formik.touched.poster_url && formik.errors.poster_url && (
                  <p className="mt-1 text-sm text-red-400">{formik.errors.poster_url}</p>
                )}
              </div>

              {/* Backdrop URL */}
              <div>
                <label htmlFor="backdrop_url" className="block text-sm font-medium mb-2">
                  Backdrop URL
                </label>
                <input
                  id="backdrop_url"
                  name="backdrop_url"
                  type="url"
                  placeholder="https://example.com/backdrop.jpg"
                  value={formik.values.backdrop_url}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className={`w-full bg-white/10 text-white placeholder:text-gray-400 rounded-lg px-4 py-3 border ${
                    formik.touched.backdrop_url && formik.errors.backdrop_url
                      ? 'border-red-500'
                      : 'border-white/20'
                  } focus:outline-none focus:ring-2 focus:ring-white/30`}
                  disabled={isLoading}
                />
                {formik.touched.backdrop_url && formik.errors.backdrop_url && (
                  <p className="mt-1 text-sm text-red-400">{formik.errors.backdrop_url}</p>
                )}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 justify-end">
            <button
              type="button"
              onClick={() => router.push('/browse')}
              className="px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white font-semibold rounded-lg transition-colors duration-200"
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isLoading}
            >
              {isLoading ? 'Creating...' : 'Create Movie'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateMovieForm;

