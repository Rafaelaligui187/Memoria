"use client"

import Link from "next/link"
import { ArrowLeft, User, Users, BookOpen, GraduationCap, Briefcase, Award, Quote } from "lucide-react"
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
  motto?: string
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
        primary: "from-blue-600 to-cyan-600",
        secondary: "bg-blue-100 text-blue-600",
        accent: "text-blue-600",
        border: "border-blue-200",
        hover: "hover:bg-blue-50",
        badge: "bg-blue-600",
      }
    case "junior-high":
      return {
        primary: "from-emerald-600 to-green-700", // 🔥 deeper gradient
        secondary: "bg-emerald-100 text-emerald-700",
        accent: "text-emerald-700",
        border: "border-emerald-200",
        hover: "hover:bg-emerald-50",
        badge: "bg-emerald-700",
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
      return "Back to Year Levels & Sections"
    case "junior-high":
      return "Back to Year Levels & Sections"
    case "senior-high":
      return "Back to Year Levels & Sections"
    case "college":
      return "Back to Year Levels & Blocks"
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

const getCollegeOfficerOrder = () => [
  "Mayor",
  "Vice Mayor",
  "Secretary",
  "Assistant Secretary",
  "Treasurer",
  "Assistant Treasurer",
  "Auditor",
  "PIO",
  "PIO", // Second PIO slot
]

const getSchoolOfficerOrder = () => [
  "President",
  "Vice President",
  "Secretary",
  "Treasurer",
  "Auditor",
  "PRO", // Public Relations Officer
  "Muse",
  "Escort",
]

const sortOfficersByRole = (officers: Student[], departmentType: string) => {
  const orderArray = departmentType === "college" ? getCollegeOfficerOrder() : getSchoolOfficerOrder()

  // Create a map for quick lookup of role positions
  const roleOrder = new Map()
  orderArray.forEach((role, index) => {
    if (!roleOrder.has(role)) {
      roleOrder.set(role, [])
    }
    roleOrder.get(role).push(index)
  })

  // Sort officers by their role order
  return officers.sort((a, b) => {
    const aRole = a.officerRole || ""
    const bRole = b.officerRole || ""

    const aPositions = roleOrder.get(aRole) || [999]
    const bPositions = roleOrder.get(bRole) || [999]

    // Use the first available position for each role
    const aOrder = aPositions[0]
    const bOrder = bPositions[0]

    // If same role (like PIO), maintain original order
    if (aOrder === bOrder) {
      return 0
    }

    return aOrder - bOrder
  })
}

export function ClassYearbookPage({
  departmentType,
  departmentName,
  sectionName,
  academicYear,
  people,
  activities = [],
  motto,
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

  const unsortedOfficers = (groupedPeople.student as Student[])?.filter((student) => student.officerRole) || []
  const officers = sortOfficersByRole(unsortedOfficers, departmentType)
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
          {person.image && person.image !== '/placeholder.svg' ? (
            <img 
              src={person.image} 
              alt={person.name} 
              className="object-cover w-full h-full"
              onError={(e) => {
                console.log(`[Yearbook] Failed to load image for ${person.name}:`, person.image)
                e.currentTarget.src = '/placeholder.svg'
              }}
              onLoad={() => {
                console.log(`[Yearbook] Successfully loaded image for ${person.name}:`, person.image)
              }}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 text-gray-400">
              <User className="h-12 w-12" />
            </div>
          )}
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
              {getDepartmentBackText(departmentType)}
            </Link>
          </Button>

          {/* Title */}
          <h1 className="text-3xl md:text-4xl font-bold mb-4">{sectionName}</h1>

          {/* School Year */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 text-white/90">
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

        <div className="mb-8">
          <div className="flex items-center mb-6">
            <div className={`w-1 h-8 ${colors.badge} rounded-full mr-4`}></div>
            <h2 className={`text-2xl font-bold ${colors.accent} flex items-center`}>
              <Quote className="mr-2 h-6 w-6" />
              Class Motto
            </h2>
          </div>
          <div className={`bg-gradient-to-r from-gray-50 to-white p-8 rounded-xl border ${colors.border}`}>
            <div className="text-center">
              {motto ? (
                <blockquote className={`text-xl md:text-2xl font-medium ${colors.accent} italic leading-relaxed`}>
                  "{motto}"
                </blockquote>
              ) : (
                <p className="text-lg text-gray-500 italic">No class motto available.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
