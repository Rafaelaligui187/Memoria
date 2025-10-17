// Base types
export type ProfileStatus = "draft" | "pending" | "approved" | "rejected" | "archived"
export type UserRole = "student" | "faculty" | "alumni" | "staff" | "utility" | "admin" | "advisory"
export type AlbumPrivacy = "public" | "private" | "hidden"
export type ModerationAction = "approve" | "reject"
export type NotificationType = "approval" | "rejection" | "general" | "report"

// User and Authentication
export interface User {
  id: string
  email: string
  name: string
  initials: string
  role: UserRole
  status: "active" | "pending" | "banned"
  schoolId?: string
  isAdmin?: boolean
  createdAt: Date
  updatedAt: Date
}

export interface AdminCredentials {
  email: string
  password: string
  name: string
  initials: string
}

// School Year Management
export interface SchoolYear {
  id: string
  yearLabel: string // e.g., "2024-2025"
  startDate: Date
  endDate: Date
  isActive: boolean
  metadata?: Record<string, any>
  createdAt: Date
  updatedAt: Date
}

// Profile Base Interface
interface BaseProfile {
  id: string
  firstName: string
  middleName?: string
  lastName: string
  preferredName?: string
  email: string
  phone?: string
  photoUrl?: string
  status: ProfileStatus
  createdBy: string
  createdAt: Date
  updatedAt: Date
  schoolYearId: string
}

// Student Profile
export interface StudentProfile extends BaseProfile {
  schoolId: string
  department: string // e.g., "BSIT"
  year: string // e.g., "1st-year"
  block: string // e.g., "block-a"
  officerRole?: string // e.g., "Mayor"
  honors?: string
  quote?: string
  ambition?: string
  hobbies: string[]
  achievements: Achievement[]
  activities: string[]
  favoriteMemory?: string
  messageToClassmates?: string
  galleryImages: ImageMetadata[]
}

// Faculty Profile
export interface FacultyProfile extends BaseProfile {
  position: string // e.g., "Program Head"
  department: string
  office?: string
  yearsOfService?: number
  bio: string
  achievements: Achievement[]
  courses: string[]
  additionalRoles: string[]
  socialLinks?: SocialLinks
}

// Alumni Profile
export interface AlumniProfile extends BaseProfile {
  schoolId: string
  department: string
  graduationYear: string
  currentJobTitle?: string
  currentEmployer?: string
  location?: string
  linkedinUrl?: string
  personalWebsite?: string
  family?: string
  messageToStudents?: string
  achievements: Achievement[]
  galleryImages: ImageMetadata[]
}

// Advisory Profile
export interface AdvisoryProfile extends BaseProfile {
  position: string // e.g., "Teacher Adviser", "Class Adviser"
  departmentAssigned: string
  customDepartmentAssigned?: string
  yearsOfService?: number
  courses?: string
  additionalRoles?: string
  messageToStudents?: string
  bio?: string
  
  // Academic Information
  academicDepartment: string
  academicYearLevels: string[]
  academicCourseProgram: string
  academicSections: string[]
  
  // Social Media
  socialMediaFacebook?: string
  socialMediaInstagram?: string
  socialMediaTwitter?: string
  
  // Yearbook Information
  sayingMotto?: string
  achievements: Achievement[]
}

// Staff Profile (no messageToStudents field as requested)
export interface StaffProfile extends BaseProfile {
  role: string // e.g., "Janitor", "IT Support"
  department?: string
  yearsOfService?: number
  achievements?: Achievement[]
}

// Utility Profile (same as Staff)
export interface UtilityProfile extends BaseProfile {
  role: string
  department?: string
  yearsOfService?: number
  achievements?: Achievement[]
}

// Supporting Types
export interface Achievement {
  title: string
  description: string
  year: string
}

export interface SocialLinks {
  facebook?: string
  twitter?: string
  linkedin?: string
  instagram?: string
}

export interface ImageMetadata {
  id: string
  filename: string
  url: string
  thumbnailUrl: string
  caption?: string
  photographer?: string
  dateTaken?: Date
  location?: string
  visibility: "public" | "private"
  orderIndex: number
}

// Album and Gallery
export interface Album {
  id: string
  title: string
  description?: string
  coverImageUrl?: string
  privacy: AlbumPrivacy
  tags: string[]
  schoolYearId: string
  createdBy: string
  createdAt: Date
  updatedAt: Date
  photos: Photo[]
}

export interface Photo {
  id: string
  albumId: string
  filename: string
  url: string
  thumbnailUrl: string
  caption?: string
  photographer?: string
  dateTaken?: Date
  location?: string
  visibility: "public" | "private"
  orderIndex: number
  createdAt: Date
  updatedAt: Date
}

// Yearbook Structure
export interface Department {
  id: string
  name: string
  schoolYearId: string
  courses: Course[]
}

export interface Course {
  id: string
  name: string
  departmentId: string
  years: YearLevel[]
}

export interface YearLevel {
  id: string
  level: string // e.g., "1st-year"
  courseId: string
  blocks: Block[]
}

export interface Block {
  id: string
  name: string // e.g., "block-a"
  yearLevelId: string
  students: StudentProfile[]
  officers: Officer[]
}

export interface Officer {
  id: string
  studentId: string
  position: string // e.g., "Mayor", "Vice Mayor"
  blockId: string
}

// Moderation and Approval
export interface ModerationItem {
  id: string
  type: "profile" | "album" | "photo" | "edit"
  targetId: string
  targetType: string
  submittedBy: string
  status: "pending" | "approved" | "rejected"
  schoolYearId: string
  createdAt: Date
  updatedAt: Date
  moderatedBy?: string
  moderatedAt?: Date
  rejectionReasons?: string[]
  customReason?: string
}

export interface RejectionReason {
  id: string
  reason: string
  category: string
  isActive: boolean
  schoolYearId?: string // null for global reasons
}

// Reports and Messages
export interface Report {
  id: string
  reporterId: string
  targetType: "profile" | "album" | "photo" | "comment"
  targetId: string
  message: string
  attachments?: string[]
  status: "pending" | "resolved" | "escalated"
  schoolYearId: string
  createdAt: Date
  resolvedBy?: string
  resolvedAt?: Date
  resolutionNotes?: string
}

// Notifications
export interface Notification {
  id: string
  userId: string
  type: NotificationType
  title: string
  message: string
  data?: Record<string, any>
  read: boolean
  createdAt: Date
}

export interface EmailQueue {
  id: string
  to: string
  subject: string
  body: string
  type: string
  status: "pending" | "sent" | "failed"
  createdAt: Date
  sentAt?: Date
  error?: string
}

// Audit Logs
export interface AuditLog {
  id: string
  userId: string
  action: string
  targetType?: string
  targetId?: string
  details?: Record<string, any>
  ipAddress?: string
  userAgent?: string
  schoolYearId?: string
  createdAt: Date
}

// School History
export interface SchoolHistory {
  id: string
  schoolYearId: string
  title: string
  content: string // Rich text/HTML content
  version: number
  createdBy: string
  createdAt: Date
  updatedAt: Date
  isPublished: boolean
}

export interface SchoolHistoryVersion {
  id: string
  historyId: string
  content: string
  version: number
  createdBy: string
  createdAt: Date
}

// API Response Types
export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  message?: string
  error?: string
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

// Form Types
export interface LoginRequest {
  email: string
  password: string
}

export interface CreateProfileRequest {
  type: "student" | "faculty" | "alumni" | "staff" | "utility"
  data: Partial<StudentProfile | FacultyProfile | AlumniProfile | StaffProfile | UtilityProfile>
  schoolYearId: string
}

export interface CreateAlbumRequest {
  title: string
  description?: string
  privacy: AlbumPrivacy
  tags: string[]
  schoolYearId: string
}

export interface BulkImportRequest {
  type: "student" | "faculty" | "alumni"
  csvData: string
  mapping: Record<string, string>
  schoolYearId: string
}

// File Upload Types
export interface FileUploadResponse {
  success: boolean
  url?: string
  thumbnailUrl?: string
  filename?: string
  error?: string
}

export interface UploadProgress {
  filename: string
  progress: number
  status: "uploading" | "completed" | "error"
  error?: string
}
