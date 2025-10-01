"use client"
import Link from "next/link"
import Image from "next/image"
import { BookOpen, GraduationCap, School, History, ChevronRight, Sparkles } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { useAuth } from "@/contexts/auth-context"

export default function Dashboard() {
  const { isAuthenticated, user, isLoading } = useAuth()

  if (isLoading) {
    return <div className="container py-10">Loading...</div>
  }

  if (!isAuthenticated) {
    return <div className="container py-10">Please log in to access the dashboard.</div>
  }

  

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      {/* Hero Welcome Section */}
      <div className="relative">
        <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800">
          <div className="container py-20 px-6">
            <div className="text-center text-white max-w-4xl mx-auto">
              <div className="inline-flex items-center justify-center w-24 h-24 bg-white/20 backdrop-blur-sm rounded-full mb-8 shadow-lg">
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-blue-600 font-bold text-2xl shadow-inner">
                 {/* // Example Determine what to display for the user To fetch NAmes or other */}
                  {user?.name?.charAt(0) || user?.initials || "S"}
                </div>
              </div>
              <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
                Welcome back, <span className="text-blue-200">{user?.firstName}</span>!
                {/* //----------------------------------------------------------*/}
              </h1>
              <p className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto leading-relaxed">
                Explore your digital yearbook and relive the memories of Consolatrix College
              </p>
            </div>
          </div>
        </div>
      </div>

      <main className="container max-w-7xl mx-auto py-16 px-6">
        {/* Academic Departments */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Academic Departments</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Explore each department's unique story and achievements
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <Link href="/departments/elementary">
              <Card className="group border-0 shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden bg-white">
                <div className="h-40 bg-gradient-to-r from-sky-400 to-blue-500 relative">
                  <div className="absolute inset-0 bg-black/10"></div>
                  <div className="absolute bottom-6 left-6">
                    <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center shadow-xl">
                      <School className="h-7 w-7 text-sky-600" />
                    </div>
                  </div>
                </div>
                <CardContent className="p-8">
                  <h3 className="text-2xl font-bold mb-3 text-gray-900">Elementary</h3>
                  <p className="text-gray-600 mb-6 text-base">Grades 1-6 • Building foundations</p>
                  <div className="flex items-center text-blue-600 group-hover:translate-x-2 transition-transform font-semibold">
                    <span className="text-base">Explore</span>
                    <ChevronRight className="h-5 w-5 ml-2" />
                  </div>
                </CardContent>
              </Card>
            </Link>

            <Link href="/departments/junior-high">
              <Card className="group border-0 shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden bg-white">
                <div className="h-40 bg-gradient-to-r from-emerald-400 to-green-500 relative">
                  <div className="absolute inset-0 bg-black/10"></div>
                  <div className="absolute bottom-6 left-6">
                    <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center shadow-xl">
                      <School className="h-7 w-7 text-emerald-600" />
                    </div>
                  </div>
                </div>
                <CardContent className="p-8">
                  <h3 className="text-2xl font-bold mb-3 text-gray-900">Junior High</h3>
                  <p className="text-gray-600 mb-6 text-base">Grades 7-10 • Growing minds</p>
                  <div className="flex items-center text-blue-600 group-hover:translate-x-2 transition-transform font-semibold">
                    <span className="text-base">Explore</span>
                    <ChevronRight className="h-5 w-5 ml-2" />
                  </div>
                </CardContent>
              </Card>
            </Link>

            <Link href="/departments/senior-high">
              <Card className="group border-0 shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden bg-white">
                <div className="h-40 bg-gradient-to-r from-amber-400 to-yellow-500 relative">
                  <div className="absolute inset-0 bg-black/10"></div>
                  <div className="absolute bottom-6 left-6">
                    <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center shadow-xl">
                      <GraduationCap className="h-7 w-7 text-amber-600" />
                    </div>
                  </div>
                </div>
                <CardContent className="p-8">
                  <h3 className="text-2xl font-bold mb-3 text-gray-900">Senior High</h3>
                  <p className="text-gray-600 mb-6 text-base">Grades 11-12 • Preparing futures</p>
                  <div className="flex items-center text-blue-600 group-hover:translate-x-2 transition-transform font-semibold">
                    <span className="text-base">Explore</span>
                    <ChevronRight className="h-5 w-5 ml-2" />
                  </div>
                </CardContent>
              </Card>
            </Link>

            <Link href="/departments/college">
              <Card className="group border-0 shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden bg-white">
                <div className="h-40 bg-gradient-to-r from-purple-500 to-indigo-600 relative">
                  <div className="absolute inset-0 bg-black/10"></div>
                  <div className="absolute bottom-6 left-6">
                    <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center shadow-xl">
                      <BookOpen className="h-7 w-7 text-purple-600" />
                    </div>
                  </div>
                </div>
                <CardContent className="p-8">
                  <h3 className="text-2xl font-bold mb-3 text-gray-900">College</h3>
                  <p className="text-gray-600 mb-6 text-base">Undergraduate • Achieving dreams</p>
                  <div className="flex items-center text-blue-600 group-hover:translate-x-2 transition-transform font-semibold">
                    <span className="text-base">Explore</span>
                    <ChevronRight className="h-5 w-5 ml-2" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          </div>
        </div>

        {/* Additional Features */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          <Link href="/school-history">
            <Card className="group border-0 shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden h-full bg-white">
              <div className="relative h-64">
                <Image
                  src="/placeholder.svg?height=256&width=600&text=School+History"
                  alt="School History"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                <div className="absolute bottom-6 left-6 text-white">
                  <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mb-4">
                    <History className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-3xl font-bold mb-2">School History</h3>
                  <p className="text-white/90 text-lg">Our legacy and heritage</p>
                </div>
              </div>
              <CardContent className="p-8">
                <p className="text-gray-600 mb-6 text-lg leading-relaxed">
                  Discover the rich history and traditions of Consolatrix College of Toledo City since its founding.
                </p>
                <div className="flex items-center text-blue-600 group-hover:translate-x-2 transition-transform font-semibold">
                  <span className="text-base">Learn More</span>
                  <ChevronRight className="h-5 w-5 ml-2" />
                </div>
              </CardContent>
            </Card>
          </Link>

          <div className="bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 rounded-2xl p-10 text-white relative overflow-hidden shadow-xl">
            <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -translate-y-20 translate-x-20"></div>
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/10 rounded-full translate-y-16 -translate-x-16"></div>
            <div className="relative z-10">
              <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mb-6">
                <Sparkles className="h-8 w-8" />
              </div>
              <h3 className="text-3xl font-bold mb-4">Welcome to Memoria</h3>
              <p className="text-blue-100 mb-8 text-lg leading-relaxed">
                Your digital yearbook experience at Consolatrix College of Toledo City. Explore, remember, and celebrate
                your journey with us.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
