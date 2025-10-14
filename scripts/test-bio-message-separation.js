/**
 * Test Script: Bio and Message to Students Separation
 * 
 * This script verifies that the faculty profile page properly separates
 * the bio content from the message to students content.
 */

const fs = require('fs')
const path = require('path')

console.log('🔍 Testing Bio and Message to Students Separation...\n')

// Test file path
const facultyProfilePath = path.join(__dirname, '..', 'app', 'faculty', '[id]', 'page.tsx')

try {
  // Read the faculty profile page file
  const facultyProfileContent = fs.readFileSync(facultyProfilePath, 'utf8')
  
  console.log('📄 Checking app/faculty/[id]/page.tsx...')
  
  // Check for proper separation
  const aboutTabStart = facultyProfileContent.indexOf('TabsContent value="about"')
  const messageTabStart = facultyProfileContent.indexOf('TabsContent value="message"')
  
  let aboutTabContent = ''
  let messageTabContent = ''
  
  if (aboutTabStart !== -1 && messageTabStart !== -1) {
    if (aboutTabStart < messageTabStart) {
      aboutTabContent = facultyProfileContent.substring(aboutTabStart, messageTabStart)
      messageTabContent = facultyProfileContent.substring(messageTabStart)
    } else {
      messageTabContent = facultyProfileContent.substring(messageTabStart, aboutTabStart)
      aboutTabContent = facultyProfileContent.substring(aboutTabStart)
    }
  }
  
  console.log('\n📋 About Faculty Tab Analysis:')
  
  // Check if bio is in About tab
  const bioInAboutTab = aboutTabContent.includes('faculty.bio')
  console.log(`   Bio field in About tab: ${bioInAboutTab ? '✅' : '❌'}`)
  
  // Check if messageToStudents is NOT in About tab
  const messageInAboutTab = aboutTabContent.includes('faculty.messageToStudents')
  console.log(`   Message to Students in About tab: ${messageInAboutTab ? '❌ (Should not be here)' : '✅ (Correctly separated)'}`)
  
  console.log('\n📋 Message to Students Tab Analysis:')
  
  // Check if messageToStudents is in Message tab
  const messageInMessageTab = messageTabContent.includes('faculty.messageToStudents')
  console.log(`   Message to Students in Message tab: ${messageInMessageTab ? '✅' : '❌'}`)
  
  // Check if bio is NOT in Message tab
  const bioInMessageTab = messageTabContent.includes('faculty.bio')
  console.log(`   Bio field in Message tab: ${bioInMessageTab ? '❌ (Should not be here)' : '✅ (Correctly separated)'}`)
  
  // Check for proper tab structure
  const hasAboutTab = facultyProfileContent.includes('value="about"')
  const hasMessageTab = facultyProfileContent.includes('value="message"')
  
  console.log('\n📊 Tab Structure Check:')
  console.log(`   About Faculty tab exists: ${hasAboutTab ? '✅' : '❌'}`)
  console.log(`   Message to Students tab exists: ${hasMessageTab ? '✅' : '❌'}`)
  
  // Check for proper field usage
  const bioUsageCount = (facultyProfileContent.match(/faculty\.bio/g) || []).length
  const messageUsageCount = (facultyProfileContent.match(/faculty\.messageToStudents/g) || []).length
  
  console.log('\n📈 Field Usage Analysis:')
  console.log(`   Bio field usage count: ${bioUsageCount}`)
  console.log(`   Message to Students field usage count: ${messageUsageCount}`)
  
  // Summary
  console.log('\n📈 Summary:')
  if (bioInAboutTab && !messageInAboutTab && messageInMessageTab && !bioInMessageTab && hasAboutTab && hasMessageTab) {
    console.log('🎉 ALL CHECKS PASSED: Bio and Message to Students properly separated!')
    console.log('   - Bio is only in About Faculty tab')
    console.log('   - Message to Students is only in Message to Students tab')
    console.log('   - Both tabs exist and are properly structured')
    console.log('   - No cross-contamination between sections')
  } else {
    console.log('⚠️  SOME ISSUES FOUND: Please review the above results')
    if (messageInAboutTab) {
      console.log('   - Message to Students should not be in About Faculty tab')
    }
    if (bioInMessageTab) {
      console.log('   - Bio should not be in Message to Students tab')
    }
  }
  
} catch (error) {
  console.error('❌ Error reading faculty profile file:', error.message)
}

console.log('\n✨ Test completed!')
