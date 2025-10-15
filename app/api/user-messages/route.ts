import { NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb/connection"

// GET /api/user-messages - Get messages sent by a specific user
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    const schoolYearId = searchParams.get('schoolYearId')

    if (!userId) {
      return NextResponse.json({
        success: false,
        error: 'User ID is required'
      }, { status: 400 })
    }

    const db = await connectToDatabase()
    const reportsCollection = db.collection('reports')

    // Build query - only show messages that haven't been resolved yet
    const query: any = { 
      userId: userId,
      status: { $in: ['new', 'in_progress'] } // Only show unresolved messages
    }
    
    if (schoolYearId) {
      query.schoolYearId = schoolYearId
    }

    const messages = await reportsCollection
      .find(query)
      .sort({ submittedAt: -1 }) // Most recent first
      .toArray()

    // Convert ObjectId to string for client
    const formattedMessages = messages.map(message => ({
      ...message,
      _id: message._id?.toString(),
    }))

    return NextResponse.json({
      success: true,
      data: formattedMessages,
      count: formattedMessages.length
    })

  } catch (error) {
    console.error('Error fetching user messages:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch messages' },
      { status: 500 }
    )
  }
}
