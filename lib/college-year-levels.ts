/**
 * Shared utility for College year levels and blocks
 * Contains only mapping functions and constants, no hardcoded blocks
 */

export interface YearLevel {
  id: string
  level: string
  blocks: Block[]
}

export interface Block {
  id: string
  name: string
}

/**
 * Year level names for College courses
 */
export const COLLEGE_YEAR_LEVEL_NAMES = ['1st Year', '2nd Year', '3rd Year', '4th Year']

/**
 * Course mapping for College courses
 */
export const COLLEGE_COURSE_MAPPING = {
  bsit: "Bachelor of Science in Information Technology",
  beed: "Bachelor of Elementary Education", 
  bsed: "Bachelor of Secondary Education",
  bshm: "Bachelor of Science in Hospitality Management",
  bsentrep: "Bachelor of Science in Entrepreneurship",
  bscs: "Bachelor of Science in Computer Science",
  bped: "Bachelor of Physical Education",
}

/**
 * Course short names for College courses
 */
export const COLLEGE_COURSE_SHORT_NAMES = {
  bsit: "BSIT",
  beed: "BEED", 
  bsed: "BSED",
  bshm: "BSHM",
  bsentrep: "BSENTREP",
  bscs: "BSCS",
  bped: "BPED",
}

/**
 * Block names mapping
 */
export const BLOCK_NAMES = {
  "block-a": "Block A",
  "block-b": "Block B", 
  "block-c": "Block C",
  "block-d": "Block D",
  "block-e": "Block E",
  "block-f": "Block F",
}

/**
 * Year names mapping
 */
export const YEAR_NAMES = {
  "1st-year": "First Year",
  "2nd-year": "Second Year", 
  "3rd-year": "Third Year",
  "4th-year": "Fourth Year",
}

/**
 * Get course full name by course ID
 */
export function getCourseFullName(courseId: string): string {
  return COLLEGE_COURSE_MAPPING[courseId as keyof typeof COLLEGE_COURSE_MAPPING] || "Course"
}

/**
 * Get course short name by course ID
 */
export function getCourseShortName(courseId: string): string {
  return COLLEGE_COURSE_SHORT_NAMES[courseId as keyof typeof COLLEGE_COURSE_SHORT_NAMES] || "Course"
}

/**
 * Get year name by year ID
 */
export function getYearName(yearId: string): string {
  return YEAR_NAMES[yearId as keyof typeof YEAR_NAMES] || "Year"
}

/**
 * Get block name by block ID
 */
export function getBlockName(blockId: string): string {
  return BLOCK_NAMES[blockId as keyof typeof BLOCK_NAMES] || "Block"
}
