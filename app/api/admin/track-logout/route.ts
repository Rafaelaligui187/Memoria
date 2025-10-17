import { NextRequest, NextResponse } from "next/server"
import { adminSessionTracker } from "@/lib/admin-session-tracker"

// POST /api/admin/track-logout - Track admin logout
export async function POST(request: NextRequest) {
  try {
    const { adminEmail } = await request.json()

    if (!adminEmail) {
      return NextResponse.json({
        success: false,
        error: 'Admin email is required'
      }, { status: 400 })
    }

    await adminSessionTracker.trackAdminLogout(adminEmail)

    return NextResponse.json({
      success: true,
      message: 'Admin logout tracked successfully'
    })

  } catch (error) {
    console.error('Error tracking admin logout:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to track admin logout'
    }, { status: 500 })
  }
}
