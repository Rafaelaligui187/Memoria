"use client"

import { notFound } from "next/navigation"
import { ClassYearbookPage } from "@/components/class-yearbook-page"
import type { Person, UserRole } from "@/types/yearbook"

type CourseId = "bsit" | "beed" | "bsed" | "bshm" | "bsentrep" | "bscs"
type YearId = "1st-year" | "2nd-year" | "3rd-year" | "4th-year"
type BlockId = "block-a" | "block-b" | "block-c" | "block-d"

const collegeData = {
  bsit: {
    name: "BSIT",
    fullName: "Bachelor of Science in Information Technology",
    years: {
      "1st-year": {
        name: "1st Year",
        blocks: {
          "block-a": {
            name: "Block A",
            schoolYears: {
              "2024-2025": {
                academicYear: "2024-2025",
                advisers: [
                  {
                    id: "prof-smith",
                    name: "Prof. John Smith",
                    image: "/placeholder.svg",
                    quote: "Innovate and create the future.",
                  },
                ],
                students: [
                  {
                    id: "s101",
                    name: "Alice Johnson",
                    image: "/placeholder.svg",
                    quote: "Coding my way to success.",
                    honors: "Dean's Lister",
                  },
                  { id: "s102", name: "Bob Williams", image: "/placeholder.svg", quote: "Building digital dreams." },
                  { id: "s103", name: "Charlie Brown", image: "/placeholder.svg", quote: "Tech enthusiast." },
                  { id: "s104", name: "Diana Miller", image: "/placeholder.svg", quote: "Future software engineer." },
                  { id: "s105", name: "Eve Davis", image: "/placeholder.svg", quote: "Passionate about algorithms." },
                  { id: "s106", name: "Frank White", image: "/placeholder.svg", quote: "Always learning new tech." },
                  { id: "s107", name: "Grace Taylor", image: "/placeholder.svg", quote: "Designing user experiences." },
                  { id: "s108", name: "Henry Wilson", image: "/placeholder.svg", quote: "Problem solver." },
                  { id: "s109", name: "Ivy Moore", image: "/placeholder.svg", quote: "Cybersecurity advocate." },
                  { id: "s110", name: "Jack Green", image: "/placeholder.svg", quote: "Aspiring data scientist." },
                  {
                    id: "s111",
                    name: "Austine Kino C. Martinez",
                    image: "/placeholder.svg",
                    quote: "Aspiring network engineer",
                    honors: "Dean's Lister",
                  },
                ],
                officers: [
                  {
                    id: "s101",
                    name: "John Louise Bergabena",
                    image: "/placeholder.svg",
                    position: "Mayor",
                    quote: "Leading with code.",
                    honors: "Dean's Lister",
                  },
                  {
                    id: "s102",
                    name: "Vanni Louise Tanutan",
                    image: "/placeholder.svg",
                    position: "Vice Mayor",
                    quote: "Supporting the team.",
                    honors: "Dean's Lister",
                  },
                  {
                    id: "s111",
                    name: "Austine Kino C. Martinez",
                    image: "/placeholder.svg",
                    position: "Secretary",
                    quote: "Uhay",
                    honors: "Dean's Lister",
                  },
                ],
                activities: [
                  {
                    id: "a1",
                    title: "Hackathon 2024",
                    image: "/placeholder.svg",
                    description: "Annual coding competition.",
                    date: "Oct 20, 2024",
                  },
                  {
                    id: "a2",
                    title: "IT Week Celebration",
                    image: "/placeholder.svg",
                    description: "A week of tech talks and workshops.",
                    date: "Nov 15-19, 2024",
                  },
                ],
              },
              "2023-2024": {
                academicYear: "2023-2024",
                advisers: [
                  {
                    id: "prof-jones",
                    name: "Prof. Emily Jones",
                    image: "/placeholder.svg",
                    quote: "Empowering the next generation of IT professionals.",
                  },
                ],
                students: [
                  {
                    id: "s201",
                    name: "Karen Hall",
                    image: "/placeholder.svg",
                    quote: "Innovating for a better tomorrow.",
                  },
                  { id: "s202", name: "Liam King", image: "/placeholder.svg", quote: "Driven by technology." },
                  {
                    id: "s203",
                    name: "Mia Wright",
                    image: "/placeholder.svg",
                    quote: "Passionate about web development.",
                  },
                  {
                    id: "s204",
                    name: "Noah Scott",
                    image: "/placeholder.svg",
                    quote: "Exploring AI and machine learning.",
                  },
                  {
                    id: "s205",
                    name: "Olivia Adams",
                    image: "/placeholder.svg",
                    quote: "Creating impactful software.",
                  },
                ],
                officers: [],
                activities: [],
              },
            },
          },
          "block-b": {
            name: "Block B",
            schoolYears: {
              "2024-2025": {
                academicYear: "2024-2025",
                advisers: [
                  {
                    id: "prof-jones",
                    name: "Prof. Emily Jones",
                    image: "/placeholder.svg",
                    quote: "Empowering the next generation of IT professionals.",
                  },
                ],
                students: [
                  {
                    id: "s111",
                    name: "Karen Hall",
                    image: "/placeholder.svg",
                    quote: "Innovating for a better tomorrow.",
                  },
                  { id: "s112", name: "Liam King", image: "/placeholder.svg", quote: "Driven by technology." },
                  {
                    id: "s113",
                    name: "Mia Wright",
                    image: "/placeholder.svg",
                    quote: "Passionate about web development.",
                  },
                  {
                    id: "s114",
                    name: "Noah Scott",
                    image: "/placeholder.svg",
                    quote: "Exploring AI and machine learning.",
                  },
                  {
                    id: "s115",
                    name: "Olivia Adams",
                    image: "/placeholder.svg",
                    quote: "Creating impactful software.",
                  },
                ],
                officers: [],
                activities: [],
              },
            },
          },
        },
      },
      "4th-year": {
        name: "4th Year",
        blocks: {
          "block-d": {
            name: "Block D",
            schoolYears: {
              "2024-2025": {
                academicYear: "2024-2025",
                advisers: [],
                students: [
                  {
                    id: "s401",
                    name: "Xyril Rose I. Abanes",
                    image: "/images/fpic.png",
                    quote: "Coding my way to success.",
                    honors: "Dean's Lister",
                  },
                  {
                    id: "s402",
                    name: "Nestor E. Alegada Jr.",
                    image: "/images/mpic.png",
                    quote: "Building digital dreams.",
                  },
                  {
                    id: "s403",
                    name: "Rafael L. Aligui",
                    image: "/images/mpic.png",
                    quote: "Aspiring data scientist.",
                  },
                  { id: "s404", name: "Lex C. Ariate", image: "/images/mpic.png", quote: "Tech enthusiast." },
                  {
                    id: "s405",
                    name: "Ferlita J. Ationg",
                    image: "/images/fpic.png",
                    quote: "Future software engineer.",
                  },
                  {
                    id: "s406",
                    name: "Marjorie T Barotag",
                    image: "/images/fpic.png",
                    quote: "Passionate about algorithms.",
                  },
                  { id: "s407", name: "Alfred Barreda", image: "/images/mpic.png", quote: "Always learning new tech." },
                  {
                    id: "s408",
                    name: "John Louise R. Bergabena",
                    image: "/images/mpic.png",
                    quote: "Designing user experiences.",
                  },
                  { id: "s409", name: "April Grace P. Cabanog", image: "/images/fpic.png", quote: "Problem solver." },
                  {
                    id: "s410",
                    name: "Sedric Norvin A. Cabiles",
                    image: "/images/mpic.png",
                    quote: "Cybersecurity advocate.",
                  },
                  {
                    id: "s411",
                    name: "Joeberth C. Canceller",
                    image: "/images/mpic.png",
                    quote: "Aspiring data scientist.",
                  },
                  {
                    id: "s412",
                    name: "Shane Starlet C. Cano",
                    image: "/images/fpic.png",
                    quote: "Aspiring network engineer",
                    honors: "Dean's Lister",
                  },
                  {
                    id: "s413",
                    name: "Carl Angelo P. Codaste",
                    image: "/images/mpic.png",
                    quote: "Aspiring data scientist.",
                  },
                  {
                    id: "s414",
                    name: "Joseph Consolacion",
                    image: "/images/mpic.png",
                    quote: "Aspiring data scientist.",
                  },
                  {
                    id: "s415",
                    name: "Neil John Dacuma",
                    image: "/images/mpic.png",
                    quote: "Aspiring data scientist.",
                  },
                  { id: "s416", name: "Arnel Demotor", image: "/images/mpic.png", quote: "Aspiring data scientist." },
                  {
                    id: "s417",
                    name: "Genesis Ashly D. Ebonalo",
                    image: "/images/fpic.png",
                    quote: "Aspiring data scientist.",
                  },
                  {
                    id: "s418",
                    name: "Chyril Hadrian Gadia",
                    image: "/images/mpic.png",
                    quote: "Aspiring data scientist.",
                  },
                  {
                    id: "s419",
                    name: "Adriane M. Gumahad",
                    image: "/images/mpic.png",
                    quote: "Aspiring data scientist.",
                  },
                  {
                    id: "s420",
                    name: "Jose Ric D. Habaybay Jr.",
                    image: "/images/mpic.png",
                    quote: "Aspiring data scientist.",
                  },
                  {
                    id: "s421",
                    name: "Julie Paz P. Hacbang",
                    image: "/images/fpic.png",
                    quote: "Aspiring data scientist.",
                  },
                  {
                    id: "s422",
                    name: "Juntong Jill Cris G.",
                    image: "/images/mpic.png",
                    quote: "Aspiring data scientist.",
                  },
                  {
                    id: "s423",
                    name: "Rheffe S. Labajo",
                    image: "/images/mpic.png",
                    quote: "Aspiring data scientist.",
                  },
                  {
                    id: "s424",
                    name: "Veejay V. Laurente",
                    image: "/images/mpic.png",
                    quote: "Aspiring data scientist.",
                  },
                  {
                    id: "s425",
                    name: "Austine Kiño C. Martinez",
                    image: "/images/mpic.png",
                    quote: "Aspiring data scientist.",
                  },
                  {
                    id: "s426",
                    name: "Carl Debson Monleon",
                    image: "/images/mpic.png",
                    quote: "Aspiring data scientist.",
                  },
                  {
                    id: "s427",
                    name: "Jubec S. Navarro",
                    image: "/images/mpic.png",
                    quote: "Aspiring data scientist.",
                  },
                  {
                    id: "s428",
                    name: "John Michael Israel D. Olayvar",
                    image: "/images/mpic.png",
                    quote: "Aspiring data scientist.",
                  },
                  {
                    id: "s429",
                    name: "Melbourne Horizon U. Paras",
                    image: "/images/mpic.png",
                    quote: "Aspiring data scientist.",
                  },
                  {
                    id: "s430",
                    name: "Dave Z. Ricaplaza",
                    image: "/images/mpic.png",
                    quote: "Aspiring data scientist.",
                  },
                  {
                    id: "s431",
                    name: "James Francis E. Rodriguez",
                    image: "/images/mpic.png",
                    quote: "Aspiring data scientist.",
                  },
                  {
                    id: "s432",
                    name: "Chanlyn L. Sanchez",
                    image: "/images/fpic.png",
                    quote: "Aspiring data scientist.",
                  },
                  {
                    id: "s433",
                    name: "Vanni Louise C. Tanutan",
                    image: "/images/fpic.png",
                    quote: "Aspiring data scientist.",
                  },
                  {
                    id: "s434",
                    name: "Angelica C. Torres",
                    image: "/images/fpic.png",
                    quote: "Aspiring data scientist.",
                  },
                  {
                    id: "s435",
                    name: "Jannah P. Villarmino",
                    image: "/images/fpic.png",
                    quote: "Aspiring data scientist.",
                  },
                  {
                    id: "s436",
                    name: "Danilo A. Villarosa Jr.",
                    image: "/images/mpic.png",
                    quote: "Aspiring data scientist.",
                  },
                  { id: "s437", name: "Gyan Yonson", image: "/images/mpic.png", quote: "Aspiring data scientist." },
                ],
                officers: [
                  {
                    id: "s401",
                    name: "John Louise R. Bergabena",
                    image: "/images/mpic.png",
                    position: "Mayor",
                    quote: "Leading with code.",
                  },
                  {
                    id: "s402",
                    name: "Vanni Louise C. Tanutan",
                    image: "/images/fpic.png",
                    position: "Vice Mayor",
                    quote: "Supporting the team.",
                  },
                  {
                    id: "s422",
                    name: "Austine Kino C. Martinez",
                    image: "/images/mpic.png",
                    position: "Secretary",
                    quote: "Uhay",
                  },
                  {
                    id: "s412",
                    name: "Chanlyn L. Sanchez",
                    image: "/images/fpic.png",
                    position: "Assistant Secretary",
                    quote: "Uhay",
                  },
                  {
                    id: "s405",
                    name: "Ferlita J. Ationg",
                    image: "/images/fpic.png",
                    position: "Treasurer",
                    quote: "Uhay",
                  },
                ],
                activities: [
                  {
                    id: "a1",
                    title: "Hackathon 2024",
                    image: "/placeholder.svg",
                    description: "Annual coding competition.",
                    date: "Oct 20, 2024",
                  },
                  {
                    id: "a2",
                    title: "IT Week Celebration",
                    image: "/placeholder.svg",
                    description: "A week of tech talks and workshops.",
                    date: "Nov 15-19, 2024",
                  },
                ],
              },
            },
          },
        },
      },
    },
  },
  beed: {
    name: "BEED",
    fullName: "Bachelor of Elementary Education",
    years: {
      "1st-year": {
        name: "1st Year",
        blocks: {
          "block-a": {
            name: "Block A",
            schoolYears: {
              "2024-2025": {
                academicYear: "2024-2025",
                advisers: [
                  { id: "beed-adv-1", name: "Prof. Maria Dela Cruz", image: "/placeholder.svg", quote: "Inspire young minds." },
                ],
                students: [
                  { id: "beed101", name: "Ana Flores", image: "/placeholder.svg", quote: "Teaching with heart." },
                  { id: "beed102", name: "Bella Santos", image: "/placeholder.svg", quote: "Learning every day." },
                  { id: "beed103", name: "Carlo Perez", image: "/placeholder.svg", quote: "Future educator." },
                  { id: "beed104", name: "Dina Ramos", image: "/placeholder.svg", quote: "Kids are amazing." },
                  { id: "beed105", name: "Eli Cruz", image: "/placeholder.svg", quote: "Teach. Learn. Grow." },
                ],
                officers: [
                  { id: "beed101", name: "Ana Flores", image: "/placeholder.svg", position: "Mayor", quote: "Lead with kindness." },
                  { id: "beed103", name: "Carlo Perez", image: "/placeholder.svg", position: "Secretary", quote: "Serve with joy." },
                ],
                activities: [
                  { id: "beed-a1", title: "Reading Camp", image: "/placeholder.svg", description: "Early literacy workshop.", date: "Oct 12, 2024" },
                ],
              },
            },
          },
          "block-b": {
            name: "Block B",
            schoolYears: {
              "2024-2025": {
                academicYear: "2024-2025",
                advisers: [
                  { id: "beed-adv-2", name: "Prof. Liza Mendoza", image: "/placeholder.svg", quote: "Teach, touch lives." },
                ],
                students: [
                  { id: "beed111", name: "Faye Villanueva", image: "/placeholder.svg", quote: "Dream big." },
                  { id: "beed112", name: "Gino Navarro", image: "/placeholder.svg", quote: "Teach with passion." },
                  { id: "beed113", name: "Hanna Olivar", image: "/placeholder.svg", quote: "Guiding the youth." },
                ],
                officers: [],
                activities: [],
              },
            },
          },
        },
      },
    },
  },
  bsed: {
    name: "BSED",
    fullName: "Bachelor of Secondary Education",
    years: {
      "1st-year": {
        name: "1st Year",
        blocks: {
          "block-a": {
            name: "Block A",
            schoolYears: {
              "2024-2025": {
                academicYear: "2024-2025",
                advisers: [
                  { id: "bsed-adv-1", name: "Prof. Ramon Reyes", image: "/placeholder.svg", quote: "Empower learners." },
                ],
                students: [
                  { id: "bsed101", name: "Ivan Torres", image: "/placeholder.svg", quote: "Share knowledge." },
                  { id: "bsed102", name: "Jessa Lim", image: "/placeholder.svg", quote: "Guide and grow." },
                  { id: "bsed103", name: "Kyle Bautista", image: "/placeholder.svg", quote: "Teach to inspire." },
                  { id: "bsed104", name: "Lara Nunez", image: "/placeholder.svg", quote: "Every child can." },
                ],
                officers: [
                  { id: "bsed102", name: "Jessa Lim", image: "/placeholder.svg", position: "Mayor", quote: "Lead by example." },
                ],
                activities: [
                  { id: "bsed-a1", title: "Teaching Demo Day", image: "/placeholder.svg", description: "Micro-teaching practice.", date: "Nov 8, 2024" },
                ],
              },
            },
          },
        },
      },
    },
  },
  bshm: {
    name: "BSHM",
    fullName: "Bachelor of Science in Hospitality Management",
    years: {
      "1st-year": {
        name: "1st Year",
        blocks: {
          "block-a": {
            name: "Block A",
            schoolYears: {
              "2024-2025": {
                academicYear: "2024-2025",
                advisers: [
                  { id: "bshm-adv-1", name: "Chef Marco Santos", image: "/placeholder.svg", quote: "Service with excellence." },
                ],
                students: [
                  { id: "bshm101", name: "Monica Rivera", image: "/placeholder.svg", quote: "Hospitality is love." },
                  { id: "bshm102", name: "Noel Garcia", image: "/placeholder.svg", quote: "Serve with heart." },
                  { id: "bshm103", name: "Olive Tan", image: "/placeholder.svg", quote: "Craft experiences." },
                ],
                officers: [
                  { id: "bshm101", name: "Monica Rivera", image: "/placeholder.svg", position: "Mayor", quote: "Delight guests." },
                ],
                activities: [
                  { id: "bshm-a1", title: "Culinary Expo", image: "/placeholder.svg", description: "Showcase of dishes.", date: "Dec 2, 2024" },
                ],
              },
            },
          },
          "block-b": {
            name: "Block B",
            schoolYears: {
              "2024-2025": {
                academicYear: "2024-2025",
                advisers: [
                  { id: "bshm-adv-2", name: "Prof. Andrea Lopez", image: "/placeholder.svg", quote: "Serve and smile." },
                ],
                students: [
                  { id: "bshm111", name: "Paolo Chua", image: "/placeholder.svg", quote: "Guest first." },
                  { id: "bshm112", name: "Queenie Yap", image: "/placeholder.svg", quote: "Warm welcomes." },
                ],
                officers: [],
                activities: [],
              },
            },
          },
        },
      },
    },
  },
  bsentrep: {
    name: "BSENTREP",
    fullName: "Bachelor of Science in Entrepreneurship",
    years: {
      "1st-year": {
        name: "1st Year",
        blocks: {
          "block-a": {
            name: "Block A",
            schoolYears: {
              "2024-2025": {
                academicYear: "2024-2025",
                advisers: [
                  { id: "entrep-adv-1", name: "Prof. Victor Delgado", image: "/placeholder.svg", quote: "Build, iterate, thrive." },
                ],
                students: [
                  { id: "ent101", name: "Ruby Santos", image: "/placeholder.svg", quote: "Startup dreams." },
                  { id: "ent102", name: "Sam Ortega", image: "/placeholder.svg", quote: "Create value." },
                  { id: "ent103", name: "Tina Morales", image: "/placeholder.svg", quote: "Think different." },
                ],
                officers: [
                  { id: "ent101", name: "Ruby Santos", image: "/placeholder.svg", position: "Mayor", quote: "Lead the hustle." },
                ],
                activities: [
                  { id: "ent-a1", title: "Pitch Night", image: "/placeholder.svg", description: "Business pitch showcase.", date: "Nov 25, 2024" },
                ],
              },
            },
          },
          "block-b": {
            name: "Block B",
            schoolYears: {
              "2024-2025": {
                academicYear: "2024-2025",
                advisers: [
                  { id: "entrep-adv-2", name: "Prof. Bianca Cruz", image: "/placeholder.svg", quote: "Ideate and execute." },
                ],
                students: [
                  { id: "ent111", name: "Uriel Gomez", image: "/placeholder.svg", quote: "Build products." },
                  { id: "ent112", name: "Vera Santos", image: "/placeholder.svg", quote: "Customer first." },
                ],
                officers: [],
                activities: [],
              },
            },
          },
        },
      },
    },
  },
  bscs: {
    name: "BSCS",
    fullName: "Bachelor of Science in Computer Science",
    years: {
      "1st-year": {
        name: "1st Year",
        blocks: {
          "block-a": {
            name: "Block A",
            schoolYears: {
              "2024-2025": {
                academicYear: "2024-2025",
                advisers: [
                  {
                    id: "prof-clark",
                    name: "Prof. Sarah Clark",
                    image: "/placeholder.svg",
                    quote: "Unlocking the power of computation.",
                  },
                ],
                students: [
                  { id: "cs101", name: "Zoe Turner", image: "/placeholder.svg", quote: "Algorithm enthusiast." },
                  {
                    id: "cs102",
                    name: "Yara Baker",
                    image: "/placeholder.svg",
                    quote: "Exploring theoretical computer science.",
                  },
                ],
                officers: [],
                activities: [],
              },
            },
          },
        },
      },
    },
  },
}

export default function CollegeYearbookPage({
  params,
}: {
  params: { courseId: CourseId; yearId: YearId; blockId: BlockId; schoolYear: string }
}) {
  const course = collegeData[params.courseId]
  if (!course) {
    notFound()
  }

  const year = course.years[params.yearId as keyof typeof course.years]
  if (!year) {
    notFound()
  }

  const block = year.blocks[params.blockId as keyof typeof year.blocks]
  if (!block) {
    notFound()
  }

  const schoolYearData = block.schoolYears[params.schoolYear as keyof typeof block.schoolYears]
  if (!schoolYearData) {
    notFound()
  }

  const people: Person[] = [
    // Add students with role and officerRole properties
    ...(schoolYearData.students || []).map(
      (student: { id: string; name: string; image: string; quote: string; honors?: string }) => ({
        ...student,
        role: "student" as const,
        officerRole:
          schoolYearData.officers?.find((officer: { id: string; position: string }) => officer.id === student.id)
            ?.position || undefined,
      }),
    ),
    // Add advisers as faculty
    ...(schoolYearData.advisers || []).map(
      (adviser: { id: string; name: string; image: string; quote: string }) => ({
        ...adviser,
        role: "faculty" as const,
        position: "Adviser",
        department: course.fullName,
        yearsOfService: 1,
      }),
    ),
  ]

  return (
  <ClassYearbookPage
    departmentType="college"
    departmentName={course.fullName}
    sectionName={`${course.name} ${year.name} - ${block.name}`}
    academicYear={schoolYearData.academicYear}
    people={people}
    activities={schoolYearData.activities}
    backLink={`/departments/college/${params.courseId}/${params.yearId}/${params.blockId}/school-years`}
    profileBasePath={`/departments/college/${params.courseId}/${params.yearId}/${params.blockId}/${params.schoolYear}`}
    courseId={params.courseId}
    yearId={params.yearId}
    blockId={params.blockId}
    schoolYear={params.schoolYear}
  />
)

}
