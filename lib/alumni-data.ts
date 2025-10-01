export interface AlumniMember {
  id: string
  fullName: string
  nickname?: string
  age?: number
  birthday?: string
  address?: string
  email?: string
  phone?: string
  department: string
  courseProgram?: string
  graduationYear: string
  currentProfession?: string
  currentCompany?: string
  currentLocation?: string
  sayingMotto?: string
  socialMediaFacebook?: string
  socialMediaInstagram?: string
  socialMediaTwitter?: string
  profilePictureUrl?: string
  achievements?: string[]
  activities?: string[]
  bio?: string
  featured?: boolean
}

export const alumniData: AlumniMember[] = [
  {
    id: "alumni-001",
    fullName: "Maria Santos Rodriguez",
    nickname: "Maria",
    age: 28,
    birthday: "1996-03-15",
    address: "123 Success Avenue, Cebu City",
    email: "maria.santos@email.com",
    phone: "+63 912 345 6798",
    department: "College",
    courseProgram: "Bachelor of Science in Information Technology",
    graduationYear: "2018",
    currentProfession: "Software Engineer",
    currentCompany: "Tech Solutions Inc.",
    currentLocation: "Cebu City, Philippines",
    sayingMotto: "Technology is the bridge between dreams and reality.",
    socialMediaFacebook: "maria.santos.dev",
    socialMediaInstagram: "@mariasantos_dev",
    socialMediaTwitter: "@mariasantos_dev",
    profilePictureUrl: "/placeholder.svg?height=400&width=400&text=Maria+Santos",
    achievements: ["Outstanding IT Graduate 2018", "Dean's Lister (2016-2018)", "Best Thesis Award 2018"],
    activities: ["IT Society President", "Programming Club Member", "Volunteer Tutor"],
    bio: "Maria is a successful software engineer who credits her education at Consolatrix College for her strong foundation in technology and problem-solving.",
    featured: true,
  },
  {
    id: "alumni-002",
    fullName: "John Michael Dela Cruz",
    nickname: "John",
    age: 26,
    birthday: "1998-07-22",
    address: "456 Education Street, Manila",
    email: "john.delacruz@email.com",
    phone: "+63 912 345 6799",
    department: "College",
    courseProgram: "Bachelor of Elementary Education",
    graduationYear: "2020",
    currentProfession: "Elementary School Teacher",
    currentCompany: "Manila Public Elementary School",
    currentLocation: "Manila, Philippines",
    sayingMotto: "Teaching is the profession that creates all other professions.",
    socialMediaFacebook: "john.delacruz.teacher",
    socialMediaInstagram: "@teacherjohn",
    socialMediaTwitter: "@teacher_john_dc",
    profilePictureUrl: "/placeholder.svg?height=400&width=400&text=John+Dela+Cruz",
    achievements: ["Summa Cum Laude 2020", "Outstanding Student Teacher 2019", "Academic Excellence Award 2018-2020"],
    activities: ["Education Society Vice President", "Peer Tutor", "Community Outreach Volunteer"],
    bio: "John is a dedicated elementary teacher who brings the values and teaching methods he learned at Consolatrix College to his classroom every day.",
    featured: true,
  },
  {
    id: "alumni-003",
    fullName: "Ana Marie Gonzales",
    nickname: "Ana",
    age: 30,
    birthday: "1994-11-08",
    address: "789 Business District, Makati City",
    email: "ana.gonzales@email.com",
    phone: "+63 912 345 6800",
    department: "College",
    courseProgram: "Bachelor of Science in Business Administration",
    graduationYear: "2016",
    currentProfession: "Marketing Manager",
    currentCompany: "Global Marketing Solutions",
    currentLocation: "Makati City, Philippines",
    sayingMotto: "Success is not just about what you accomplish, but what you inspire others to do.",
    socialMediaFacebook: "ana.gonzales.marketing",
    socialMediaInstagram: "@anamarketingpro",
    socialMediaTwitter: "@anamarketingpro",
    profilePictureUrl: "/placeholder.svg?height=400&width=400&text=Ana+Gonzales",
    achievements: [
      "Magna Cum Laude 2016",
      "Best Business Plan Competition Winner 2015",
      "Marketing Excellence Award 2023",
    ],
    activities: ["Business Club President", "Debate Team Member", "Student Council Representative"],
    bio: "Ana has built a successful career in marketing, applying the business principles and leadership skills she developed during her time at Consolatrix College.",
    featured: true,
  },
  {
    id: "alumni-004",
    fullName: "Robert James Villanueva",
    nickname: "Robert",
    age: 32,
    birthday: "1992-05-14",
    address: "321 Healthcare Avenue, Davao City",
    email: "robert.villanueva@email.com",
    phone: "+63 912 345 6801",
    department: "College",
    courseProgram: "Bachelor of Science in Nursing",
    graduationYear: "2014",
    currentProfession: "Registered Nurse",
    currentCompany: "Davao Medical Center",
    currentLocation: "Davao City, Philippines",
    sayingMotto: "Nursing is not just a career, it's a calling to serve humanity.",
    socialMediaFacebook: "robert.villanueva.rn",
    socialMediaInstagram: "@nurserobertv",
    socialMediaTwitter: "@nurse_robert_v",
    profilePictureUrl: "/placeholder.svg?height=400&width=400&text=Robert+Villanueva",
    achievements: [
      "Nursing Board Exam Topnotcher 2014",
      "Outstanding Clinical Performance 2013",
      "Community Health Advocate Award 2022",
    ],
    activities: ["Nursing Society Secretary", "Red Cross Volunteer", "Medical Mission Participant"],
    bio: "Robert is a compassionate nurse who embodies the caring spirit and professional excellence instilled during his nursing education at Consolatrix College.",
    featured: false,
  },
]
