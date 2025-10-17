import { type NextRequest, NextResponse } from "next/server"

interface Profile {
  id: string
  userId: string
  type: "student" | "faculty" | "alumni" | "staff" | "utility" | "advisory"
  status: "draft" | "pending" | "approved" | "rejected"
  yearId: string
  data: Record<string, any>
  createdAt: string
  updatedAt: string
  submittedAt?: string
  reviewedAt?: string
  reviewedBy?: string
  rejectionReason?: string
}

const profiles: Profile[] = [
  {
    id: "1",
    userId: "1",
    type: "student",
    status: "pending",
    yearId: "2024-2025",
    data: {
      // Basic Info
      fullName: "John Doe",
      nickname: "Johnny",
      age: 18,
      gender: "Male",
      birthday: "2006-05-15",
      address: "123 Sampaguita St., Quezon City",
      email: "john.doe@cctc.edu.ph",
      phone: "09123456789",

      // Academic Info
      department: "College",
      yearLevel: "1st Year",
      courseProgram: "BS Computer Science",
      blockSection: "CS-A",

      // Parents/Guardian
      fatherGuardianName: "John Sr. Doe",
      motherGuardianName: "Maria Doe",

      // Additional Info
      dreamJob: "Software Engineer",
      sayingMotto: "Dream big, work hard, stay focused.",

      // Social Media
      socialMediaFacebook: "@john.doe",
      socialMediaInstagram: "@johndoe",
      socialMediaTwitter: "@johndoe",

      // Yearbook Info
      profilePictureUrl: "",
      achievements: ["Dean's List", "Programming Contest Winner"],
      activities: ["Computer Society", "Basketball Team"],

      // Legacy fields for backward compatibility
      quote: "Dream big, work hard, stay focused.",
      ambition: "To become a successful software engineer",
      hobbies: ["Programming", "Gaming", "Reading"],
      honors: "Dean's List",
      officerRole: "None",
    },
    createdAt: "2024-08-15T00:00:00Z",
    updatedAt: "2024-08-15T00:00:00Z",
    submittedAt: "2024-08-15T00:00:00Z",
  },
  {
    id: "2",
    userId: "2",
    type: "faculty",
    status: "approved",
    yearId: "2024-2025",
    data: {
      // Basic Info
      fullName: "Maria Santos",
      nickname: "Prof. Maria",
      age: 35,
      gender: "Female",
      birthday: "1989-03-20",
      address: "456 Mahogany Ave., Makati City",
      email: "maria.santos@cctc.edu.ph",
      phone: "09987654321",

      // Professional Info
      position: "Associate Professor",
      departmentAssigned: "College of Computer Studies",
      yearsOfService: 10,
      messageToStudents: "Always stay curious and never stop learning.",

      // Additional Info
      sayingMotto: "Education is the most powerful weapon which you can use to change the world",

      // Social Media
      socialMediaFacebook: "@prof.maria",
      socialMediaInstagram: "@mariasantos",
      socialMediaTwitter: "@profmaria",

      // Yearbook Info
      profilePictureUrl: "",
      achievements: ["Outstanding Faculty Award", "Research Excellence Award"],

      // Legacy fields
      bio: "Dedicated educator with passion for technology",
      courses: "Data Structures, Algorithms, Web Development",
      additionalRoles: "Research Committee Member",
    },
    createdAt: "2024-08-10T00:00:00Z",
    updatedAt: "2024-08-12T00:00:00Z",
    submittedAt: "2024-08-10T00:00:00Z",
    reviewedAt: "2024-08-12T00:00:00Z",
    reviewedBy: "admin",
  },
  {
    id: "3",
    userId: "3",
    type: "alumni",
    status: "approved",
    yearId: "2024-2025",
    data: {
      // Basic Info
      fullName: "Carlos Rodriguez",
      nickname: "Carl",
      age: 28,
      gender: "Male",
      birthday: "1996-07-10",
      address: "789 Narra St., Cebu City",
      email: "carlos.rodriguez@gmail.com",
      phone: "09111222333",

      // Academic History
      department: "College",
      courseProgram: "BS Information Technology",
      graduationYear: "2019",

      // Career Info
      currentProfession: "Senior Software Engineer",
      currentCompany: "Tech Solutions Inc.",
      currentLocation: "Manila, Philippines",

      // Additional Info
      sayingMotto: "Once a student, always part of the family",
      messageToStudents: "Stay curious, embrace challenges, and never stop learning.",

      // Social Media
      socialMediaFacebook: "@carlos.rodriguez",
      socialMediaInstagram: "@carlrod",
      socialMediaTwitter: "@carlostech",

      // Yearbook Info
      profilePictureUrl: "",
      achievements: ["Summa Cum Laude", "Outstanding Thesis Award"],

      // Legacy fields
      quote: "Once a student, always part of the family",
      ambition: "To lead innovative tech solutions globally",
      hobbies: ["Traveling", "Photography", "Mentoring"],
      honors: "Summa Cum Laude",
    },
    createdAt: "2024-08-05T00:00:00Z",
    updatedAt: "2024-08-05T00:00:00Z",
    submittedAt: "2024-08-05T00:00:00Z",
    reviewedAt: "2024-08-06T00:00:00Z",
    reviewedBy: "admin",
  },
  {
    id: "4",
    userId: "4",
    type: "staff",
    status: "pending",
    yearId: "2024-2025",
    data: {
      // Basic Info
      fullName: "Ana Reyes",
      nickname: "Ms. Ana",
      age: 42,
      gender: "Female",
      birthday: "1982-11-25",
      address: "321 Acacia St., Pasig City",
      email: "ana.reyes@cctc.edu.ph",
      phone: "09444555666",

      // Professional Info
      position: "Registrar",
      officeAssigned: "Registrar's Office",
      yearsOfService: 15,

      // Additional Info
      sayingMotto: "Service before self",

      // Social Media
      socialMediaFacebook: "@ana.reyes",
      socialMediaInstagram: "",
      socialMediaTwitter: "",

      // Yearbook Info
      profilePictureUrl: "",
      achievements: ["Employee of the Year", "Service Excellence Award"],

      // Legacy fields
      bio: "Dedicated staff member ensuring smooth academic operations",
    },
    createdAt: "2024-08-20T00:00:00Z",
    updatedAt: "2024-08-20T00:00:00Z",
    submittedAt: "2024-08-20T00:00:00Z",
  },
]

export async function GET(request: NextRequest, { params }: { params: { yearId: string } }) {
  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get("type")
    const status = searchParams.get("status")
    const q = searchParams.get("q")

    let filteredProfiles = profiles.filter((profile) => profile.yearId === params.yearId)

    if (type && type !== "all") {
      filteredProfiles = filteredProfiles.filter((profile) => profile.type === type)
    }

    if (status && status !== "all") {
      filteredProfiles = filteredProfiles.filter((profile) => profile.status === status)
    }

    if (q) {
      const query = q.toLowerCase()
      filteredProfiles = filteredProfiles.filter((profile) =>
        JSON.stringify(profile.data).toLowerCase().includes(query),
      )
    }

    return NextResponse.json({
      success: true,
      data: filteredProfiles,
      total: filteredProfiles.length,
    })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to fetch profiles" }, { status: 500 })
  }
}

export async function POST(request: NextRequest, { params }: { params: { yearId: string } }) {
  try {
    const body = await request.json()
    const { userId, type, data, status = "draft" } = body

    if (!userId || !type || !data) {
      return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 })
    }

    const requiredFields = {
      student: [
        "fullName",
        "age",
        "gender",
        "birthday",
        "address",
        "email",
        "sayingMotto",
        "department",
        "yearLevel",
        "courseProgram",
        "blockSection",
        "dreamJob",
        "fatherGuardianName",
        "motherGuardianName",
      ],
      alumni: [
        "fullName",
        "age",
        "gender",
        "birthday",
        "address",
        "email",
        "sayingMotto",
        "department",
        "courseProgram",
        "graduationYear",
      ],
      faculty: [
        "fullName",
        "age",
        "gender",
        "birthday",
        "address",
        "email",
        "sayingMotto",
        "position",
        "departmentAssigned",
        "yearsOfService",
        "messageToStudents",
      ],
      staff: [
        "fullName",
        "age",
        "gender",
        "birthday",
        "address",
        "email",
        "sayingMotto",
        "position",
        "officeAssigned",
        "yearsOfService",
      ],
      utility: [
        "fullName",
        "age",
        "gender",
        "birthday",
        "address",
        "email",
        "sayingMotto",
        "position",
        "officeAssigned",
        "yearsOfService",
      ],
      advisory: [
        "fullName",
        "age",
        "gender",
        "birthday",
        "address",
        "email",
        "sayingMotto",
        "position",
        "departmentAssigned",
        "yearsOfService",
        "messageToStudents",
        "academicDepartment",
        "academicYearLevels",
        "academicCourseProgram",
        "academicSections",
      ],
    }

    const required = requiredFields[type as keyof typeof requiredFields] || []
    const missingFields = required.filter((field) => !data[field] || data[field].toString().trim() === "")

    if (missingFields.length > 0) {
      return NextResponse.json(
        {
          success: false,
          error: `Missing required fields: ${missingFields.join(", ")}`,
        },
        { status: 400 },
      )
    }

    if (data.age && (isNaN(Number(data.age)) || Number(data.age) < 1 || Number(data.age) > 100)) {
      return NextResponse.json(
        {
          success: false,
          error: "Age must be a valid number between 1 and 100",
        },
        { status: 400 },
      )
    }

    if (data.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid email format",
        },
        { status: 400 },
      )
    }

    const newProfile: Profile = {
      id: Date.now().toString(),
      userId,
      type,
      status,
      yearId: params.yearId,
      data,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    if (status === "pending") {
      newProfile.submittedAt = new Date().toISOString()
    }

    profiles.push(newProfile)

    return NextResponse.json({
      success: true,
      data: newProfile,
    })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to create profile" }, { status: 500 })
  }
}
