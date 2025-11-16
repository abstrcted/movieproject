// src/app/(dashboard)/browse/[id]/page.tsx

type MovieDetailsPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function MovieDetailsPage({ params }: MovieDetailsPageProps) {
  const { id } = await params;

  return (
    <section className="min-h-screen bg-[#1B1A1A] text-white px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 py-8 md:py-12">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold mb-6">
          Movie Details: {id}
        </h1>
        <p className="text-gray-300">
          This is a placeholder details page for the movie or TV show with ID: <span className="font-mono">{id}</span>
        </p>
      </div>
    </section>
  );
}
