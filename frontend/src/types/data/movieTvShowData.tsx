export type MovieTvShow = {
    id: string;
    title: string;
    image: string;
    description: string;
    director: string;
    releaseDate: string;
    genre: string[];
    rating: string;
    duration: string;
};

export const movieTvShowData: MovieTvShow[] = [
    {
        id: "movie-1",
        title: 'Dune',
        image: '/images/dune-2022.png',
        description: 'Dune is a 2021 American epic science fiction film directed by Denis Villeneuve and written by Villeneuve and Jon Spaihts, based on the 1965 novel of the same name by Frank Herbert. The film stars Timothée Chalamet, Rebecca Ferguson, Oscar Isaac, Josh Brolin, Stellan Skarsgård, Dave Bautista, Zendaya, and Javier Bardem.',
        director: 'Denis Villeneuve',   
        releaseDate: 'October 22, 2021',
        genre: ['Science Fiction', 'Adventure'],
        rating: 'PG-13',
        duration: '155 minutes',
    },
    {
        id: "movie-2",
        title: 'Dune: Part Two',
        image: '/images/dune-2024.png',
        description: 'Dune is a 2021 American epic science fiction film directed by Denis Villeneuve and written by Villeneuve and Jon Spaihts, based on the 1965 novel of the same name by Frank Herbert. The film stars Timothée Chalamet, Rebecca Ferguson, Oscar Isaac, Josh Brolin, Stellan Skarsgård, Dave Bautista, Zendaya, and Javier Bardem.',
        director: 'Denis Villeneuve',
        releaseDate: 'March 1, 2024',
        genre: ['Science Fiction', 'Adventure'],
        rating: 'PG-13',
        duration: '155 minutes',
    },
    {
        id: "movie-3",
        title: 'Now You See Me',
        image: '/images/now-you-see-me.png',
        description: 'The Four Horsemen and a new generation of illusionists try to bring down a worldwide criminal network.',
        director: 'Ruben Fleischer',
        releaseDate: 'Novermber 14, 2025',
        genre: ['Science Fiction', 'Adventure'],
        rating: 'PG-13',
        duration: '112 minutes',
    },
];
