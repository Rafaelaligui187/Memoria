import { ObjectId } from 'mongodb'

// Base Yearbook Entry Interface
export interface BaseYearbookEntry {
  _id?: ObjectId
  schoolYearId: string
  schoolYear: string // Human-readable school year (e.g., "2025-2026")
  status: 'pending' | 'approved' | 'rejected' | 'archived'
  previousProfileId?: ObjectId // Reference to previous approved profile when updating
  
  // Personal Info
  fullName: string
  nickname?: string
  age?: number
  gender?: string
  birthday?: Date
  address?: string
  email: string
  phone?: string
  profilePicture?: string
  
  // Family Info
  fatherGuardianName?: string
  motherGuardianName?: string
  
  // Extras
  sayingMotto?: string
  dreamJob?: string
  officerRole?: string
  bio?: string
  hobbies?: string[]
  honors?: string[]
  achievements?: string[]
  socialMedia?: {
    facebook?: string
    twitter?: string
    instagram?: string
    linkedin?: string
    tiktok?: string
  }
  
  // Timestamps
  createdAt: Date
  updatedAt: Date
}

// College Yearbook Entry
export interface CollegeYearbookEntry extends BaseYearbookEntry {
  // Academic Info for College
  department: string
  yearLevel: string // 1st Year, 2nd Year, 3rd Year, 4th Year
  courseProgram: string // BSIT, BSCS, etc.
  major?: string // Major field for BSED students
  blockSection?: string
}

// Senior High Yearbook Entry
export interface SeniorHighYearbookEntry extends BaseYearbookEntry {
  // Academic Info for Senior High
  department: string
  yearLevel: string // Grade 11, Grade 12
  courseProgram: string // STEM, ABM, HUMSS, etc.
  blockSection?: string
}

// Junior High Yearbook Entry
export interface JuniorHighYearbookEntry extends BaseYearbookEntry {
  // Academic Info for Junior High
  department: string
  yearLevel: string // Grade 7, Grade 8, Grade 9, Grade 10
  courseProgram?: string
  blockSection?: string
}

// Elementary Yearbook Entry
export interface ElementaryYearbookEntry extends BaseYearbookEntry {
  // Academic Info for Elementary
  department: string
  yearLevel: string // Grade 1, Grade 2, etc.
  courseProgram?: string
  blockSection?: string
}

// Alumni Yearbook Entry
export interface AlumniYearbookEntry extends BaseYearbookEntry {
  // Academic Info for Alumni
  department: string
  yearLevel?: string // Graduation year
  courseProgram: string
  blockSection?: string
  graduationYear: string
  currentJobTitle?: string
  currentEmployer?: string
  currentLocation?: string
}

// Faculty & Staff Yearbook Entry
export interface FacultyStaffYearbookEntry extends BaseYearbookEntry {
  // Academic Info for Faculty & Staff
  department: string
  yearLevel?: string
  courseProgram?: string
  blockSection?: string
  position: string
  yearsOfService?: number
  office?: string
  courses?: string[]
  additionalRoles?: string[]
}

// AR Sisters Yearbook Entry
export interface ARSistersYearbookEntry extends BaseYearbookEntry {
  // Religious & Professional Info for AR Sisters
  department: string
  position: string
  customPosition?: string
  yearsOfService?: number
  departmentAssigned?: string
  religiousOrder: string
  vowsDate?: string
  specialization?: string
  education?: string
  additionalRoles?: string[]
  messageToStudents?: string
  publications?: string
  research?: string
  classesHandled?: string
}

// Yearbook Page Schema
export interface YearbookPageSchema {
  _id?: ObjectId
  schoolYearId: string
  schoolYear: string // Human-readable school year (e.g., "2025-2026")
  
  // Page Information
  pageType: 'cover' | 'dedication' | 'acknowledgment' | 'table-of-contents' | 'department' | 'section' | 'activities' | 'memories' | 'back-cover' | 'custom'
  pageTitle: string
  pageNumber?: number
  
  // Content
  content: {
    text?: string
    images?: string[] // Array of image URLs
    layout?: 'single-column' | 'two-column' | 'three-column' | 'grid' | 'custom'
    customLayout?: any // For custom layouts
  }
  
  // Department/Section specific (for department and section pages)
  department?: string
  section?: string
  courseProgram?: string
  yearLevel?: string
  blockSection?: string
  
  // Metadata
  createdBy: string // User ID who created the page
  lastModifiedBy?: string // User ID who last modified the page
  isPublished: boolean
  isTemplate: boolean // Whether this is a template page
  
  // Timestamps
  createdAt: Date
  updatedAt: Date
}

// School Year Schema
export interface SchoolYearSchema {
  _id?: ObjectId
  yearLabel: string // e.g., "2025-2026"
  startDate: Date
  endDate: Date
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

// Yearbook Collection Names
export const YEARBOOK_COLLECTIONS = {
  COLLEGE: 'College_yearbook',
  SENIOR_HIGH: 'SeniorHigh_yearbook',
  JUNIOR_HIGH: 'JuniorHigh_yearbook',
  ELEMENTARY: 'Elementary_yearbook',
  ALUMNI: 'Alumni_yearbook',
  FACULTY_STAFF: 'FacultyStaff_yearbook',
  AR_SISTERS: 'ARSisters_yearbook',
  SCHOOL_YEARS: 'SchoolYears',
  PAGES: 'YearbookPages'
} as const

// Department to Collection Mapping
export const DEPARTMENT_TO_COLLECTION = {
  'College': YEARBOOK_COLLECTIONS.COLLEGE,
  'Senior High': YEARBOOK_COLLECTIONS.SENIOR_HIGH,
  'Junior High': YEARBOOK_COLLECTIONS.JUNIOR_HIGH,
  'Elementary': YEARBOOK_COLLECTIONS.ELEMENTARY,
  'Alumni': YEARBOOK_COLLECTIONS.ALUMNI,
  'Faculty & Staff': YEARBOOK_COLLECTIONS.FACULTY_STAFF,
  'AR Sisters': YEARBOOK_COLLECTIONS.AR_SISTERS,
} as const

// Validation Schema for Required Fields
export interface YearbookValidationSchema {
  requiredFields: string[]
  optionalFields: string[]
  departmentSpecificFields?: Record<string, string[]>
}

export const YEARBOOK_VALIDATION_SCHEMAS: Record<string, YearbookValidationSchema> = {
  [YEARBOOK_COLLECTIONS.COLLEGE]: {
    requiredFields: ['schoolYearId', 'schoolYear', 'fullName', 'email', 'department', 'yearLevel', 'courseProgram'],
    optionalFields: ['nickname', 'age', 'gender', 'birthday', 'address', 'phone', 'profilePicture', 'fatherGuardianName', 'motherGuardianName', 'major', 'blockSection', 'sayingMotto', 'dreamJob', 'officerRole', 'bio', 'hobbies', 'honors', 'achievements', 'socialMedia']
  },
  [YEARBOOK_COLLECTIONS.SENIOR_HIGH]: {
    requiredFields: ['schoolYearId', 'schoolYear', 'fullName', 'email', 'department', 'yearLevel', 'courseProgram'],
    optionalFields: ['nickname', 'age', 'gender', 'birthday', 'address', 'phone', 'profilePicture', 'fatherGuardianName', 'motherGuardianName', 'blockSection', 'sayingMotto', 'dreamJob', 'officerRole', 'bio', 'hobbies', 'honors', 'achievements', 'socialMedia']
  },
  [YEARBOOK_COLLECTIONS.JUNIOR_HIGH]: {
    requiredFields: ['schoolYearId', 'schoolYear', 'fullName', 'email', 'department', 'yearLevel'],
    optionalFields: ['nickname', 'age', 'gender', 'birthday', 'address', 'phone', 'profilePicture', 'fatherGuardianName', 'motherGuardianName', 'courseProgram', 'blockSection', 'sayingMotto', 'dreamJob', 'officerRole', 'bio', 'hobbies', 'honors', 'achievements', 'socialMedia']
  },
  [YEARBOOK_COLLECTIONS.ELEMENTARY]: {
    requiredFields: ['schoolYearId', 'schoolYear', 'fullName', 'email', 'department', 'yearLevel'],
    optionalFields: ['nickname', 'age', 'gender', 'birthday', 'address', 'phone', 'profilePicture', 'fatherGuardianName', 'motherGuardianName', 'courseProgram', 'blockSection', 'sayingMotto', 'dreamJob', 'officerRole', 'bio', 'hobbies', 'honors', 'achievements', 'socialMedia']
  },
  [YEARBOOK_COLLECTIONS.ALUMNI]: {
    requiredFields: ['schoolYearId', 'schoolYear', 'fullName', 'email', 'department', 'courseProgram', 'graduationYear'],
    optionalFields: ['nickname', 'age', 'gender', 'birthday', 'address', 'phone', 'profilePicture', 'fatherGuardianName', 'motherGuardianName', 'yearLevel', 'blockSection', 'currentJobTitle', 'currentEmployer', 'currentLocation', 'sayingMotto', 'dreamJob', 'officerRole', 'bio', 'hobbies', 'honors', 'achievements', 'socialMedia']
  },
  [YEARBOOK_COLLECTIONS.FACULTY_STAFF]: {
    requiredFields: ['schoolYearId', 'schoolYear', 'fullName', 'email', 'department', 'position'],
    optionalFields: ['nickname', 'age', 'gender', 'birthday', 'address', 'phone', 'profilePicture', 'fatherGuardianName', 'motherGuardianName', 'yearLevel', 'courseProgram', 'blockSection', 'yearsOfService', 'office', 'courses', 'additionalRoles', 'sayingMotto', 'dreamJob', 'officerRole', 'bio', 'hobbies', 'honors', 'achievements', 'socialMedia']
  },
  [YEARBOOK_COLLECTIONS.AR_SISTERS]: {
    requiredFields: ['schoolYearId', 'schoolYear', 'fullName', 'email', 'department', 'position'],
    optionalFields: ['nickname', 'age', 'gender', 'birthday', 'address', 'phone', 'profilePicture', 'fatherGuardianName', 'motherGuardianName', 'yearsOfService', 'departmentAssigned', 'vowsDate', 'specialization', 'education', 'additionalRoles', 'messageToStudents', 'publications', 'research', 'classesHandled', 'sayingMotto', 'dreamJob', 'officerRole', 'bio', 'hobbies', 'honors', 'achievements', 'socialMedia', 'customPosition']
  },
  [YEARBOOK_COLLECTIONS.PAGES]: {
    requiredFields: ['schoolYearId', 'schoolYear', 'pageType', 'pageTitle', 'createdBy'],
    optionalFields: ['pageNumber', 'content', 'department', 'section', 'courseProgram', 'yearLevel', 'blockSection', 'lastModifiedBy', 'isPublished', 'isTemplate']
  }
}

// Type for all yearbook entry types
export type YearbookEntry = 
  | CollegeYearbookEntry 
  | SeniorHighYearbookEntry 
  | JuniorHighYearbookEntry 
  | ElementaryYearbookEntry 
  | AlumniYearbookEntry 
  | FacultyStaffYearbookEntry
  | ARSistersYearbookEntry

// Department type
export type Department = keyof typeof DEPARTMENT_TO_COLLECTION
