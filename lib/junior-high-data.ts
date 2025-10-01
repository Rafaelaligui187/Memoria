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
            advisers: [
              { id: "jh-adv-1", name: "Mr. Ramon Diaz", image: "/placeholder.svg", quote: "Start strong, finish stronger." },
            ],
            students: [
              { id: "jh701", name: "Mika Santos", image: "/placeholder.svg", quote: "Curious mind." },
              { id: "jh702", name: "Noah Cruz", image: "/placeholder.svg", quote: "Learning every day." },
            ],
            officers: [
              { id: "jh701", name: "Mika Santos", image: "/placeholder.svg", position: "President", quote: "Lead with heart." },
            ],
            activities: [
              { id: "jh-a1", title: "Science Fair", image: "/placeholder.svg", description: "Grade 7 exhibits.", date: "Oct 12, 2024" },
            ],
          },
        },
      },
      "section-c": {
        name: "Section C",
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
export type JuniorHighSectionId<Y extends JuniorHighYearId> = keyof typeof juniorHighData[Y]["sections"]
