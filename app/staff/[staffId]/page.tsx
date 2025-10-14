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
  Building,
  User,
  Clock,
  Star,
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
import { staffData } from "@/lib/staff-data"

const getDepartmentColor = (department: string) => {
  const colors = {
    Administration: "from-red-600 to-red-800",
    "Academic Affairs Office": "from-blue-600 to-blue-800",
    "Student Affairs Office": "from-green-600 to-green-800",
    "Physical Education Department": "from-purple-600 to-purple-800",
    "Registrar's Office": "from-orange-600 to-orange-800",
    "Finance Office": "from-indigo-600 to-indigo-800",
  }
  return colors[department as keyof typeof colors] || "from-gray-600 to-gray-800"
}

export default function StaffProfilePage() {
  const params = useParams()
  const staffId = params.staffId as string
  const [authenticated, setAuthenticated] = useState(false)
  const [activeTab, setActiveTab] = useState("profile")
  const [staff, setStaff] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setAuthenticated(isAuthenticated())
    fetchStaffProfile()
  }, [staffId])

  const fetchStaffProfile = async () => {
    try {
      setLoading(true)
      setError(null)

      // Fetch staff profile from API
      const response = await fetch(`/api/yearbook/profile/${staffId}`, {
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache',
        },
      })

      if (response.ok) {
        const result = await response.json()
        if (result.success && result.data) {
          console.log("[Staff Profile] Found staff in database:", result.data.fullName)
          setStaff(result.data)
        } else {
          console.log("[Staff Profile] Staff not found in database")
          setError("Staff member not found")
        }
      } else {
        console.log("[Staff Profile] API failed")
        setError("Failed to fetch staff profile")
      }
    } catch (err) {
      console.error("[Staff Profile] Error fetching staff profile:", err)
      setError("Failed to fetch staff profile")
    } finally {
      setLoading(false)
    }
  }

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
            <p className="text-gray-600 text-lg">Loading staff profile...</p>
          </div>
        </main>
      </div>
    )
  }

  // Show error state
  if (error || !staff) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Staff Member Not Found</h1>
            <p className="text-gray-600 mb-4">{error || 'The requested staff member could not be found.'}</p>
            <Link href="/staff">
              <Button>Back to Staff Directory</Button>
            </Link>
          </div>
        </main>
      </div>
    )
  }

  const departmentColor = getDepartmentColor(staff.officeAssigned || staff.departmentAssigned || "Administration")

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 via-blue-50/30 to-indigo-50/50">
      <Header />

      <div className={`relative bg-gradient-to-br ${departmentColor} text-white overflow-hidden`}>
        <div className="absolute inset-0 bg-black/20" />
        <div className="absolute top-10 right-10 w-32 h-32 bg-white/10 rounded-full blur-xl"></div>
        <div className="absolute bottom-20 left-20 w-24 h-24 bg-white/5 rounded-full blur-lg"></div>
        <div className="absolute top-1/2 right-1/4 w-16 h-16 bg-white/10 rounded-full blur-md"></div>

        <div className="container relative py-24 px-4">
          <Link href="/staff">
            <Button variant="ghost" className="text-white hover:bg-white/10 mb-8 backdrop-blur-sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Staff Directory
            </Button>
          </Link>

          <div className="flex flex-col lg:flex-row items-start lg:items-center gap-12">
            <div className="relative group">
              <div className="w-48 h-48 lg:w-56 lg:h-56 rounded-3xl overflow-hidden border-4 border-white/30 shadow-2xl group-hover:scale-105 transition-transform duration-300">
                <Image
                  src={staff.profilePicture || "/placeholder.svg"}
                  alt={staff.fullName}
                  width={224}
                  height={224}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-3 -right-3 bg-white text-gray-900 px-4 py-2 rounded-2xl text-sm font-bold shadow-xl">
                <Clock className="h-4 w-4 inline mr-2" />
                {staff.yearsOfService} years
              </div>
            </div>

            <div className="flex-1 space-y-6">
              <div>
                <Badge className="bg-white/20 text-white mb-4 px-4 py-2 text-sm font-medium">Staff Member</Badge>
              </div>

              <div>
                <h1 className="text-5xl lg:text-6xl font-bold mb-4 leading-tight">{staff.fullName}</h1>
                <p className="text-2xl lg:text-3xl text-white/90 mb-3 font-light">{staff.position}</p>
                <p className="text-xl text-white/80 mb-6">{staff.officeAssigned || staff.departmentAssigned}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-white/90">
                <div className="flex items-center gap-3 bg-white/10 px-4 py-3 rounded-xl backdrop-blur-sm">
                  <Building className="h-5 w-5" />
                  <span>{staff.officeAssigned || staff.office || 'Office Not Assigned'}</span>
                </div>
                <div className="flex items-center gap-3 bg-white/10 px-4 py-3 rounded-xl backdrop-blur-sm">
                  <Calendar className="h-5 w-5" />
                  <span>School Year {staff.schoolYear}</span>
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
                value="profile"
                className="flex items-center gap-3 text-lg py-4 rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-indigo-600 data-[state=active]:text-white"
              >
                <User className="h-5 w-5" />
                Profile
              </TabsTrigger>
              <TabsTrigger
                value="about"
                className="flex items-center gap-3 text-lg py-4 rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-violet-600 data-[state=active]:text-white"
              >
                <User className="h-5 w-5" />
                About Staff
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
                        <p className="text-gray-700">{staff.fullName}</p>
                      </div>
                      <div>
                        <span className="font-medium">Nickname:</span>
                        <p className="text-gray-700">{staff.nickname || "Not specified"}</p>
                      </div>
                      <div>
                        <span className="font-medium">Age:</span>
                        <p className="text-gray-700">{staff.age || "Not specified"}</p>
                      </div>
                      <div>
                        <div className="flex items-center mb-2">
                          <Cake className="h-4 w-4 mr-2 text-gray-500" />
                          <span className="font-medium">Birthday:</span>
                        </div>
                        <p className="text-gray-700">
                          {staff.birthday ? new Date(staff.birthday).toLocaleDateString() : "Not specified"}
                        </p>
                      </div>
                      <div>
                        <div className="flex items-center mb-2">
                          <MapPin className="h-4 w-4 mr-2 text-gray-500" />
                          <span className="font-medium">Address:</span>
                        </div>
                        <p className="text-gray-700">{staff.address || "Not specified"}</p>
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
                      {staff.email && (
                        <div className="flex items-center gap-3 p-3 bg-white rounded-lg">
                          <Mail className="h-4 w-4 text-gray-500" />
                          <span className="text-gray-700">{staff.email}</span>
                        </div>
                      )}
                      {staff.phone && (
                        <div className="flex items-center gap-3 p-3 bg-white rounded-lg">
                          <Phone className="h-4 w-4 text-gray-500" />
                          <span className="text-gray-700">{staff.phone}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-3 p-3 bg-white rounded-lg">
                        <Building className="h-4 w-4 text-gray-500" />
                        <span className="text-gray-700">{staff.officeAssigned || staff.office || 'Office Not Assigned'}</span>
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
                        <span className="text-blue-600">{staff.socialMediaFacebook || "Not specified"}</span>
                      </div>
                      <div className="flex items-center gap-3 p-3 bg-white rounded-lg">
                        <span className="text-sm text-gray-500">Instagram:</span>
                        <span className="text-pink-600">{staff.socialMediaInstagram || "Not specified"}</span>
                      </div>
                      <div className="flex items-center gap-3 p-3 bg-white rounded-lg">
                        <span className="text-sm text-gray-500">Twitter/X:</span>
                        <span className="text-gray-700">{staff.socialMediaTwitter || "Not specified"}</span>
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
                        <div className="text-4xl font-bold text-yellow-800 mb-2">{staff.yearsOfService}</div>
                        <div className="text-yellow-700 font-medium">Years of Dedicated Service</div>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-white rounded-lg">
                        <span className="text-gray-600">Position</span>
                        <span className="text-gray-900 font-medium">{staff.position}</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-white rounded-lg">
                        <span className="text-gray-600">Office/Department</span>
                        <span className="text-gray-900 font-medium">
                          {staff.officeAssigned || staff.departmentAssigned}
                        </span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-white rounded-lg">
                        <span className="text-gray-600">Current School Year</span>
                        <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                          {staff.schoolYear}
                        </Badge>
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
                          "{staff.sayingMotto || "Not specified"}"
                        </p>
                      </div>
                    </CardContent>
                  </Card>

                  {staff.bio && (
                    <Card className="shadow-lg">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <BookOpen className="h-5 w-5 text-purple-600" />
                          About
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="p-6 bg-gradient-to-br from-purple-50 to-violet-50 rounded-xl border border-purple-200">
                          <p className="text-gray-700 leading-relaxed">{staff.bio}</p>
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
                      {staff.achievements && staff.achievements.length > 0 ? (
                        <div className="space-y-4">
                          {staff.achievements.map((achievement, index) => (
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

                  {staff.additionalRoles && staff.additionalRoles.length > 0 && (
                    <Card className="shadow-lg">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <BookOpen className="h-5 w-5 text-indigo-600" />
                          Additional Roles
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          {staff.additionalRoles.map((role, index) => (
                            <div
                              key={index}
                              className="p-4 bg-gradient-to-r from-indigo-50 to-blue-50 rounded-xl border border-indigo-200"
                            >
                              <span className="text-gray-700 font-medium">{role}</span>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="about" className="space-y-8">
              <div className="grid lg:grid-cols-3 gap-8">
                <div className="space-y-6">
                  <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200 shadow-lg">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Mail className="h-5 w-5 text-blue-600" />
                        Contact Information
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {staff.email && (
                        <div className="flex items-center gap-3 p-3 bg-white rounded-lg">
                          <Mail className="h-4 w-4 text-gray-500" />
                          <span className="text-gray-700">{staff.email}</span>
                        </div>
                      )}
                      {staff.phone && (
                        <div className="flex items-center gap-3 p-3 bg-white rounded-lg">
                          <Phone className="h-4 w-4 text-gray-500" />
                          <span className="text-gray-700">{staff.phone}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-3 p-3 bg-white rounded-lg">
                        <Building className="h-4 w-4 text-gray-500" />
                        <span className="text-gray-700">{staff.officeAssigned || staff.office || 'Office Not Assigned'}</span>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200 shadow-lg">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Clock className="h-5 w-5 text-green-600" />
                        Service Record
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="text-center p-6 bg-gradient-to-br from-green-100 to-emerald-100 rounded-xl">
                        <div className="text-4xl font-bold text-green-800 mb-2">{staff.yearsOfService}</div>
                        <div className="text-green-700 font-medium">Years of Dedicated Service</div>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-white rounded-lg">
                        <span className="text-gray-600">Current School Year</span>
                        <Badge variant="secondary" className="bg-green-100 text-green-800">
                          {staff.schoolYear}
                        </Badge>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-white rounded-lg">
                        <span className="text-gray-600">Position</span>
                        <span className="text-gray-900 font-medium">{staff.position}</span>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div className="lg:col-span-2 space-y-6">
                  {staff.bio && (
                    <Card className="shadow-lg">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <BookOpen className="h-5 w-5 text-purple-600" />
                          About
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="p-6 bg-gradient-to-br from-purple-50 to-violet-50 rounded-xl border border-purple-200">
                          <p className="text-gray-700 leading-relaxed text-lg">{staff.bio}</p>
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
                      {staff.achievements && staff.achievements.length > 0 ? (
                        <div className="space-y-4">
                          {staff.achievements.map((achievement, index) => (
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

                  {staff.additionalRoles && staff.additionalRoles.length > 0 && (
                    <Card className="shadow-lg">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <BookOpen className="h-5 w-5 text-indigo-600" />
                          Additional Roles & Responsibilities
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          {staff.additionalRoles.map((role, index) => (
                            <div
                              key={index}
                              className="p-4 bg-gradient-to-r from-indigo-50 to-blue-50 rounded-xl border border-indigo-200"
                            >
                              <span className="text-gray-700 font-medium">{role}</span>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  )
}
