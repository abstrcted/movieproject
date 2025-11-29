import { Movie } from '@/services/moviesApi';
import { TVShow } from '@/services/tvShowsApi';

export type CastMember = {
  actor: string;
  character: string;
};

export type MovieTvShow = {
  id: string;
  type: 'movie' | 'tvshow';
  title: string;
  image: string;
  description: string;
  director?: string;
  creator?: string;
  releaseDate: string;
  year: string;
  genre: string[];
  rating: string;
  duration?: string;
  seasons?: string;
  studio?: string;
  network?: string;
  boxOffice?: string;
  cast: CastMember[];
};

// Utility functions to normalize API responses to MovieTvShow format

export const normalizeMovie = (movie: Movie): MovieTvShow => {
  const movieId = movie.movie_id || movie.id;
  const releaseDate = movie.releaseDate || movie.release_date || '';
  const runtime = movie.runtime_in_minutes || movie.runtime;
  const mpaRating = movie.mpa_rating || movie.rating || '';
  const description = movie.overview || movie.description || '';
  const genres = movie.genres || movie.genre || [];

  // Handle poster URL - API returns path like "/7WfAuzUtztPJ9rDEzmjx0I4NIDw.jpg"
  let imageUrl = 'https://placehold.co/500x750/1a1a1a/808080.png?text=No+Poster';

  const posterPath = movie.poster_url || movie.posterUrl;
  const backdropPath = movie.backdrop_url || movie.backdropUrl;

  if (posterPath && posterPath.startsWith('/')) {
    // Prepend TMDB base URL
    imageUrl = `https://image.tmdb.org/t/p/w500${posterPath}`;
  } else if (backdropPath && backdropPath.startsWith('/')) {
    imageUrl = `https://image.tmdb.org/t/p/w500${backdropPath}`;
  } else if (posterPath) {
    // Already a full URL
    imageUrl = posterPath;
  }

  return {
    id: String(movieId),
    type: 'movie',
    title: movie.title || '',
    image: imageUrl,
    description: description,
    director: movie.director,
    releaseDate: releaseDate,
    year: movie.year ? String(movie.year) : '',
    genre: Array.isArray(genres) ? genres : [],
    rating: mpaRating,
    duration: runtime ? `${runtime} minutes` : undefined,
    studio: movie.studio,
    boxOffice: movie.boxOffice,
    cast:
      movie.cast?.map((c) => ({
        actor: c.name,
        character: c.character
      })) || []
  };
};

export const normalizeTVShow = (show: TVShow): MovieTvShow => {
  return {
    id: String(show.iD || show.id),
    type: 'tvshow',
    title: show.name || show.title || '',
    image:
      show.posterURL ||
      show.posterUrl ||
      show.backdropURL ||
      show.backdropUrl ||
      'https://placehold.co/500x750/1a1a1a/808080.png?text=No+Poster',
    description: show.overview || show.description || '',
    creator: Array.isArray(show.creators) ? show.creators.join(', ') : show.creator,
    releaseDate: show.firstAirDate || show.releaseDate || '',
    year: show.firstAirDate ? new Date(show.firstAirDate).getFullYear().toString() : show.year || '',
    genre: Array.isArray(show.genres) ? show.genres : show.genre || [],
    rating: show.rating || (show.tMDbRating ? `${show.tMDbRating}/10` : ''),
    seasons: show.seasons ? `${show.seasons} season${Number(show.seasons) > 1 ? 's' : ''}` : undefined,
    network: show.networks || show.network,
    cast:
      show.cast?.map((c) => ({
        actor: c.name,
        character: c.character
      })) || []
  };
};

export const movieTvShowData: MovieTvShow[] = [
  {
    id: 'movie-1',
    type: 'movie',
    title: 'Dune',
    image: '/images/dune-2022.png',
    description:
      "Paul Atreides, a brilliant and gifted young man born into a great destiny beyond his understanding, must travel to a dangerous planet in the universe to ensure the future of his family and his people. As malevolent forces explode into conflict over the planet's exclusive supply of a precious resource in existence, only those who can conquer their own fear will survive.",
    director: 'Denis Villeneuve',
    releaseDate: 'October 22, 2021',
    year: '2021',
    genre: ['Sci-fi', 'Action', 'Whatever else'],
    rating: 'PG-13',
    duration: '155 minutes',
    studio: 'Legendary Studios',
    boxOffice: '1 Morbillion dollars',
    cast: [
      { actor: 'Timothée Chalamet', character: 'Paul Atreides' },
      { actor: 'Rebecca Ferguson', character: 'Lady Jessica' },
      { actor: 'Oscar Isaac', character: 'Duke Leto Atreides' },
      { actor: 'Zendaya', character: 'Chani' },
      { actor: 'Jason Momoa', character: 'Duncan Idaho' },
      { actor: 'Stellan Skarsgård', character: 'Baron Vladimir Harkonnen' },
      { actor: 'Josh Brolin', character: 'Gurney Halleck' },
      { actor: 'Javier Bardem', character: 'Stilgar' }
    ]
  },
  {
    id: 'movie-2',
    type: 'movie',
    title: 'Dune: Part Two',
    image: '/images/dune-2024.png',
    description:
      'Paul Atreides unites with Chani and the Fremen while seeking revenge against the conspirators who destroyed his family. Facing a choice between the love of his life and the fate of the universe, he must prevent a terrible future only he can foresee.',
    director: 'Denis Villeneuve',
    releaseDate: 'March 1, 2024',
    year: '2024',
    genre: ['Sci-fi', 'Action', 'Adventure'],
    rating: 'PG-13',
    duration: '166 minutes',
    studio: 'Legendary Studios',
    boxOffice: '711.8 million dollars',
    cast: [
      { actor: 'Timothée Chalamet', character: 'Paul Atreides' },
      { actor: 'Zendaya', character: 'Chani' },
      { actor: 'Rebecca Ferguson', character: 'Lady Jessica' },
      { actor: 'Javier Bardem', character: 'Stilgar' },
      { actor: 'Austin Butler', character: 'Feyd-Rautha Harkonnen' },
      { actor: 'Florence Pugh', character: 'Princess Irulan' },
      { actor: 'Josh Brolin', character: 'Gurney Halleck' },
      { actor: 'Stellan Skarsgård', character: 'Baron Vladimir Harkonnen' }
    ]
  },
  {
    id: 'movie-3',
    type: 'movie',
    title: 'Now You See Me',
    image: '/images/now-you-see-me.png',
    description: 'The Four Horsemen and a new generation of illusionists try to bring down a worldwide criminal network.',
    director: 'Ruben Fleischer',
    releaseDate: 'November 14, 2025',
    year: '2025',
    genre: ['Action', 'Thriller', 'Mystery'],
    rating: 'PG-13',
    duration: '112 minutes',
    studio: 'Summit Entertainment',
    boxOffice: '351.7 million dollars',
    cast: [
      { actor: 'Jesse Eisenberg', character: 'J. Daniel Atlas' },
      { actor: 'Mark Ruffalo', character: 'Dylan Rhodes' },
      { actor: 'Woody Harrelson', character: 'Merritt McKinney' },
      { actor: 'Dave Franco', character: 'Jack Wilder' }
    ]
  },
  {
    id: 'tvshow-4',
    type: 'tvshow',
    title: 'Arcane',
    image: '/images/arcane.jpg',
    description:
      'Set in the utopian region of Piltover and the oppressed underground of Zaun, the story follows the origins of two iconic League of Legends champions and the power that will tear them apart.',
    creator: 'Christian Linke, Alex Yee',
    releaseDate: 'November 6, 2021',
    year: '2021',
    genre: ['Animation', 'Action', 'Fantasy'],
    rating: 'TV-14',
    seasons: '2 seasons',
    network: 'Netflix',
    cast: [
      { actor: 'Hailee Steinfeld', character: 'Vi' },
      { actor: 'Ella Purnell', character: 'Jinx' },
      { actor: 'Kevin Alejandro', character: 'Jayce' },
      { actor: 'Katie Leung', character: 'Caitlyn' }
    ]
  },
  {
    id: 'tvshow-5',
    type: 'tvshow',
    title: "Frieren: Beyond Journey's End",
    image: '/images/frieren.webp',
    description:
      'After a 10-year quest to defeat the Demon King, elf mage Frieren and her companions return victorious. But their reunion is bittersweet as Frieren confronts her near-immortality and begins a new journey to understand humanity and the meaning of life.',
    creator: 'Keiichiro Saito',
    releaseDate: 'September 29, 2023',
    year: '2023',
    genre: ['Animation', 'Fantasy', 'Adventure'],
    rating: 'TV-14',
    seasons: '1 season',
    network: 'Crunchyroll',
    cast: [
      { actor: 'Atsumi Tanezaki', character: 'Frieren' },
      { actor: 'Kana Ichinose', character: 'Fern' },
      { actor: 'Chiaki Kobayashi', character: 'Stark' },
      { actor: 'Nobuhiko Okamoto', character: 'Himmel' }
    ]
  }
];
