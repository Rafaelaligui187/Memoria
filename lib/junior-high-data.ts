// lib/junior-high-data.ts

export const juniorHighData = {
  "grade-7": {
    name: "Grade 7",
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
  "grade-8": {
    name: "Grade 8",
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

export type JuniorHighYearId = keyof typeof juniorHighData
