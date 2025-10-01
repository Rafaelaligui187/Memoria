export interface StaffMember {
  id: string
  fullName: string
  nickname?: string
  age?: number
  birthday?: string
  address?: string
  email?: string
  phone?: string
  position: string
  departmentAssigned?: string
  officeAssigned?: string
  yearsOfService: number
  sayingMotto?: string
  messageToStudents?: string
  socialMediaFacebook?: string
  socialMediaInstagram?: string
  socialMediaTwitter?: string
  profilePictureUrl?: string
  achievements?: string[]
  activities?: string[]
  schoolYear: string
  bio?: string
  featured?: boolean
  additionalRoles?: string[]
}

export const staffData: StaffMember[] = [
  {
    id: "staff-001",
    fullName: "Mrs. Eleanor B. Bacalso",
    nickname: "Mrs. Eleanor",
    age: 42,
    birthday: "1982-09-12",
    address: "789 Academic Road, Toledo City",
    email: "ebacalso@consolatrix.edu.ph",
    phone: "+63 912 345 6794",
    position: "Academic Coordinator",
    officeAssigned: "Academic Affairs Office",
    yearsOfService: 8,
    sayingMotto: "Excellence in academics begins with excellent coordination and support.",
    socialMediaFacebook: "eleanor.bacalso",
    socialMediaInstagram: "@mrs_eleanor_academic",
    socialMediaTwitter: "@eleanor_cctc",
    profilePictureUrl: "/images/Picture9.png",
    achievements: [
      "Outstanding Staff Performance 2023",
      "Academic Excellence Support Award 2022",
      "Student Success Facilitator 2021",
    ],
    schoolYear: "2024-2025",
    bio: "Mrs. Bacalso ensures smooth academic operations and provides essential support to both students and faculty.",
    featured: true,
    additionalRoles: ["Academic Calendar Coordinator", "Student Records Assistant"],
  },
  {
    id: "staff-002",
    fullName: "Mrs. Mary Leizl C. Dela Cruz",
    nickname: "Mrs. Mary",
    age: 38,
    birthday: "1986-04-25",
    address: "321 Activity Center, Toledo City",
    email: "mdelacruz@consolatrix.edu.ph",
    phone: "+63 912 345 6795",
    position: "Student Activity Coordinator",
    officeAssigned: "Student Affairs Office",
    yearsOfService: 6,
    sayingMotto: "Student life is enriched through meaningful activities and experiences.",
    socialMediaFacebook: "mary.delacruz.activities",
    socialMediaInstagram: "@maryactivities",
    socialMediaTwitter: "@mary_activities",
    profilePictureUrl: "/images/Picture10.png",
    achievements: [
      "Student Engagement Excellence 2023",
      "Event Management Award 2022",
      "Community Building Recognition 2021",
    ],
    schoolYear: "2024-2025",
    bio: "Mrs. Dela Cruz coordinates student activities and ensures vibrant campus life for all students.",
    featured: true,
    additionalRoles: ["Event Planning Specialist", "Student Organization Advisor"],
  },
  {
    id: "staff-003",
    fullName: "Mr. Kenneth Gimenez",
    nickname: "Sir Kenneth",
    age: 35,
    birthday: "1989-07-08",
    address: "654 Support Street, Toledo City",
    email: "kgimenez@consolatrix.edu.ph",
    phone: "+63 912 345 6796",
    position: "Assistant Student Activity Coordinator",
    officeAssigned: "Student Affairs Office",
    yearsOfService: 4,
    sayingMotto: "Every student deserves opportunities to shine and grow.",
    socialMediaFacebook: "kenneth.gimenez",
    socialMediaInstagram: "@sir_kenneth_activities",
    socialMediaTwitter: "@kenneth_cctc",
    profilePictureUrl: "/images/mgrad.jpg",
    achievements: ["Rising Star Staff Award 2023", "Student Support Excellence 2022", "Team Collaboration Award 2021"],
    schoolYear: "2024-2025",
    bio: "Mr. Gimenez assists in coordinating student activities and provides dedicated support to student organizations.",
    featured: false,
    additionalRoles: ["Student Club Advisor", "Activity Assistant"],
  },
  {
    id: "staff-004",
    fullName: "Mr. Fiel Matthew L. Gepitulan",
    nickname: "Coach Fiel",
    age: 40,
    birthday: "1984-12-03",
    address: "987 Sports Complex, Toledo City",
    email: "fgepitulan@consolatrix.edu.ph",
    phone: "+63 912 345 6797",
    position: "Sports Coordinator",
    officeAssigned: "Physical Education Department",
    yearsOfService: 7,
    sayingMotto: "Sports build character, teamwork, and resilience.",
    socialMediaFacebook: "coach.fiel",
    socialMediaInstagram: "@coachfiel",
    socialMediaTwitter: "@coach_fiel_sports",
    profilePictureUrl: "/images/Picture11.png",
    achievements: [
      "Sports Excellence Coordinator 2023",
      "Athletic Program Development 2022",
      "Student Athlete Mentor 2021",
    ],
    schoolYear: "2024-2025",
    bio: "Coach Fiel coordinates all sports activities and helps students develop their athletic potential.",
    featured: true,
    additionalRoles: ["Athletic Program Director", "Student Athlete Counselor"],
  },
]
