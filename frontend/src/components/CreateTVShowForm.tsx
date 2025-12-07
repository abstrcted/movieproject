'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useFormik } from 'formik';
import { createTVShowSchema } from '@/utils/validation';
import { createTVShow } from '@/services/tvShowsApi';
import { Tv, Calendar, Star, Image as ImageIcon } from 'lucide-react';

const GENRES = [
  'Action', 'Adventure', 'Animation', 'Comedy', 'Crime', 'Documentary',
  'Drama', 'Family', 'Fantasy', 'History', 'Horror', 'Music',
  'Mystery', 'Romance', 'Science Fiction', 'Thriller', 'War', 'Western'
];

const STATUSES = ['Returning Series', 'Ended', 'Canceled', 'In Production', 'Planned'];

const CreateTVShowForm = () => {
  const router = useRouter();
  const { data: session } = useSession();
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [creators, setCreators] = useState<string[]>([]);
  const [creatorInput, setCreatorInput] = useState('');

  const token = (session?.user as any)?.accessToken;

  const formik = useFormik({
    initialValues: {
      name: '',
      originalName: '',
      firstAirDate: '',
      lastAirDate: '',
      seasons: 1,
      episodes: 0,
      status: 'Returning Series',
      tMDbRating: 0,
      popularity: 0,
      voteCount: 0,
      overview: '',
      genres: [] as string[],
      networks: '',
      creators: [] as string[],
      posterURL: '',
      backdropURL: ''
    },
    validationSchema: createTVShowSchema,
    onSubmit: async (values) => {
      setIsLoading(true);
      setErrorMessage('');
      setSuccessMessage('');

      try {
        // Normalize payload to match API shape:
        // - networks and studios should be arrays
        // - genres should be array (already is)
        // - creators is maintained separately
        // - include cast as empty array if not provided
        const payload = {
          name: values.name,
          originalName: values.originalName,
          firstAirDate: values.firstAirDate,
          lastAirDate: values.lastAirDate,
          seasons: Number(values.seasons || 0),
          episodes: Number(values.episodes || 0),
          status: values.status,
          genres: Array.isArray(values.genres) ? values.genres : (values.genres ? [values.genres] : []),
          overview: values.overview,
          popularity: Number(values.popularity || 0),
          tMDbRating: Number(values.tMDbRating || 0),
          voteCount: Number(values.voteCount || 0),
          posterURL: values.posterURL || '',
          backdropURL: values.backdropURL || '',
          creators: creators || [],
          networks: values.networks ? [values.networks] : [],
          studios: (values as any).studios || [],
          cast: (values as any).cast || []
        };

        console.log('[CreateTVShowForm] Creating TV show with normalized payload:', payload);
        console.log('[CreateTVShowForm] Token present:', !!token, token ? (`startsWith:${String(token).slice(0,8)}...`) : 'no-token');

        const response = await createTVShow(payload, token);
        console.log('[CreateTVShowForm] createTVShow response:', response);

        if (response && response.success) {
          setSuccessMessage(response.message || 'TV show created successfully!');
          setTimeout(() => {
            router.push('/browse');
          }, 2000);
        } else {
          // Try to show server-provided message; include full response when helpful
          const serverMsg = response?.message || (response && JSON.stringify(response)) || 'Failed to create TV show';
          setErrorMessage(serverMsg);
        }
      } catch (err: unknown) {
        // Provide detailed error info in logs and show a helpful message to the user
        console.error('[CreateTVShowForm] Unexpected error creating TV show:', err);
        // If axios error, show response body if present
        const anyErr: any = err as any;
        if (anyErr?.response) {
          console.error('[CreateTVShowForm] Error response:', anyErr.response);
          setErrorMessage(anyErr.response.data?.message || anyErr.response.data || 'Server returned an error');
        } else {
          setErrorMessage('An unexpected error occurred. See console for details.');
        }
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

  const addCreator = () => {
    if (creatorInput.trim() && !creators.includes(creatorInput.trim())) {
      setCreators([...creators, creatorInput.trim()]);
      setCreatorInput('');
    }
  };

  const removeCreator = (creator: string) => {
    setCreators(creators.filter(c => c !== creator));
  };

  return (
    <div className="min-h-screen bg-[#1B1A1A] text-white px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 py-8 md:py-12">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-2 flex items-center gap-3">
            <Tv className="w-8 h-8" />
            Create New TV Show
          </h1>
          <p className="text-gray-400">Add a new TV show to the database</p>
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

        {/* Validation summary (helps debug why submit may do nothing) */}
        {formik.submitCount > 0 && Object.keys(formik.errors).length > 0 && (
          <div className="mb-6 p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg text-yellow-300">
            <strong className="block mb-2">Validation errors:</strong>
            <ul className="list-disc list-inside text-sm">
              {Object.entries(formik.errors).map(([k, v]) => (
                <li key={k}>{k}: {String(v)}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Form */}
        <form onSubmit={formik.handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="bg-white/5 rounded-lg p-6 border border-white/10">
            <h2 className="text-xl font-semibold mb-4">Basic Information</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Name */}
              <div className="md:col-span-2">
                <label htmlFor="name" className="block text-sm font-medium mb-2">
                  Name <span className="text-red-400">*</span>
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="Enter TV show name"
                  value={formik.values.name}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className={`w-full bg-white/10 text-white placeholder:text-gray-400 rounded-lg px-4 py-3 border ${
                    formik.touched.name && formik.errors.name
                      ? 'border-red-500'
                      : 'border-white/20'
                  } focus:outline-none focus:ring-2 focus:ring-white/30`}
                  disabled={isLoading}
                />
                {formik.touched.name && formik.errors.name && (
                  <p className="mt-1 text-sm text-red-400">{formik.errors.name}</p>
                )}
              </div>

              {/* Original Name */}
              <div className="md:col-span-2">
                <label htmlFor="originalName" className="block text-sm font-medium mb-2">
                  Original Name
                </label>
                <input
                  id="originalName"
                  name="originalName"
                  type="text"
                  placeholder="Enter original name (if different)"
                  value={formik.values.originalName}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className="w-full bg-white/10 text-white placeholder:text-gray-400 rounded-lg px-4 py-3 border border-white/20 focus:outline-none focus:ring-2 focus:ring-white/30"
                  disabled={isLoading}
                />
              </div>

              {/* Network */}
              <div>
                <label htmlFor="networks" className="block text-sm font-medium mb-2">
                  Network
                </label>
                <input
                  id="networks"
                  name="networks"
                  type="text"
                  placeholder="Enter network name"
                  value={formik.values.networks}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className="w-full bg-white/10 text-white placeholder:text-gray-400 rounded-lg px-4 py-3 border border-white/20 focus:outline-none focus:ring-2 focus:ring-white/30"
                  disabled={isLoading}
                />
              </div>

              {/* Status */}
              <div>
                <label htmlFor="status" className="block text-sm font-medium mb-2">
                  Status <span className="text-red-400">*</span>
                </label>
                <select
                  id="status"
                  name="status"
                  value={formik.values.status}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className={`w-full bg-white/10 text-white rounded-lg px-4 py-3 border ${
                    formik.touched.status && formik.errors.status
                      ? 'border-red-500'
                      : 'border-white/20'
                  } focus:outline-none focus:ring-2 focus:ring-white/30`}
                  disabled={isLoading}
                >
                  {STATUSES.map(status => (
                    <option key={status} value={status} className="bg-gray-800">
                      {status}
                    </option>
                  ))}
                </select>
                {formik.touched.status && formik.errors.status && (
                  <p className="mt-1 text-sm text-red-400">{formik.errors.status}</p>
                )}
              </div>

              {/* First Air Date */}
              <div>
                <label htmlFor="firstAirDate" className="flex items-center gap-2 text-sm font-medium mb-2">
                  <Calendar className="w-4 h-4" />
                  First Air Date <span className="text-red-400">*</span>
                </label>
                <input
                  id="firstAirDate"
                  name="firstAirDate"
                  type="date"
                  value={formik.values.firstAirDate}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className={`w-full bg-white/10 text-white placeholder:text-gray-400 rounded-lg px-4 py-3 border ${
                    formik.touched.firstAirDate && formik.errors.firstAirDate
                      ? 'border-red-500'
                      : 'border-white/20'
                  } focus:outline-none focus:ring-2 focus:ring-white/30`}
                  disabled={isLoading}
                />
                {formik.touched.firstAirDate && formik.errors.firstAirDate && (
                  <p className="mt-1 text-sm text-red-400">{formik.errors.firstAirDate}</p>
                )}
              </div>

              {/* Last Air Date */}
              <div>
                <label htmlFor="lastAirDate" className="flex items-center gap-2 text-sm font-medium mb-2">
                  <Calendar className="w-4 h-4" />
                  Last Air Date
                </label>
                <input
                  id="lastAirDate"
                  name="lastAirDate"
                  type="date"
                  value={formik.values.lastAirDate}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className="w-full bg-white/10 text-white placeholder:text-gray-400 rounded-lg px-4 py-3 border border-white/20 focus:outline-none focus:ring-2 focus:ring-white/30"
                  disabled={isLoading}
                />
              </div>

              {/* Seasons */}
              <div>
                <label htmlFor="seasons" className="block text-sm font-medium mb-2">
                  Seasons <span className="text-red-400">*</span>
                </label>
                <input
                  id="seasons"
                  name="seasons"
                  type="number"
                  placeholder="1"
                  value={formik.values.seasons}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className={`w-full bg-white/10 text-white placeholder:text-gray-400 rounded-lg px-4 py-3 border ${
                    formik.touched.seasons && formik.errors.seasons
                      ? 'border-red-500'
                      : 'border-white/20'
                  } focus:outline-none focus:ring-2 focus:ring-white/30`}
                  disabled={isLoading}
                />
                {formik.touched.seasons && formik.errors.seasons && (
                  <p className="mt-1 text-sm text-red-400">{formik.errors.seasons}</p>
                )}
              </div>

              {/* Episodes */}
              <div>
                <label htmlFor="episodes" className="block text-sm font-medium mb-2">
                  Episodes
                </label>
                <input
                  id="episodes"
                  name="episodes"
                  type="number"
                  placeholder="0"
                  value={formik.values.episodes}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className="w-full bg-white/10 text-white placeholder:text-gray-400 rounded-lg px-4 py-3 border border-white/20 focus:outline-none focus:ring-2 focus:ring-white/30"
                  disabled={isLoading}
                />
              </div>

              {/* TMDb Rating */}
              <div>
                <label htmlFor="tMDbRating" className="flex items-center gap-2 text-sm font-medium mb-2">
                  <Star className="w-4 h-4" />
                  TMDb Rating (0-10)
                </label>
                <input
                  id="tMDbRating"
                  name="tMDbRating"
                  type="number"
                  step="0.1"
                  min="0"
                  max="10"
                  placeholder="0.0"
                  value={formik.values.tMDbRating}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className="w-full bg-white/10 text-white placeholder:text-gray-400 rounded-lg px-4 py-3 border border-white/20 focus:outline-none focus:ring-2 focus:ring-white/30"
                  disabled={isLoading}
                />
              </div>
            </div>
          </div>

          {/* Creators */}
          <div className="bg-white/5 rounded-lg p-6 border border-white/10">
            <h2 className="text-xl font-semibold mb-4">Creators</h2>
            <div className="flex gap-2 mb-3">
              <input
                type="text"
                placeholder="Enter creator name"
                value={creatorInput}
                onChange={(e) => setCreatorInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addCreator();
                  }
                }}
                className="flex-1 bg-white/10 text-white placeholder:text-gray-400 rounded-lg px-4 py-3 border border-white/20 focus:outline-none focus:ring-2 focus:ring-white/30"
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={addCreator}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors duration-200"
                disabled={isLoading}
              >
                Add
              </button>
            </div>
            {creators.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {creators.map((creator, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-blue-600/20 border border-blue-500/50 rounded-full text-sm flex items-center gap-2"
                  >
                    {creator}
                    <button
                      type="button"
                      onClick={() => removeCreator(creator)}
                      className="text-red-400 hover:text-red-300"
                      disabled={isLoading}
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            )}
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
              placeholder="Enter a detailed description of the TV show..."
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
                <label htmlFor="posterURL" className="block text-sm font-medium mb-2">
                  Poster URL
                </label>
                <input
                  id="posterURL"
                  name="posterURL"
                  type="url"
                  placeholder="https://example.com/poster.jpg"
                  value={formik.values.posterURL}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className={`w-full bg-white/10 text-white placeholder:text-gray-400 rounded-lg px-4 py-3 border ${
                    formik.touched.posterURL && formik.errors.posterURL
                      ? 'border-red-500'
                      : 'border-white/20'
                  } focus:outline-none focus:ring-2 focus:ring-white/30`}
                  disabled={isLoading}
                />
                {formik.touched.posterURL && formik.errors.posterURL && (
                  <p className="mt-1 text-sm text-red-400">{formik.errors.posterURL}</p>
                )}
              </div>

              {/* Backdrop URL */}
              <div>
                <label htmlFor="backdropURL" className="block text-sm font-medium mb-2">
                  Backdrop URL
                </label>
                <input
                  id="backdropURL"
                  name="backdropURL"
                  type="url"
                  placeholder="https://example.com/backdrop.jpg"
                  value={formik.values.backdropURL}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className={`w-full bg-white/10 text-white placeholder:text-gray-400 rounded-lg px-4 py-3 border ${
                    formik.touched.backdropURL && formik.errors.backdropURL
                      ? 'border-red-500'
                      : 'border-white/20'
                  } focus:outline-none focus:ring-2 focus:ring-white/30`}
                  disabled={isLoading}
                />
                {formik.touched.backdropURL && formik.errors.backdropURL && (
                  <p className="mt-1 text-sm text-red-400">{formik.errors.backdropURL}</p>
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
              onClick={() => {
                console.log('[CreateTVShowForm] Submit clicked. values:', formik.values, 'errors before submit:', formik.errors);
                formik.submitForm();
              }}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isLoading}
            >
              {isLoading ? 'Creating...' : 'Create TV Show'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateTVShowForm;

