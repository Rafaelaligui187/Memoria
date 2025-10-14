"use client"
import Link from "next/link"
import Image from "next/image"
import { useState, useEffect } from "react"
import { BookOpen, GraduationCap, School, History, ChevronRight, Sparkles } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { useAuth } from "@/contexts/auth-context"

interface ComprehensiveProfile {
  _id: string
  fullName: string
  nickname?: string
  profilePicture?: string
  sayingMotto?: string
  honors?: string
  userType: string
  department: string
  yearLevel: string
  courseProgram: string
  blockSection: string
  schoolYearId: string
  status: string
  officerRole?: string
  
  // Comprehensive profile fields
  age?: number
  gender?: string
  birthday?: string
  address?: string
  email?: string
  phone?: string
  fatherGuardianName?: string
  motherGuardianName?: string
  graduationYear?: string
  dreamJob?: string
  messageToStudents?: string
  socialMediaFacebook?: string
  socialMediaInstagram?: string
  socialMediaTwitter?: string
  socialMediaLinkedin?: string
  achievements?: string[]
  activities?: string[]
  ambition?: string
  hobbies?: string
  bio?: string
  legacy?: string
  contribution?: string
  advice?: string
  work?: string
  company?: string
  location?: string
}

export default function Dashboard() {
  const { isAuthenticated, user, isLoading } = useAuth()
  const [profilePicture, setProfilePicture] = useState<string | null>(null)
  const [profileLoading, setProfileLoading] = useState(true)

  // Fetch user's profile picture
  useEffect(() => {
    const fetchProfilePicture = async () => {
      if (user?.email) {
        try {
          setProfileLoading(true)
          console.log("Fetching profile for email:", user.email)
          
          // Try to get all approved profiles and find by email
          const response = await fetch('/api/yearbook?department=College&status=approved')
          if (response.ok) {
            const result = await response.json()
            console.log("All approved profiles:", result)
            
            if (result.success && result.data && result.data.length > 0) {
              // Find the profile that matches the user's email
              const userProfile = result.data.find((profile: ComprehensiveProfile) => profile.email === user.email)
              console.log("Found user profile:", userProfile)
              
              if (userProfile && userProfile.profilePicture) {
                console.log("Setting profile picture:", userProfile.profilePicture)
                setProfilePicture(userProfile.profilePicture)
              } else {
                console.log("No profile picture found for email:", user.email)
              }
            } else {
              console.log("No approved profiles found")
            }
          } else {
            console.error("Failed to fetch profiles:", response.status)
          }
        } catch (error) {
          console.error("Failed to fetch profile picture:", error)
        } finally {
          setProfileLoading(false)
        }
      } else {
        console.log("No user email available")
        setProfileLoading(false)
      }
    }

    if (user) {
      fetchProfilePicture()
    }
  }, [user])

  if (isLoading) {
    return <div className="container py-10">Loading...</div>
  }

  if (!isAuthenticated) {
    return <div className="container py-10">Please log in to access the dashboard.</div>
  }

  // Determine what to display for the user
  const userId = user?.schoolId || "N/A"
  const displayName = user?.name || userId
  const avatarInitial = displayName.charAt(0).toUpperCase()

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      {/* Hero Welcome Section */}
      <div className="relative">
        <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800">
          <div className="container py-20 px-6">
            <div className="text-center text-white max-w-4xl mx-auto">
              <div className="inline-flex items-center justify-center w-24 h-24 bg-white/20 backdrop-blur-sm rounded-full mb-8 shadow-lg">
                {profilePicture ? (
                  <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center overflow-hidden shadow-inner">
                    <Image
                      src={profilePicture}
                      alt={displayName}
                      width={64}
                      height={64}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-blue-600 font-bold text-2xl shadow-inner">
                    {avatarInitial}
                  </div>
                )}
              </div>
              <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
                Welcome back, <span className="text-blue-200">{displayName}</span>!
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
            <Link href="/school-years-elementary">
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
