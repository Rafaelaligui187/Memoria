"use client"

import Link from "next/link"
import { ArrowLeft, Calendar, User, Users, BookOpen, GraduationCap, Briefcase, Award } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import type { Person, Student, Faculty, Alumni, Staff, Activity, UserRole } from "@/types/yearbook"

interface ClassYearbookPageProps {
  departmentType: "elementary" | "junior-high" | "senior-high" | "college"
  departmentName: string
  sectionName: string
  academicYear: string
  people: Person[]
  activities?: Activity[]
  backLink: string
  profileBasePath: string
  courseId?: string
  yearId?: string
  blockId?: string
  schoolYear?: string
}

const getDepartmentColors = (departmentType: string) => {
  switch (departmentType) {
    case "elementary":
      return {
        primary: "from-sky-500 to-blue-600",
        secondary: "bg-sky-100 text-sky-600",
        accent: "text-sky-600",
        border: "border-sky-200",
        hover: "hover:bg-sky-50",
        badge: "bg-sky-600",
      }
    case "junior-high":
      return {
        primary: "from-emerald-500 to-green-600",
        secondary: "bg-emerald-100 text-emerald-600",
        accent: "text-emerald-600",
        border: "border-emerald-200",
        hover: "hover:bg-emerald-50",
        badge: "bg-emerald-600",
      }
    case "senior-high":
      return {
        primary: "from-amber-500 to-yellow-600",
        secondary: "bg-amber-100 text-amber-600",
        accent: "text-amber-600",
        border: "border-amber-200",
        hover: "hover:bg-amber-50",
        badge: "bg-amber-600",
      }
    case "college":
      return {
        primary: "from-purple-500 to-purple-600",
        secondary: "bg-purple-100 text-purple-600",
        accent: "text-purple-600",
        border: "border-purple-200",
        hover: "hover:bg-purple-50",
        badge: "bg-purple-600",
      }
    default:
      return {
        primary: "from-gray-500 to-gray-600",
        secondary: "bg-gray-100 text-gray-600",
        accent: "text-gray-600",
        border: "border-gray-200",
        hover: "hover:bg-gray-50",
        badge: "bg-gray-600",
      }
  }
}

const getDepartmentBackText = (departmentType: string) => {
  switch (departmentType) {
    case "elementary":
      return "Back to Elementary Department"
    case "junior-high":
      return "Back to Junior High Department"
    case "senior-high":
      return "Back to Senior High Department"
    case "college":
      return "Back to College Department"
    default:
      return "Back"
  }
}

const getRoleIcon = (role: UserRole) => {
  switch (role) {
    case "student":
      return <GraduationCap className="h-5 w-5" />
    case "faculty":
      return <User className="h-5 w-5" />
    case "alumni":
      return <Award className="h-5 w-5" />
    case "staff":
    case "utility":
      return <Briefcase className="h-5 w-5" />
  }
}

const getRoleTitle = (role: UserRole) => {
  switch (role) {
    case "student":
      return "Students"
    case "faculty":
      return "Faculty"
    case "alumni":
      return "Alumni"
    case "staff":
      return "Staff"
    case "utility":
      return "Utility Personnel"
  }
}

const getRoleBadgeColor = (role: UserRole) => {
  switch (role) {
    case "student":
      return "bg-blue-600"
    case "faculty":
      return "bg-green-600"
    case "alumni":
      return "bg-purple-600"
    case "staff":
      return "bg-orange-600"
    case "utility":
      return "bg-gray-600"
  }
}

export function ClassYearbookPage({
  departmentType,
  departmentName,
  sectionName,
  academicYear,
  people,
  activities = [],
  backLink,
  profileBasePath,
  courseId,
  yearId,
  blockId,
  schoolYear,
}: ClassYearbookPageProps) {
  const colors = getDepartmentColors(departmentType)
  const backText = getDepartmentBackText(departmentType)

  const groupedPeople = (people || []).reduce(
    (acc, person) => {
      if (!acc[person.role]) {
        acc[person.role] = []
      }
      acc[person.role].push(person)
      return acc
    },
    {} as Record<UserRole, Person[]>,
  )

  const officers = (groupedPeople.student as Student[])?.filter((student) => student.officerRole) || []
  const regularStudents = (groupedPeople.student as Student[])?.filter((student) => !student.officerRole) || []

  const getPersonLink = (personId: string) => {
    return `${profileBasePath}/${personId}`
  }

  const renderPersonCard = (person: Person, showRole = false) => (
    <Link key={person.id} href={getPersonLink(person.id)} className="block">
      <div
        className={`bg-white border ${colors.border} rounded-lg p-4 hover:shadow-lg transition-shadow cursor-pointer`}
      >
        {/* Role Badge */}
        {showRole && (
          <div className="mb-3">
            <Badge className={`${getRoleBadgeColor(person.role)} text-white hover:opacity-90 text-xs`}>
              {getRoleTitle(person.role)}
            </Badge>
          </div>
        )}

        {/* Officer Position Badge */}
        {person.role === "student" && (person as Student).officerRole && (
          <div className="mb-3">
            <Badge className={`${colors.badge} text-white hover:opacity-90`}>{(person as Student).officerRole}</Badge>
          </div>
        )}

        {/* Image */}
        <div className="bg-gray-200 rounded-lg aspect-[3/4] overflow-hidden mb-4">
          <img src={person.image || "/placeholder.svg"} alt={person.name} className="object-cover w-full h-full" />
        </div>

        {/* Name */}
        <h3 className={`font-medium ${colors.accent} mb-2 hover:opacity-80`}>{person.name}</h3>

        {/* Role-specific content */}
        {person.role === "student" && (
          <>
            {(person as Student).honors && (
              <div className="mb-2">
                <Badge variant="secondary" className="text-xs bg-red-100 text-red-800">
                  {(person as Student).honors}
                </Badge>
              </div>
            )}
            {(person as Student).quote && (
              <p className="text-sm text-gray-600 italic line-clamp-3">"{(person as Student).quote}"</p>
            )}
          </>
        )}

        {person.role === "faculty" && (
          <>
            <p className="text-sm text-gray-600 mb-1">{(person as Faculty).position}</p>
            <p className="text-xs text-gray-500">{(person as Faculty).department}</p>
            {(person as Faculty).yearsOfService && (
              <p className="text-xs text-gray-500 mt-1">{(person as Faculty).yearsOfService} years of service</p>
            )}
          </>
        )}

        {person.role === "alumni" && (
          <>
            {(person as Alumni).graduationYear && (
              <div className="mb-2">
                <Badge variant="secondary" className="text-xs bg-purple-100 text-purple-800">
                  Class of {(person as Alumni).graduationYear}
                </Badge>
              </div>
            )}
            {(person as Alumni).work && <p className="text-sm text-gray-600 mb-1">{(person as Alumni).work}</p>}
            {(person as Alumni).company && <p className="text-xs text-gray-500">{(person as Alumni).company}</p>}
            {(person as Alumni).quote && (
              <p className="text-sm text-gray-600 italic line-clamp-2 mt-2">"{(person as Alumni).quote}"</p>
            )}
          </>
        )}

        {(person.role === "staff" || person.role === "utility") && (
          <>
            <p className="text-sm text-gray-600 mb-1">{(person as Staff).position}</p>
            <p className="text-xs text-gray-500">{(person as Staff).department}</p>
            {(person as Staff).yearsOfService && (
              <p className="text-xs text-gray-500 mt-1">{(person as Staff).yearsOfService} years of service</p>
            )}
          </>
        )}
      </div>
    </Link>
  )

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className={`bg-gradient-to-r ${colors.primary} text-white`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {/* Back Button */}
          <Button variant="ghost" className="text-white hover:bg-white/20 mb-4" asChild>
            <Link href={backLink}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to School Year Selection
            </Link>
          </Button>

          {/* Title */}
          <h1 className="text-3xl md:text-4xl font-bold mb-4">{sectionName}</h1>

          {/* Academic Year */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 text-white/90">
            <div className="flex items-center">
              <Calendar className="mr-2 h-4 w-4" />
              <span>{academicYear}</span>
            </div>
            {schoolYear && (
              <div className="flex items-center">
                <BookOpen className="mr-2 h-4 w-4" />
                <span>School Year: {schoolYear.replace("-", "–")}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Class Officers Section */}
        {officers.length > 0 && (
          <div className="mb-12">
            <div className="flex items-center mb-6">
              <div className={`w-1 h-8 ${colors.badge} rounded-full mr-4`}></div>
              <h2 className={`text-2xl font-bold ${colors.accent} flex items-center`}>
                <Users className="mr-2 h-6 w-6" />
                Class Officers
              </h2>
            </div>
            <div className="bg-gradient-to-r from-gray-50 to-white p-6 rounded-xl border border-gray-100">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {officers.map((officer) => renderPersonCard(officer))}
              </div>
            </div>
          </div>
        )}

        {/* Role-based Sections */}
        {Object.entries(groupedPeople).map(([role, peopleInRole]) => {
          // Skip students if we're showing them separately
          if (role === "student") {
            if (regularStudents.length === 0) return null
            peopleInRole = regularStudents
          }

          return (
            <div key={role} className="mb-12">
              <div className="flex items-center mb-6">
                <div className={`w-1 h-8 ${getRoleBadgeColor(role as UserRole)} rounded-full mr-4`}></div>
                <h2 className={`text-2xl font-bold ${colors.accent} flex items-center`}>
                  {getRoleIcon(role as UserRole)}
                  <span className="ml-2">{getRoleTitle(role as UserRole)}</span>
                  <span className="ml-2 text-lg font-normal text-gray-500">({peopleInRole.length})</span>
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
                {peopleInRole.map((person) => renderPersonCard(person))}
              </div>
            </div>
          )
        })}

        {/* Activities Section */}
        {activities.length > 0 && (
          <div className="mb-8">
            <div className="flex items-center mb-6">
              <div className={`w-1 h-8 ${colors.badge} rounded-full mr-4`}></div>
              <h2 className={`text-2xl font-bold ${colors.accent} flex items-center`}>
                <BookOpen className="mr-2 h-6 w-6" />
                Activities & Events
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {activities.map((activity) => (
                <div
                  key={activity.id}
                  className={`bg-white border ${colors.border} rounded-lg p-4 hover:shadow-lg transition-shadow`}
                >
                  <div className="bg-gray-200 rounded-lg aspect-video overflow-hidden mb-4">
                    <img
                      src={activity.image || "/placeholder.svg"}
                      alt={activity.title}
                      className="object-cover w-full h-full"
                    />
                  </div>
                  <h3 className={`font-medium ${colors.accent} mb-2`}>{activity.title}</h3>
                  <p className="text-sm text-gray-600 mb-2">{activity.description}</p>
                  <p className="text-xs text-gray-500">{activity.date}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
