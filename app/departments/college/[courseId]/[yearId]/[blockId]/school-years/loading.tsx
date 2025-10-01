import { Skeleton } from "@/components/ui/skeleton"
import { BookOpen } from "lucide-react"

export default function SchoolYearSelectionLoading() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-white shadow-sm">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <BookOpen className="h-6 w-6 text-purple-600" />
            <span className="text-xl font-bold text-purple-600">Memoria</span>
          </div>
          <div className="hidden md:flex items-center gap-6">
            <Skeleton className="h-4 w-12" />
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-8 w-24" />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 py-10">
        <div className="container">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 mb-8">
            <Skeleton className="h-5 w-5" />
            <span className="text-gray-600">/</span>
            <Skeleton className="h-4 w-16" />
            <span className="text-gray-600">/</span>
            <Skeleton className="h-4 w-12" />
            <span className="text-gray-600">/</span>
            <Skeleton className="h-4 w-16" />
            <span className="text-gray-600">/</span>
            <Skeleton className="h-4 w-14" />
          </div>

          {/* Header Section */}
          <div className="mb-10">
            <div className="flex flex-col md:flex-row md:items-center gap-4 mb-6">
              <Skeleton className="w-16 h-16 rounded-xl flex-shrink-0" />
              <div>
                <Skeleton className="h-8 w-64 mb-2" />
                <Skeleton className="h-4 w-96" />
              </div>
            </div>
          </div>

          {/* School Years Grid Loading */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array(6)
              .fill(0)
              .map((_, i) => (
                <div key={i} className="bg-white rounded-lg shadow-md overflow-hidden">
                  <div className="h-32 bg-gray-200">
                    <Skeleton className="h-full w-full" />
                  </div>
                  <div className="p-4">
                    <div className="flex flex-col gap-2">
                      <div className="flex justify-between items-center">
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-4 w-20" />
                      </div>
                      <div className="flex justify-between items-center">
                        <Skeleton className="h-4 w-16" />
                        <Skeleton className="h-4 w-32" />
                      </div>
                    </div>
                    <div className="mt-4 flex justify-end">
                      <Skeleton className="h-4 w-24" />
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t py-6">
        <div className="container">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center gap-2 mb-4 md:mb-0">
              <BookOpen className="h-5 w-5 text-purple-600" />
              <span className="text-sm font-bold text-purple-600">Memoria</span>
            </div>
            <Skeleton className="h-4 w-64" />
          </div>
        </div>
      </footer>
    </div>
  )
}
