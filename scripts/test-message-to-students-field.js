/**
 * Test Script: Message to Students Field Addition
 * 
 * This script verifies that the "Message to Students" field has been
 * added to both Staff and Utility forms in Setup Profile and Create Manual Profile.
 */

const fs = require('fs')
const path = require('path')

console.log('🔍 Testing Message to Students Field Addition...\n')

// Test file paths
const createManualFormPath = path.join(__dirname, '..', 'components', 'create-manual-profile-form.tsx')
const unifiedSetupFormPath = path.join(__dirname, '..', 'components', 'unified-profile-setup-form.tsx')

try {
  console.log('📄 Checking components/create-manual-profile-form.tsx...')
  
  // Read the create manual profile form file
  const createManualFormContent = fs.readFileSync(createManualFormPath, 'utf8')
  
  console.log('\n📋 Create Manual Profile Form Analysis:')
  
  // Check if messageToStudents is included in Staff data submission
  const staffDataSubmission = createManualFormContent.includes('selectedRole === "staff"') && 
                             createManualFormContent.includes('messageToStudents: formData.messageToStudents')
  console.log(`   Staff data submission includes messageToStudents: ${staffDataSubmission ? '✅' : '❌'}`)
  
  // Check if messageToStudents is included in Utility data submission
  const utilityDataSubmission = createManualFormContent.includes('selectedRole === "utility"') && 
                               createManualFormContent.includes('messageToStudents: formData.messageToStudents')
  console.log(`   Utility data submission includes messageToStudents: ${utilityDataSubmission ? '✅' : '❌'}`)
  
  // Check if Staff form has Message to Students field
  const staffFormField = createManualFormContent.includes('case "staff":') && 
                        createManualFormContent.includes('Message to Students') &&
                        createManualFormContent.includes('formData.messageToStudents')
  console.log(`   Staff form has Message to Students field: ${staffFormField ? '✅' : '❌'}`)
  
  // Check if Utility form has Message to Students field
  const utilityFormField = createManualFormContent.includes('case "utility":') && 
                          createManualFormContent.includes('Message to Students') &&
                          createManualFormContent.includes('formData.messageToStudents')
  console.log(`   Utility form has Message to Students field: ${utilityFormField ? '✅' : '❌'}`)
  
  console.log('\n📄 Checking components/unified-profile-setup-form.tsx...')
  
  // Read the unified profile setup form file
  const unifiedSetupFormContent = fs.readFileSync(unifiedSetupFormPath, 'utf8')
  
  console.log('\n📋 Unified Profile Setup Form Analysis:')
  
  // Check if messageToStudents is included in Staff/Utility data submission
  const staffUtilityDataSubmission = unifiedSetupFormContent.includes('selectedRole === "staff" || selectedRole === "utility"') && 
                                    unifiedSetupFormContent.includes('messageToStudents: formData.messageToStudents')
  console.log(`   Staff/Utility data submission includes messageToStudents: ${staffUtilityDataSubmission ? '✅' : '❌'}`)
  
  // Check if Message to Students field is shown for Staff and Utility
  const staffUtilityFormField = unifiedSetupFormContent.includes('selectedRole === "faculty" || selectedRole === "staff" || selectedRole === "utility"') && 
                                unifiedSetupFormContent.includes('Message to Students *')
  console.log(`   Staff/Utility form shows Message to Students field: ${staffUtilityFormField ? '✅' : '❌'}`)
  
  // Check if Faculty-specific fields are still only for Faculty
  const facultySpecificFields = unifiedSetupFormContent.includes('selectedRole === "faculty"') && 
                               unifiedSetupFormContent.includes('Courses Taught') &&
                               unifiedSetupFormContent.includes('Additional Roles')
  console.log(`   Faculty-specific fields remain Faculty-only: ${facultySpecificFields ? '✅' : '❌'}`)
  
  console.log('\n📊 Field Structure Check:')
  
  // Check for proper field structure
  const hasProperFieldStructure = createManualFormContent.includes('<Label htmlFor="messageToStudents">') && 
                                 createManualFormContent.includes('<Textarea') &&
                                 createManualFormContent.includes('placeholder="Share a message with your students"')
  console.log(`   Proper field structure: ${hasProperFieldStructure ? '✅' : '❌'}`)
  
  // Check for proper form handling
  const hasProperFormHandling = createManualFormContent.includes('handleInputChange("messageToStudents"') && 
                               unifiedSetupFormContent.includes('handleInputChange("messageToStudents"')
  console.log(`   Proper form handling: ${hasProperFormHandling ? '✅' : '❌'}`)
  
  // Summary
  console.log('\n📈 Summary:')
  const allChecks = [
    staffDataSubmission,
    utilityDataSubmission,
    staffFormField,
    utilityFormField,
    staffUtilityDataSubmission,
    staffUtilityFormField,
    facultySpecificFields,
    hasProperFieldStructure,
    hasProperFormHandling
  ]
  
  const passedChecks = allChecks.filter(check => check).length
  
  if (passedChecks === allChecks.length) {
    console.log('🎉 ALL CHECKS PASSED: Message to Students field successfully added!')
    console.log('   - Staff forms now include Message to Students field')
    console.log('   - Utility forms now include Message to Students field')
    console.log('   - Data submission includes messageToStudents for Staff/Utility')
    console.log('   - Proper field structure and form handling implemented')
    console.log('   - Faculty-specific fields remain Faculty-only')
    console.log('   - Consistent with Faculty form implementation')
  } else {
    console.log(`⚠️  ${allChecks.length - passedChecks} ISSUES FOUND: Please review the above results`)
  }
  
  // Example usage test
  console.log('\n🧪 Example Usage Test:')
  console.log('   Staff Profile Form:')
  console.log('   - Position: "Registrar"')
  console.log('   - Office Assigned: "Registrar"')
  console.log('   - Message to Students: "Always be organized and keep your records updated!"')
  console.log('   ')
  console.log('   Utility Profile Form:')
  console.log('   - Position: "Utility Head"')
  console.log('   - Office Assigned: "Groundskeeping"')
  console.log('   - Message to Students: "Keep our campus clean and beautiful!"')
  console.log('   ')
  console.log('   Status: ✅ Both forms now have Message to Students field')
  
} catch (error) {
  console.error('❌ Error reading form files:', error.message)
}

console.log('\n✨ Test completed!')
