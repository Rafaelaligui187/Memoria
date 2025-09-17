"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import {
  ArrowLeft,
  Mail,
  Phone,
  MapPin,
  GraduationCap,
  Award,
  BookOpen,
  Calendar,
  Building,
  User,
  Trophy,
  Clock,
  Star,
  Heart,
  Quote,
  MessageCircle,
  Users,
  Send,
  CalendarDays,
  MapPinIcon,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
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
    office: "Main Building",
    image: "/images/Picture1.png",
    bio: "My dear Graduates, It is with great pleasure and admiration that I convey my best wishes and profound felicitations to all the graduates, completers, and academic awardees of the School Year 2019-2020. Let us celebrate your milestone in a very unique, virtual and personal way. This has never happened before. We pray that this pandemic will never ever happen again. Let this school year's theme inspire you, Filipino Youth in Mission: Beloved. Gifted. Empowered. Just like other high school graduates, you will enjoy the greatest ever scale of freedom in the next sojourn of your life. You will have many academic and life decisions to make. We hope that what the world is now experiencing has enlightened you not just about the kind of future you want for yourselves but about the kind of leaders, nation builders, agents of change and catalysts of progress you need to become to create a future that is true, good, and beautiful for all of mankind. You have a missionl. Be role models as an ARSCians wherever God will bring you. I would also lke to give special thanks to the parents of our graduates and completers for their patience, understanding, sacrifices and support both moral and financial during these challenging, but rewarding years at Consolatrix College of Toledo City, Inc. Congratulations class of 2020, you did it! You will be missed greatly, and will always be a part of the Consolatrician family.",
    achievements: [
      "Educational Leadership Excellence Award 2023",
      "Community Service Recognition 2022",
      "Outstanding Administrator Award 2021",
    ],
    additionalRoles: ["Board Member - Catholic Educational Association", "Regional Education Council Member"],
    email: "directress@consolatrix.edu.ph",
    phone: "+63 912 345 6789",
    research: ["Educational Leadership in Catholic Institutions", "Student Success Strategies"],
    classesHandled: ["Educational Administration Seminar", "Leadership Development Workshop"],
  },
  {
    id: 2,
    name: "Prof. Juan Carlos Reyes",
    position: "IT Department Head",
    department: "College",
    hierarchy: "department_head",
    schoolYear: "2024-2025",
    yearsOfService: 12,
    specialization: "Computer Science",
    education: "M.S. in Computer Science",
    email: "juan.reyes@consolatrix.edu.ph",
    phone: "+63 912 345 6790",
    office: "IT Building, Room 301",
    image: "/placeholder.svg?height=400&width=400&text=Prof.+Juan+Reyes",
    bio: "Professor Reyes is passionate about emerging technologies and has guided numerous students in their programming journey. He specializes in web development and artificial intelligence, bringing cutting-edge knowledge to the classroom.",
    achievements: [
      "Best Faculty Award 2023",
      "Innovation in Teaching Award 2022",
      "Industry Partnership Excellence 2021",
      "Technology Leadership Award 2020",
    ],
    additionalRoles: ["IT Consultant for Local Businesses", "Technology Advisory Board Member"],
    courses: ["Web Development", "Database Systems", "Artificial Intelligence", "Programming Fundamentals"],
    publications: ["Modern Web Development Practices (2023)", "AI in Education: Opportunities and Challenges (2022)"],
    research: ["Machine Learning Applications in Education", "Web Technologies for Enhanced Learning"],
    classesHandled: ["CS101 - Programming Fundamentals", "CS301 - Web Development", "CS401 - Artificial Intelligence"],
    gallery: [
      "/placeholder.svg?height=300&width=400&text=IT+Lab+1",
      "/placeholder.svg?height=300&width=400&text=IT+Lab+2",
      "/placeholder.svg?height=300&width=400&text=Programming+Class",
      "/placeholder.svg?height=300&width=400&text=Tech+Conference",
    ],
  },
]

// Department color mapping
const getDepartmentColor = (department: string) => {
  const colors = {
    Administration: "from-red-600 to-red-800",
    College: "from-blue-600 to-blue-800",
    "Senior High": "from-green-600 to-green-800",
    "Junior High": "from-purple-600 to-purple-800",
    Elementary: "from-orange-600 to-orange-800",
    "Basic Education": "from-indigo-600 to-indigo-800",
  }
  return colors[department as keyof typeof colors] || "from-gray-600 to-gray-800"
}

const OFFICE_HOURS = [
  { day: "Monday", time: "2:00 PM - 4:00 PM", location: "Faculty Office" },
  { day: "Wednesday", time: "10:00 AM - 12:00 PM", location: "Faculty Office" },
  { day: "Friday", time: "1:00 PM - 3:00 PM", location: "Faculty Office" },
]

const STUDENT_TESTIMONIALS = [
  {
    id: 1,
    name: "Maria Santos",
    year: "4th Year College",
    message: "Professor Reyes made programming so much easier to understand. His teaching style is amazing!",
    rating: 5,
    date: "2024-01-15",
  },
  {
    id: 2,
    name: "John Dela Cruz",
    year: "3rd Year College",
    message: "The best IT professor I've ever had. Always willing to help and explain concepts clearly.",
    rating: 5,
    date: "2024-01-10",
  },
  {
    id: 3,
    name: "Anna Rodriguez",
    year: "2nd Year College",
    message: "Sr. Josephine's wisdom and guidance have been invaluable throughout my studies.",
    rating: 5,
    date: "2024-01-08",
  },
]

export default function FacultyProfilePage() {
  const params = useParams()
  const facultyId = Number.parseInt(params.id as string)
  const [authenticated, setAuthenticated] = useState(false)
  const [activeTab, setActiveTab] = useState("message")
  const [newQuestion, setNewQuestion] = useState("")
  const [studentName, setStudentName] = useState("")

  useEffect(() => {
    setAuthenticated(isAuthenticated())
  }, [])

  const faculty = FACULTY_DATA.find((f) => f.id === facultyId)

  const handleQuestionSubmit = () => {
    if (newQuestion.trim() && studentName.trim()) {
      alert(`Question submitted successfully! ${faculty?.name} will respond soon.`)
      setNewQuestion("")
      setStudentName("")
    }
  }

  if (!faculty) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Faculty Member Not Found</h1>
            <Link href="/faculty">
              <Button>Back to Faculty Directory</Button>
            </Link>
          </div>
        </main>
      </div>
    )
  }

  const departmentColor = getDepartmentColor(faculty.department)

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 via-blue-50/30 to-indigo-50/50">
      <Header />

      <div className={`relative bg-gradient-to-br ${departmentColor} text-white overflow-hidden`}>
        <div className="absolute inset-0 bg-black/20" />
        <div className="absolute top-10 right-10 w-32 h-32 bg-white/10 rounded-full blur-xl"></div>
        <div className="absolute bottom-20 left-20 w-24 h-24 bg-white/5 rounded-full blur-lg"></div>
        <div className="absolute top-1/2 right-1/4 w-16 h-16 bg-white/10 rounded-full blur-md"></div>

        <div className="container relative py-24 px-4">
          <Link href="/faculty">
            <Button variant="ghost" className="text-white hover:bg-white/10 mb-8 backdrop-blur-sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Faculty Directory
            </Button>
          </Link>

          <div className="flex flex-col lg:flex-row items-start lg:items-center gap-12">
            <div className="relative group">
              <div className="w-48 h-48 lg:w-56 lg:h-56 rounded-3xl overflow-hidden border-4 border-white/30 shadow-2xl group-hover:scale-105 transition-transform duration-300">
                <Image
                  src={faculty.image || "/placeholder.svg"}
                  alt={faculty.name}
                  width={224}
                  height={224}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-3 -right-3 bg-white text-gray-900 px-4 py-2 rounded-2xl text-sm font-bold shadow-xl">
                <Clock className="h-4 w-4 inline mr-2" />
                {faculty.yearsOfService} years
              </div>
            </div>

            <div className="flex-1 space-y-6">
              <div>
                <Badge className="bg-white/20 text-white mb-4 px-4 py-2 text-sm font-medium">
                  {faculty.hierarchy === "directress"
                    ? "School Directress"
                    : faculty.hierarchy === "department_head"
                      ? "Department Head"
                      : faculty.hierarchy === "office_head"
                        ? "Office Head"
                        : "Faculty Member"}
                </Badge>
              </div>

              <div>
                <h1 className="text-5xl lg:text-6xl font-bold mb-4 leading-tight">{faculty.name}</h1>
                <p className="text-2xl lg:text-3xl text-white/90 mb-3 font-light">{faculty.position}</p>
                <p className="text-xl text-white/80 mb-6">{faculty.department} Department</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-white/90">
                <div className="flex items-center gap-3 bg-white/10 px-4 py-3 rounded-xl backdrop-blur-sm">
                  <Building className="h-5 w-5" />
                  <span>{faculty.office}</span>
                </div>
                <div className="flex items-center gap-3 bg-white/10 px-4 py-3 rounded-xl backdrop-blur-sm">
                  <Calendar className="h-5 w-5" />
                  <span>School Year {faculty.schoolYear}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <main className="flex-1 py-16">
        <div className="container max-w-7xl">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-12 bg-white shadow-lg rounded-2xl p-2 h-16">
              <TabsTrigger
                value="message"
                className="flex items-center gap-3 text-lg py-4 rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-indigo-600 data-[state=active]:text-white"
              >
                <Heart className="h-5 w-5" />
                Message to Students
              </TabsTrigger>
              <TabsTrigger
                value="connect"
                className="flex items-center gap-3 text-lg py-4 rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-500 data-[state=active]:to-emerald-600 data-[state=active]:text-white"
              >
                <MessageCircle className="h-5 w-5" />
                Connect & Learn
              </TabsTrigger>
              <TabsTrigger
                value="about"
                className="flex items-center gap-3 text-lg py-4 rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-violet-600 data-[state=active]:text-white"
              >
                <User className="h-5 w-5" />
                About Faculty
              </TabsTrigger>
            </TabsList>

            <TabsContent value="message" className="space-y-12">
              <div className="max-w-5xl mx-auto">
                <Card className="border-0 shadow-2xl bg-gradient-to-br from-blue-50 via-white to-indigo-50 overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500"></div>
                  <CardContent className="p-16">
                    <div className="text-center mb-12">
                      <div className="relative inline-block">
                        <Quote className="h-16 w-16 text-blue-600 mx-auto mb-6 opacity-60" />
                        <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-full opacity-20"></div>
                      </div>
                      <h2 className="text-4xl font-bold text-gray-900 mb-4">
                        A Personal Message from {faculty.name.split(" ")[1] || faculty.name.split(" ")[0]}
                      </h2>
                      <div className="w-32 h-1.5 bg-gradient-to-r from-blue-500 to-indigo-600 mx-auto rounded-full"></div>
                    </div>

                    <div className="relative">
                      <div className="absolute -top-8 -left-8 text-8xl text-blue-200 font-serif opacity-50">"</div>
                      <div className="prose prose-xl prose-blue max-w-none text-center relative z-10">
                        <blockquote className="text-2xl leading-relaxed text-gray-700 font-medium italic border-none p-8 bg-white/60 rounded-3xl backdrop-blur-sm">
                          {faculty.bio}
                        </blockquote>
                      </div>
                      <div className="absolute -bottom-8 -right-8 text-8xl text-blue-200 font-serif opacity-50">"</div>
                    </div>

                    <div className="text-center mt-12 pt-8 border-t border-gray-200">
                      <div className="flex items-center justify-center gap-4">
                        <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-blue-200">
                          <Image
                            src={faculty.image || "/placeholder.svg"}
                            alt={faculty.name}
                            width={48}
                            height={48}
                            className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                          />
                        </div>
                        <div className="text-left">
                          <p className="text-gray-900 font-bold text-lg">{faculty.name}</p>
                          <p className="text-gray-600">{faculty.position}</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="connect" className="space-y-8">
              <div className="grid lg:grid-cols-2 gap-8">
                <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200 shadow-lg">
                  <CardHeader className="bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-t-lg">
                    <CardTitle className="flex items-center gap-3 text-xl">
                      <CalendarDays className="h-6 w-6" />
                      Office Hours
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      {OFFICE_HOURS.map((schedule, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-4 bg-white rounded-xl shadow-sm border border-green-100"
                        >
                          <div>
                            <p className="font-semibold text-gray-900">{schedule.day}</p>
                            <p className="text-green-600 font-medium">{schedule.time}</p>
                          </div>
                          <div className="flex items-center gap-2 text-gray-600">
                            <MapPinIcon className="h-4 w-4" />
                            <span className="text-sm">{schedule.location}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="mt-6 p-4 bg-green-100 rounded-xl">
                      <p className="text-green-800 text-sm">
                        <strong>Note:</strong> Feel free to drop by during office hours for academic guidance, career
                        advice, or just a friendly chat!
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200 shadow-lg">
                  <CardHeader className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-t-lg">
                    <CardTitle className="flex items-center gap-3 text-xl">
                      <MessageCircle className="h-6 w-6" />
                      Ask a Question
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Your Name</label>
                        <Input
                          value={studentName}
                          onChange={(e) => setStudentName(e.target.value)}
                          placeholder="Enter your name"
                          className="border-blue-200 focus:border-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Your Question</label>
                        <Textarea
                          value={newQuestion}
                          onChange={(e) => setNewQuestion(e.target.value)}
                          placeholder="Ask about courses, career advice, or anything academic..."
                          rows={4}
                          className="border-blue-200 focus:border-blue-500"
                        />
                      </div>
                      <Button
                        onClick={handleQuestionSubmit}
                        className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700"
                        disabled={!newQuestion.trim() || !studentName.trim()}
                      >
                        <Send className="h-4 w-4 mr-2" />
                        Send Question
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card className="shadow-lg">
                <CardHeader className="bg-gradient-to-r from-purple-500 to-violet-600 text-white rounded-t-lg">
                  <CardTitle className="flex items-center gap-3 text-xl">
                    <Users className="h-6 w-6" />
                    What Students Say
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {STUDENT_TESTIMONIALS.map((testimonial) => (
                      <div
                        key={testimonial.id}
                        className="p-6 bg-gradient-to-br from-purple-50 to-violet-50 rounded-xl border border-purple-100"
                      >
                        <div className="flex items-center gap-1 mb-3">
                          {[...Array(testimonial.rating)].map((_, i) => (
                            <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          ))}
                        </div>
                        <p className="text-gray-700 mb-4 italic">"{testimonial.message}"</p>
                        <div className="border-t border-purple-200 pt-3">
                          <p className="font-semibold text-gray-900">{testimonial.name}</p>
                          <p className="text-sm text-purple-600">{testimonial.year}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="about" className="space-y-8">
              <div className="grid lg:grid-cols-3 gap-8">
                <div className="space-y-6">
                  <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200 shadow-lg">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Mail className="h-5 w-5 text-blue-600" />
                        Contact Information
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center gap-3 p-3 bg-white rounded-lg">
                        <Mail className="h-4 w-4 text-gray-500" />
                        <span className="text-gray-700">{faculty.email}</span>
                      </div>
                      <div className="flex items-center gap-3 p-3 bg-white rounded-lg">
                        <Phone className="h-4 w-4 text-gray-500" />
                        <span className="text-gray-700">{faculty.phone}</span>
                      </div>
                      <div className="flex items-center gap-3 p-3 bg-white rounded-lg">
                        <MapPin className="h-4 w-4 text-gray-500" />
                        <span className="text-gray-700">{faculty.office}</span>
                      </div>
                      <div className="flex items-center gap-3 p-3 bg-white rounded-lg">
                        <Building className="h-4 w-4 text-gray-500" />
                        <span className="text-gray-700">{faculty.department} Department</span>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200 shadow-lg">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Clock className="h-5 w-5 text-green-600" />
                        Legacy & Service
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="text-center p-6 bg-gradient-to-br from-green-100 to-emerald-100 rounded-xl">
                        <div className="text-4xl font-bold text-green-800 mb-2">{faculty.yearsOfService}</div>
                        <div className="text-green-700 font-medium">Years of Dedicated Service</div>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-white rounded-lg">
                        <span className="text-gray-600">Current School Year</span>
                        <Badge variant="secondary" className="bg-green-100 text-green-800">
                          {faculty.schoolYear}
                        </Badge>
                      </div>
                      {faculty.specialization && (
                        <div className="flex justify-between items-center p-3 bg-white rounded-lg">
                          <span className="text-gray-600">Specialization</span>
                          <span className="text-gray-900 font-medium">{faculty.specialization}</span>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>

                <div className="lg:col-span-2 space-y-6">
                  {faculty.education && (
                    <Card className="shadow-lg">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <GraduationCap className="h-5 w-5 text-purple-600" />
                          Education
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="p-6 bg-gradient-to-r from-purple-50 to-violet-50 rounded-xl border border-purple-200">
                          <span className="text-gray-700 font-medium text-lg">{faculty.education}</span>
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  <Card className="shadow-lg">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Award className="h-5 w-5 text-yellow-600" />
                        Achievements & Recognition
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {faculty.achievements?.map((achievement, index) => (
                          <div
                            key={index}
                            className="flex items-start gap-4 p-6 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl border border-yellow-200 shadow-sm"
                          >
                            <Star className="h-6 w-6 text-yellow-600 mt-1 flex-shrink-0" />
                            <span className="text-gray-700 font-medium text-lg">{achievement}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {faculty.research && (
                    <Card className="shadow-lg">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <BookOpen className="h-5 w-5 text-indigo-600" />
                          Research Interests
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          {faculty.research.map((topic, index) => (
                            <div
                              key={index}
                              className="p-4 bg-gradient-to-r from-indigo-50 to-blue-50 rounded-xl border border-indigo-200"
                            >
                              <span className="text-gray-700 font-medium">{topic}</span>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {faculty.classesHandled && (
                    <Card className="shadow-lg">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <BookOpen className="h-5 w-5 text-blue-600" />
                          Classes Handled
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid md:grid-cols-2 gap-4">
                          {faculty.classesHandled.map((course, index) => (
                            <div
                              key={index}
                              className="p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl border border-blue-200"
                            >
                              <span className="text-gray-700 font-medium">{course}</span>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {faculty.gallery && (
                    <Card className="shadow-lg">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Trophy className="h-5 w-5 text-green-600" />
                          Gallery
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                          {faculty.gallery.map((image, index) => (
                            <div key={index} className="aspect-square overflow-hidden rounded-xl shadow-md">
                              <Image
                                src={image || "/placeholder.svg"}
                                alt={`Gallery image ${index + 1}`}
                                width={200}
                                height={200}
                                className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                              />
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  )
}
