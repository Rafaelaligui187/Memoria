import Link from "next/link"
import { ArrowLeft, Users } from "lucide-react"

export default function SeniorHighYearPage({
  params,
}: {
  params: { strandId: string }
}) {
  const { strandId } = params

  const strands = {
    stem: {
      name: "STEM",
      tagline: "INNOVATE, DISCOVER, EXCEL",
      description: "Science, Technology, Engineering, and Mathematics strand for future scientists, engineers, and innovators.",
    },
    abm: {
      name: "ABM",
      tagline: "LEAD, MANAGE, SUCCEED",
      description: "Accountancy, Business, and Management strand for future entrepreneurs and business leaders.",
    },
    humss: {
      name: "HUMSS",
      tagline: "EXPRESS, INSPIRE, EMPOWER",
      description: "Humanities and Social Sciences strand for communicators, educators, and leaders.",
    },
    gas: {
      name: "GAS",
      tagline: "EXPLORE, LEARN, GROW",
      description: "General Academic Strand for students exploring multiple career pathways.",
    },
    tvl: {
      name: "TVL",
      tagline: "SKILL, BUILD, ACHIEVE",
      description: "Technical-Vocational-Livelihood strand preparing students with industry-relevant skills.",
    },
    arts: {
      name: "Arts and Design",
      tagline: "CREATE, EXPRESS, INSPIRE",
      description: "Arts and Design track for aspiring creative professionals and performers.",
    },
  }

  const strand = strands[strandId as keyof typeof strands] || strands.stem

  const yearLevels = [
    {
      id: "grade-11",
      name: "Grade 11",
      sections: ["a", "b", "c"],
    },
    {
      id: "grade-12",
      name: "Grade 12",
      sections: ["a", "b", "c"],
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white">
      {/* Header with Back Button */}
      <div className="bg-white border-b border-amber-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link
            href="/departments/senior-high"
            className="inline-flex items-center text-amber-600 hover:text-amber-800 transition-colors"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back to Senior High Department
          </Link>
        </div>
      </div>

      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-amber-600 to-amber-700 py-24 px-4 sm:px-6 lg:px-8 text-white">
        <div className="absolute inset-0 opacity-20 bg-[url('/placeholder.svg?height=500&width=1000&text=Pattern')] bg-repeat"></div>
        <div className="relative max-w-7xl mx-auto text-center">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl mb-4">{strand.name}</h1>
          <p className="text-2xl font-light tracking-widest text-amber-200">{strand.tagline}</p>
          <p className="mt-8 max-w-3xl mx-auto text-xl text-amber-100">{strand.description}</p>
        </div>
      </div>

      {/* Year Levels Section */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">Year Levels & Sections</h2>

        <div className="space-y-8">
          {yearLevels.map((year) => (
            <div key={year.id} className="bg-white rounded-xl shadow-sm border border-amber-100 p-8">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                <div className="mb-6 md:mb-0">
                  <h3 className="text-2xl font-semibold text-gray-900 mb-2">{year.name}</h3>
                  <div className="flex items-center text-gray-600">
                    <Users className="h-4 w-4 mr-2" />
                    <span>
                      {year.sections.length} Section{year.sections.length > 1 ? "s" : ""} Available
                    </span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-3">
                  {year.sections.map((section) => (
                    <Link
                      key={section}
                      href={`/departments/senior-high/${strandId}/${year.id}/section-${section}`}
                    >
                      <div className="bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white px-6 py-3 rounded-lg font-medium transition-all duration-200 hover:shadow-lg hover:scale-105">
                        Section {section.toUpperCase()}
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
            <p>&copy; 2024 {strand.name} Strand. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
