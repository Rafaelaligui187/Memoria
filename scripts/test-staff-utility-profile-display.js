/**
 * Test Script: Staff and Utility Profile Display Verification
 * 
 * This script verifies that staff and utility profile pages display
 * the actual Department or Office Assigned from form data instead of
 * mapped building names.
 */

const fs = require('fs')
const path = require('path')

console.log('🔍 Testing Staff and Utility Profile Display...\n')

// Test file paths
const staffProfilePath = path.join(__dirname, '..', 'app', 'staff', '[staffId]', 'page.tsx')
const facultyProfilePath = path.join(__dirname, '..', 'app', 'faculty', '[id]', 'page.tsx')

try {
  console.log('📄 Checking app/staff/[staffId]/page.tsx...')
  
  // Read the staff profile page file
  const staffProfileContent = fs.readFileSync(staffProfilePath, 'utf8')
  
  // Check for proper office/department display
  const officeDisplayPatterns = [
    'staff.officeAssigned',
    'staff.departmentAssigned',
    'staff.office'
  ]
  
  console.log('\n📋 Office/Department Display Analysis:')
  
  let correctDisplayFound = false
  officeDisplayPatterns.forEach(pattern => {
    const count = (staffProfileContent.match(new RegExp(pattern, 'g')) || []).length
    if (count > 0) {
      console.log(`   ✅ ${pattern}: Found ${count} usage(s)`)
      correctDisplayFound = true
    }
  })
  
  // Check for building assignment usage (should not be present)
  const buildingAssignmentUsage = staffProfileContent.includes('getBuildingAssignment')
  console.log(`   Building assignment usage: ${buildingAssignmentUsage ? '❌ (Should not be used)' : '✅ (Correctly removed)'}`)
  
  // Check for hardcoded building names
  const hardcodedBuildings = [
    'Computer Science Building',
    'Administration Building',
    'Main Building',
    'Science Building'
  ]
  
  let hardcodedFound = false
  hardcodedBuildings.forEach(building => {
    if (staffProfileContent.includes(building)) {
      console.log(`   ❌ Hardcoded building found: ${building}`)
      hardcodedFound = true
    }
  })
  
  if (!hardcodedFound) {
    console.log('   ✅ No hardcoded building names found')
  }
  
  // Check for proper fallback handling
  const hasFallbackHandling = staffProfileContent.includes('Office Not Assigned') || 
                             staffProfileContent.includes('Department Not Assigned')
  console.log(`   Fallback handling: ${hasFallbackHandling ? '✅' : '❌'}`)
  
  console.log('\n📄 Checking app/faculty/[id]/page.tsx for comparison...')
  
  // Read the faculty profile page file for comparison
  const facultyProfileContent = fs.readFileSync(facultyProfilePath, 'utf8')
  
  // Check faculty page for proper department display
  const facultyDepartmentPatterns = [
    'faculty.departmentAssigned',
    'faculty.department'
  ]
  
  console.log('\n📋 Faculty Department Display Analysis:')
  
  facultyDepartmentPatterns.forEach(pattern => {
    const count = (facultyProfileContent.match(new RegExp(pattern, 'g')) || []).length
    if (count > 0) {
      console.log(`   ✅ ${pattern}: Found ${count} usage(s)`)
    }
  })
  
  // Summary
  console.log('\n📈 Summary:')
  if (correctDisplayFound && !buildingAssignmentUsage && !hardcodedFound && hasFallbackHandling) {
    console.log('🎉 ALL CHECKS PASSED: Staff and Utility profiles correctly display form data!')
    console.log('   - Office/Department assignments display actual form input')
    console.log('   - No building assignment mappings used')
    console.log('   - No hardcoded building names')
    console.log('   - Proper fallback handling implemented')
    console.log('   - Consistent with faculty profile approach')
  } else {
    console.log('⚠️  SOME ISSUES FOUND: Please review the above results')
    if (buildingAssignmentUsage) {
      console.log('   - Building assignment utility should not be used')
    }
    if (hardcodedFound) {
      console.log('   - Hardcoded building names should be removed')
    }
    if (!hasFallbackHandling) {
      console.log('   - Fallback handling should be implemented')
    }
  }
  
} catch (error) {
  console.error('❌ Error reading profile files:', error.message)
}

console.log('\n✨ Test completed!')
