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
    title: 'Breaking Bad',
    image: '/images/breaking-bad.png',
    description:
      "A high school chemistry teacher diagnosed with inoperable lung cancer turns to manufacturing and selling methamphetamine in order to secure his family's future.",
    creator: 'Vince Gilligan',
    releaseDate: 'January 20, 2008',
    year: '2008',
    genre: ['Crime', 'Drama', 'Thriller'],
    rating: 'TV-MA',
    seasons: '5 seasons',
    network: 'AMC',
    cast: [
      { actor: 'Bryan Cranston', character: 'Walter White' },
      { actor: 'Aaron Paul', character: 'Jesse Pinkman' },
      { actor: 'Anna Gunn', character: 'Skyler White' },
      { actor: 'Dean Norris', character: 'Hank Schrader' }
    ]
  },
  {
    id: 'tvshow-5',
    type: 'tvshow',
    title: 'Stranger Things',
    image: '/images/stranger-things.png',
    description:
      'When a young boy disappears, his mother, a police chief and his friends must confront terrifying supernatural forces in order to get him back.',
    creator: 'The Duffer Brothers',
    releaseDate: 'July 15, 2016',
    year: '2016',
    genre: ['Sci-fi', 'Horror', 'Drama'],
    rating: 'TV-14',
    seasons: '4 seasons',
    network: 'Netflix',
    cast: [
      { actor: 'Millie Bobby Brown', character: 'Eleven' },
      { actor: 'Finn Wolfhard', character: 'Mike Wheeler' },
      { actor: 'Winona Ryder', character: 'Joyce Byers' },
      { actor: 'David Harbour', character: 'Jim Hopper' }
    ]
  }
];
