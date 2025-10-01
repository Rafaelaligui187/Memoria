import Link from "next/link"
import { ArrowLeft, Users } from "lucide-react"

export default function CoursePage({
  params,
}: {
  params: { courseId: string }
}) {
  const { courseId } = params

  // Mock data - replace with actual data fetching
  const getCourseData = (courseId: string) => {
    const courses = {
      bsit: {
        name: "BS Information Technology",
        tagline: "BUILD, SOLVE, CONNECT",
        description:
          "Preparing students for careers in information technology, software development, and digital innovation.",
      },
      beed: {
        name: "Bachelor of Elementary Education",
        tagline: "TEACH, INSPIRE, NURTURE",
        description: "Training future elementary school teachers with comprehensive pedagogical knowledge and skills.",
      },
      bsed: {
        name: "Bachelor of Secondary Education",
        tagline: "EDUCATE, EMPOWER, EXCEL",
        description: "Developing competent secondary school teachers across various subject specializations.",
      },
      bshm: {
        name: "BS Hospitality Management",
        tagline: "SERVE, LEAD, EXCEL",
        description: "Preparing students for leadership roles in the hospitality and tourism industry.",
      },
      bsentrep: {
        name: "BS Entrepreneurship",
        tagline: "INNOVATE, CREATE, SUCCEED",
        description: "Fostering entrepreneurial mindset and business innovation skills for future business leaders.",
      },
    }
    return courses[courseId as keyof typeof courses] || courses.bsit
  }

  const course = getCourseData(courseId)

  const yearLevels = [
    {
      id: "1st-year",
      name: "First Year",
      blocks: ["a", "b", "c"],
    },
    {
      id: "2nd-year",
      name: "Second Year",
      blocks: ["a", "b"],
    },
    {
      id: "3rd-year",
      name: "Third Year",
      blocks: ["a", "b"],
    },
    {
      id: "4th-year",
      name: "Fourth Year",
      blocks: ["a", "b", "c", "d"],
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white">
      {/* Header with Back Button */}
      <div className="bg-white border-b border-purple-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link
            href="/departments/college"
            className="inline-flex items-center text-purple-600 hover:text-purple-800 transition-colors"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back to College Department
          </Link>
        </div>
      </div>

      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-purple-600 to-indigo-700 py-24 px-4 sm:px-6 lg:px-8 text-white">
        <div className="absolute inset-0 opacity-20 bg-[url('/placeholder.svg?height=500&width=1000&text=Pattern')] bg-repeat"></div>
        <div className="relative max-w-7xl mx-auto text-center">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl mb-4">{course.name}</h1>
          <p className="text-2xl font-light tracking-widest text-purple-200">{course.tagline}</p>
          <p className="mt-8 max-w-3xl mx-auto text-xl text-purple-100">{course.description}</p>
        </div>
      </div>

      {/* Year Levels Section */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">Year Levels & Blocks</h2>

        <div className="space-y-8">
          {yearLevels.map((year) => (
            <div key={year.id} className="bg-white rounded-xl shadow-sm border border-purple-100 p-8">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                <div className="mb-6 md:mb-0">
                  <h3 className="text-2xl font-semibold text-gray-900 mb-2">{year.name}</h3>
                  <div className="flex items-center text-gray-600">
                    <Users className="h-4 w-4 mr-2" />
                    <span>
                      {year.blocks.length} Block{year.blocks.length > 1 ? "s" : ""} Available
                    </span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-3">
                  {year.blocks.map((block) => (
                    <Link key={block} href={`/departments/college/${courseId}/${year.id}/block-${block}`}>
                      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white px-6 py-3 rounded-lg font-medium transition-all duration-200 hover:shadow-lg hover:scale-105">
                        Block {block.toUpperCase()}
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Simple Footer */}
      <footer className="bg-gray-100 py-8 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center text-gray-600">
            <p>&copy; 2024 {course.name} Program. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
