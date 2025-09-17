"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import { Users, Calendar, ChevronDown, Search, Filter, Star, Award, GraduationCap } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Header } from "@/components/header"
import { isAuthenticated } from "@/lib/auth"

const FACULTY_DATA = [
  {
    id: 1,
    name: "Sr. Josephine D. Ativo, A.R. PhD, EM",
    position: "School Directress",
    department: "Administration",
    hierarchy: "directress",
    schoolYear: "2024-2025",
    yearsOfService: 15,
    email: "maria.santos@consolatrix.edu.ph",
    office: "Admin Building, Room 201",
    image: "/images/Picture1.png",
    bio: "Dr. Santos has been leading the college with distinction for over a decade. Her research focuses on innovative teaching methodologies and student success strategies.",
    featured: true,
    achievements: ["Educational Leadership Excellence Award 2023", "Community Service Recognition 2022"],
    additionalRoles: ["Board Member - Catholic Educational Association"],
  },
  {
    id: 2,
    name: "Sr. Yolanda N. Navea, A.R.",
    position: "Superior",
    department: "Administration",
    hierarchy: "superior",
    schoolYear: "2024-2025",
    yearsOfService: 20,
    email: "juan.reyes@consolatrix.edu.ph",
    phone: "+63 912 345 6790",
    office: "IT Building, Room 301",
    image: "/images/Picture2.png",
    bio: "Professor Reyes is passionate about emerging technologies and has guided numerous students in their programming journey. He specializes in web development and artificial intelligence.",
    featured: true,
    achievements: ["Technology Innovation Award 2023", "Best Mentor Award 2022"],
    additionalRoles: ["IT Consultant for Local Businesses"],
  },
  {
    id: 3,
    name: "Sr. Ginger L. Acosta, A.R.",
    position: "School Registrar",
    department: "Administration",
    hierarchy: "office_head",
    schoolYear: "2024-2025",
    yearsOfService: 12,
    email: "ana.cruz@consolatrix.edu.ph",
    phone: "+63 912 345 6791",
    office: "Education Building, Room 101",
    image: "/images/Picture3.png",
    bio: "Dr. Cruz is dedicated to preparing future educators with the skills and knowledge needed to inspire young minds. Her research focuses on child development and inclusive education.",
    achievements: [
      "Excellence in Teacher Education Award 2023",
      "Research Publication Award 2022",
      "Community Outreach Recognition 2021",
    ],
    courses: ["Child Development", "Teaching Methods", "Classroom Management", "Educational Psychology"],
    featured: true,
    additionalRoles: ["Academic Records Management Specialist"],
  },
  {
    id: 4,
    name: "Sr. Ma. Corazon J. Barroca, A.R.",
    position: "Basic Education Department Head",
    department: "Basic Education",
    hierarchy: "department_head",
    schoolYear: "2024-2025",
    yearsOfService: 18,
    specialization: "Community Health Nursing",
    education: "Ph.D. in Nursing Science",
    email: "sofia.mendoza@consolatrix.edu.ph",
    phone: "+63 912 345 6793",
    office: "Nursing Building, Room 301",
    image: "/images/Picture4.png",
    bio: "Dr. Mendoza is committed to advancing nursing education and practice. She has extensive experience in community health programs and has published numerous research papers.",
    achievements: [
      "Outstanding Nurse Educator Award 2023",
      "Community Health Excellence Award 2022",
      "Research Innovation Award 2021",
    ],
    courses: ["Community Health Nursing", "Nursing Research", "Health Assessment", "Nursing Leadership"],
    featured: true,
    additionalRoles: ["Department Curriculum Committee Chair"],
  },
  {
    id: 5,
    name: "Dr. Josephine M. Tabal",
    position: "Program Head",
    department: "Education",
    hierarchy: "faculty",
    schoolYear: "2024-2025",
    yearsOfService: 8,
    specialization: "Educational Administration",
    education: "M.A. in Educational Management",
    email: "jasmine.lim@consolatrix.edu.ph",
    phone: "+63 912 345 6795",
    office: "SHS Building, Room 201",
    image: "/images/Picture5.png",
    bio: "Mrs. Lim has been instrumental in developing the Senior High School program, ensuring students are well-prepared for college and their chosen careers.",
    achievements: [
      "Educational Leadership Award 2023",
      "Program Development Excellence 2022",
      "Student Achievement Recognition 2021",
    ],
    courses: ["Educational Leadership", "Curriculum Development", "Student Affairs"],
    featured: true,
    additionalRoles: ["Senior High School Curriculum Coordinator"],
  },
  {
    id: 6,
    name: "Mr. Procoro V. Gonzaga, MATM, MIT",
    position: "Junior High School Principal",
    department: "College of Computer Studies",
    hierarchy: "office_head",
    schoolYear: "2024-2025",
    yearsOfService: 10,
    specialization: "Secondary Education",
    education: "M.A. in Secondary Education",
    email: "roberto.garcia@consolatrix.edu.ph",
    phone: "+63 912 345 6796",
    office: "JHS Building, Room 101",
    image: "/images/Picture6.png",
    bio: "Mr. Garcia is passionate about adolescent development and creating engaging learning environments for junior high school students.",
    achievements: [
      "Secondary Education Excellence Award 2023",
      "Youth Development Recognition 2022",
      "Innovative Teaching Award 2021",
    ],
    courses: ["Secondary Education", "Adolescent Psychology", "Curriculum Planning"],
    featured: true,
  },
  {
    id: 7,
    name: "Mr. Russel D. Tadena",
    position: "Program Head",
    department: "Hospitality Management",
    hierarchy: "faculty",
    schoolYear: "2024-2025",
    yearsOfService: 10,
    specialization: "Elementary Education",
    education: "M.A. in Elementary Education",
    email: "patricia.torres@consolatrix.edu.ph",
    phone: "+63 912 345 6797",
    office: "Elementary Building, Room 201",
    image: "/images/Picture7.png",
    bio: "Mrs. Torres has dedicated her career to nurturing young learners and has been recognized for her innovative approaches to elementary education.",
    achievements: [
      "Elementary Education Excellence Award 2023",
      "Child Development Recognition 2022",
      "Community Engagement Award 2021",
    ],
    courses: ["Elementary Education", "Child Development", "Reading Instruction"],
    featured: true,
  },
  {
    id: 8,
    name: "Mr. Niño Angelo A. Serentas",
    position: "Adviser",
    department: "BS Entrepreneurship",
    hierarchy: "faculty",
    schoolYear: "2024-2025",
    yearsOfService: 10,
    specialization: "Elementary Education",
    education: "M.A. in Elementary Education",
    email: "patricia.torres@consolatrix.edu.ph",
    phone: "+63 912 345 6797",
    office: "Elementary Building, Room 201",
    image: "/images/Picture8.png",
    bio: "Mrs. Torres has dedicated her career to nurturing young learners and has been recognized for her innovative approaches to elementary education.",
    achievements: [
      "Elementary Education Excellence Award 2023",
      "Child Development Recognition 2022",
      "Community Engagement Award 2021",
    ],
    courses: ["Elementary Education", "Child Development", "Reading Instruction"],
    featured: true,
  },
  {
    id: 9,
    name: "Mrs. Eleanor B. Bacalso",
    position: "Academic Coordinator",
    department: "School",
    hierarchy: "office_head",
    schoolYear: "2024-2025",
    yearsOfService: 10,
    email: "patricia.torres@consolatrix.edu.ph",
    phone: "+63 912 345 6797",
    office: "Elementary Building, Room 201",
    image: "/images/Picture9.png",
    bio: "Mrs. Torres has dedicated her career to nurturing young learners and has been recognized for her innovative approaches to elementary education.",
    achievements: [
      "Elementary Education Excellence Award 2023",
      "Child Development Recognition 2022",
      "Community Engagement Award 2021",
    ],
    courses: ["Elementary Education", "Child Development", "Reading Instruction"],
    featured: true,
  },
  {
    id: 10,
    name: "Mrs. Mary Leizl C. Dela Cruz",
    position: "Student Activity Coordinator",
    department: "School",
    hierarchy: "office_head",
    schoolYear: "2024-2025",
    yearsOfService: 10,
    email: "patricia.torres@consolatrix.edu.ph",
    phone: "+63 912 345 6797",
    office: "Elementary Building, Room 201",
    image: "/images/Picture10.png",
    bio: "Mrs. Torres has dedicated her career to nurturing young learners and has been recognized for her innovative approaches to elementary education.",
    achievements: [
      "Elementary Education Excellence Award 2023",
      "Child Development Recognition 2022",
      "Community Engagement Award 2021",
    ],
    courses: ["Elementary Education", "Child Development", "Reading Instruction"],
    featured: true,
  },
  {
    id: 11,
    name: "Mr. Kenneth Gimenez",
    position: "Assist. Student Activity Coordinator",
    department: "School",
    hierarchy: "office_head",
    schoolYear: "2024-2025",
    yearsOfService: 10,
    specialization: "Elementary Education",
    education: "M.A. in Elementary Education",
    email: "patricia.torres@consolatrix.edu.ph",
    phone: "+63 912 345 6797",
    office: "Elementary Building, Room 201",
    image: "/images/mgrad.jpg",
    bio: "Mrs. Torres has dedicated her career to nurturing young learners and has been recognized for her innovative approaches to elementary education.",
    achievements: [
      "Elementary Education Excellence Award 2023",
      "Child Development Recognition 2022",
      "Community Engagement Award 2021",
    ],
    courses: ["Elementary Education", "Child Development", "Reading Instruction"],
    featured: true,
  },
  {
    id: 12,
    name: "Mr. Fiel Matthew L. Gepitulan",
    position: "Sports Coordinator",
    department: "School",
    hierarchy: "office_head",
    schoolYear: "2024-2025",
    yearsOfService: 10,
    specialization: "Elementary Education",
    education: "M.A. in Elementary Education",
    email: "patricia.torres@consolatrix.edu.ph",
    phone: "+63 912 345 6797",
    office: "Elementary Building, Room 201",
    image: "/images/Picture11.png",
    bio: "Mrs. Torres has dedicated her career to nurturing young learners and has been recognized for her innovative approaches to elementary education.",
    achievements: [
      "Elementary Education Excellence Award 2023",
      "Child Development Recognition 2022",
      "Community Engagement Award 2021",
    ],
    courses: ["Elementary Education", "Child Development", "Reading Instruction"],
    featured: true,
  },
  {
    id: 13,
    name: "Ms. Ma. Corazon A. Salazar",
    position: "Adviser",
    department: "Kindergarten",
    hierarchy: "faculty",
    schoolYear: "2024-2025",
    yearsOfService: 10,
    specialization: "Business Management",
    education: "MBA in Business Administration",
    email: "miguel.bautista@consolatrix.edu.ph",
    phone: "+63 912 345 6792",
    office: "Business Building, Room 205",
    image: "/placeholder.svg?height=400&width=400&text=Prof.+Miguel+Bautista",
    bio: "Professor Bautista brings real-world business experience to the classroom. He has worked in various industries before joining academia and continues to consult for local businesses.",
    achievements: [
      "Industry Excellence Award 2023",
      "Student Mentorship Award 2022",
      "Business Innovation Recognition 2021",
    ],
    courses: ["Strategic Management", "Marketing Principles", "Entrepreneurship", "Business Ethics"],
    featured: false,
  },
  {
    id: 14,
    name: "Ms. Jeramie G. Dela Cerna",
    position: "St. Agnes Adviser",
    department: "Elementary",
    hierarchy: "faculty",
    schoolYear: "2024-2025",
    yearsOfService: 10,
    specialization: "Business Management",
    education: "MBA in Business Administration",
    email: "miguel.bautista@consolatrix.edu.ph",
    phone: "+63 912 345 6792",
    office: "Business Building, Room 205",
    image: "/placeholder.svg?height=400&width=400&text=Prof.+Miguel+Bautista",
    bio: "Professor Bautista brings real-world business experience to the classroom. He has worked in various industries before joining academia and continues to consult for local businesses.",
    achievements: [
      "Industry Excellence Award 2023",
      "Student Mentorship Award 2022",
      "Business Innovation Recognition 2021",
    ],
    courses: ["Strategic Management", "Marketing Principles", "Entrepreneurship", "Business Ethics"],
    featured: false,
  },
  {
    id: 15,
    name: "Ms. Andree Adlawan",
    position: "St. Therese Adviser",
    department: "Elementary",
    hierarchy: "faculty",
    schoolYear: "2024-2025",
    yearsOfService: 10,
    specialization: "Business Management",
    education: "MBA in Business Administration",
    email: "miguel.bautista@consolatrix.edu.ph",
    phone: "+63 912 345 6792",
    office: "Business Building, Room 205",
    image: "/placeholder.svg?height=400&width=400&text=Prof.+Miguel+Bautista",
    bio: "Professor Bautista brings real-world business experience to the classroom. He has worked in various industries before joining academia and continues to consult for local businesses.",
    achievements: [
      "Industry Excellence Award 2023",
      "Student Mentorship Award 2022",
      "Business Innovation Recognition 2021",
    ],
    courses: ["Strategic Management", "Marketing Principles", "Entrepreneurship", "Business Ethics"],
    featured: false,
  },
  {
    id: 16,
    name: "Mrs. Karen Mae G. Chiong",
    position: "St. Rose of Lima Adviser",
    department: "Elementary",
    hierarchy: "faculty",
    schoolYear: "2024-2025",
    yearsOfService: 10,
    specialization: "Business Management",
    education: "MBA in Business Administration",
    email: "miguel.bautista@consolatrix.edu.ph",
    phone: "+63 912 345 6792",
    office: "Business Building, Room 205",
    image: "/placeholder.svg?height=400&width=400&text=Prof.+Miguel+Bautista",
    bio: "Professor Bautista brings real-world business experience to the classroom. He has worked in various industries before joining academia and continues to consult for local businesses.",
    achievements: [
      "Industry Excellence Award 2023",
      "Student Mentorship Award 2022",
      "Business Innovation Recognition 2021",
    ],
    courses: ["Strategic Management", "Marketing Principles", "Entrepreneurship", "Business Ethics"],
    featured: false,
  },
  {
    id: 17,
    name: "Ms. Shaira Marie L. Cantiberos",
    position: "St. Rita Adviser",
    department: "Elementary",
    hierarchy: "faculty",
    schoolYear: "2024-2025",
    yearsOfService: 10,
    specialization: "Business Management",
    education: "MBA in Business Administration",
    email: "miguel.bautista@consolatrix.edu.ph",
    phone: "+63 912 345 6792",
    office: "Business Building, Room 205",
    image: "/placeholder.svg?height=400&width=400&text=Prof.+Miguel+Bautista",
    bio: "Professor Bautista brings real-world business experience to the classroom. He has worked in various industries before joining academia and continues to consult for local businesses.",
    achievements: [
      "Industry Excellence Award 2023",
      "Student Mentorship Award 2022",
      "Business Innovation Recognition 2021",
    ],
    courses: ["Strategic Management", "Marketing Principles", "Entrepreneurship", "Business Ethics"],
    featured: false,
  },
  {
    id: 18,
    name: "Mr. Charles Gwen C Cañares",
    position: "St. Raphael Adviser",
    department: "Elementary",
    hierarchy: "faculty",
    schoolYear: "2024-2025",
    yearsOfService: 10,
    specialization: "Business Management",
    education: "MBA in Business Administration",
    email: "miguel.bautista@consolatrix.edu.ph",
    phone: "+63 912 345 6792",
    office: "Business Building, Room 205",
    image: "/placeholder.svg?height=400&width=400&text=Prof.+Miguel+Bautista",
    bio: "Professor Bautista brings real-world business experience to the classroom. He has worked in various industries before joining academia and continues to consult for local businesses.",
    achievements: [
      "Industry Excellence Award 2023",
      "Student Mentorship Award 2022",
      "Business Innovation Recognition 2021",
    ],
    courses: ["Strategic Management", "Marketing Principles", "Entrepreneurship", "Business Ethics"],
    featured: false,
  },
  {
    id: 19,
    name: "Mrs. Gemma Teresa A. Sitanos",
    position: "St. Ezekiel Moreno Adviser",
    department: "Elementary",
    hierarchy: "faculty",
    schoolYear: "2024-2025",
    yearsOfService: 10,
    specialization: "Business Management",
    education: "MBA in Business Administration",
    email: "miguel.bautista@consolatrix.edu.ph",
    phone: "+63 912 345 6792",
    office: "Business Building, Room 205",
    image: "/placeholder.svg?height=400&width=400&text=Prof.+Miguel+Bautista",
    bio: "Professor Bautista brings real-world business experience to the classroom. He has worked in various industries before joining academia and continues to consult for local businesses.",
    achievements: [
      "Industry Excellence Award 2023",
      "Student Mentorship Award 2022",
      "Business Innovation Recognition 2021",
    ],
    courses: ["Strategic Management", "Marketing Principles", "Entrepreneurship", "Business Ethics"],
    featured: false,
  },
  {
    id: 20,
    name: "Ms. Simple Mar Ompong",
    position: "G",
    department: "Junior High",
    hierarchy: "staff",
    schoolYear: "2024-2025",
    yearsOfService: 10,
    specialization: "Business Management",
    education: "MBA in Business Administration",
    email: "miguel.bautista@consolatrix.edu.ph",
    phone: "+63 912 345 6792",
    office: "Business Building, Room 205",
    image: "/placeholder.svg?height=400&width=400&text=Prof.+Miguel+Bautista",
    bio: "Professor Bautista brings real-world business experience to the classroom. He has worked in various industries before joining academia and continues to consult for local businesses.",
    achievements: [
      "Industry Excellence Award 2023",
      "Student Mentorship Award 2022",
      "Business Innovation Recognition 2021",
    ],
    courses: ["Strategic Management", "Marketing Principles", "Entrepreneurship", "Business Ethics"],
    featured: false,
  },
]

const SCHOOL_YEARS = ["2024-2025", "2023-2024", "2022-2023", "2021-2022"]

const HIERARCHY_ORDER = {
  directress: 1,
  superior: 2,
  department_head: 3,
  office_head: 4,
  faculty: 5,
  staff: 6,
}

const ROLES_ORDER = ["directress", "superior", "department_head", "office_head", "faculty", "staff"]

const departments = [
  "All",
  "Faculty",
  "Staff",
  "Maintenance",
  ...new Set(FACULTY_DATA.map((faculty) => faculty.department)),
]

export default function FacultyPage() {
  const [authenticated, setAuthenticated] = useState(false)
  const [selectedDepartment, setSelectedDepartment] = useState("All")
  const [selectedSchoolYear, setSelectedSchoolYear] = useState("2024-2025")
  const [sortBy, setSortBy] = useState<"name" | "department" | "hierarchy">("hierarchy")
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    setAuthenticated(isAuthenticated())
  }, [])

  const filteredFaculty = FACULTY_DATA.filter((faculty) => {
    const matchesDepartment =
      selectedDepartment === "All" ||
      (selectedDepartment === "Faculty" && faculty.hierarchy === "faculty") ||
      (selectedDepartment === "Staff" && faculty.hierarchy === "staff") ||
      (selectedDepartment === "Maintenance" && faculty.hierarchy === "maintenance") ||
      faculty.department === selectedDepartment
    const matchesSchoolYear = faculty.schoolYear === selectedSchoolYear
    const matchesSearch =
      faculty.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faculty.position.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faculty.department.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesDepartment && matchesSchoolYear && matchesSearch
  })

  const sortedFaculty = [...filteredFaculty].sort((a, b) => {
    switch (sortBy) {
      case "name":
        return a.name.localeCompare(b.name)
      case "department":
        return a.department.localeCompare(b.department)
      case "hierarchy":
        return HIERARCHY_ORDER[a.hierarchy] - HIERARCHY_ORDER[b.hierarchy]
      default:
        return 0
    }
  })

  const getHierarchyByDepartment = () => {
    const departments = new Set(filteredFaculty.map((f) => f.department))
    const hierarchyByDept = {}

    departments.forEach((dept) => {
      const deptFaculty = filteredFaculty.filter(
        (f) => f.department === dept && f.hierarchy !== "faculty" && f.hierarchy !== "staff",
      )

      const hasDepartmentHead = deptFaculty.some((f) => f.hierarchy === "department_head")

      if (!hasDepartmentHead && dept !== "Administration") {
        // Generate mock Department Head if none exists
        const mockDeptHead = {
          id: `mock-${dept}`,
          name: `Department Head - ${dept}`,
          position: "Department Head",
          department: dept,
          hierarchy: "department_head",
          schoolYear: selectedSchoolYear,
          yearsOfService: 0,
          image: "/placeholder.svg?height=400&width=400&text=Department+Head",
          bio: "Department Head position - To be filled",
          featured: false,
          achievements: [],
          additionalRoles: [],
          isMockup: true,
        }
        deptFaculty.push(mockDeptHead)
      }

      hierarchyByDept[dept] = deptFaculty.sort((a, b) => HIERARCHY_ORDER[a.hierarchy] - HIERARCHY_ORDER[b.hierarchy])
    })

    return hierarchyByDept
  }

  const hierarchyByDepartment = getHierarchyByDepartment()

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20">
      <Header />

      <div className="relative bg-gradient-to-br from-blue-900 via-indigo-900 to-purple-900 text-white overflow-hidden">
        <div className="absolute inset-0 bg-[url('/api/placeholder/1920/1080')] bg-cover bg-center opacity-10" />
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/90 via-indigo-900/80 to-purple-900/90" />

        <div className="container relative py-32 px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-5xl mx-auto text-center"
          >
            <div className="inline-flex items-center gap-3 bg-white/15 backdrop-blur-md px-6 py-3 rounded-full mb-8 border border-white/20">
              <GraduationCap className="h-5 w-5" />
              <span className="text-sm font-semibold tracking-wide">Excellence in Education</span>
            </div>

            <h1 className="text-5xl md:text-7xl font-bold mb-8 bg-gradient-to-r from-white via-blue-100 to-indigo-200 bg-clip-text text-transparent">
              Faculty & Staff
            </h1>

            <p className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto mb-12 leading-relaxed">
              Meet the dedicated educators and professionals who inspire excellence and shape the future at Consolatrix
              College
            </p>

            <div className="inline-flex items-center gap-6 bg-white/20 backdrop-blur-lg p-8 rounded-3xl border-2 border-white/30 shadow-2xl shadow-blue-900/20">
              <Calendar className="h-8 w-8 text-white" />
              <div className="text-left">
                <p className="text-sm text-blue-200 mb-1">Academic Year</p>
                <Select value={selectedSchoolYear} onValueChange={setSelectedSchoolYear}>
                  <SelectTrigger className="w-56 h-14 bg-white/25 border-2 border-white/50 text-white hover:bg-white/35 transition-all duration-300 text-xl font-bold shadow-lg backdrop-blur-sm">
                    <SelectValue />
                    <ChevronDown className="h-6 w-6 text-white" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border-2 border-blue-200 shadow-xl">
                    {SCHOOL_YEARS.map((year) => (
                      <SelectItem key={year} value={year} className="text-lg font-medium">
                        {year}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="bg-white py-20">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-800 px-4 py-2 rounded-full mb-6">
              <Award className="h-4 w-4" />
              <span className="text-sm font-semibold">Leadership Structure</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">Our Leadership</h2>
            <div className="w-24 h-1 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full mx-auto mb-6"></div>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Discover our organizational structure and the dedicated leaders who guide each department
            </p>
          </motion.div>

          <div className="space-y-24">
            {Object.entries(hierarchyByDepartment).map(([department, faculty], deptIndex) => (
              <motion.div
                key={department}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: deptIndex * 0.2 }}
                className={`relative ${deptIndex % 2 === 0 ? "bg-gradient-to-br from-blue-50/50 to-indigo-50/30" : "bg-gradient-to-br from-slate-50 to-gray-50/50"} p-12 rounded-3xl shadow-lg border border-gray-100`}
              >
                <div className="text-center mb-16">
                  <h3 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                    {department === "Administration" ? "🏛️ School Leadership" : `🎓 ${department} Department`}
                  </h3>
                  <div className="w-20 h-1 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full mx-auto"></div>
                </div>

                <div className="relative">
                  {faculty
                    .filter(
                      (f) =>
                        f.hierarchy === "directress" || f.hierarchy === "superior" || f.hierarchy === "department_head",
                    )
                    .map((head, headIndex) => (
                      <div key={head.id} className="relative mb-20">
                        <div className="flex justify-center">
                          <div className="max-w-sm">
                            <Link href={head.isMockup ? "#" : `/faculty/${head.id}`}>
                              <Card
                                className={`group hover:shadow-2xl transition-all duration-700 border-2 border-transparent hover:border-blue-400 transform hover:-translate-y-3 hover:rotate-1 ${head.isMockup ? "opacity-70 cursor-not-allowed" : ""} bg-white shadow-xl`}
                              >
                                <div className="relative overflow-hidden rounded-t-xl">
                                  <div className="aspect-[4/3] overflow-hidden">
                                    <Image
                                      src={head.image || "/placeholder.svg"}
                                      alt={head.name}
                                      width={400}
                                      height={300}
                                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                    />
                                  </div>
                                  <div className="absolute top-4 left-4">
                                    <Badge
                                      className={`
                                      ${head.hierarchy === "directress" ? "bg-gradient-to-r from-red-500 to-pink-500 text-white border-0" : ""}
                                      ${head.hierarchy === "superior" ? "bg-gradient-to-r from-purple-500 to-indigo-500 text-white border-0" : ""}
                                      ${head.hierarchy === "department_head" ? "bg-gradient-to-r from-blue-500 to-cyan-500 text-white border-0" : ""}
                                      px-4 py-2 text-sm font-bold shadow-lg backdrop-blur-sm
                                    `}
                                    >
                                      {head.hierarchy === "directress"
                                        ? "🎯 School Directress"
                                        : head.hierarchy === "superior"
                                          ? "⭐ Superior"
                                          : "👑 Department Head"}
                                    </Badge>
                                  </div>
                                  {head.isMockup && (
                                    <div className="absolute inset-0 bg-gradient-to-t from-gray-900/60 to-transparent flex items-end justify-center p-4 rounded-t-xl">
                                      <span className="text-white text-sm font-bold bg-orange-500/90 px-4 py-2 rounded-full">
                                        🔍 Position Available
                                      </span>
                                    </div>
                                  )}
                                </div>
                                <CardContent className="p-8 text-center bg-gradient-to-b from-white to-gray-50/50">
                                  <h3
                                    className={`text-2xl font-bold mb-3 transition-colors ${head.isMockup ? "text-gray-500" : "text-gray-900 group-hover:text-blue-600"}`}
                                  >
                                    {head.name}
                                  </h3>
                                  <p
                                    className={`text-lg font-semibold mb-3 ${
                                      head.hierarchy === "directress"
                                        ? "text-red-600"
                                        : head.hierarchy === "superior"
                                          ? "text-purple-600"
                                          : "text-blue-600"
                                    }`}
                                  >
                                    {head.position}
                                  </p>
                                  {!head.isMockup && (
                                    <div className="flex items-center justify-center gap-2 text-gray-600">
                                      <Star className="h-4 w-4 text-yellow-500" />
                                      <span>{head.yearsOfService} years of excellence</span>
                                    </div>
                                  )}
                                </CardContent>
                              </Card>
                            </Link>
                          </div>
                        </div>

                        {faculty.filter((f) => f.hierarchy === "office_head" || f.hierarchy === "faculty").length >
                          0 && (
                          <div className="absolute left-1/2 transform -translate-x-1/2 top-full w-2 h-20 overflow-hidden rounded-full">
                            <div className="absolute inset-0 bg-gradient-to-b from-blue-400 via-indigo-500 to-purple-600 rounded-full"></div>
                            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/60 to-transparent rounded-full animate-pulse"></div>
                            <div
                              className="absolute w-full h-12 bg-gradient-to-b from-cyan-300 via-blue-400 to-transparent rounded-full animate-bounce opacity-80"
                              style={{ animationDuration: "2.5s" }}
                            ></div>
                            <div
                              className="absolute w-full h-8 bg-gradient-to-b from-white/80 to-transparent rounded-full animate-ping opacity-60"
                              style={{ animationDuration: "3s" }}
                            ></div>
                          </div>
                        )}
                      </div>
                    ))}

                  {faculty.filter((f) => f.hierarchy === "office_head" || f.hierarchy === "faculty").length > 0 && (
                    <div className="relative">
                      <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-10 w-4/5 h-2 overflow-hidden rounded-full">
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-500 to-transparent rounded-full"></div>
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/70 to-transparent rounded-full animate-pulse"></div>
                        <div
                          className="absolute w-1/2 h-full bg-gradient-to-r from-transparent via-cyan-400 to-transparent rounded-full animate-ping opacity-70"
                          style={{ animationDuration: "4s" }}
                        ></div>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 pt-8">
                        {faculty
                          .filter((f) => f.hierarchy === "office_head" || f.hierarchy === "faculty")
                          .map((member, memberIndex) => (
                            <motion.div
                              key={member.id}
                              initial={{ opacity: 0, scale: 0.8, y: 20 }}
                              animate={{ opacity: 1, scale: 1, y: 0 }}
                              transition={{ duration: 0.5, delay: memberIndex * 0.1 }}
                            >
                              <Link href={`/faculty/${member.id}`}>
                                <Card className="group hover:shadow-2xl transition-all duration-500 border-2 border-gray-100 hover:border-blue-300 transform hover:-translate-y-2 hover:rotate-1 bg-white">
                                  <div className="relative overflow-hidden rounded-t-lg">
                                    <div className="aspect-[4/3] overflow-hidden">
                                      <Image
                                        src={member.image || "/placeholder.svg"}
                                        alt={member.name}
                                        width={320}
                                        height={240}
                                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                      />
                                    </div>
                                    <div className="absolute top-3 right-3">
                                      <Badge
                                        className={`
                                        ${member.hierarchy === "office_head" ? "bg-gradient-to-r from-green-500 to-emerald-500 text-white border-0" : "bg-gradient-to-r from-blue-500 to-indigo-500 text-white border-0"}
                                        px-3 py-1 text-xs font-bold shadow-lg
                                      `}
                                      >
                                        {member.hierarchy === "office_head" ? "🏢 Office Head" : "👨‍🏫 Faculty"}
                                      </Badge>
                                    </div>
                                  </div>
                                  <CardContent className="p-6 bg-gradient-to-b from-white to-gray-50/30">
                                    <h4 className="font-bold text-base text-gray-900 mb-2 group-hover:text-blue-600 transition-colors line-clamp-2">
                                      {member.name}
                                    </h4>
                                    <p className="text-sm text-blue-600 font-semibold mb-2 line-clamp-1">
                                      {member.position}
                                    </p>
                                    <div className="flex items-center gap-1 text-xs text-gray-500">
                                      <Star className="h-3 w-3 text-yellow-500" />
                                      <span>{member.yearsOfService} years</span>
                                    </div>
                                  </CardContent>
                                </Card>
                              </Link>
                            </motion.div>
                          ))}
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-br from-gray-50 via-blue-50/20 to-indigo-50/10 py-20">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center gap-2 bg-indigo-100 text-indigo-800 px-4 py-2 rounded-full mb-6">
              <Users className="h-4 w-4" />
              <span className="text-sm font-semibold">Complete Directory</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">All Team Members</h2>
            <div className="w-24 h-1 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full mx-auto mb-6"></div>
            <p className="text-gray-600 text-lg">
              <span className="font-semibold text-indigo-600">{sortedFaculty.length}</span> dedicated professionals for{" "}
              {selectedSchoolYear}
            </p>
          </motion.div>

          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-12">
            <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  placeholder="Search faculty and staff..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-3 w-full sm:w-80 border-2 border-gray-200 focus:border-blue-500 rounded-xl shadow-sm"
                />
              </div>

              <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
                <SelectTrigger className="w-full sm:w-48 h-12 border-2 border-gray-200 focus:border-blue-500 rounded-xl shadow-sm">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Filter by..." />
                </SelectTrigger>
                <SelectContent>
                  {departments.map((dept) => (
                    <SelectItem key={dept} value={dept}>
                      {dept}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Select value={sortBy} onValueChange={(value) => setSortBy(value as any)}>
              <SelectTrigger className="w-full lg:w-48 h-12 border-2 border-gray-200 focus:border-blue-500 rounded-xl shadow-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="hierarchy">Sort by Hierarchy</SelectItem>
                <SelectItem value="name">Sort by Name</SelectItem>
                <SelectItem value="department">Sort by Department</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {sortedFaculty.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {sortedFaculty.map((faculty, index) => (
                <motion.div
                  key={faculty.id}
                  initial={{ opacity: 0, y: 30, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.5, delay: index * 0.05 }}
                >
                  <Link href={`/faculty/${faculty.id}`}>
                    <Card className="group overflow-hidden hover:shadow-2xl transition-all duration-700 h-full bg-white border-2 border-gray-100 hover:border-blue-300 transform hover:-translate-y-3 hover:rotate-1">
                      <div className="relative overflow-hidden">
                        <div className="aspect-[4/3] overflow-hidden">
                          <Image
                            src={faculty.image || "/placeholder.svg"}
                            alt={faculty.name}
                            width={400}
                            height={300}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                          />
                        </div>
                        <div className="absolute top-3 right-3">
                          <Badge
                            className={`
                              ${faculty.department === "College" ? "bg-gradient-to-r from-blue-500 to-cyan-500 text-white border-0" : ""}
                              ${faculty.department === "Senior High" ? "bg-gradient-to-r from-green-500 to-emerald-500 text-white border-0" : ""}
                              ${faculty.department === "Junior High" ? "bg-gradient-to-r from-purple-500 to-indigo-500 text-white border-0" : ""}
                              ${faculty.department === "Elementary" ? "bg-gradient-to-r from-orange-500 to-red-500 text-white border-0" : ""}
                              ${faculty.department === "Basic Education" ? "bg-gradient-to-r from-red-500 to-pink-500 text-white border-0" : ""}
                              ${faculty.department === "Administration" ? "bg-gradient-to-r from-gray-600 to-gray-700 text-white border-0" : ""}
                              px-3 py-1 text-xs font-bold shadow-lg
                            `}
                          >
                            {faculty.department}
                          </Badge>
                        </div>
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      </div>

                      <CardContent className="p-6 bg-gradient-to-b from-white to-gray-50/30">
                        <h3 className="font-bold text-lg text-gray-900 mb-2 group-hover:text-blue-600 transition-colors line-clamp-2">
                          {faculty.name}
                        </h3>
                        <p className="text-blue-600 font-semibold text-sm mb-2 line-clamp-1">{faculty.position}</p>
                        <p className="text-gray-600 text-sm mb-3">{faculty.department}</p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1 text-gray-500 text-sm">
                            <Star className="h-3 w-3 text-yellow-500" />
                            <span>{faculty.yearsOfService} years</span>
                          </div>
                          {faculty.featured && (
                            <Badge className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1">⭐ Featured</Badge>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                </motion.div>
              ))}
            </div>
          ) : (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center py-20">
              <div className="bg-gradient-to-br from-gray-100 to-gray-200 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-8">
                <Users className="h-10 w-10 text-gray-400" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">No team members found</h3>
              <p className="text-gray-600 mb-8 max-w-md mx-auto">
                We couldn't find any faculty or staff matching your current search and filter criteria.
              </p>
              <Button
                onClick={() => {
                  setSelectedDepartment("All")
                  setSelectedSchoolYear("2024-2025")
                  setSearchQuery("")
                }}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
              >
                Clear All Filters
              </Button>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  )
}
