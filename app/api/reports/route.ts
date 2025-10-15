import { NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb/connection"
import { ObjectId } from "mongodb"

// GET /api/reports - Get all reports for admin
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const schoolYearId = searchParams.get('schoolYearId')
    const status = searchParams.get('status')
    const category = searchParams.get('category')
    const priority = searchParams.get('priority')

    if (!schoolYearId) {
      return NextResponse.json({
        success: false,
        error: 'School year ID is required'
      }, { status: 400 })
    }

    const db = await connectToDatabase()
    const reportsCollection = db.collection('reports')

    // Build query
    const query: any = { schoolYearId }
    if (status && status !== 'all') query.status = status
    if (category && category !== 'all') query.category = category
    if (priority && priority !== 'all') query.priority = priority

    const reports = await reportsCollection
      .find(query)
      .sort({ submittedAt: -1 })
      .toArray()

    // Convert ObjectId to string for client
    const formattedReports = reports.map(report => ({
      ...report,
      _id: report._id?.toString(),
    }))

    return NextResponse.json({
      success: true,
      data: formattedReports,
      count: formattedReports.length
    })

  } catch (error) {
    console.error('Error fetching reports:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch reports' },
      { status: 500 }
    )
  }
}

// POST /api/reports - Create a new report/message
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      userId,
      userName,
      userEmail,
      category,
      subject,
      description,
      priority = 'medium',
      schoolYearId,
      attachments = []
    } = body

    // Validate required fields
    if (!userId || !userName || !userEmail || !category || !subject || !description || !schoolYearId) {
      return NextResponse.json({
        success: false,
        error: 'Missing required fields'
      }, { status: 400 })
    }

    const db = await connectToDatabase()
    const reportsCollection = db.collection('reports')

    const newReport = {
      userId,
      userName,
      userEmail,
      category,
      subject,
      description,
      priority,
      status: 'new',
      schoolYearId,
      attachments,
      submittedAt: new Date().toISOString(),
      createdAt: new Date(),
      updatedAt: new Date()
    }

    const result = await reportsCollection.insertOne(newReport)

    // Create notification for new user report/message
    try {
      // Create notification directly in database
      const notificationsCollection = db.collection('notifications')
      
      const notificationData = {
        id: `notif_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        type: priority === "urgent" ? "error" : "warning",
        title: "New User Report",
        message: `${userName} submitted a report: "${subject}"`,
        priority: priority,
        category: "moderation",
        actionUrl: `/admin/reports?reportId=${result.insertedId.toString()}`,
        actionLabel: "View Report",
        metadata: { 
          reportId: result.insertedId.toString(), 
          userName, 
          subject 
        },
        timestamp: new Date(),
        read: false,
      }
      
      await notificationsCollection.insertOne(notificationData)
      
    } catch (notificationError) {
      console.error('Error creating report notification:', notificationError)
      // Don't fail the report creation if notification fails
    }

    return NextResponse.json({
      success: true,
      data: {
        id: result.insertedId.toString(),
        ...newReport
      },
      message: 'Report submitted successfully'
    })

  } catch (error) {
    console.error('Error creating report:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create report' },
      { status: 500 }
    )
  }
}
