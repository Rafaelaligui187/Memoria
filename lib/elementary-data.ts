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
