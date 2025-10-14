// Building assignment utility for Faculty and Staff profiles
// Maps Department Assigned (Faculty) and Office Assigned (Staff/Utility) to building assignments

export interface BuildingAssignment {
  building: string
  location: string
  description?: string
}

// Faculty building assignments based on Department Assigned
export const FACULTY_BUILDING_MAPPING: Record<string, BuildingAssignment> = {
  // College Departments
  "College of Computers": {
    building: "Computer Science Building",
    location: "Main Campus - Building A",
    description: "Technology and Computer Science Department"
  },
  "College of Business": {
    building: "Business Administration Building", 
    location: "Main Campus - Building B",
    description: "Business and Management Studies"
  },
  "College of Education": {
    building: "Education Building",
    location: "Main Campus - Building C", 
    description: "Teacher Education and Training"
  },
  "College of Engineering": {
    building: "Engineering Building",
    location: "Main Campus - Building D",
    description: "Engineering and Technical Programs"
  },
  "College of Arts and Sciences": {
    building: "Arts and Sciences Building",
    location: "Main Campus - Building E",
    description: "Liberal Arts and Sciences"
  },
  "College of Nursing": {
    building: "Nursing Building", 
    location: "Main Campus - Building F",
    description: "Nursing and Health Sciences"
  },
  
  // Senior High School
  "Senior High": {
    building: "Senior High School Building",
    location: "Main Campus - Building G",
    description: "Senior High School Department"
  },
  "Senior High School": {
    building: "Senior High School Building", 
    location: "Main Campus - Building G",
    description: "Senior High School Department"
  },
  
  // Junior High School
  "Junior High": {
    building: "Junior High School Building",
    location: "Main Campus - Building H", 
    description: "Junior High School Department"
  },
  "Junior High School": {
    building: "Junior High School Building",
    location: "Main Campus - Building H",
    description: "Junior High School Department"
  },
  
  // Elementary School
  "Elementary": {
    building: "Elementary School Building",
    location: "Main Campus - Building I",
    description: "Elementary School Department"
  },
  "Elementary School": {
    building: "Elementary School Building",
    location: "Main Campus - Building I", 
    description: "Elementary School Department"
  },
  
  // Basic Education
  "Basic Education": {
    building: "Basic Education Complex",
    location: "Main Campus - Buildings G, H, I",
    description: "Basic Education Department (K-12)"
  },
  
  // Administration
  "Administration": {
    building: "Administration Building",
    location: "Main Campus - Building J",
    description: "School Administration and Management"
  },
  "Administrative Office": {
    building: "Administration Building",
    location: "Main Campus - Building J", 
    description: "School Administration and Management"
  }
}

// Staff and Utility building assignments based on Office Assigned
export const STAFF_BUILDING_MAPPING: Record<string, BuildingAssignment> = {
  // Registrar Office
  "Registrar": {
    building: "Administration Building",
    location: "Main Campus - Building J, 2nd Floor",
    description: "Student Records and Registration"
  },
  "Registrar Office": {
    building: "Administration Building", 
    location: "Main Campus - Building J, 2nd Floor",
    description: "Student Records and Registration"
  },
  
  // Accounting Office
  "Accounting": {
    building: "Administration Building",
    location: "Main Campus - Building J, 1st Floor",
    description: "Financial Management and Accounting"
  },
  "Accounting Office": {
    building: "Administration Building",
    location: "Main Campus - Building J, 1st Floor", 
    description: "Financial Management and Accounting"
  },
  "Finance": {
    building: "Administration Building",
    location: "Main Campus - Building J, 1st Floor",
    description: "Financial Management and Accounting"
  },
  
  // Human Resources
  "Human Resources": {
    building: "Administration Building",
    location: "Main Campus - Building J, 3rd Floor",
    description: "Human Resources and Personnel Management"
  },
  "HR": {
    building: "Administration Building",
    location: "Main Campus - Building J, 3rd Floor",
    description: "Human Resources and Personnel Management"
  },
  
  // IT Department
  "IT Department": {
    building: "Computer Science Building",
    location: "Main Campus - Building A, Ground Floor",
    description: "Information Technology Services"
  },
  "Information Technology": {
    building: "Computer Science Building", 
    location: "Main Campus - Building A, Ground Floor",
    description: "Information Technology Services"
  },
  "IT Support": {
    building: "Computer Science Building",
    location: "Main Campus - Building A, Ground Floor",
    description: "Information Technology Services"
  },
  
  // Library
  "Library": {
    building: "Library Building",
    location: "Main Campus - Building K",
    description: "School Library and Learning Resources"
  },
  "Librarian": {
    building: "Library Building",
    location: "Main Campus - Building K",
    description: "School Library and Learning Resources"
  },
  
  // Guidance Office
  "Guidance": {
    building: "Administration Building",
    location: "Main Campus - Building J, 2nd Floor",
    description: "Student Guidance and Counseling"
  },
  "Guidance Office": {
    building: "Administration Building",
    location: "Main Campus - Building J, 2nd Floor",
    description: "Student Guidance and Counseling"
  },
  "Counseling": {
    building: "Administration Building",
    location: "Main Campus - Building J, 2nd Floor",
    description: "Student Guidance and Counseling"
  },
  
  // Maintenance
  "Maintenance": {
    building: "Maintenance Building",
    location: "Main Campus - Building L",
    description: "Facilities Maintenance and Repair"
  },
  "Maintenance Office": {
    building: "Maintenance Building",
    location: "Main Campus - Building L",
    description: "Facilities Maintenance and Repair"
  },
  "Facilities": {
    building: "Maintenance Building",
    location: "Main Campus - Building L",
    description: "Facilities Maintenance and Repair"
  },
  
  // Security
  "Security": {
    building: "Security Office",
    location: "Main Campus - Building M",
    description: "Campus Security and Safety"
  },
  "Security Office": {
    building: "Security Office",
    location: "Main Campus - Building M",
    description: "Campus Security and Safety"
  },
  
  // Custodial
  "Custodial": {
    building: "Maintenance Building",
    location: "Main Campus - Building L",
    description: "Campus Cleaning and Maintenance"
  },
  "Janitorial": {
    building: "Maintenance Building",
    location: "Main Campus - Building L",
    description: "Campus Cleaning and Maintenance"
  },
  
  // Clinic
  "Clinic": {
    building: "Health Services Building",
    location: "Main Campus - Building N",
    description: "Student Health Services"
  },
  "Health Services": {
    building: "Health Services Building",
    location: "Main Campus - Building N",
    description: "Student Health Services"
  },
  "Nurse": {
    building: "Health Services Building",
    location: "Main Campus - Building N",
    description: "Student Health Services"
  },
  
  // Cafeteria
  "Cafeteria": {
    building: "Student Center",
    location: "Main Campus - Building O",
    description: "Campus Dining Services"
  },
  "Food Services": {
    building: "Student Center",
    location: "Main Campus - Building O",
    description: "Campus Dining Services"
  },
  
  // Student Affairs
  "Student Affairs": {
    building: "Student Center",
    location: "Main Campus - Building O, 2nd Floor",
    description: "Student Activities and Services"
  },
  "Student Services": {
    building: "Student Center",
    location: "Main Campus - Building O, 2nd Floor",
    description: "Student Activities and Services"
  }
}

/**
 * Get building assignment for Faculty based on Department Assigned
 */
export function getFacultyBuildingAssignment(departmentAssigned: string): BuildingAssignment | null {
  if (!departmentAssigned) return null
  
  // Try exact match first
  const exactMatch = FACULTY_BUILDING_MAPPING[departmentAssigned]
  if (exactMatch) return exactMatch
  
  // Try partial match for department names
  const departmentLower = departmentAssigned.toLowerCase()
  
  for (const [key, value] of Object.entries(FACULTY_BUILDING_MAPPING)) {
    if (departmentLower.includes(key.toLowerCase()) || key.toLowerCase().includes(departmentLower)) {
      return value
    }
  }
  
  // Default fallback for unknown departments
  return {
    building: "Main Campus Building",
    location: "Main Campus",
    description: "General Campus Location"
  }
}

/**
 * Get building assignment for Staff/Utility based on Office Assigned
 */
export function getStaffBuildingAssignment(officeAssigned: string): BuildingAssignment | null {
  if (!officeAssigned) return null
  
  // Try exact match first
  const exactMatch = STAFF_BUILDING_MAPPING[officeAssigned]
  if (exactMatch) return exactMatch
  
  // Try partial match for office names
  const officeLower = officeAssigned.toLowerCase()
  
  for (const [key, value] of Object.entries(STAFF_BUILDING_MAPPING)) {
    if (officeLower.includes(key.toLowerCase()) || key.toLowerCase().includes(officeLower)) {
      return value
    }
  }
  
  // Default fallback for unknown offices
  return {
    building: "Administration Building",
    location: "Main Campus - Building J",
    description: "General Administrative Location"
  }
}

/**
 * Get building assignment based on profile type and assignment
 */
export function getBuildingAssignment(
  profileType: 'faculty' | 'staff' | 'utility',
  departmentAssigned?: string,
  officeAssigned?: string
): BuildingAssignment | null {
  switch (profileType) {
    case 'faculty':
      return getFacultyBuildingAssignment(departmentAssigned || '')
    case 'staff':
    case 'utility':
      return getStaffBuildingAssignment(officeAssigned || '')
    default:
      return null
  }
}
