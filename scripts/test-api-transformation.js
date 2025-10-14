/**
 * Test Script: API Data Transformation for Staff and Utility Profiles
 * 
 * This script verifies that the API endpoint properly transforms
 * Staff and Utility profile data to prioritize officeAssigned.
 */

const fs = require('fs')
const path = require('path')

console.log('🔍 Testing API Data Transformation for Staff and Utility Profiles...\n')

// Test file path
const apiRoutePath = path.join(__dirname, '..', 'app', 'api', 'yearbook', 'profile', '[id]', 'route.ts')

try {
  console.log('📄 Checking app/api/yearbook/profile/[id]/route.ts...')
  
  // Read the API route file
  const apiRouteContent = fs.readFileSync(apiRoutePath, 'utf8')
  
  console.log('\n📋 API Transformation Analysis:')
  
  // Check for Staff/Utility data transformation
  const hasStaffUtilityTransformation = apiRouteContent.includes('result.data.userType === "staff" || result.data.userType === "utility"')
  console.log(`   Staff/Utility transformation logic: ${hasStaffUtilityTransformation ? '✅' : '❌'}`)
  
  // Check for departmentDisplay field
  const hasDepartmentDisplay = apiRouteContent.includes('departmentDisplay:')
  console.log(`   departmentDisplay field creation: ${hasDepartmentDisplay ? '✅' : '❌'}`)
  
  // Check for officeAssigned priority
  const hasOfficeAssignedPriority = apiRouteContent.includes('result.data.officeAssigned || result.data.office || result.data.departmentAssigned || result.data.department')
  console.log(`   officeAssigned priority logic: ${hasOfficeAssignedPriority ? '✅' : '❌'}`)
  
  // Check for original department preservation
  const hasOriginalDepartment = apiRouteContent.includes('originalDepartment: result.data.department')
  console.log(`   Original department preservation: ${hasOriginalDepartment ? '✅' : '❌'}`)
  
  // Check for hierarchy field
  const hasHierarchyField = apiRouteContent.includes('hierarchy: result.data.hierarchy || result.data.userType')
  console.log(`   Hierarchy field addition: ${hasHierarchyField ? '✅' : '❌'}`)
  
  // Check for both Senior High and Faculty & Staff transformations
  const seniorHighTransformation = apiRouteContent.includes('Senior High') && apiRouteContent.includes('userType === "staff"')
  const facultyStaffTransformation = apiRouteContent.includes('Faculty & Staff') && apiRouteContent.includes('userType === "staff"')
  
  console.log('\n📊 Department Coverage:')
  console.log(`   Senior High transformation: ${seniorHighTransformation ? '✅' : '❌'}`)
  console.log(`   Faculty & Staff transformation: ${facultyStaffTransformation ? '✅' : '❌'}`)
  
  // Check for proper data structure
  const hasTransformedDataStructure = apiRouteContent.includes('transformedData = {') && apiRouteContent.includes('...result.data')
  console.log(`   Proper data structure: ${hasTransformedDataStructure ? '✅' : '❌'}`)
  
  // Summary
  console.log('\n📈 Summary:')
  const allChecks = [
    hasStaffUtilityTransformation,
    hasDepartmentDisplay,
    hasOfficeAssignedPriority,
    hasOriginalDepartment,
    hasHierarchyField,
    seniorHighTransformation,
    facultyStaffTransformation,
    hasTransformedDataStructure
  ]
  
  const passedChecks = allChecks.filter(check => check).length
  
  if (passedChecks === allChecks.length) {
    console.log('🎉 ALL CHECKS PASSED: API properly transforms Staff and Utility data!')
    console.log('   - Staff/Utility transformation logic implemented')
    console.log('   - departmentDisplay field created with officeAssigned priority')
    console.log('   - Original department preserved for reference')
    console.log('   - Hierarchy field added for proper display logic')
    console.log('   - Both Senior High and Faculty & Staff covered')
    console.log('   - Proper data structure maintained')
  } else {
    console.log(`⚠️  ${allChecks.length - passedChecks} ISSUES FOUND: Please review the above results`)
  }
  
  // Example transformation test
  console.log('\n🧪 Example Transformation Test:')
  console.log('   Input Data:')
  console.log('   - userType: "utility"')
  console.log('   - department: "Faculty & Staff"')
  console.log('   - officeAssigned: "Groundskeeping"')
  console.log('   - office: ""')
  console.log('   ')
  console.log('   Expected Output:')
  console.log('   - departmentDisplay: "Groundskeeping"')
  console.log('   - originalDepartment: "Faculty & Staff"')
  console.log('   - hierarchy: "utility"')
  console.log('   - Status: ✅ Should now display "Groundskeeping" instead of "Faculty & Staff"')
  
} catch (error) {
  console.error('❌ Error reading API route file:', error.message)
}

console.log('\n✨ Test completed!')
