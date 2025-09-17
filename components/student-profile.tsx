"use client"
import Image from "next/image"
import Link from "next/link"
import { ChevronLeft, Award, BookOpen, Briefcase, User } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface Achievement {
  title: string
  description?: string
}

interface Activity {
  name: string
  role?: string
}

interface StudentProfileProps {
  departmentType: "elementary" | "junior-high" | "senior-high" | "college"
  departmentName: string
  sectionInfo: {
    id: string
    name: string
    academicYear: string
    adviser?: string
  }
  student: {
    id: string
    name: string
    photoUrl: string
    quote?: string
    ambition?: string
    hobbies?: string[]
    achievements?: Achievement[]
    activities?: Activity[]
    favoriteMemory?: string
    message?: string
    galleryImages?: string[]
  }
  backLink: string
  courseId?: string
  yearId?: string
  blockId?: string
}

export function StudentProfile({
  departmentType,
  departmentName,
  sectionInfo,
  student,
  backLink,
  courseId,
  yearId,
  blockId,
}: StudentProfileProps) {
  // Get department-specific colors
  const getAccentColor = () => {
    switch (departmentType) {
      case "elementary":
        return {
          gradient: "from-sky-500 to-blue-600",
          text: "text-blue-600",
          bg: "bg-blue-100",
          border: "border-blue-200",
          hover: "hover:bg-blue-50",
          pattern: "bg-[radial-gradient(#e2f0fb_1px,transparent_1px)] bg-[length:20px_20px]",
        }
      case "junior-high":
        return {
          gradient: "from-emerald-500 to-green-600",
          text: "text-green-600",
          bg: "bg-green-100",
          border: "border-green-200",
          hover: "hover:bg-green-50",
          pattern: "bg-[radial-gradient(#e5f5e0_1px,transparent_1px)] bg-[length:20px_20px]",
        }
      case "senior-high":
        return {
          gradient: "from-amber-500 to-yellow-600",
          text: "text-yellow-600",
          bg: "bg-yellow-100",
          border: "border-yellow-200",
          hover: "hover:bg-yellow-50",
          pattern: "bg-[radial-gradient(#fff5e0_1px,transparent_1px)] bg-[length:20px_20px]",
        }
      case "college":
      default:
        return {
          gradient: "from-purple-500 to-indigo-600",
          text: "text-indigo-600",
          bg: "bg-indigo-100",
          border: "border-indigo-200",
          hover: "hover:bg-indigo-50",
          pattern: "bg-[radial-gradient(#f5e0ff_1px,transparent_1px)] bg-[length:20px_20px]",
        }
    }
  }

  const colors = getAccentColor()

  return (
    <div className={`min-h-screen pb-16 ${colors.pattern}`}>
      {/* Header */}
      <div className={`bg-gradient-to-r ${colors.gradient} text-white`}>
        <div className="container mx-auto px-4 py-6">
          <Link
            href={backLink}
            className="inline-flex items-center text-white/90 hover:text-white mb-4 transition-colors"
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            <span>Back to {sectionInfo.name}</span>
          </Link>

          <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
            <div className="relative w-28 h-28 md:w-36 md:h-36 rounded-full overflow-hidden border-4 border-white shadow-lg">
              {student.photoUrl ? (
                <Image src={student.photoUrl || "/placeholder.svg"} alt={student.name} fill className="object-cover" />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-200 text-gray-400">
                  <User className="h-12 w-12" />
                </div>
              )}
            </div>
            <div className="text-center md:text-left">
              <h1 className="text-2xl md:text-3xl font-bold tracking-tight">{student.name}</h1>
              <div className="flex flex-wrap justify-center md:justify-start items-center gap-x-4 gap-y-2 mt-2">
                <div className="flex items-center text-white/90">
                  <BookOpen className="h-4 w-4 mr-1.5" />
                  <span>{sectionInfo.name}</span>
                </div>
              </div>
              {student.quote && (
                <div className="mt-4 p-4 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20 max-w-xl">
                  <div className="text-white font-medium text-lg italic">"{student.quote}"</div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 mt-6">
        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="achievements">Achievements</TabsTrigger>
          </TabsList>

          {/* Profile Tab */}
          <TabsContent value="profile" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Main Info */}
              <Card className="p-5 md:col-span-2">
                <h2 className="text-lg font-semibold mb-4 flex items-center">
                  <User className="h-4 w-4 mr-2 text-gray-600" />
                  About
                </h2>

                {student.ambition && (
                  <div className="mb-4">
                    <h3 className="text-sm font-medium text-gray-500 mb-1">Ambition</h3>
                    <p className="text-gray-700">{student.ambition}</p>
                  </div>
                )}

                {student.favoriteMemory && (
                  <div className="mb-4">
                    <h3 className="text-sm font-medium text-gray-500 mb-1">Favorite Memory</h3>
                    <p className="text-gray-700">{student.favoriteMemory}</p>
                  </div>
                )}

                {student.message && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-1">Message</h3>
                    <p className="text-gray-700">{student.message}</p>
                  </div>
                )}
              </Card>

              {/* Sidebar Info */}
              <Card className="p-5">
                <h2 className="text-lg font-semibold mb-4 flex items-center">
                  <BookOpen className="h-4 w-4 mr-2 text-gray-600" />
                  Class Information
                </h2>

                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-500">Department</p>
                    <p className="font-medium">{departmentName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Section</p>
                    <p className="font-medium">{sectionInfo.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Academic Year</p>
                    <p className="font-medium">{sectionInfo.academicYear}</p>
                  </div>
                  {sectionInfo.adviser && (
                    <div>
                      <p className="text-sm text-gray-500">Adviser</p>
                      <p className="font-medium">{sectionInfo.adviser}</p>
                    </div>
                  )}
                </div>

                {student.hobbies && student.hobbies.length > 0 && (
                  <div className="mt-5">
                    <h3 className="text-sm font-medium text-gray-500 mb-2">Hobbies & Interests</h3>
                    <div className="flex flex-wrap gap-2">
                      {student.hobbies.map((hobby, index) => (
                        <span
                          key={index}
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colors.bg} ${colors.text}`}
                        >
                          {hobby}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </Card>
            </div>
          </TabsContent>

          {/* Achievements Tab */}
          <TabsContent value="achievements" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Achievements */}
              {student.achievements && student.achievements.length > 0 && (
                <Card className="p-5">
                  <h2 className="text-lg font-semibold mb-4 flex items-center">
                    <Award className="h-4 w-4 mr-2 text-gray-600" />
                    Achievements
                  </h2>
                  <div className="space-y-4">
                    {student.achievements.map((achievement, index) => (
                      <div key={index} className="flex items-start">
                        <div
                          className={`flex-shrink-0 w-8 h-8 rounded-full ${colors.bg} flex items-center justify-center mr-3`}
                        >
                          <span className={`text-sm font-medium ${colors.text}`}>{index + 1}</span>
                        </div>
                        <div>
                          <h3 className="font-medium">{achievement.title}</h3>
                          {achievement.description && (
                            <p className="text-sm text-gray-600 mt-1">{achievement.description}</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              )}

              {/* Activities */}
              {student.activities && student.activities.length > 0 && (
                <Card className="p-5">
                  <h2 className="text-lg font-semibold mb-4 flex items-center">
                    <Briefcase className="h-4 w-4 mr-2 text-gray-600" />
                    Activities & Organizations
                  </h2>
                  <div className="space-y-3">
                    {student.activities.map((activity, index) => (
                      <div key={index} className={`border rounded-lg p-3 ${colors.border} ${colors.hover}`}>
                        <h3 className="font-medium">{activity.name}</h3>
                        {activity.role && <p className="text-sm text-gray-600 mt-1">{activity.role}</p>}
                      </div>
                    ))}
                  </div>
                </Card>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
