"use client"

import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent } from "@/components/ui/card"

export default function SeniorHighSectionLoading() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-amber-50 via-white to-yellow-50">
      {/* Top banner skeleton */}
      <div className="w-full h-40 bg-amber-100/60 animate-pulse" />

      <main className="flex-1 py-10">
        <div className="container">
          {/* Breadcrumb skeleton */}
          <Skeleton className="h-5 w-80 mb-8" />

          {/* Title skeleton */}
          <Skeleton className="h-10 w-96 mb-10" />

          {/* Officers grid skeleton */}
          <Skeleton className="h-6 w-48 mb-6" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {Array.from({ length: 4 }).map((_, i) => (
              <Card key={`officer-${i}`} className="overflow-hidden">
                <Skeleton className="aspect-[3/4] w-full" />
                <CardContent className="p-4 space-y-2">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-3 w-full" />
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Students grid skeleton */}
          <Skeleton className="h-6 w-56 mb-6" />
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {Array.from({ length: 20 }).map((_, i) => (
              <Card key={`student-${i}`} className="overflow-hidden">
                <Skeleton className="aspect-[3/4] w-full" />
                <CardContent className="p-3 space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-3 w-3/4" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}
