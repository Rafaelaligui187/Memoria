export type UserRole = "student" | "faculty" | "alumni" | "staff" | "utility"

export interface BasePerson {
  id: string
  name: string
  image: string
  role: UserRole
  gallery?: string[]
}

export interface Student extends BasePerson {
  role: "student"
  quote?: string
  honors?: string
  hobbies?: string
  ambition?: string
  activities?: string[]
  officerRole?: string // For student officers: Mayor, Vice Mayor, Secretary, etc.
}

export interface Faculty extends BasePerson {
  role: "faculty"
  department: string
  position: string
  yearsOfService: number
  legacy?: string
  messageToStudents?: string
  achievements?: string[]
}

export interface Alumni extends BasePerson {
  role: "alumni"
  // All student fields
  quote?: string
  honors?: string
  hobbies?: string
  ambition?: string
  activities?: string[]
  graduationYear: number
  // Alumni-specific fields
  work?: string
  company?: string
  location?: string
  advice?: string
}

export interface Staff extends BasePerson {
  role: "staff" | "utility"
  department: string
  position: string
  yearsOfService: number
  contribution?: string
  achievements?: string[]
}

export type Person = Student | Faculty | Alumni | Staff

export interface Activity {
  id: string
  title: string
  image: string
  description: string
  date: string
}

export interface ClassData {
  name: string
  academicYear: string
  people: Person[]
  activities?: Activity[]
  motto?: string
}

// Role-based field configuration
export const roleFieldConfig = {
  student: {
    sections: [
      {
        title: "About",
        fields: ["quote", "ambition", "hobbies"],
      },
      {
        title: "Academic",
        fields: ["honors", "activities"],
      },
      {
        title: "Leadership",
        fields: ["officerRole"],
        condition: (person: Person) => (person as Student).officerRole,
      },
    ],
  },
  faculty: {
    sections: [
      {
        title: "Professional",
        fields: ["department", "position", "yearsOfService"],
      },
      {
        title: "Legacy",
        fields: ["legacy", "messageToStudents"],
      },
      {
        title: "Achievements",
        fields: ["achievements"],
      },
    ],
  },
  alumni: {
    sections: [
      {
        title: "Student Life",
        fields: ["quote", "ambition", "hobbies", "activities"],
      },
      {
        title: "Life Updates",
        fields: ["work", "company", "location"],
      },
      {
        title: "Wisdom",
        fields: ["advice"],
      },
    ],
  },
  staff: {
    sections: [
      {
        title: "Professional",
        fields: ["department", "position", "yearsOfService"],
      },
      {
        title: "Contribution",
        fields: ["contribution"],
      },
      {
        title: "Achievements",
        fields: ["achievements"],
      },
    ],
  },
  utility: {
    sections: [
      {
        title: "Professional",
        fields: ["department", "position", "yearsOfService"],
      },
      {
        title: "Contribution",
        fields: ["contribution"],
      },
      {
        title: "Achievements",
        fields: ["achievements"],
      },
    ],
  },
}
