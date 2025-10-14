/**
 * Utility functions for age calculation based on birth date
 */

/**
 * Calculates age based on birth date
 * @param birthDate - Birth date in YYYY-MM-DD format
 * @returns Calculated age in years, or null if invalid date
 */
export function calculateAge(birthDate: string): number | null {
  if (!birthDate) return null
  
  try {
    const birth = new Date(birthDate)
    const today = new Date()
    
    // Check if the date is valid
    if (isNaN(birth.getTime())) {
      return null
    }
    
    // Check if birth date is in the future
    if (birth > today) {
      return null
    }
    
    let age = today.getFullYear() - birth.getFullYear()
    const monthDiff = today.getMonth() - birth.getMonth()
    
    // If birthday hasn't occurred this year yet, subtract 1
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--
    }
    
    // Return null for invalid ages (negative or too high)
    if (age < 0 || age > 150) {
      return null
    }
    
    return age
  } catch (error) {
    console.error('Error calculating age:', error)
    return null
  }
}

/**
 * Formats birth date for display
 * @param birthDate - Birth date in YYYY-MM-DD format
 * @returns Formatted date string or empty string if invalid
 */
export function formatBirthDate(birthDate: string): string {
  if (!birthDate) return ''
  
  try {
    const date = new Date(birthDate)
    if (isNaN(date.getTime())) return ''
    
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  } catch (error) {
    console.error('Error formatting birth date:', error)
    return ''
  }
}

/**
 * Validates if a birth date is reasonable
 * @param birthDate - Birth date in YYYY-MM-DD format
 * @returns Object with isValid boolean and error message if invalid
 */
export function validateBirthDate(birthDate: string): { isValid: boolean; error?: string } {
  if (!birthDate) {
    return { isValid: false, error: 'Birth date is required' }
  }
  
  const birth = new Date(birthDate)
  const today = new Date()
  
  if (isNaN(birth.getTime())) {
    return { isValid: false, error: 'Invalid birth date format' }
  }
  
  if (birth > today) {
    return { isValid: false, error: 'Birth date cannot be in the future' }
  }
  
  const age = calculateAge(birthDate)
  if (age === null) {
    return { isValid: false, error: 'Invalid birth date' }
  }
  
  if (age < 0) {
    return { isValid: false, error: 'Age cannot be negative' }
  }
  
  if (age > 150) {
    return { isValid: false, error: 'Age seems unrealistic' }
  }
  
  return { isValid: true }
}

/**
 * Gets age range description for display
 * @param age - Age in years
 * @returns Age range description
 */
export function getAgeRangeDescription(age: number): string {
  if (age < 0) return 'Invalid age'
  if (age < 13) return 'Child'
  if (age < 18) return 'Teenager'
  if (age < 30) return 'Young Adult'
  if (age < 50) return 'Adult'
  if (age < 65) return 'Middle-aged'
  return 'Senior'
}
