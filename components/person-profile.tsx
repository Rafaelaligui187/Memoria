"use client"

import {
  ArrowLeft,
  Briefcase,
  GraduationCap,
  Award,
  Users,
  User,
  Heart,
  MapPin,
  Share2,
  Cake,
  Phone,
  Mail,
  Calendar,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { type Person, type Student, type Faculty, type Alumni, type Staff, roleFieldConfig } from "@/types/yearbook"
import Link from "next/link"

interface PersonProfileProps {
  person: Person & {
    // Basic Info (all roles)
    fullName?: string
    nickname?: string
    age?: number
    gender?: string
    birthday?: string
    address?: string
    email?: string
    phone?: string

    // Student & Alumni specific
    fatherGuardianName?: string
    motherGuardianName?: string
    department?: string
    yearLevel?: string
    courseProgram?: string
    blockSection?: string
    dreamJob?: string
    graduationYear?: string

    // Faculty specific
    position?: string
    departmentAssigned?: string
    yearsOfService?: number
    messageToStudents?: string

    // Staff specific
    officeAssigned?: string

    // Alumni career specific
    currentProfession?: string
    currentCompany?: string
    currentLocation?: string

    // Social Media (all roles)
    socialMediaFacebook?: string
    socialMediaInstagram?: string
    socialMediaTwitter?: string

    // Yearbook Info (all roles)
    sayingMotto?: string
    profilePictureUrl?: string
    achievements?: string[]
  }
  backLink: string
  backText: string
}

export function PersonProfile({ person, backLink, backText }: PersonProfileProps) {
  const config = roleFieldConfig[person.role]

  const renderFieldValue = (field: string, value: any) => {
    if (!value) return null

    if (Array.isArray(value)) {
      return (
        <div className="flex flex-wrap gap-2">
          {value.map((item, index) => (
            <Badge key={index} variant="secondary" className="text-xs">
              {item}
            </Badge>
          ))}
        </div>
      )
    }

    if (
      field === "quote" ||
      field === "messageToStudents" ||
      field === "legacy" ||
      field === "advice" ||
      field === "sayingMotto"
    ) {
      return <p className="text-gray-700 italic">"{value}"</p>
    }

    return <p className="text-gray-700">{value}</p>
  }

  const getFieldLabel = (field: string) => {
    const labels: Record<string, string> = {
      quote: "Quote",
      ambition: "Ambition",
      hobbies: "Hobbies",
      honors: "Honors",
      activities: "Activities",
      officerRole: "Officer Position",
      department: "Department",
      position: "Position",
      yearsOfService: "Years of Service",
      legacy: "Legacy",
      messageToStudents: "Message to Students",
      achievements: "Achievements",
      graduationYear: "Graduation Year",
      work: "Current Work",
      company: "Company",
      location: "Location",
      advice: "Advice",
      contribution: "Contribution",
      fullName: "Full Name",
      nickname: "Nickname",
      age: "Age",
      gender: "Gender",
      birthday: "Birthday",
      address: "Address",
      email: "Email",
      phone: "Phone",
      fatherGuardianName: "Father's Name",
      motherGuardianName: "Mother's Name",
      yearLevel: "Year Level",
      courseProgram: "Course/Program",
      blockSection: "Block/Section",
      dreamJob: "Dream Job",
      departmentAssigned: "Department Assigned",
      officeAssigned: "Office Assigned",
      currentProfession: "Current Profession",
      currentCompany: "Current Company",
      currentLocation: "Current Location",
      socialMediaFacebook: "Facebook",
      socialMediaInstagram: "Instagram",
      socialMediaTwitter: "Twitter/X",
      sayingMotto: "Motto/Saying",
    }
    return labels[field] || field
  }

  const getRoleIcon = () => {
    switch (person.role) {
      case "student":
        return <GraduationCap className="h-5 w-5" />
      case "faculty":
        return <Users className="h-5 w-5" />
      case "alumni":
        return <Award className="h-5 w-5" />
      case "staff":
      case "utility":
        return <Briefcase className="h-5 w-5" />
    }
  }

  const getRoleTitle = () => {
    switch (person.role) {
      case "student":
        return "Student"
      case "faculty":
        return "Faculty Member"
      case "alumni":
        return "Alumni"
      case "staff":
        return "Staff Member"
      case "utility":
        return "Utility Personnel"
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Button variant="ghost" className="mb-4" asChild>
            <Link href={backLink}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              {backText}
            </Link>
          </Button>

          <div className="flex flex-col md:flex-row gap-6">
            {/* Profile Image */}
            <div className="flex-shrink-0">
              <div className="w-48 h-64 bg-gray-200 rounded-lg overflow-hidden">
                <img
                  src={person.profilePictureUrl || person.image || "/placeholder.svg"}
                  alt={person.fullName || person.name}
                  className="object-cover w-full h-full"
                />
              </div>
            </div>

            {/* Basic Info */}
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                {getRoleIcon()}
                <Badge variant="secondary" className="text-sm">
                  {getRoleTitle()}
                </Badge>
                {person.role === "student" && (person as Student).officerRole && (
                  <Badge className="bg-blue-600 text-white">{(person as Student).officerRole}</Badge>
                )}
              </div>

              <h1 className="text-3xl font-bold text-gray-900 mb-2">{person.fullName || person.name}</h1>
              {person.nickname && <p className="text-xl text-gray-600 italic mb-4">"{person.nickname}"</p>}

              {/* Role-specific header info */}
              {person.role === "faculty" && (
                <div className="space-y-2 text-gray-600">
                  <p className="text-lg">{person.position || (person as Faculty).position}</p>
                  <p>{person.departmentAssigned || (person as Faculty).department}</p>
                  {person.yearsOfService && <p>{person.yearsOfService} years of service</p>}
                </div>
              )}

              {person.role === "alumni" && (
                <div className="space-y-2 text-gray-600">
                  <p className="text-lg">Class of {person.graduationYear || (person as Alumni).graduationYear}</p>
                  {(person.currentProfession || (person as Alumni).work) && (
                    <p>{person.currentProfession || (person as Alumni).work}</p>
                  )}
                  {(person.currentCompany || (person as Alumni).company) && (
                    <p>{person.currentCompany || (person as Alumni).company}</p>
                  )}
                </div>
              )}

              {(person.role === "staff" || person.role === "utility") && (
                <div className="space-y-2 text-gray-600">
                  <p className="text-lg">{person.position || (person as Staff).position}</p>
                  <p>{person.officeAssigned || (person as Staff).department}</p>
                  {person.yearsOfService && <p>{person.yearsOfService} years of service</p>}
                </div>
              )}

              <div className="flex flex-wrap gap-4 mt-4 text-sm text-gray-600">
                {person.age && (
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    <span>Age {person.age}</span>
                  </div>
                )}
                {person.email && (
                  <div className="flex items-center gap-1">
                    <Mail className="h-4 w-4" />
                    <span>{person.email}</span>
                  </div>
                )}
                {person.phone && (
                  <div className="flex items-center gap-1">
                    <Phone className="h-4 w-4" />
                    <span>{person.phone}</span>
                  </div>
                )}
              </div>

              {(person.sayingMotto || person.quote) && (
                <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <p className="text-blue-800 font-medium italic text-lg">"{person.sayingMotto || person.quote}"</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card className="h-fit">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <User className="h-5 w-5 text-gray-600" />
                Basic Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {person.gender && (
                <div>
                  <h4 className="font-medium text-gray-900 mb-1">Gender</h4>
                  <p className="text-gray-700">{person.gender}</p>
                </div>
              )}
              {person.birthday && (
                <div>
                  <h4 className="font-medium text-gray-900 mb-1 flex items-center gap-1">
                    <Cake className="h-4 w-4" />
                    Birthday
                  </h4>
                  <p className="text-gray-700">{new Date(person.birthday).toLocaleDateString()}</p>
                </div>
              )}
              {person.address && (
                <div>
                  <h4 className="font-medium text-gray-900 mb-1 flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    Address
                  </h4>
                  <p className="text-gray-700">{person.address}</p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="h-fit">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                {person.role === "student" || person.role === "alumni" ? (
                  <GraduationCap className="h-5 w-5 text-blue-600" />
                ) : (
                  <Briefcase className="h-5 w-5 text-blue-600" />
                )}
                {person.role === "student" || person.role === "alumni"
                  ? "Academic Information"
                  : "Professional Information"}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Student & Alumni Academic Info */}
              {(person.role === "student" || person.role === "alumni") && (
                <>
                  {person.department && (
                    <div>
                      <h4 className="font-medium text-gray-900 mb-1">Department</h4>
                      <p className="text-gray-700">{person.department}</p>
                    </div>
                  )}
                  {person.courseProgram && (
                    <div>
                      <h4 className="font-medium text-gray-900 mb-1">Course/Program</h4>
                      <p className="text-gray-700">{person.courseProgram}</p>
                    </div>
                  )}
                  {person.yearLevel && (
                    <div>
                      <h4 className="font-medium text-gray-900 mb-1">Year Level</h4>
                      <p className="text-gray-700">{person.yearLevel}</p>
                    </div>
                  )}
                  {person.blockSection && (
                    <div>
                      <h4 className="font-medium text-gray-900 mb-1">Block/Section</h4>
                      <p className="text-gray-700">{person.blockSection}</p>
                    </div>
                  )}
                  {person.role === "alumni" && person.graduationYear && (
                    <div>
                      <h4 className="font-medium text-gray-900 mb-1">Graduation Year</h4>
                      <p className="text-gray-700">{person.graduationYear}</p>
                    </div>
                  )}
                </>
              )}

              {/* Faculty Professional Info */}
              {person.role === "faculty" && (
                <>
                  {person.position && (
                    <div>
                      <h4 className="font-medium text-gray-900 mb-1">Position</h4>
                      <p className="text-gray-700">{person.position}</p>
                    </div>
                  )}
                  {person.departmentAssigned && (
                    <div>
                      <h4 className="font-medium text-gray-900 mb-1">Department Assigned</h4>
                      <p className="text-gray-700">{person.departmentAssigned}</p>
                    </div>
                  )}
                  {person.yearsOfService && (
                    <div>
                      <h4 className="font-medium text-gray-900 mb-1">Years of Service</h4>
                      <p className="text-gray-700">{person.yearsOfService}</p>
                    </div>
                  )}
                </>
              )}

              {/* Staff Professional Info */}
              {(person.role === "staff" || person.role === "utility") && (
                <>
                  {person.position && (
                    <div>
                      <h4 className="font-medium text-gray-900 mb-1">Position</h4>
                      <p className="text-gray-700">{person.position}</p>
                    </div>
                  )}
                  {person.officeAssigned && (
                    <div>
                      <h4 className="font-medium text-gray-900 mb-1">Office Assigned</h4>
                      <p className="text-gray-700">{person.officeAssigned}</p>
                    </div>
                  )}
                  {person.yearsOfService && (
                    <div>
                      <h4 className="font-medium text-gray-900 mb-1">Years of Service</h4>
                      <p className="text-gray-700">{person.yearsOfService}</p>
                    </div>
                  )}
                </>
              )}
            </CardContent>
          </Card>

          {person.role === "student" && (person.fatherGuardianName || person.motherGuardianName) && (
            <Card className="h-fit">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Users className="h-5 w-5 text-green-600" />
                  Parents/Guardian Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {person.fatherGuardianName && (
                  <div>
                    <h4 className="font-medium text-gray-900 mb-1">Father's Name</h4>
                    <p className="text-gray-700">{person.fatherGuardianName}</p>
                  </div>
                )}
                {person.motherGuardianName && (
                  <div>
                    <h4 className="font-medium text-gray-900 mb-1">Mother's Name</h4>
                    <p className="text-gray-700">{person.motherGuardianName}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {person.role === "alumni" &&
            (person.currentProfession || person.currentCompany || person.currentLocation) && (
              <Card className="h-fit">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Briefcase className="h-5 w-5 text-purple-600" />
                    Career Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {person.currentProfession && (
                    <div>
                      <h4 className="font-medium text-gray-900 mb-1">Current Profession</h4>
                      <p className="text-gray-700">{person.currentProfession}</p>
                    </div>
                  )}
                  {person.currentCompany && (
                    <div>
                      <h4 className="font-medium text-gray-900 mb-1">Company</h4>
                      <p className="text-gray-700">{person.currentCompany}</p>
                    </div>
                  )}
                  {person.currentLocation && (
                    <div>
                      <h4 className="font-medium text-gray-900 mb-1">Location</h4>
                      <p className="text-gray-700">{person.currentLocation}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

          {person.role === "student" && person.dreamJob && (
            <Card className="h-fit">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Heart className="h-5 w-5 text-orange-600" />
                  Dreams & Aspirations
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-medium text-gray-900 mb-1">Dream Job</h4>
                  <p className="text-gray-700">{person.dreamJob}</p>
                </div>
              </CardContent>
            </Card>
          )}

          {person.role === "faculty" && person.messageToStudents && (
            <Card className="h-fit">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Heart className="h-5 w-5 text-blue-600" />
                  Message to Students
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 italic">"{person.messageToStudents}"</p>
              </CardContent>
            </Card>
          )}

          {(person.socialMediaFacebook || person.socialMediaInstagram || person.socialMediaTwitter) && (
            <Card className="h-fit">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Share2 className="h-5 w-5 text-purple-600" />
                  Social Media
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {person.socialMediaFacebook && (
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-blue-600">Facebook:</span>
                    <span className="text-gray-700">{person.socialMediaFacebook}</span>
                  </div>
                )}
                {person.socialMediaInstagram && (
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-pink-600">Instagram:</span>
                    <span className="text-gray-700">{person.socialMediaInstagram}</span>
                  </div>
                )}
                {person.socialMediaTwitter && (
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-gray-600">Twitter/X:</span>
                    <span className="text-gray-700">{person.socialMediaTwitter}</span>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Existing role-based sections from original config */}
          {config.sections.map((section, index) => {
            // Check section condition if exists
            if (section.condition && !section.condition(person)) {
              return null
            }

            const hasContent = section.fields.some((field) => (person as any)[field])
            if (!hasContent) return null

            return (
              <Card key={index} className="h-fit">
                <CardHeader>
                  <CardTitle className="text-lg">{section.title}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {section.fields.map((field) => {
                    const value = (person as any)[field]
                    if (!value) return null

                    return (
                      <div key={field}>
                        <h4 className="font-medium text-gray-900 mb-2">{getFieldLabel(field)}</h4>
                        {renderFieldValue(field, value)}
                      </div>
                    )
                  })}
                </CardContent>
              </Card>
            )
          })}

          {person.achievements && person.achievements.length > 0 && (
            <Card className="h-fit">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Award className="h-5 w-5 text-yellow-600" />
                  Achievements & Honors
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {person.achievements.map((achievement, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <Award className="h-4 w-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">{achievement}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Gallery */}
        {person.gallery && person.gallery.length > 0 && (
          <Card className="mt-8">
            <CardHeader>
              <CardTitle className="text-lg">Gallery</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {person.gallery.map((image, index) => (
                  <div key={index} className="aspect-square bg-gray-200 rounded-lg overflow-hidden">
                    <img
                      src={image || "/placeholder.svg"}
                      alt={`Gallery image ${index + 1}`}
                      className="object-cover w-full h-full"
                    />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
