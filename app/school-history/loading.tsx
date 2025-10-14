import { Skeleton } from "@/components/ui/skeleton"
import { PublicHeader } from "@/components/public-header"

export default function SchoolHistoryLoading() {
  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-gray-50 to-gray-100">
      <PublicHeader />

      {/* Hero Skeleton */}
      <div className="relative h-[70vh] overflow-hidden bg-gray-200">
        <div className="absolute inset-0 flex flex-col justify-center items-center text-center p-8">
          <div className="max-w-4xl mx-auto">
            <Skeleton className="h-6 w-24 mb-4 mx-auto" />
            <Skeleton className="h-16 w-full max-w-2xl mb-6 mx-auto" />
            <Skeleton className="h-6 w-full max-w-3xl mb-8 mx-auto" />
            <div className="flex justify-center gap-4">
              <Skeleton className="h-10 w-36" />
              <Skeleton className="h-10 w-36" />
            </div>
          </div>
        </div>
      </div>

      <div className="container px-4 mx-auto py-16">
        {/* Historical Significance Skeleton */}
        <div className="mb-24">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <Skeleton className="h-6 w-24 mb-4" />
              <Skeleton className="h-12 w-full max-w-md mb-6" />
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-3/4 mb-8" />

              <div className="grid grid-cols-3 gap-4 mb-8">
                <Skeleton className="h-24 w-full rounded-lg" />
                <Skeleton className="h-24 w-full rounded-lg" />
                <Skeleton className="h-24 w-full rounded-lg" />
              </div>
            </div>

            <Skeleton className="h-[500px] w-full rounded-2xl" />
          </div>
        </div>

        {/* Timeline Skeleton */}
        <div className="mb-24">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <Skeleton className="h-6 w-24 mb-4 mx-auto" />
            <Skeleton className="h-12 w-full max-w-md mb-6 mx-auto" />
            <Skeleton className="h-4 w-full mb-2 mx-auto" />
            <Skeleton className="h-4 w-3/4 mx-auto" />
          </div>

          <div className="relative mb-12">
            <Skeleton className="h-1 w-full mb-8" />
            <div className="flex justify-between">
              {[...Array(9)].map((_, i) => (
                <Skeleton key={i} className="h-5 w-5 rounded-full" />
              ))}
            </div>
          </div>

          <Skeleton className="h-[400px] w-full rounded-2xl" />
        </div>

        {/* Tabs Skeleton */}
        <div className="mb-24">
          <div className="text-center mb-8">
            <Skeleton className="h-10 w-80 rounded-full mx-auto" />
          </div>

          <Skeleton className="h-[400px] w-full rounded-2xl" />
        </div>
      </div>
    </div>
  )
}
