// Reusable validation utilities for consistent error handling across all forms
export interface ValidationRule {
  required?: boolean
  minLength?: number
  maxLength?: number
  pattern?: RegExp
  custom?: (value: string) => string | null
  message?: string
}

export interface ValidationRules {
  [key: string]: ValidationRule
}

export interface ValidationErrors {
  [key: string]: string
}

// Common validation rules for different field types
export const commonValidationRules: ValidationRules = {
  fullName: {
    required: true,
    minLength: 2,
    maxLength: 100,
    message: "Full name is required and must be 2-100 characters"
  },
  nickname: {
    maxLength: 50,
    message: "Nickname must be less than 50 characters"
  },
  age: {
    required: true,
    custom: (value: string) => {
      const age = Number(value)
      if (isNaN(age) || age < 1 || age > 100) {
        return "Please enter a valid age (1-100)"
      }
      return null
    }
  },
  gender: {
    required: true,
    message: "Gender is required"
  },
  birthday: {
    required: true,
    custom: (value: string) => {
      const date = new Date(value)
      if (isNaN(date.getTime())) {
        return "Please enter a valid date"
      }
      const today = new Date()
      if (date > today) {
        return "Birthday cannot be in the future"
      }
      return null
    }
  },
  address: {
    required: true,
    minLength: 5,
    maxLength: 200,
    message: "Address is required and must be 5-200 characters"
  },
  email: {
    required: true,
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    message: "Please enter a valid email address"
  },
  phone: {
    pattern: /^[\d\s\-\+\(\)]+$/,
    message: "Please enter a valid phone number"
  },
  position: {
    required: true,
    minLength: 2,
    maxLength: 100,
    message: "Position/Role is required and must be 2-100 characters"
  },
  departmentAssigned: {
    required: true,
    message: "Department assigned is required"
  },
  officeAssigned: {
    required: true,
    message: "Office assigned is required"
  },
  customDepartmentAssigned: {
    required: true,
    minLength: 2,
    maxLength: 100,
    message: "Please enter the correct department assigned"
  },
  customOfficeAssigned: {
    required: true,
    minLength: 2,
    maxLength: 100,
    message: "Please enter the correct office assigned"
  },
  yearsOfService: {
    required: true,
    custom: (value: string) => {
      const years = Number(value)
      if (isNaN(years) || years < 0 || years > 50) {
        return "Please enter a valid years of service (0-50)"
      }
      return null
    }
  },
  messageToStudents: {
    required: true,
    minLength: 10,
    maxLength: 500,
    message: "Message to students is required and must be 10-500 characters"
  },
  sayingMotto: {
    required: true,
    minLength: 5,
    maxLength: 200,
    message: "Motto/Saying is required and must be 5-200 characters"
  },
  bio: {
    maxLength: 1000,
    message: "Bio must be less than 1000 characters"
  },
  // Student-specific fields
  fatherGuardianName: {
    required: true,
    minLength: 2,
    maxLength: 100,
    message: "Father's/Guardian's name is required"
  },
  motherGuardianName: {
    required: true,
    minLength: 2,
    maxLength: 100,
    message: "Mother's/Guardian's name is required"
  },
  department: {
    required: true,
    message: "Department is required"
  },
  yearLevel: {
    required: true,
    message: "Year level is required"
  },
  courseProgram: {
    required: true,
    message: "Course/Program is required"
  },
  blockSection: {
    required: true,
    message: "Section/Block is required"
  },
  major: {
    required: true,
    message: "Major is required"
  },
  dreamJob: {
    required: true,
    minLength: 2,
    maxLength: 100,
    message: "Dream job is required and must be 2-100 characters"
  },
  // Alumni-specific fields
  graduationYear: {
    required: true,
    custom: (value: string) => {
      const year = Number(value)
      const currentYear = new Date().getFullYear()
      if (isNaN(year) || year < 1950 || year > currentYear) {
        return `Please enter a valid graduation year (1950-${currentYear})`
      }
      return null
    }
  },
  currentProfession: {
    required: true,
    minLength: 2,
    maxLength: 100,
    message: "Current profession is required and must be 2-100 characters"
  },
  currentCompany: {
    maxLength: 100,
    message: "Company name must be less than 100 characters"
  },
  currentLocation: {
    maxLength: 100,
    message: "Location must be less than 100 characters"
  },
  // Advisory-specific fields
  academicDepartment: {
    required: true,
    message: "Academic department is required"
  },
  academicYearLevels: {
    required: true,
    custom: (value: string) => {
      try {
        const levels = JSON.parse(value)
        if (!Array.isArray(levels) || levels.length === 0) {
          return "Please select at least one academic year level"
        }
        return null
      } catch {
        return "Please select at least one academic year level"
      }
    }
  },
  academicCourseProgram: {
    required: true,
    message: "Academic course/program is required"
  },
  academicSections: {
    required: true,
    custom: (value: string) => {
      try {
        const sections = JSON.parse(value)
        if (!Array.isArray(sections) || sections.length === 0) {
          return "Please select at least one academic section"
        }
        return null
      } catch {
        return "Please select at least one academic section"
      }
    }
  }
}

// Validation function
export const validateField = (fieldName: string, value: string, rules: ValidationRules): string | null => {
  const rule = rules[fieldName]
  if (!rule) return null

  // Required validation
  if (rule.required && (!value || value.trim() === "")) {
    return rule.message || `${fieldName} is required`
  }

  // Skip other validations if field is empty and not required
  if (!value || value.trim() === "") return null

  // Min length validation
  if (rule.minLength && value.length < rule.minLength) {
    return rule.message || `${fieldName} must be at least ${rule.minLength} characters`
  }

  // Max length validation
  if (rule.maxLength && value.length > rule.maxLength) {
    return rule.message || `${fieldName} must be less than ${rule.maxLength} characters`
  }

  // Pattern validation
  if (rule.pattern && !rule.pattern.test(value)) {
    return rule.message || `${fieldName} format is invalid`
  }

  // Custom validation
  if (rule.custom) {
    return rule.custom(value)
  }

  return null
}

// Validate entire form
export const validateForm = (formData: Record<string, string>, rules: ValidationRules): ValidationErrors => {
  const errors: ValidationErrors = {}
  
  console.log('[v0] Validating form with rules:', Object.keys(rules))
  console.log('[v0] Form data keys:', Object.keys(formData))
  
  Object.keys(rules).forEach(fieldName => {
    const error = validateField(fieldName, formData[fieldName] || "", rules)
    if (error) {
      console.log(`[v0] Validation error for ${fieldName}:`, error)
      errors[fieldName] = error
    }
  })

  console.log('[v0] Validation errors:', errors)
  return errors
}

// Get error styling classes
export const getErrorStyling = (hasError: boolean) => {
  return hasError ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""
}

// Get error message styling
export const getErrorMessageStyling = () => {
  return "text-sm text-red-600 mt-1"
}

// Get role-specific validation rules
export const getRoleSpecificValidationRules = (selectedRole: string): ValidationRules => {
  const baseRules = { ...commonValidationRules }
  
  // Common fields for all roles
  const commonFields = [
    'fullName', 'nickname', 'age', 'gender', 'birthday', 'address', 'email', 'phone',
    'sayingMotto', 'bio'
  ]
  
  // Role-specific fields
  const roleFields: Record<string, string[]> = {
    student: [
      'fatherGuardianName', 'motherGuardianName', 'department', 'yearLevel', 
      'courseProgram', 'blockSection', 'major', 'dreamJob'
    ],
    faculty: [
      'position', 'departmentAssigned', 'yearsOfService', 'messageToStudents'
    ],
    staff: [
      'position', 'officeAssigned', 'yearsOfService', 'messageToStudents'
    ],
    utility: [
      'position', 'officeAssigned', 'yearsOfService', 'messageToStudents'
    ],
    advisory: [
      'position', 'departmentAssigned', 'yearsOfService', 'messageToStudents',
      'academicDepartment', 'academicYearLevels', 'academicCourseProgram', 'academicSections'
    ],
    alumni: [
      'department', 'courseProgram', 'graduationYear', 'currentProfession'
    ]
  }
  
  // Create role-specific rules
  const roleRules: ValidationRules = {}
  
  // Add common fields
  commonFields.forEach(field => {
    if (baseRules[field]) {
      roleRules[field] = baseRules[field]
    }
  })
  
  // Add role-specific fields
  if (roleFields[selectedRole]) {
    roleFields[selectedRole].forEach(field => {
      if (baseRules[field]) {
        roleRules[field] = baseRules[field]
      }
    })
  }
  
  return roleRules
}

// Conditional validation rules based on form state
export const getConditionalValidationRules = (
  baseRules: ValidationRules,
  formData: Record<string, string>,
  selectedRole: string
): ValidationRules => {
  const rules = { ...baseRules }

  // Faculty-specific conditional rules
  if (selectedRole === "faculty") {
    if (formData.departmentAssigned === "Others") {
      rules.customDepartmentAssigned = {
        required: true,
        minLength: 2,
        maxLength: 100,
        message: "Please enter the correct department assigned"
      }
    }
  }

  // Advisory-specific conditional rules
  if (selectedRole === "advisory") {
    if (formData.departmentAssigned === "Others") {
      rules.customDepartmentAssigned = {
        required: true,
        minLength: 2,
        maxLength: 100,
        message: "Please enter the correct department assigned"
      }
    }
  }

  // Staff/Utility-specific conditional rules
  if (selectedRole === "staff" || selectedRole === "utility") {
    if (formData.officeAssigned === "Others") {
      rules.customOfficeAssigned = {
        required: true,
        minLength: 2,
        maxLength: 100,
        message: "Please enter the correct office assigned"
      }
    }
    
    // Make messageToStudents optional for staff and utility (required only for faculty)
    if (rules.messageToStudents) {
      rules.messageToStudents = {
        ...rules.messageToStudents,
        required: false,
        message: "Message to students must be 10-500 characters if provided"
      }
    }
  }

  // Student-specific conditional rules
  if (selectedRole === "student") {
    // Major is only required for BSED students
    if (formData.courseProgram === "BSED") {
      rules.major = {
        required: true,
        message: "Major is required for BSED students"
      }
    } else {
      // Remove major validation for non-BSED students
      delete rules.major
    }
  }

  return rules
}
