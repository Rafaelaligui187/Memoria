"use client"

import { ArrowLeft, Briefcase, GraduationCap, Award, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { type Person, type Student, type Faculty, type Alumni, type Staff, roleFieldConfig } from "@/types/yearbook"
import Link from "next/link"

interface PersonProfileProps {
  person: Person
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

    if (field === "quote" || field === "messageToStudents" || field === "legacy" || field === "advice") {
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
                  src={person.image || "/placeholder.svg"}
                  alt={person.name}
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

              <h1 className="text-3xl font-bold text-gray-900 mb-4">{person.name}</h1>

              {/* Role-specific header info */}
              {person.role === "faculty" && (
                <div className="space-y-2 text-gray-600">
                  <p className="text-lg">{(person as Faculty).position}</p>
                  <p>{(person as Faculty).department}</p>
                </div>
              )}

              {person.role === "alumni" && (
                <div className="space-y-2 text-gray-600">
                  <p className="text-lg">Class of {(person as Alumni).graduationYear}</p>
                  {(person as Alumni).work && <p>{(person as Alumni).work}</p>}
                  {(person as Alumni).company && <p>{(person as Alumni).company}</p>}
                </div>
              )}

              {(person.role === "staff" || person.role === "utility") && (
                <div className="space-y-2 text-gray-600">
                  <p className="text-lg">{(person as Staff).position}</p>
                  <p>{(person as Staff).department}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
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
