"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { User, ExternalLink } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

interface ProfileData {
  // Basic Info
  fullName: string
  nickname?: string
  age?: number
  gender?: string
  birthday?: string
  address?: string
  email?: string
  phone?: string

  // Academic/Professional Info
  department?: string
  yearLevel?: string
  courseProgram?: string
  major?: string
  blockSection?: string
  graduationYear?: string
  position?: string
  departmentAssigned?: string
  officeAssigned?: string
  yearsOfService?: number

  // Career Info (Alumni)
  currentProfession?: string
  currentCompany?: string
  currentLocation?: string

  // Additional Info
  dreamJob?: string
  sayingMotto?: string
  messageToStudents?: string

  // Social Media
  socialMediaFacebook?: string
  socialMediaInstagram?: string
  socialMediaTwitter?: string

  // Yearbook Info
  profilePictureUrl?: string
  achievements?: string[]
  activities?: string[]

  // Legacy fields
  quote?: string
  ambition?: string
  hobbies?: string
  honors?: string

  // Parents/Guardian (Students)
  fatherGuardianName?: string
  motherGuardianName?: string
}

interface ProfileCardProps {
  id: string
  type: "student" | "alumni" | "faculty" | "staff"
  data: ProfileData
  variant?: "yearbook" | "faculty-staff"
  showFullProfile?: boolean
}

export function ProfileCard({ id, type, data, variant = "yearbook", showFullProfile = false }: ProfileCardProps) {
  const isYearbookCard = variant === "yearbook" && (type === "student" || type === "alumni")
  const isFacultyStaffCard = variant === "faculty-staff" && (type === "faculty" || type === "staff")

  const getDisplayName = () => {
    if (data.nickname) {
      return `${data.fullName} "${data.nickname}"`
    }
    return data.fullName
  }

  const getMainMotto = () => {
    return data.sayingMotto || data.quote || ""
  }

  if (showFullProfile) {
    // Full Profile Page Layout
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Photo & Quick Info */}
          <div className="lg:col-span-1">
            <Card className="p-6">
              <div className="text-center space-y-4">
                {/* Profile Photo */}
                <div className="relative w-48 h-48 mx-auto rounded-full overflow-hidden border-4 border-gray-200">
                  {data.profilePictureUrl ? (
                    <Image
                      src={data.profilePictureUrl || "/placeholder.svg"}
                      alt={data.fullName}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center bg-gray-100 text-gray-400">
                      <User className="h-16 w-16" />
                    </div>
                  )}
                </div>

                {/* Basic Info */}
                <div>
                  <h1 className="text-2xl font-bold">{getDisplayName()}</h1>
                  <div className="flex items-center justify-center gap-2 text-muted-foreground mt-2">
                    {type === "student" || type === "alumni" ? (
                      <span className="capitalize">{type}</span>
                    ) : (
                      <span className="capitalize">{type}</span>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Right Column - Detailed Information */}
          <div className="lg:col-span-2 space-y-6">
            {/* Personal Information */}
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">Personal Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium">Full Name:</span>
                  <p>{data.fullName}</p>
                </div>
                {data.nickname && (
                  <div>
                    <span className="font-medium">Nickname:</span>
                    <p>{data.nickname}</p>
                  </div>
                )}
                {data.age && (
                  <div>
                    <span className="font-medium">Age:</span>
                    <p>{data.age}</p>
                  </div>
                )}
                {data.gender && (
                  <div>
                    <span className="font-medium">Gender:</span>
                    <p>{data.gender}</p>
                  </div>
                )}
                {data.birthday && (
                  <div>
                    <span className="font-medium">Birthday:</span>
                    <p>{new Date(data.birthday).toLocaleDateString()}</p>
                  </div>
                )}
                {data.address && (
                  <div>
                    <span className="font-medium">Address:</span>
                    <p>{data.address}</p>
                  </div>
                )}
                {data.email && (
                  <div>
                    <span className="font-medium">Email:</span>
                    <p>{data.email}</p>
                  </div>
                )}
                {data.phone && (
                  <div>
                    <span className="font-medium">Phone:</span>
                    <p>{data.phone}</p>
                  </div>
                )}
              </div>
            </Card>

            {/* Academic/Professional Information */}
            {(type === "student" || type === "alumni") && (
              <Card className="p-6">
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">Academic Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  {data.department && (
                    <div>
                      <span className="font-medium">Department:</span>
                      <p>{data.department}</p>
                    </div>
                  )}
                  {data.courseProgram && (
                    <div>
                      <span className="font-medium">Course/Program:</span>
                      <p>{data.courseProgram}</p>
                    </div>
                  )}
                  {data.courseProgram === "BSED" && data.major && (
                    <div>
                      <span className="font-medium">Major:</span>
                      <p>Major in: {data.major}</p>
                    </div>
                  )}
                  {type === "student" && data.yearLevel && (
                    <div>
                      <span className="font-medium">Year Level:</span>
                      <p>{data.yearLevel}</p>
                    </div>
                  )}
                  {type === "student" && data.blockSection && (
                    <div>
                      <span className="font-medium">Section/Block:</span>
                      <p>{data.blockSection}</p>
                    </div>
                  )}
                  {type === "alumni" && data.graduationYear && (
                    <div>
                      <span className="font-medium">Graduation Year:</span>
                      <p>{data.graduationYear}</p>
                    </div>
                  )}
                  {type === "student" && data.dreamJob && (
                    <div>
                      <span className="font-medium">Dream Job:</span>
                      <p>{data.dreamJob}</p>
                    </div>
                  )}
                </div>
              </Card>
            )}

            {/* Professional Information - Faculty & Staff */}
            {(type === "faculty" || type === "staff") && (
              <Card className="p-6">
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">Professional Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  {data.position && (
                    <div>
                      <span className="font-medium">Position:</span>
                      <p>{data.position}</p>
                    </div>
                  )}
                  {data.departmentAssigned && (
                    <div>
                      <span className="font-medium">Department:</span>
                      <p>{data.departmentAssigned}</p>
                    </div>
                  )}
                  {data.officeAssigned && (
                    <div>
                      <span className="font-medium">Office:</span>
                      <p>{data.officeAssigned}</p>
                    </div>
                  )}
                  {data.yearsOfService && (
                    <div>
                      <span className="font-medium">Years of Service:</span>
                      <p>{data.yearsOfService}</p>
                    </div>
                  )}
                </div>
                {data.messageToStudents && (
                  <div className="mt-4">
                    <span className="font-medium">Message to Students:</span>
                    <p className="mt-1 text-muted-foreground italic">"{data.messageToStudents}"</p>
                  </div>
                )}
              </Card>
            )}

            {/* Career Information - Alumni */}
            {type === "alumni" && (data.currentProfession || data.currentCompany || data.currentLocation) && (
              <Card className="p-6">
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">Career Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  {data.currentProfession && (
                    <div>
                      <span className="font-medium">Current Profession:</span>
                      <p>{data.currentProfession}</p>
                    </div>
                  )}
                  {data.currentCompany && (
                    <div>
                      <span className="font-medium">Company:</span>
                      <p>{data.currentCompany}</p>
                    </div>
                  )}
                  {data.currentLocation && (
                    <div>
                      <span className="font-medium">Location:</span>
                      <p>{data.currentLocation}</p>
                    </div>
                  )}
                </div>
              </Card>
            )}

            {/* Parents/Guardian Information - Students */}
            {type === "student" && (data.fatherGuardianName || data.motherGuardianName) && (
              <Card className="p-6">
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">Parents/Guardian Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  {data.fatherGuardianName && (
                    <div>
                      <span className="font-medium">Father's Name:</span>
                      <p>{data.fatherGuardianName}</p>
                    </div>
                  )}
                  {data.motherGuardianName && (
                    <div>
                      <span className="font-medium">Mother's Name:</span>
                      <p>{data.motherGuardianName}</p>
                    </div>
                  )}
                </div>
              </Card>
            )}

            {/* Yearbook Information */}
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">Yearbook Information</h2>
              {getMainMotto() && (
                <div className="mb-4">
                  <span className="font-medium">{type === "faculty" ? "Teaching Philosophy:" : "Motto/Saying:"}</span>
                  <p className="mt-1 text-lg italic text-center p-4 bg-muted rounded-lg">"{getMainMotto()}"</p>
                </div>
              )}

              {data.achievements && data.achievements.length > 0 && (
                <div className="mb-4">
                  <span className="font-medium">Achievements/Honors:</span>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {data.achievements.map((achievement, index) => (
                      <Badge key={index} variant="secondary">
                        {achievement}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {data.activities && data.activities.length > 0 && (
                <div>
                  <span className="font-medium">Activities & Organizations:</span>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {data.activities.map((activity, index) => (
                      <Badge key={index} variant="outline">
                        {activity}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </Card>
          </div>
        </div>
      </div>
    )
  }

  return (
    <Card className="group hover:shadow-lg transition-all duration-300 overflow-hidden">
      <CardContent className="p-0">
        <div className="relative">
          {/* Profile Photo */}
          <div className="aspect-square relative overflow-hidden">
            {data.profilePictureUrl ? (
              <Image
                src={data.profilePictureUrl || "/placeholder.svg"}
                alt={data.fullName}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 text-gray-400">
                <User className="h-16 w-16" />
              </div>
            )}
          </div>

          {/* Content - Only showing required fields */}
          <div className="p-4 space-y-3">
            {/* Full Name with Nickname */}
            <div className="text-center">
              <h3 className="font-semibold text-lg leading-tight">{data.fullName}</h3>
              {data.nickname && <p className="text-sm text-muted-foreground italic">"{data.nickname}"</p>}
            </div>

            {/* Motto/Saying - Only show if exists */}
            {getMainMotto() && (
              <div className="text-center">
                <p className="text-sm italic text-muted-foreground line-clamp-2">"{getMainMotto()}"</p>
              </div>
            )}

            {/* View Profile Button */}
            <div className="pt-2">
              <Button
                variant="outline"
                size="sm"
                className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors bg-transparent"
                asChild
              >
                <Link href={`/profiles/${id}`}>
                  <ExternalLink className="h-3 w-3 mr-2" />
                  View Profile
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
