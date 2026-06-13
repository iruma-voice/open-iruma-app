export default function Loading() {
  return (
    <main className="p-4 w-full h-screen bg-white">
      <header className="mb-6 mt-2 animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-1/2 mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-2/3"></div>
      </header>

      <div className="flex flex-col gap-4 animate-pulse">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="border border-gray-100 rounded-xl p-4 shadow-sm bg-white">
            <div className="flex gap-2 mb-3">
              <div className="h-5 bg-gray-200 rounded-full w-16"></div>
              <div className="h-5 bg-gray-200 rounded-full w-16"></div>
            </div>
            <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-6 bg-gray-200 rounded w-1/2"></div>
            <div className="h-3 bg-gray-200 rounded w-1/4 mt-4"></div>
          </div>
        ))}
      </div>
    </main>
  );
}
