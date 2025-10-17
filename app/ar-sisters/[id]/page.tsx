"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import {
  ArrowLeft,
  Mail,
  Phone,
  MapPin,
  GraduationCap,
  Award,
  BookOpen,
  Calendar,
  Building,
  User,
  Trophy,
  Clock,
  Star,
  Heart,
  Quote,
  Share2,
  Cake,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Header } from "@/components/header"
import { isAuthenticated } from "@/lib/auth"

const getDepartmentColor = (department: string) => {
  const colors = {
    "AR Sisters": "from-purple-600 to-purple-800",
    Administration: "from-red-600 to-red-800",
    College: "from-blue-600 to-blue-800",
    "Senior High": "from-green-600 to-green-800",
    "Junior High": "from-purple-600 to-purple-800",
    Elementary: "from-orange-600 to-orange-800",
    "Basic Education": "from-indigo-600 to-indigo-800",
  }
  return colors[department as keyof typeof colors] || "from-gray-600 to-gray-800"
}

export default function ARSistersProfilePage() {
  const params = useParams()
  const profileId = params.id as string
  
  const [authenticated, setAuthenticated] = useState(false)
  const [profile, setProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState("about")

  useEffect(() => {
    setAuthenticated(isAuthenticated())
    if (profileId) {
      fetchProfile()
    }
  }, [profileId])

  const fetchProfile = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await fetch(`/api/yearbook/profile/${profileId}`, {
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache',
        },
      })
      
      const result = await response.json()

      if (result.success && result.data) {
        setProfile(result.data)
        console.log('[AR Sisters Profile] Loaded profile:', result.data)
      } else {
        console.error('[AR Sisters Profile] Failed to fetch profile:', result.error)
        setError(result.error || 'Failed to load profile')
      }
    } catch (error) {
      console.error('[AR Sisters Profile] Error fetching profile:', error)
      setError('Failed to load profile')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
            <p className="text-gray-600 text-lg">Loading AR Sister profile...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error || !profile) {
    return (
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="bg-gradient-to-br from-gray-100 to-gray-200 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-8">
              <User className="h-10 w-10 text-gray-400" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Profile Not Found</h3>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              {error || "The AR Sister profile you're looking for doesn't exist or has been removed."}
            </p>
            <Link href="/faculty">
              <Button className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Faculty & Staff
              </Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20">
      <Header />

      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-900 text-white overflow-hidden">
        <div className="absolute inset-0 bg-[url('/api/placeholder/1920/1080')] bg-cover bg-center opacity-10" />
        <div className="absolute inset-0 bg-gradient-to-r from-purple-900/90 via-indigo-900/80 to-blue-900/90" />

        <div className="container relative py-20 px-4">
          <div className="max-w-6xl mx-auto">
            {/* Back Button */}
            <div className="mb-8">
              <Link href="/faculty">
                <Button variant="outline" className="bg-white/20 border-white/30 text-white hover:bg-white/30 backdrop-blur-sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Faculty Directory
                </Button>
              </Link>
            </div>

            {/* Profile Header */}
            <div className="flex flex-col lg:flex-row items-center lg:items-start gap-8">
              {/* Profile Image */}
              <div className="relative">
                <div className="w-48 h-48 rounded-2xl overflow-hidden border-4 border-white/30 shadow-2xl">
                  <Image
                    src={profile.image || profile.profilePicture || "/placeholder.svg"}
                    alt={profile.fullName || profile.name}
                    width={300}
                    height={300}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute -bottom-4 -right-4">
                  <Badge className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white border-0 px-4 py-2 text-sm font-bold shadow-lg">
                    {profile.yearsOfService ? `${profile.yearsOfService} years` : 'AR Sister'}
                  </Badge>
                </div>
              </div>

              {/* Profile Info */}
              <div className="flex-1 text-center lg:text-left">
                <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-4 py-2 rounded-full mb-4 border border-white/20">
                  <Star className="h-4 w-4" />
                  <span className="text-sm font-semibold tracking-wide">AR Sisters Leadership</span>
                </div>

                <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-white via-purple-100 to-indigo-200 bg-clip-text text-transparent">
                  {profile.fullName || profile.name}
                </h1>

                <p className="text-xl md:text-2xl text-purple-100 mb-6 font-semibold">
                  {profile.position}
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-white/90">
                  <div className="flex items-center gap-3 bg-white/10 px-4 py-3 rounded-xl backdrop-blur-sm">
                    <Building className="h-5 w-5" />
                    <span>{profile.department || "AR Sisters"}</span>
                  </div>
                  <div className="flex items-center gap-3 bg-white/10 px-4 py-3 rounded-xl backdrop-blur-sm">
                    <Calendar className="h-5 w-5" />
                    <span>School Year {profile.schoolYear || "2025-2026"}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <main className="flex-1 py-16">
        <div className="container max-w-7xl">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-12 bg-white shadow-lg rounded-2xl p-2 h-16">
              <TabsTrigger
                value="about"
                className="flex items-center gap-3 text-lg py-4 rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-violet-600 data-[state=active]:text-white"
              >
                <User className="h-5 w-5" />
                About AR Sister
              </TabsTrigger>
              <TabsTrigger
                value="message"
                className="flex items-center gap-3 text-lg py-4 rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-indigo-600 data-[state=active]:text-white"
              >
                <Heart className="h-5 w-5" />
                Message to Students
              </TabsTrigger>
            </TabsList>

            <TabsContent value="message" className="space-y-12">
              <div className="max-w-5xl mx-auto">
                <Card className="border-0 shadow-2xl bg-gradient-to-br from-blue-50 via-white to-indigo-50 overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500"></div>
                  <CardContent className="p-16">
                    <div className="text-center mb-12">
                      <div className="relative inline-block">
                        <Quote className="h-16 w-16 text-blue-600 mx-auto mb-6 opacity-60" />
                        <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-full opacity-20"></div>
                      </div>
                      <h2 className="text-4xl font-bold text-gray-900 mb-4">
                        A Personal Message from {(profile.fullName || profile.name).split(" ")[1] || (profile.fullName || profile.name).split(" ")[0]}
                      </h2>
                      <div className="w-32 h-1.5 bg-gradient-to-r from-blue-500 to-indigo-600 mx-auto rounded-full"></div>
                    </div>

                    <div className="relative">
                      <div className="absolute -top-8 -left-8 text-8xl text-blue-200 font-serif opacity-50">"</div>
                      <div className="prose prose-xl prose-blue max-w-none text-center relative z-10">
                        <blockquote className="text-2xl leading-relaxed text-gray-700 font-medium italic border-none p-8 bg-white/60 rounded-3xl backdrop-blur-sm">
                          {profile.messageToStudents || "No message available"}
                        </blockquote>
                      </div>
                      <div className="absolute -bottom-8 -right-8 text-8xl text-blue-200 font-serif opacity-50">"</div>
                    </div>

                    <div className="text-center mt-12 pt-8 border-t border-gray-200">
                      <div className="flex items-center justify-center gap-4">
                        <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-blue-200">
                          <Image
                            src={profile.image || profile.profilePicture || "/placeholder.svg"}
                            alt={profile.fullName || profile.name}
                            width={48}
                            height={48}
                            className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                          />
                        </div>
                        <div className="text-left">
                          <p className="text-gray-900 font-bold text-lg">{profile.fullName || profile.name}</p>
                          <p className="text-gray-600">{profile.position}</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="about" className="space-y-8">
              <div className="grid lg:grid-cols-3 gap-8">
                <div className="space-y-6">
                  <Card className="bg-gradient-to-br from-purple-50 to-violet-50 border-purple-200 shadow-lg">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <User className="h-5 w-5 text-purple-600" />
                        Personal Information
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <span className="font-medium">Full Name:</span>
                        <p className="text-gray-700">{profile.fullName || profile.name || "Not specified"}</p>
                      </div>
                      <div>
                        <span className="font-medium">Nickname:</span>
                        <p className="text-gray-700">{profile.nickname || "Not specified"}</p>
                      </div>
                      <div>
                        <span className="font-medium">Age:</span>
                        <p className="text-gray-700">{profile.age || "Not specified"}</p>
                      </div>
                      <div>
                        <div className="flex items-center mb-2">
                          <Cake className="h-4 w-4 mr-2 text-gray-500" />
                          <span className="font-medium">Birthday:</span>
                        </div>
                        <p className="text-gray-700">
                          {profile.birthday ? new Date(profile.birthday).toLocaleDateString() : "Not specified"}
                        </p>
                      </div>
                      <div>
                        <div className="flex items-center mb-2">
                          <MapPin className="h-4 w-4 mr-2 text-gray-500" />
                          <span className="font-medium">Address:</span>
                        </div>
                        <p className="text-gray-700">{profile.address || "Not specified"}</p>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200 shadow-lg">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Mail className="h-5 w-5 text-green-600" />
                        Contact Information
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center gap-3 p-3 bg-white rounded-lg">
                        <Mail className="h-4 w-4 text-gray-500" />
                        <span className="text-gray-700">{profile.email || "Not specified"}</span>
                      </div>
                      <div className="flex items-center gap-3 p-3 bg-white rounded-lg">
                        <Phone className="h-4 w-4 text-gray-500" />
                        <span className="text-gray-700">{profile.phone || "Not specified"}</span>
                      </div>
                      <div className="flex items-center gap-3 p-3 bg-white rounded-lg">
                        <MapPin className="h-4 w-4 text-gray-500" />
                        <span className="text-gray-700">{profile.office || "Consolatrix College"}</span>
                      </div>
                      <div className="flex items-center gap-3 p-3 bg-white rounded-lg">
                        <Building className="h-4 w-4 text-gray-500" />
                        <span className="text-gray-700">{profile.department || "AR Sisters"} Department</span>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-gradient-to-br from-purple-50 to-violet-50 border-purple-200 shadow-lg">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Share2 className="h-5 w-5 text-purple-600" />
                        Social Media
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex items-center gap-3 p-3 bg-white rounded-lg">
                        <span className="text-sm text-gray-500">Facebook:</span>
                        <span className="text-blue-600">{profile.socialMediaFacebook || "Not specified"}</span>
                      </div>
                      <div className="flex items-center gap-3 p-3 bg-white rounded-lg">
                        <span className="text-sm text-gray-500">Instagram:</span>
                        <span className="text-pink-600">{profile.socialMediaInstagram || "Not specified"}</span>
                      </div>
                      <div className="flex items-center gap-3 p-3 bg-white rounded-lg">
                        <span className="text-sm text-gray-500">Twitter/X:</span>
                        <span className="text-gray-700">{profile.socialMediaTwitter || "Not specified"}</span>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-200 shadow-lg">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Clock className="h-5 w-5 text-yellow-600" />
                        Professional Service
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="text-center p-6 bg-gradient-to-br from-yellow-100 to-orange-100 rounded-xl">
                        <div className="text-4xl font-bold text-yellow-800 mb-2">{profile.yearsOfService || "0"}</div>
                        <div className="text-yellow-700 font-medium">Years of Dedicated Service</div>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-white rounded-lg">
                        <span className="text-gray-600">Position</span>
                        <span className="text-gray-900 font-medium">{profile.position}</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-white rounded-lg">
                        <span className="text-gray-600">Department</span>
                        <span className="text-gray-900 font-medium">{profile.department || "AR Sisters"}</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-white rounded-lg">
                        <span className="text-gray-600">Current School Year</span>
                        <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                          {profile.schoolYear || "2025-2026"}
                        </Badge>
                      </div>
                      {profile.additionalRoles && (
                        <div className="flex justify-between items-center p-3 bg-white rounded-lg">
                          <span className="text-gray-600">Additional Roles</span>
                          <span className="text-gray-900 font-medium">{profile.additionalRoles}</span>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>

                <div className="lg:col-span-2 space-y-6">
                  <Card className="shadow-lg">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Quote className="h-5 w-5 text-indigo-600" />
                        Teaching Philosophy / Motto
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="p-6 bg-gradient-to-br from-indigo-50 to-blue-50 rounded-xl border border-indigo-200">
                        <p className="text-lg italic text-center text-gray-700 font-medium">
                          "{profile.sayingMotto || "Not specified"}"
                        </p>
                      </div>
                    </CardContent>
                  </Card>

                  {/* About Profile Section */}
                  <Card className="shadow-lg">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <User className="h-5 w-5 text-blue-600" />
                        About AR Sister
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="p-6 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl border border-blue-200">
                        {profile.bio ? (
                          <div className="space-y-4">
                            <p className="text-gray-700 leading-relaxed text-lg">
                              {profile.bio}
                            </p>
                          </div>
                        ) : (
                          <div className="text-center py-8">
                            <User className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                            <p className="text-gray-500 italic text-lg">
                              {profile.fullName || profile.name} hasn't shared their profile information yet.
                            </p>
                            <p className="text-gray-400 text-sm mt-2">
                              Check back later for more details about this AR Sister.
                            </p>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>

                  {profile.education && (
                    <Card className="shadow-lg">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <GraduationCap className="h-5 w-5 text-purple-600" />
                          Education
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="p-6 bg-gradient-to-br from-purple-50 to-violet-50 rounded-xl border border-purple-200">
                          <span className="text-gray-700 font-medium text-lg">{profile.education}</span>
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  <Card className="shadow-lg">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Award className="h-5 w-5 text-yellow-600" />
                        Achievements & Recognition
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="p-6 bg-gradient-to-br from-yellow-50 to-orange-50 rounded-xl border border-yellow-200">
                        {profile.achievements ? (
                          <div className="space-y-4">
                            <p className="text-gray-700 leading-relaxed text-lg">
                              {profile.achievements}
                            </p>
                          </div>
                        ) : (
                          <div className="text-center py-8">
                            <Trophy className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                            <p className="text-gray-500 italic text-lg">
                              No achievements recorded.
                            </p>
                            <p className="text-gray-400 text-sm mt-2">
                              Achievements and recognition will be displayed here when available.
                            </p>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  )
}