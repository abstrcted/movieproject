

export default async function MovieDetailsPage({ params }: { params: { id: string } }) {
    const movieId = params.id;
    return (
        // TODO: Implement movie details page
        <div className="flex flex-col items-center justify-center h-screen">
            <h1 className="text-3xl sm:text-3xl lg:text-5xl font-bold text-black">
                Movie Details: {movieId}
            </h1>
        </div>
    );
};
