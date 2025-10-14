export interface FacultyMember {
  id: string
  fullName: string
  nickname?: string
  age?: number
  birthday?: string
  address?: string
  email?: string
  phone?: string
  position: string
  departmentAssigned: string
  yearsOfService: number
  sayingMotto?: string
  messageToStudents?: string
  socialMediaFacebook?: string
  socialMediaInstagram?: string
  socialMediaTwitter?: string
  profilePictureUrl?: string
  achievements?: string[]
  activities?: string[]
  hierarchy: "directress" | "superior" | "department_head" | "office_head" | "faculty"
  schoolYear: string
  specialization?: string
  education?: string
  office?: string
  bio?: string
  featured?: boolean
  additionalRoles?: string[]
  courses?: string[]
  publications?: string[]
  research?: string[]
  classesHandled?: string[]
  gallery?: string[]
}

export const facultyData: FacultyMember[] = [
  {
    id: "faculty-001",
    fullName: "Sr. Josephine D. Ativo, A.R. PhD, EM",
    nickname: "Sr. Josephine",
    age: 55,
    birthday: "1969-03-15",
    address: "Consolatrix Convent, Toledo City",
    email: "directress@consolatrix.edu.ph",
    phone: "+63 912 345 6789",
    position: "School Directress",
    departmentAssigned: "Administration",
    yearsOfService: 15,
    sayingMotto: "Education is the most powerful weapon which you can use to change the world.",
    messageToStudents:
      "My dear students, remember that education is not just about acquiring knowledge, but about developing character and serving others with love and compassion.",
    socialMediaFacebook: "consolatrixcollege",
    socialMediaInstagram: "@consolatrixcollege",
    socialMediaTwitter: "@consolatrixcollege",
    profilePictureUrl: "/images/Picture1.png",
    achievements: [
      "Educational Leadership Excellence Award 2023",
      "Community Service Recognition 2022",
      "Outstanding Administrator Award 2021",
    ],
    hierarchy: "directress",
    schoolYear: "2024-2025",
    education: "Ph.D. in Educational Management",
    office: "Main Building, Room 201",
    bio: "Dr. Ativo has been leading the college with distinction for over a decade. Her research focuses on innovative teaching methodologies and student success strategies.",
    featured: true,
    additionalRoles: ["Board Member - Catholic Educational Association", "Regional Education Council Member"],
    research: ["Educational Leadership in Catholic Institutions", "Student Success Strategies"],
    classesHandled: ["Educational Administration Seminar", "Leadership Development Workshop"],
  },
  {
    id: "faculty-002",
    fullName: "Sr. Yolanda N. Navea, A.R.",
    nickname: "Sr. Yolanda",
    age: 60,
    birthday: "1964-08-22",
    address: "Consolatrix Convent, Toledo City",
    email: "superior@consolatrix.edu.ph",
    phone: "+63 912 345 6790",
    position: "Superior",
    departmentAssigned: "Administration",
    yearsOfService: 20,
    sayingMotto: "In service to God and humanity, we find our true purpose.",
    messageToStudents:
      "Dear children, let your faith guide your studies and your compassion guide your actions. You are called to be lights in this world.",
    socialMediaFacebook: "consolatrixcollege",
    socialMediaInstagram: "@consolatrixcollege",
    socialMediaTwitter: "@consolatrixcollege_superior",
    profilePictureUrl: "/images/Picture2.png",
    achievements: [
      "Lifetime Service Award 2023",
      "Community Leadership Recognition 2022",
      "Religious Excellence Award 2021",
    ],
    hierarchy: "superior",
    schoolYear: "2024-2025",
    education: "Master of Theology",
    office: "Administration Building, Room 101",
    bio: "Sr. Yolanda has dedicated her life to education and spiritual guidance, providing wisdom and leadership to the entire school community.",
    featured: true,
    additionalRoles: ["Provincial Council Member", "Interfaith Dialogue Committee"],
  },
  {
    id: "faculty-003",
    fullName: "Sr. Ginger L. Acosta, A.R.",
    nickname: "Sr. Ginger",
    age: 48,
    birthday: "1976-11-10",
    address: "Consolatrix Convent, Toledo City",
    email: "registrar@consolatrix.edu.ph",
    phone: "+63 912 345 6791",
    position: "School Registrar",
    departmentAssigned: "Administration",
    yearsOfService: 12,
    sayingMotto: "Accuracy and integrity in all academic records ensure student success.",
    messageToStudents:
      "Your academic journey is precious. I am here to ensure every achievement is properly documented and celebrated.",
    socialMediaFacebook: "consolatrixcollege",
    socialMediaInstagram: "@sr_ginger_registrar",
    socialMediaTwitter: "@registrar_cctc",
    profilePictureUrl: "/images/Picture3.png",
    achievements: [
      "Excellence in Academic Records Management 2023",
      "Digital Transformation Award 2022",
      "Student Service Excellence 2021",
    ],
    hierarchy: "office_head",
    schoolYear: "2024-2025",
    education: "Master in Educational Administration",
    office: "Registrar's Office, Main Building",
    bio: "Sr. Ginger ensures the integrity and accuracy of all academic records while providing excellent service to students and families.",
    featured: true,
    additionalRoles: ["Academic Records Management Specialist", "Student Data Privacy Officer"],
  },
  {
    id: "faculty-004",
    fullName: "Dr. Josephine M. Tabal",
    nickname: "Dr. Tabal",
    age: 45,
    birthday: "1979-05-18",
    address: "123 Education Street, Toledo City",
    email: "jtabal@consolatrix.edu.ph",
    phone: "+63 912 345 6792",
    position: "Program Head",
    departmentAssigned: "Education",
    yearsOfService: 8,
    sayingMotto: "Every child deserves a teacher who believes in their potential.",
    messageToStudents:
      "Teaching is not just a profession, it's a calling. Embrace the responsibility and joy of shaping young minds.",
    socialMediaFacebook: "dr.josephine.tabal",
    socialMediaInstagram: "@drjtabal",
    socialMediaTwitter: "@dr_tabal_edu",
    profilePictureUrl: "/images/Picture5.png",
    achievements: [
      "Outstanding Educator Award 2023",
      "Research Excellence in Education 2022",
      "Community Outreach Recognition 2021",
    ],
    hierarchy: "faculty",
    schoolYear: "2024-2025",
    specialization: "Educational Administration",
    education: "Ph.D. in Education",
    office: "Education Building, Room 201",
    bio: "Dr. Tabal is passionate about preparing future educators with the skills and knowledge needed to inspire young minds.",
    featured: true,
    courses: ["Educational Leadership", "Curriculum Development", "Student Affairs"],
    research: ["Innovative Teaching Methods", "Student-Centered Learning"],
    classesHandled: ["EDUC 101 - Foundations of Education", "EDUC 301 - Curriculum Development"],
  },
  {
    id: "faculty-005",
    fullName: "Mr. Procoro V. Gonzaga, MATM, MIT",
    nickname: "Sir Procoro",
    age: 52,
    birthday: "1972-02-14",
    address: "456 Principal Avenue, Toledo City",
    email: "pgonzaga@consolatrix.edu.ph",
    phone: "+63 912 345 6793",
    position: "Junior High School Principal",
    departmentAssigned: "Junior High School",
    yearsOfService: 10,
    sayingMotto: "Adolescence is not a problem to be solved, but a stage to be understood and nurtured.",
    messageToStudents:
      "Your teenage years are full of possibilities. Embrace challenges, learn from mistakes, and never stop dreaming big.",
    socialMediaFacebook: "procoro.gonzaga",
    socialMediaInstagram: "@sir_procoro",
    socialMediaTwitter: "@principal_gonzaga",
    profilePictureUrl: "/images/Picture6.png",
    achievements: [
      "Secondary Education Excellence Award 2023",
      "Youth Development Recognition 2022",
      "Innovative Teaching Award 2021",
    ],
    hierarchy: "office_head",
    schoolYear: "2024-2025",
    specialization: "Secondary Education",
    education: "Master in Teaching Mathematics, Master in Information Technology",
    office: "JHS Building, Room 101",
    bio: "Mr. Gonzaga is passionate about adolescent development and creating engaging learning environments for junior high school students.",
    featured: true,
    courses: ["Secondary Education", "Adolescent Psychology", "Mathematics Education"],
    classesHandled: ["MATH 201 - Algebra", "EDUC 201 - Adolescent Development"],
  },
]
