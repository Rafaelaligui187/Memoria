export default function Loading() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Header Skeleton */}
      <div className="h-16 bg-white border-b animate-pulse">
        <div className="container px-4 h-full flex items-center justify-between">
          <div className="h-8 w-32 bg-gray-200 rounded"></div>
          <div className="flex gap-4">
            <div className="h-8 w-20 bg-gray-200 rounded"></div>
            <div className="h-8 w-20 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>

      {/* Hero Section Skeleton */}
      <div className="bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 py-24">
        <div className="container px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="h-6 w-40 bg-blue-700/50 rounded-full mx-auto mb-6"></div>
            <div className="h-12 w-96 bg-blue-700/50 rounded mx-auto mb-6"></div>
            <div className="h-6 w-80 bg-blue-700/30 rounded mx-auto"></div>
          </div>
        </div>
      </div>

      {/* Content Skeleton */}
      <div className="flex-1 py-16">
        <div className="container px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="bg-white rounded-xl overflow-hidden shadow-sm animate-pulse">
                <div className="aspect-[4/3] bg-gray-200"></div>
                <div className="p-6">
                  <div className="flex gap-2 mb-3">
                    <div className="h-5 w-16 bg-blue-100 rounded"></div>
                    <div className="h-5 w-20 bg-gray-100 rounded"></div>
                  </div>
                  <div className="h-6 w-full bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 w-24 bg-gray-100 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
