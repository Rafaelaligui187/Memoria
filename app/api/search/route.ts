import { NextResponse } from "next/server"

// Mock data for search results
const searchData = {
  students: [
    {
      id: 1,
      name: "Maria Santos",
      department: "College",
      course: "BSIT",
      year: "4th Year",
      image: "/placeholder.svg?height=100&width=100&text=Maria",
      url: "/departments/college",
    },
    {
      id: 2,
      name: "John Reyes",
      department: "College",
      course: "BSED",
      year: "4th Year",
      image: "/placeholder.svg?height=100&width=100&text=John",
      url: "/departments/college",
    },
    {
      id: 3,
      name: "Emma Garcia",
      department: "Elementary",
      grade: "Grade 5",
      section: "Section A",
      image: "/placeholder.svg?height=100&width=100&text=Emma",
      url: "/school-years-elementary",
    },
    {
      id: 4,
      name: "Noah Santos",
      department: "Elementary",
      grade: "Grade 6",
      section: "Section B",
      image: "/placeholder.svg?height=100&width=100&text=Noah",
      url: "/school-years-elementary",
    },
    {
      id: 5,
      name: "Sophia Cruz",
      department: "Senior High",
      strand: "STEM",
      grade: "Grade 12",
      image: "/placeholder.svg?height=100&width=100&text=Sophia",
      url: "/departments/senior-high",
    },
  ],
  faculty: [
    {
      id: 1,
      name: "Dr. Elena Rodriguez",
      department: "College",
      position: "College Dean",
      image: "/placeholder.svg?height=100&width=100&text=Dr.+Rodriguez",
      url: "/departments/college/faculty",
    },
    {
      id: 2,
      name: "Prof. Robert Santos",
      department: "College",
      position: "Programming Instructor",
      image: "/placeholder.svg?height=100&width=100&text=Prof.+Santos",
      url: "/departments/college/faculty",
    },
    {
      id: 3,
      name: "Ms. Maria Santos",
      department: "Elementary",
      position: "Grade 1 Adviser",
      image: "/placeholder.svg?height=100&width=100&text=Ms.+Santos",
      url: "/departments/elementary/faculty",
    },
  ],
  gallery: [
    {
      id: 1,
      title: "Foundation Day 2023",
      category: "Events",
      date: "August 15, 2023",
      image: "/placeholder.svg?height=100&width=200&text=Foundation+Day",
      url: "/gallery/1",
    },
    {
      id: 2,
      title: "Graduation Ceremony",
      category: "Events",
      date: "March 25, 2023",
      image: "/placeholder.svg?height=100&width=200&text=Graduation",
      url: "/gallery/2",
    },
    {
      id: 3,
      title: "Sports Festival",
      category: "Events",
      date: "November 5, 2022",
      image: "/placeholder.svg?height=100&width=200&text=Sports",
      url: "/gallery/4",
    },
  ],
  memories: [
    {
      id: 1,
      content: "Four years of hard work, laughter, and growth. Thank you, Consolatrix College!",
      author: "Maria Santos",
      date: "2 days ago",
      url: "/memory-wall/1",
    },
    {
      id: 2,
      content: "The friendships I've made here will last a lifetime. So grateful for this journey.",
      author: "John Reyes",
      date: "3 days ago",
      url: "/memory-wall/2",
    },
  ],
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get("q")
    const category = searchParams.get("category") || "all"

    if (!query) {
      return NextResponse.json({ results: [] })
    }

    const lowerQuery = query.toLowerCase()

    const results: any = {}

    // Filter students
    if (category === "all" || category === "students") {
      results.students = searchData.students.filter(
        (student) =>
          student.name.toLowerCase().includes(lowerQuery) ||
          (student.course && student.course.toLowerCase().includes(lowerQuery)) ||
          (student.grade && student.grade.toLowerCase().includes(lowerQuery)),
      )
    }

    // Filter faculty
    if (category === "all" || category === "faculty") {
      results.faculty = searchData.faculty.filter(
        (faculty) =>
          faculty.name.toLowerCase().includes(lowerQuery) ||
          faculty.position.toLowerCase().includes(lowerQuery) ||
          faculty.department.toLowerCase().includes(lowerQuery),
      )
    }

    // Filter gallery
    if (category === "all" || category === "gallery") {
      results.gallery = searchData.gallery.filter(
        (item) => item.title.toLowerCase().includes(lowerQuery) || item.category.toLowerCase().includes(lowerQuery),
      )
    }

    // Filter memories
    if (category === "all" || category === "memories") {
      results.memories = searchData.memories.filter(
        (memory) =>
          memory.content.toLowerCase().includes(lowerQuery) || memory.author.toLowerCase().includes(lowerQuery),
      )
    }

    return NextResponse.json({ results })
  } catch (error) {
    console.error("Search error:", error)
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 })
  }
}
