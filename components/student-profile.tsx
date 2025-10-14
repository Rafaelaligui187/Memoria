"use client"
import Image from "next/image"
import Link from "next/link"
import {
  ChevronLeft,
  Award,
  BookOpen,
  Briefcase,
  User,
  MapPin,
  Users,
  GraduationCap,
  Target,
  Share2,
  Cake,
  Phone,
  Mail,
} from "lucide-react"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"

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
    nickname?: string
    age?: number
    birthday?: string
    address?: string
    mottoSaying?: string
    dreamJob?: string
    fatherGuardianName?: string
    motherGuardianName?: string
    facebook?: string
    instagram?: string
    twitter?: string
    parentsGuardianName?: string
    quote?: string
    ambition?: string
    hobbies?: string[]
    achievements?: Achievement[]
    activities?: Activity[]
    bio?: string
    message?: string
    galleryImages?: string[]
    course?: string
    yearLevel?: string
    sectionBlock?: string
    honors?: string
    officerRole?: string
    email?: string
    phone?: string
    socialMediaFacebook?: string
    socialMediaInstagram?: string
    socialMediaTwitter?: string
    sayingMotto?: string
    department?: string
    courseProgram?: string
    blockSection?: string
    profilePictureUrl?: string
    major?: string
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
          gradient: "from-emerald-600 to-green-700",
          text: "text-green-700",
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

  const getMainMotto = () => {
    return student.sayingMotto || student.mottoSaying || student.quote || ""
  }

  const formatAcademicYear = (academicYear: string) => {
    // If it's already in the correct format (e.g., "2025-2026"), return as is
    if (academicYear && academicYear.match(/^\d{4}-\d{4}$/)) {
      return academicYear
    }
    
    // If it's a MongoDB ObjectId or other format, try to extract year or use default
    if (academicYear && academicYear.length > 10) {
      // For MongoDB ObjectIds or other long strings, use current year + 1
      const currentYear = new Date().getFullYear()
      return `${currentYear}-${currentYear + 1}`
    }
    
    // If it's a single year (e.g., "2025"), convert to range format
    if (academicYear && academicYear.match(/^\d{4}$/)) {
      const year = parseInt(academicYear)
      return `${year}-${year + 1}`
    }
    
    // Default fallback
    const currentYear = new Date().getFullYear()
    return `${currentYear}-${currentYear + 1}`
  }

  // Render different layouts based on department type
  if (departmentType === "college") {
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
                {student.profilePictureUrl || student.photoUrl ? (
                  <Image
                    src={student.profilePictureUrl || student.photoUrl || "/placeholder.svg"}
                    alt={student.name}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center bg-gray-200 text-gray-400">
                    <User className="h-12 w-12" />
                  </div>
                )}
              </div>
              <div className="text-center md:text-left">
                <h1 className="text-2xl md:text-3xl font-bold tracking-tight">{student.name}</h1>
                {student.nickname && <p className="text-white/90 text-lg italic mt-1">"{student.nickname}"</p>}
                <div className="flex flex-wrap justify-center md:justify-start items-center gap-x-4 gap-y-1 mt-1">
                  {student.age && <p className="text-white/90 text-sm">Age: {student.age}</p>}
                  {(student.course || student.courseProgram) === "BSED" && student.major && (
                    <p className="text-white/90 text-sm">Major: {student.major}</p>
                  )}
                </div>
                <div className="flex flex-wrap justify-center md:justify-start items-center gap-x-4 gap-y-2 mt-2">
                  <div className="flex items-center text-white/90">
                    <BookOpen className="h-4 w-4 mr-1.5" />
                    <span>{sectionInfo.name}</span>
                  </div>
                  {(student.course || student.courseProgram) && (
                    <div className="flex items-center text-white/90">
                      <GraduationCap className="h-4 w-4 mr-1.5" />
                      <span>
                        {student.course || student.courseProgram} {student.yearLevel && `- ${student.yearLevel} Year`}
                      </span>
                    </div>
                  )}
                </div>
                {getMainMotto() && (
                  <div className="mt-4 p-4 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20 max-w-xl">
                    <div className="text-white font-medium text-lg italic">"{getMainMotto()}"</div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 mt-6">
          <Tabs defaultValue="profile" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-6">
              <TabsTrigger value="profile">Profile</TabsTrigger>
              <TabsTrigger value="academic">Academic Info</TabsTrigger>
              <TabsTrigger value="achievements">Achievements</TabsTrigger>
            </TabsList>

            <TabsContent value="profile" className="space-y-6">
              <div className="grid grid-cols-1 gap-6">
                {/* Main Info */}
                <Card className="p-5">
                  <h2 className="text-lg font-semibold mb-4 flex items-center">
                    <User className="h-4 w-4 mr-2 text-gray-600" />
                    Profile Information
                  </h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 mb-1">Full Name</h3>
                      <p className="text-gray-700">{student.name}</p>
                    </div>

                    {student.nickname && (
                      <div>
                        <h3 className="text-sm font-medium text-gray-500 mb-1">Nickname</h3>
                        <p className="text-gray-700">"{student.nickname}"</p>
                      </div>
                    )}

                    <div>
                      <h3 className="text-sm font-medium text-gray-500 mb-1">Age</h3>
                      <p className="text-gray-700">{student.age || "Not specified"}</p>
                    </div>

                    <div>
                      <div className="flex items-center mb-2">
                        <Cake className="h-4 w-4 mr-2 text-gray-500" />
                        <h3 className="text-sm font-medium text-gray-500">Birthday</h3>
                      </div>
                      <p className="text-gray-700">
                        {student.birthday ? new Date(student.birthday).toLocaleDateString() : "Not specified"}
                      </p>
                    </div>

                    {student.email && (
                      <div>
                        <div className="flex items-center mb-2">
                          <Mail className="h-4 w-4 mr-2 text-gray-500" />
                          <h3 className="text-sm font-medium text-gray-500">Email</h3>
                        </div>
                        <p className="text-gray-700">{student.email}</p>
                      </div>
                    )}

                    {student.phone && (
                      <div>
                        <div className="flex items-center mb-2">
                          <Phone className="h-4 w-4 mr-2 text-gray-500" />
                          <h3 className="text-sm font-medium text-gray-500">Phone</h3>
                        </div>
                        <p className="text-gray-700">{student.phone}</p>
                      </div>
                    )}

                    <div className="md:col-span-2">
                      <div className="flex items-center mb-2">
                        <MapPin className="h-4 w-4 mr-2 text-gray-500" />
                        <h3 className="text-sm font-medium text-gray-500">Address</h3>
                      </div>
                      <p className="text-gray-700">{student.address || "Not specified"}</p>
                    </div>

                    <div className="md:col-span-2">
                      <div className="flex items-center mb-2">
                        <Users className="h-4 w-4 mr-2 text-gray-500" />
                        <h3 className="text-sm font-medium text-gray-500">Parents/Guardian</h3>
                      </div>
                      <div className="space-y-1">
                        <p className="text-gray-700">
                          <span className="text-gray-500 text-sm">Father/Guardian:</span>{" "}
                          {student.fatherGuardianName || "Not specified"}
                        </p>
                        <p className="text-gray-700">
                          <span className="text-gray-500 text-sm">Mother/Guardian:</span>{" "}
                          {student.motherGuardianName || "Not specified"}
                        </p>
                        {!student.fatherGuardianName && !student.motherGuardianName && student.parentsGuardianName && (
                          <p className="text-gray-700">{student.parentsGuardianName}</p>
                        )}
                      </div>
                    </div>

                    <div className="md:col-span-2">
                      <div className="flex items-center mb-2">
                        <Share2 className="h-4 w-4 mr-2 text-gray-500" />
                        <h3 className="text-sm font-medium text-gray-500">Social Media</h3>
                      </div>
                      <div className="flex flex-wrap gap-4">
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-gray-500">Facebook:</span>
                          <span className="text-blue-600">
                            {student.socialMediaFacebook || student.facebook || "Not specified"}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-gray-500">Instagram:</span>
                          <span className="text-pink-600">
                            {student.socialMediaInstagram || student.instagram || "Not specified"}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-gray-500">Twitter/X:</span>
                          <span className="text-gray-700">
                            {student.socialMediaTwitter || student.twitter || "Not specified"}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="border-t pt-6 space-y-4">
                    {student.dreamJob && (
                      <div>
                        <h3 className="text-sm font-medium text-gray-500 mb-1 flex items-center">
                          <Target className="h-4 w-4 mr-1" />
                          Dream Job
                        </h3>
                        <p className="text-gray-700">{student.dreamJob}</p>
                      </div>
                    )}

                    <div>
                      <h3 className="text-sm font-medium text-gray-500 mb-1">Motto/Saying</h3>
                      <p className="text-gray-700 italic">"{getMainMotto() || "Not specified"}"</p>
                    </div>

                    {student.bio && (
                      <div>
                        <h3 className="text-sm font-medium text-gray-500 mb-1">Personal Bio</h3>
                        <p className="text-gray-700">{student.bio}</p>
                      </div>
                    )}

                    {student.message && (
                      <div>
                        <h3 className="text-sm font-medium text-gray-500 mb-1">Message</h3>
                        <p className="text-gray-700">{student.message}</p>
                      </div>
                    )}
                  </div>
                </Card>
              </div>
            </TabsContent>

            {/* Academic Info Tab */}
            <TabsContent value="academic" className="space-y-6">
              <Card className="p-5">
                <h2 className="text-lg font-semibold mb-4 flex items-center">
                  <GraduationCap className="h-4 w-4 mr-2 text-gray-600" />
                  Academic Information
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-1">Department</h3>
                    <p className="text-gray-700">{student.department || departmentName}</p>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-1">Year Level</h3>
                    <p className="text-gray-700">{student.yearLevel || "Not specified"}</p>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-1">Course/Program</h3>
                    <p className="text-gray-700">{student.course || student.courseProgram || "Not specified"}</p>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-1">Section/Block</h3>
                    <p className="text-gray-700">{student.blockSection || student.sectionBlock || "Not specified"}</p>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-1">Academic Year</h3>
                    <p className="text-gray-700">{formatAcademicYear(sectionInfo.academicYear)}</p>
                  </div>

                  {sectionInfo.adviser && (
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 mb-1">Adviser</h3>
                      <p className="text-gray-700">{sectionInfo.adviser}</p>
                    </div>
                  )}
                </div>
              </Card>
            </TabsContent>

            {/* Achievements Tab */}
            <TabsContent value="achievements" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="p-5">
                  <h2 className="text-lg font-semibold mb-4 flex items-center">
                    <Award className="h-4 w-4 mr-2 text-gray-600" />
                    Achievements
                  </h2>
                  {student.achievements && Array.isArray(student.achievements) && student.achievements.length > 0 ? (
                    <div className="space-y-4">
                      {student.achievements.map((achievement, index) => (
                        <div key={index} className="flex items-start">
                          <div
                            className={`flex-shrink-0 w-8 h-8 rounded-full ${colors.bg} flex items-center justify-center mr-3`}
                          >
                            <span className={`text-sm font-medium ${colors.text}`}>{index + 1}</span>
                          </div>
                          <div>
                            <h3 className="font-medium">
                              {typeof achievement === "string" ? achievement : achievement.title}
                            </h3>
                            {typeof achievement === "object" && achievement.description && (
                              <p className="text-sm text-gray-600 mt-1">{achievement.description}</p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 italic">No achievements recorded</p>
                  )}
                </Card>

                {/* Activities */}
                <Card className="p-5">
                  <h2 className="text-lg font-semibold mb-4 flex items-center">
                    <Briefcase className="h-4 w-4 mr-2 text-gray-600" />
                    Activities & Organizations
                  </h2>
                  {student.activities && Array.isArray(student.activities) && student.activities.length > 0 ? (
                    <div className="space-y-3">
                      {student.activities.map((activity, index) => (
                        <div key={index} className={`border rounded-lg p-3 ${colors.border} ${colors.hover}`}>
                          <h3 className="font-medium">{typeof activity === "string" ? activity : activity.name}</h3>
                          {typeof activity === "object" && activity.role && (
                            <p className="text-sm text-gray-600 mt-1">{activity.role}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 italic">No activities recorded</p>
                  )}
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    )
  }

  // Original layout for other departments (elementary, junior-high, senior-high)
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
              {student.profilePictureUrl || student.photoUrl ? (
                <Image
                  src={student.profilePictureUrl || student.photoUrl || "/placeholder.svg"}
                  alt={student.name}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-200 text-gray-400">
                  <User className="h-12 w-12" />
                </div>
              )}
            </div>
            <div className="text-center md:text-left">
              <h1 className="text-2xl md:text-3xl font-bold tracking-tight">{student.name}</h1>
              {student.nickname && <p className="text-white/90 text-lg italic mt-1">"{student.nickname}"</p>}
              {student.age && <p className="text-white/90 text-sm mt-1">Age: {student.age}</p>}
              <div className="flex flex-wrap justify-center md:justify-start items-center gap-x-4 gap-y-2 mt-2">
                <div className="flex items-center text-white/90">
                  <BookOpen className="h-4 w-4 mr-1.5" />
                  <span>{sectionInfo.name}</span>
                </div>
                {(student.course || student.courseProgram) && (
                  <div className="flex items-center text-white/90">
                    <GraduationCap className="h-4 w-4 mr-1.5" />
                    <span>
                      {student.course || student.courseProgram} {student.yearLevel && `- ${student.yearLevel} Year`}
                    </span>
                  </div>
                )}
              </div>
              {getMainMotto() && (
                <div className="mt-4 p-4 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20 max-w-xl">
                  <div className="text-white font-medium text-lg italic">"{getMainMotto()}"</div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 mt-6">
        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="academic">Academic Info</TabsTrigger>
            <TabsTrigger value="achievements">Achievements</TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="space-y-6">
            <div className="grid grid-cols-1 gap-6">
              {/* Main Info */}
              <Card className="p-5">
                <h2 className="text-lg font-semibold mb-4 flex items-center">
                  <User className="h-4 w-4 mr-2 text-gray-600" />
                  Profile Information
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-1">Full Name</h3>
                    <p className="text-gray-700">{student.name}</p>
                  </div>

                  {student.nickname && (
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 mb-1">Nickname</h3>
                      <p className="text-gray-700">"{student.nickname}"</p>
                    </div>
                  )}

                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-1">Age</h3>
                    <p className="text-gray-700">{student.age || "Not specified"}</p>
                  </div>

                  <div>
                    <div className="flex items-center mb-2">
                      <Cake className="h-4 w-4 mr-2 text-gray-500" />
                      <h3 className="text-sm font-medium text-gray-500">Birthday</h3>
                    </div>
                    <p className="text-gray-700">
                      {student.birthday ? new Date(student.birthday).toLocaleDateString() : "Not specified"}
                    </p>
                  </div>

                  {student.email && (
                    <div>
                      <div className="flex items-center mb-2">
                        <Mail className="h-4 w-4 mr-2 text-gray-500" />
                        <h3 className="text-sm font-medium text-gray-500">Email</h3>
                      </div>
                      <p className="text-gray-700">{student.email}</p>
                    </div>
                  )}

                  {student.phone && (
                    <div>
                      <div className="flex items-center mb-2">
                        <Phone className="h-4 w-4 mr-2 text-gray-500" />
                        <h3 className="text-sm font-medium text-gray-500">Phone</h3>
                      </div>
                      <p className="text-gray-700">{student.phone}</p>
                    </div>
                  )}

                  <div className="md:col-span-2">
                    <div className="flex items-center mb-2">
                      <MapPin className="h-4 w-4 mr-2 text-gray-500" />
                      <h3 className="text-sm font-medium text-gray-500">Address</h3>
                    </div>
                    <p className="text-gray-700">{student.address || "Not specified"}</p>
                  </div>

                  <div className="md:col-span-2">
                    <div className="flex items-center mb-2">
                      <Users className="h-4 w-4 mr-2 text-gray-500" />
                      <h3 className="text-sm font-medium text-gray-500">Parents/Guardian</h3>
                    </div>
                    <div className="space-y-1">
                      <p className="text-gray-700">
                        <span className="text-gray-500 text-sm">Father/Guardian:</span>{" "}
                        {student.fatherGuardianName || "Not specified"}
                      </p>
                      <p className="text-gray-700">
                        <span className="text-gray-500 text-sm">Mother/Guardian:</span>{" "}
                        {student.motherGuardianName || "Not specified"}
                      </p>
                      {!student.fatherGuardianName && !student.motherGuardianName && student.parentsGuardianName && (
                        <p className="text-gray-700">{student.parentsGuardianName}</p>
                      )}
                    </div>
                  </div>

                  <div className="md:col-span-2">
                    <div className="flex items-center mb-2">
                      <Share2 className="h-4 w-4 mr-2 text-gray-500" />
                      <h3 className="text-sm font-medium text-gray-500">Social Media</h3>
                    </div>
                    <div className="flex flex-wrap gap-4">
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-500">Facebook:</span>
                        <span className="text-blue-600">
                          {student.socialMediaFacebook || student.facebook || "Not specified"}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-500">Instagram:</span>
                        <span className="text-pink-600">
                          {student.socialMediaInstagram || student.instagram || "Not specified"}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-500">Twitter/X:</span>
                        <span className="text-gray-700">
                          {student.socialMediaTwitter || student.twitter || "Not specified"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="border-t pt-6 space-y-4">
                  {student.dreamJob && (
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 mb-1 flex items-center">
                        <Target className="h-4 w-4 mr-1" />
                        Dream Job
                      </h3>
                      <p className="text-gray-700">{student.dreamJob}</p>
                    </div>
                  )}

                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-1">Motto/Saying</h3>
                    <p className="text-gray-700 italic">"{getMainMotto() || "Not specified"}"</p>
                  </div>

                  {student.bio && (
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 mb-1">Personal Bio</h3>
                      <p className="text-gray-700">{student.bio}</p>
                    </div>
                  )}

                  {student.message && (
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 mb-1">Message</h3>
                      <p className="text-gray-700">{student.message}</p>
                    </div>
                  )}
                </div>
              </Card>
            </div>
          </TabsContent>

          {/* Academic Info Tab */}
          <TabsContent value="academic" className="space-y-6">
            <Card className="p-5">
              <h2 className="text-lg font-semibold mb-4 flex items-center">
                <GraduationCap className="h-4 w-4 mr-2 text-gray-600" />
                Academic Information
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">Department</h3>
                  <p className="text-gray-700">{student.department || departmentName}</p>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">Year Level</h3>
                  <p className="text-gray-700">{student.yearLevel || "Not specified"}</p>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">Course/Program</h3>
                  <p className="text-gray-700">{student.course || student.courseProgram || "Not specified"}</p>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">Section/Block</h3>
                  <p className="text-gray-700">{student.blockSection || student.sectionBlock || "Not specified"}</p>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">Academic Year</h3>
                  <p className="text-gray-700">{formatAcademicYear(sectionInfo.academicYear)}</p>
                </div>

                {sectionInfo.adviser && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-1">Adviser</h3>
                    <p className="text-gray-700">{sectionInfo.adviser}</p>
                  </div>
                )}
              </div>
            </Card>
          </TabsContent>

          {/* Achievements Tab */}
          <TabsContent value="achievements" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="p-5">
                <h2 className="text-lg font-semibold mb-4 flex items-center">
                  <Award className="h-4 w-4 mr-2 text-gray-600" />
                  Achievements
                </h2>
                {student.achievements && Array.isArray(student.achievements) && student.achievements.length > 0 ? (
                  <div className="space-y-4">
                    {student.achievements.map((achievement, index) => (
                      <div key={index} className="flex items-start">
                        <div
                          className={`flex-shrink-0 w-8 h-8 rounded-full ${colors.bg} flex items-center justify-center mr-3`}
                        >
                          <span className={`text-sm font-medium ${colors.text}`}>{index + 1}</span>
                        </div>
                        <div>
                          <h3 className="font-medium">
                            {typeof achievement === "string" ? achievement : achievement.title}
                          </h3>
                          {typeof achievement === "object" && achievement.description && (
                            <p className="text-sm text-gray-600 mt-1">{achievement.description}</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 italic">No achievements recorded</p>
                )}
              </Card>

              {/* Activities */}
              <Card className="p-5">
                <h2 className="text-lg font-semibold mb-4 flex items-center">
                  <Briefcase className="h-4 w-4 mr-2 text-gray-600" />
                  Activities & Organizations
                </h2>
                {student.activities && Array.isArray(student.activities) && student.activities.length > 0 ? (
                  <div className="space-y-3">
                    {student.activities.map((activity, index) => (
                      <div key={index} className={`border rounded-lg p-3 ${colors.border} ${colors.hover}`}>
                        <h3 className="font-medium">{typeof activity === "string" ? activity : activity.name}</h3>
                        {typeof activity === "object" && activity.role && (
                          <p className="text-sm text-gray-600 mt-1">{activity.role}</p>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 italic">No activities recorded</p>
                )}
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
