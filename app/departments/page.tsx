import { Header } from "@/components/header"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { GraduationCap, Users, BookOpen, Award } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

const departments = [
  {
    id: "elementary",
    name: "Elementary Department",
    description:
      "Building strong foundations for lifelong learning through engaging and nurturing educational experiences for young minds.",
    image: "/placeholder.svg?height=300&width=400",
    color: "from-sky-500 to-blue-500",
    bgColor: "bg-sky-50",
    textColor: "text-sky-600",
    borderColor: "border-sky-200",
    students: "450+ Students",
    grades: "Grades 1-6",
    href: "/departments/elementary",
    features: ["Interactive Learning", "Character Development", "Creative Arts", "Basic Sciences"],
  },
  {
    id: "junior-high",
    name: "Junior High Department",
    description:
      "Guiding students through their formative years with comprehensive education that prepares them for senior high school.",
    image: "/placeholder.svg?height=300&width=400",
    color: "from-emerald-500 to-green-500",
    bgColor: "bg-emerald-50",
    textColor: "text-emerald-600",
    borderColor: "border-emerald-200",
    students: "320+ Students",
    grades: "Grades 7-10",
    href: "/departments/junior-high",
    features: ["Core Subjects", "Research Skills", "Leadership Training", "Sports Programs"],
  },
  {
    id: "senior-high",
    name: "Senior High Department",
    description:
      "Preparing students for higher education and careers through specialized tracks and advanced learning opportunities.",
    image: "/placeholder.svg?height=300&width=400",
    color: "from-amber-500 to-yellow-500",
    bgColor: "bg-amber-50",
    textColor: "text-amber-600",
    borderColor: "border-amber-200",
    students: "280+ Students",
    grades: "Grades 11-12",
    href: "/departments/senior-high",
    features: ["STEM Track", "ABM Track", "HUMSS Track", "Arts & Design"],
  },
  {
    id: "college",
    name: "College Department",
    description:
      "Excellence in higher education with comprehensive programs that develop professional competence and leadership skills.",
    image: "/placeholder.svg?height=300&width=400",
    color: "from-purple-500 to-indigo-500",
    bgColor: "bg-purple-50",
    textColor: "text-purple-600",
    borderColor: "border-purple-200",
    students: "500+ Students",
    grades: "Undergraduate",
    href: "/departments/college",
    features: ["Business Programs", "Computer Science", "Education", "Liberal Arts"],
  },
]

const stats = [
  {
    icon: Users,
    number: "1,550+",
    label: "Total Students",
    color: "text-blue-600",
  },
  {
    icon: GraduationCap,
    number: "150+",
    label: "Faculty Members",
    color: "text-green-600",
  },
  {
    icon: BookOpen,
    number: "50+",
    label: "Programs Offered",
    color: "text-amber-600",
  },
  {
    icon: Award,
    number: "40",
    label: "Years of Excellence",
    color: "text-purple-600",
  },
]

export default function DepartmentsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full mb-4">
            <GraduationCap className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Our Departments</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Discover our comprehensive educational programs designed to nurture students from elementary through
            college, fostering academic excellence and personal growth.
          </p>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {stats.map((stat, index) => (
            <Card key={index} className="text-center hover:shadow-lg transition-shadow duration-300">
              <CardContent className="p-6">
                <div
                  className={`inline-flex items-center justify-center w-12 h-12 rounded-lg mb-4 ${stat.color} bg-opacity-10`}
                >
                  <stat.icon className={`h-6 w-6 ${stat.color}`} />
                </div>
                <div className={`text-3xl font-bold mb-2 ${stat.color}`}>{stat.number}</div>
                <div className="text-gray-600 font-medium">{stat.label}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Department Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          {departments.map((dept) => (
            <Card
              key={dept.id}
              className={`group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 ${dept.borderColor}`}
            >
              <CardContent className="p-0">
                <div className="relative overflow-hidden">
                  <Image
                    src={dept.image || "/placeholder.svg"}
                    alt={dept.name}
                    width={400}
                    height={300}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div
                    className={`absolute inset-0 bg-gradient-to-t ${dept.color} opacity-20 group-hover:opacity-30 transition-opacity duration-300`}
                  ></div>
                  <div
                    className={`absolute top-4 left-4 px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-sm font-medium ${dept.textColor}`}
                  >
                    {dept.grades}
                  </div>
                </div>

                <div className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div
                      className={`w-10 h-10 bg-gradient-to-r ${dept.color} rounded-lg flex items-center justify-center`}
                    >
                      <GraduationCap className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 group-hover:text-purple-600 transition-colors">
                        {dept.name}
                      </h3>
                      <p className={`text-sm font-medium ${dept.textColor}`}>{dept.students}</p>
                    </div>
                  </div>

                  <p className="text-gray-600 mb-6 leading-relaxed">{dept.description}</p>

                  <div className="mb-6">
                    <h4 className="font-semibold text-gray-900 mb-3">Key Features:</h4>
                    <div className="grid grid-cols-2 gap-2">
                      {dept.features.map((feature, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${dept.color}`}></div>
                          <span className="text-sm text-gray-600">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Link href={dept.href}>
                    <Button className={`w-full bg-gradient-to-r ${dept.color} hover:opacity-90 text-white`} size="lg">
                      Explore {dept.name}
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Call to Action */}
        <Card className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white">
          <CardContent className="p-8 text-center">
            <BookOpen className="h-12 w-12 mx-auto mb-4 text-white" />
            <h3 className="text-2xl font-bold mb-4">Ready to Join Our Community?</h3>
            <p className="text-purple-100 mb-6 max-w-2xl mx-auto">
              Whether you're looking for elementary education or pursuing higher learning, we have the right program to
              help you achieve your academic goals.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="secondary" className="bg-white text-purple-600 hover:bg-gray-100">
                Apply for Admission
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-purple-600 bg-transparent"
              >
                Schedule a Visit
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
