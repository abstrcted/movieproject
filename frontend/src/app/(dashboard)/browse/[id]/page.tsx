// frontend/src/app/(dashboard)/browse/[id]/page.tsx

export default async function MovieDetailsPage({ params }: any) {
  const movieId = params?.id as string;

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-3xl sm:text-3xl lg:text-5xl font-bold text-black">
        Movie Details: {movieId}
      </h1>
    </div>
  );
}
