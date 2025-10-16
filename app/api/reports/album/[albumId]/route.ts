import { NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb/connection"
import { ObjectId } from "mongodb"

// GET /api/reports/album/[albumId] - Get reports for a specific album
export async function GET(
  request: NextRequest,
  { params }: { params: { albumId: string } }
) {
  try {
    const { searchParams } = new URL(request.url)
    const schoolYearId = searchParams.get('schoolYearId')

    if (!params.albumId) {
      return NextResponse.json({
        success: false,
        error: 'Album ID is required'
      }, { status: 400 })
    }

    const db = await connectToDatabase()
    const reportsCollection = db.collection('reports')

    // Build query to find reports related to this album
    const query: any = {
      $or: [
        { targetId: params.albumId },
        { targetType: 'album', targetId: params.albumId },
        { subject: { $regex: params.albumId, $options: 'i' } },
        { description: { $regex: params.albumId, $options: 'i' } }
      ]
    }

    if (schoolYearId) {
      query.schoolYearId = schoolYearId
    }

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
    console.error('Error fetching album reports:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch album reports' },
      { status: 500 }
    )
  }
}
