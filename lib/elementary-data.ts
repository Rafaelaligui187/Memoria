// lib/elementary-data.ts

export const elementaryData = {
  "grade-1": {
    name: "Grade 1",
    sections: {
      "section-a": {
        name: "Section A",
        schoolYears: {
          "2024-2025": {
            academicYear: "2024-2025",
            advisers: [
              { id: "el-adv-1", name: "Ms. Liza Perez", image: "/placeholder.svg", quote: "Learning is fun!" },
            ],
            students: [
              { id: "el101", name: "Aria Lim", image: "/placeholder.svg", quote: "I love reading." },
              { id: "el102", name: "Ben Tan", image: "/placeholder.svg", quote: "Math is cool!" },
            ],
            officers: [
              { id: "el101", name: "Aria Lim", image: "/placeholder.svg", position: "Class Leader", quote: "Be kind." },
            ],
            activities: [
              { id: "el-a1", title: "Reading Day", image: "/placeholder.svg", description: "Reading with friends.", date: "Sep 20, 2024" },
            ],
          },
          "2023-2024": {
            academicYear: "2023-2024",
            advisers: [
              { id: "el-adv-1b", name: "Ms. Joy Flores", image: "/placeholder.svg", quote: "Every day is a chance to learn." },
            ],
            students: [
              { id: "el1b01", name: "Caleb Uy", image: "/placeholder.svg", quote: "Reading time!" },
              { id: "el1b02", name: "Dana Sy", image: "/placeholder.svg", quote: "I like drawing." },
            ],
            officers: [],
            activities: [],
          }
        },
      },
      "section-b": {
        name: "Section B",
        schoolYears: {
          "2024-2025": {
            academicYear: "2024-2025",
            advisers: [],
            students: [],
            officers: [],
            activities: [],
          },
        },
      },
    },
  },
  "grade-2": {
    name: "Grade 2",
    sections: {
      "section-a": {
        name: "Section A",
        schoolYears: {
          "2024-2025": {
            academicYear: "2024-2025",
            advisers: [],
            students: [],
            officers: [],
            activities: [],
          },
          "2023-2024": {
            academicYear: "2023-2024",
            advisers: [],
            students: [],
            officers: [],
            activities: [],
          },
        },
      },
      "section-b": {
        name: "Section B",
        schoolYears: {
          "2024-2025": {
            academicYear: "2024-2025",
            advisers: [],
            students: [],
            officers: [],
            activities: [],
          },
        },
      },
    },
  },
} as const

export type ElementaryYearId = keyof typeof elementaryData
export type ElementarySectionId<Y extends ElementaryYearId> = keyof typeof elementaryData[Y]["sections"]
