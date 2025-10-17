import { NextRequest, NextResponse } from "next/server"
import { adminSessionTracker } from "@/lib/admin-session-tracker"

// POST /api/admin/track-login - Track admin login
export async function POST(request: NextRequest) {
  try {
    const { adminEmail } = await request.json()

    if (!adminEmail) {
      return NextResponse.json({
        success: false,
        error: 'Admin email is required'
      }, { status: 400 })
    }

    const sessionId = await adminSessionTracker.trackAdminLogin(adminEmail)

    return NextResponse.json({
      success: true,
      message: 'Admin login tracked successfully',
      sessionId
    })

  } catch (error) {
    console.error('Error tracking admin login:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to track admin login'
    }, { status: 500 })
  }
}
