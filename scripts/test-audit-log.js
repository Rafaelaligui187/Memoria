// Test script to create an audit log directly
import { createAuditLog } from './lib/audit-log-utils.js'

async function testAuditLogCreation() {
  console.log('Testing audit log creation...')
  
  try {
    const result = await createAuditLog({
      userId: "test_admin",
      userName: "Test Admin",
      action: "test_action",
      targetType: "test_target",
      targetId: "test_id",
      targetName: "Test Profile",
      details: {
        test: true,
        message: "This is a test audit log entry"
      },
      schoolYearId: "2025-2026",
      ipAddress: "127.0.0.1",
      userAgent: "Test Agent",
      status: "success"
    })
    
    console.log('Audit log creation result:', result)
  } catch (error) {
    console.error('Error testing audit log creation:', error)
  }
}

testAuditLogCreation()
