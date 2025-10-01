// lib/senior-high-data.ts

export const seniorHighData = {
  stem: {
    name: "STEM",
    years: {
      "grade-11": {
        name: "Grade 11",
        sections: {
          "section-a": {
            name: "Section A",
            academicYear: "2024-2025",
            advisers: [
              { id: "dr-anderson", name: "Dr. Michael Anderson", image: "/placeholder.svg", quote: "Science is the key to understanding the world." }
            ],
            students: [
              { id: "shs1101", name: "Alex Johnson", image: "/placeholder.svg", quote: "Future engineer.", honors: "With High Honors" },
              { id: "shs1102", name: "Brenda Lee", image: "/placeholder.svg", quote: "Passionate about robotics." }
            ],
            officers: [
              { id: "shs1101", name: "Alex Johnson", image: "/placeholder.svg", position: "President", quote: "Leading the STEM path." }
            ],
            activities: [
              { id: "sha1", title: "Robotics Competition", image: "/placeholder.svg", description: "Annual robotics challenge.", date: "Apr 10, 2025" }
            ]
          }
        }
      }
    }
  },
  abm: {
    name: "ABM",
    years: {
      "grade-11": {
        name: "Grade 11",
        sections: {
          "section-a": {
            name: "Section A",
            academicYear: "2024-2025",
            advisers: [],
            students: [],
            officers: [],
            activities: []
          }
        }
      }
    }
  }
} as const
