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
  Award,
  BookOpen,
  Calendar,
  User,
  Clock,
  Star,
  Quote,
  Share2,
  Cake,
  GraduationCap,
  Briefcase,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Header } from "@/components/header"
import { isAuthenticated } from "@/lib/auth"
import { alumniData } from "@/lib/alumni-data"

const getDepartmentColor = (department: string) => {
  const colors = {
    College: "from-blue-600 to-blue-800",
    "Senior High": "from-green-600 to-green-800",
    "Junior High": "from-purple-600 to-purple-800",
    Elementary: "from-orange-600 to-orange-800",
  }
  return colors[department as keyof typeof colors] || "from-gray-600 to-gray-800"
}

export default function AlumniProfilePage() {
  const params = useParams()
  const alumniId = params.alumniId as string
  const [authenticated, setAuthenticated] = useState(false)
  const [activeTab, setActiveTab] = useState("profile")

  useEffect(() => {
    setAuthenticated(isAuthenticated())
  }, [])

  const alumni = alumniData.find((a) => a.id === alumniId)

  if (!alumni) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Alumni Not Found</h1>
            <Link href="/alumni">
              <Button>Back to Alumni Directory</Button>
            </Link>
          </div>
        </main>
      </div>
    )
  }

  const departmentColor = getDepartmentColor(alumni.department)

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 via-blue-50/30 to-indigo-50/50">
      <Header />

      <div className={`relative bg-gradient-to-br ${departmentColor} text-white overflow-hidden`}>
        <div className="absolute inset-0 bg-black/20" />
        <div className="absolute top-10 right-10 w-32 h-32 bg-white/10 rounded-full blur-xl"></div>
        <div className="absolute bottom-20 left-20 w-24 h-24 bg-white/5 rounded-full blur-lg"></div>
        <div className="absolute top-1/2 right-1/4 w-16 h-16 bg-white/10 rounded-full blur-md"></div>

        <div className="container relative py-24 px-4">
          <Link href="/alumni">
            <Button variant="ghost" className="text-white hover:bg-white/10 mb-8 backdrop-blur-sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Alumni Directory
            </Button>
          </Link>

          <div className="flex flex-col lg:flex-row items-start lg:items-center gap-12">
            <div className="relative group">
              <div className="w-48 h-48 lg:w-56 lg:h-56 rounded-3xl overflow-hidden border-4 border-white/30 shadow-2xl group-hover:scale-105 transition-transform duration-300">
                <Image
                  src={alumni.profilePictureUrl || "/placeholder.svg"}
                  alt={alumni.fullName}
                  width={224}
                  height={224}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-3 -right-3 bg-white text-gray-900 px-4 py-2 rounded-2xl text-sm font-bold shadow-xl">
                <GraduationCap className="h-4 w-4 inline mr-2" />
                Class of {alumni.graduationYear}
              </div>
            </div>

            <div className="flex-1 space-y-6">
              <div>
                <Badge className="bg-white/20 text-white mb-4 px-4 py-2 text-sm font-medium">Alumni</Badge>
              </div>

              <div>
                <h1 className="text-5xl lg:text-6xl font-bold mb-4 leading-tight">{alumni.fullName}</h1>
                {alumni.currentProfession && (
                  <p className="text-2xl lg:text-3xl text-white/90 mb-3 font-light">{alumni.currentProfession}</p>
                )}
                {alumni.currentCompany && <p className="text-xl text-white/80 mb-6">{alumni.currentCompany}</p>}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-white/90">
                <div className="flex items-center gap-3 bg-white/10 px-4 py-3 rounded-xl backdrop-blur-sm">
                  <GraduationCap className="h-5 w-5" />
                  <span>{alumni.courseProgram}</span>
                </div>
                <div className="flex items-center gap-3 bg-white/10 px-4 py-3 rounded-xl backdrop-blur-sm">
                  <Calendar className="h-5 w-5" />
                  <span>Class of {alumni.graduationYear}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <main className="flex-1 py-16">
        <div className="container max-w-7xl">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-12 bg-white shadow-lg rounded-2xl p-2 h-16">
              <TabsTrigger
                value="profile"
                className="flex items-center gap-3 text-lg py-4 rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-indigo-600 data-[state=active]:text-white"
              >
                <User className="h-5 w-5" />
                Profile
              </TabsTrigger>
              <TabsTrigger
                value="academic"
                className="flex items-center gap-3 text-lg py-4 rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-500 data-[state=active]:to-emerald-600 data-[state=active]:text-white"
              >
                <GraduationCap className="h-5 w-5" />
                Academic History
              </TabsTrigger>
              <TabsTrigger
                value="career"
                className="flex items-center gap-3 text-lg py-4 rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-violet-600 data-[state=active]:text-white"
              >
                <Briefcase className="h-5 w-5" />
                Career
              </TabsTrigger>
            </TabsList>

            <TabsContent value="profile" className="space-y-8">
              <div className="grid lg:grid-cols-3 gap-8">
                <div className="space-y-6">
                  <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200 shadow-lg">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <User className="h-5 w-5 text-blue-600" />
                        Personal Information
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <span className="font-medium">Full Name:</span>
                        <p className="text-gray-700">{alumni.fullName}</p>
                      </div>
                      <div>
                        <span className="font-medium">Nickname:</span>
                        <p className="text-gray-700">{alumni.nickname || "Not specified"}</p>
                      </div>
                      <div>
                        <span className="font-medium">Age:</span>
                        <p className="text-gray-700">{alumni.age || "Not specified"}</p>
                      </div>
                      <div>
                        <div className="flex items-center mb-2">
                          <Cake className="h-4 w-4 mr-2 text-gray-500" />
                          <span className="font-medium">Birthday:</span>
                        </div>
                        <p className="text-gray-700">
                          {alumni.birthday ? new Date(alumni.birthday).toLocaleDateString() : "Not specified"}
                        </p>
                      </div>
                      <div>
                        <div className="flex items-center mb-2">
                          <MapPin className="h-4 w-4 mr-2 text-gray-500" />
                          <span className="font-medium">Address:</span>
                        </div>
                        <p className="text-gray-700">{alumni.address || "Not specified"}</p>
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
                      {alumni.email && (
                        <div className="flex items-center gap-3 p-3 bg-white rounded-lg">
                          <Mail className="h-4 w-4 text-gray-500" />
                          <span className="text-gray-700">{alumni.email}</span>
                        </div>
                      )}
                      {alumni.phone && (
                        <div className="flex items-center gap-3 p-3 bg-white rounded-lg">
                          <Phone className="h-4 w-4 text-gray-500" />
                          <span className="text-gray-700">{alumni.phone}</span>
                        </div>
                      )}
                      {alumni.currentLocation && (
                        <div className="flex items-center gap-3 p-3 bg-white rounded-lg">
                          <MapPin className="h-4 w-4 text-gray-500" />
                          <span className="text-gray-700">{alumni.currentLocation}</span>
                        </div>
                      )}
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
                        <span className="text-blue-600">{alumni.socialMediaFacebook || "Not specified"}</span>
                      </div>
                      <div className="flex items-center gap-3 p-3 bg-white rounded-lg">
                        <span className="text-sm text-gray-500">Instagram:</span>
                        <span className="text-pink-600">{alumni.socialMediaInstagram || "Not specified"}</span>
                      </div>
                      <div className="flex items-center gap-3 p-3 bg-white rounded-lg">
                        <span className="text-sm text-gray-500">Twitter/X:</span>
                        <span className="text-gray-700">{alumni.socialMediaTwitter || "Not specified"}</span>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div className="lg:col-span-2 space-y-6">
                  <Card className="shadow-lg">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Quote className="h-5 w-5 text-indigo-600" />
                        Motto / Saying
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="p-6 bg-gradient-to-br from-indigo-50 to-blue-50 rounded-xl border border-indigo-200">
                        <p className="text-lg italic text-center text-gray-700 font-medium">
                          "{alumni.sayingMotto || "Not specified"}"
                        </p>
                      </div>
                    </CardContent>
                  </Card>

                  {alumni.bio && (
                    <Card className="shadow-lg">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <BookOpen className="h-5 w-5 text-purple-600" />
                          About
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="p-6 bg-gradient-to-br from-purple-50 to-violet-50 rounded-xl border border-purple-200">
                          <p className="text-gray-700 leading-relaxed">{alumni.bio}</p>
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
                      {alumni.achievements && alumni.achievements.length > 0 ? (
                        <div className="space-y-4">
                          {alumni.achievements.map((achievement, index) => (
                            <div
                              key={index}
                              className="flex items-start gap-4 p-6 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl border border-yellow-200 shadow-sm"
                            >
                              <Star className="h-6 w-6 text-yellow-600 mt-1 flex-shrink-0" />
                              <span className="text-gray-700 font-medium text-lg">{achievement}</span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-gray-500 italic">No achievements recorded</p>
                      )}
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="academic" className="space-y-8">
              <div className="grid lg:grid-cols-2 gap-8">
                <Card className="shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <GraduationCap className="h-5 w-5 text-blue-600" />
                      Academic History
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
                      <div className="space-y-4">
                        <div>
                          <span className="font-medium text-gray-600">Department:</span>
                          <p className="text-gray-900 text-lg">{alumni.department}</p>
                        </div>
                        <div>
                          <span className="font-medium text-gray-600">Course/Program:</span>
                          <p className="text-gray-900 text-lg">{alumni.courseProgram || "Not specified"}</p>
                        </div>
                        <div>
                          <span className="font-medium text-gray-600">Graduation Year:</span>
                          <p className="text-gray-900 text-lg">{alumni.graduationYear}</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Award className="h-5 w-5 text-yellow-600" />
                      Academic Achievements
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {alumni.achievements && alumni.achievements.length > 0 ? (
                      <div className="space-y-3">
                        {alumni.achievements.map((achievement, index) => (
                          <div
                            key={index}
                            className="flex items-start gap-3 p-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg border border-yellow-200"
                          >
                            <Star className="h-5 w-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                            <span className="text-gray-700 font-medium">{achievement}</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-500 italic">No academic achievements recorded</p>
                    )}
                  </CardContent>
                </Card>
              </div>

              {alumni.activities && alumni.activities.length > 0 && (
                <Card className="shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BookOpen className="h-5 w-5 text-indigo-600" />
                      Activities & Organizations
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-2 gap-4">
                      {alumni.activities.map((activity, index) => (
                        <div
                          key={index}
                          className="p-4 bg-gradient-to-r from-indigo-50 to-blue-50 rounded-xl border border-indigo-200"
                        >
                          <span className="text-gray-700 font-medium">{activity}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="career" className="space-y-8">
              <div className="grid lg:grid-cols-2 gap-8">
                <Card className="shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Briefcase className="h-5 w-5 text-green-600" />
                      Current Position
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="p-6 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border border-green-200">
                      <div className="space-y-4">
                        <div>
                          <span className="font-medium text-gray-600">Current Profession:</span>
                          <p className="text-gray-900 text-lg">{alumni.currentProfession || "Not specified"}</p>
                        </div>
                        <div>
                          <span className="font-medium text-gray-600">Company/Organization:</span>
                          <p className="text-gray-900 text-lg">{alumni.currentCompany || "Not specified"}</p>
                        </div>
                        <div>
                          <span className="font-medium text-gray-600">Location:</span>
                          <p className="text-gray-900 text-lg">{alumni.currentLocation || "Not specified"}</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Clock className="h-5 w-5 text-purple-600" />
                      Career Journey
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="p-6 bg-gradient-to-br from-purple-50 to-violet-50 rounded-xl border border-purple-200">
                      <div className="text-center">
                        <div className="text-3xl font-bold text-purple-800 mb-2">
                          {new Date().getFullYear() - Number.parseInt(alumni.graduationYear)}
                        </div>
                        <div className="text-purple-700 font-medium">Years Since Graduation</div>
                      </div>
                      <div className="mt-4 pt-4 border-t border-purple-200">
                        <p className="text-sm text-purple-600 text-center">
                          Graduated in {alumni.graduationYear} from {alumni.courseProgram}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {alumni.bio && (
                <Card className="shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BookOpen className="h-5 w-5 text-indigo-600" />
                      Professional Journey
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="p-6 bg-gradient-to-br from-indigo-50 to-blue-50 rounded-xl border border-indigo-200">
                      <p className="text-gray-700 leading-relaxed text-lg">{alumni.bio}</p>
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  )
}
