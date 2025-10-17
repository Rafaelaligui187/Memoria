import { NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb/connection"

// GET /api/notifications - Get notifications for authenticated user
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '20')
    const unreadOnly = searchParams.get('unreadOnly') === 'true'

    // Get user ID from headers (you may need to implement proper auth middleware)
    const userId = request.headers.get('x-user-id')
    
    if (!userId) {
      return NextResponse.json(
        { success: false, error: "User not authenticated" },
        { status: 401 }
      )
    }

    const db = await connectToDatabase()
    const notificationsCollection = db.collection('notifications')

    let query: any = { 
      $or: [
        { userId: userId },
        { userId: "all" }
      ]
    }
    if (unreadOnly) {
      query.read = false
    }

    const notifications = await notificationsCollection
      .find(query)
      .sort({ timestamp: -1 })
      .limit(limit)
      .toArray()

    const unreadCount = await notificationsCollection.countDocuments({ 
      $or: [
        { userId: userId, read: false },
        { userId: "all", read: false }
      ]
    })

    return NextResponse.json({
      success: true,
      data: notifications,
      unreadCount,
      totalCount: notifications.length
    })

  } catch (error) {
    console.error('Error fetching user notifications:', error)
    return NextResponse.json(
      { success: false, error: "Failed to fetch notifications" },
      { status: 500 }
    )
  }
}

// POST /api/notifications - Create notification for user
export async function POST(request: NextRequest) {
  try {
    const { userId, type, title, message, actionUrl, actionLabel, metadata } = await request.json()

    if (!userId || !type || !title || !message) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      )
    }

    const db = await connectToDatabase()
    const notificationsCollection = db.collection('notifications')

    const newNotification = {
      id: `notif_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      userId,
      type,
      title,
      message,
      timestamp: new Date(),
      read: false,
      actionUrl,
      actionLabel,
      metadata,
    }

    await notificationsCollection.insertOne(newNotification)

    return NextResponse.json({
      success: true,
      data: newNotification,
    })

  } catch (error) {
    console.error('Error creating notification:', error)
    return NextResponse.json(
      { success: false, error: "Failed to create notification" },
      { status: 500 }
    )
  }
}

// PATCH /api/notifications - Update notification (mark as read/unread)
export async function PATCH(request: NextRequest) {
  try {
    const { notificationId, action } = await request.json()

    if (!notificationId || !action) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      )
    }

    const db = await connectToDatabase()
    const notificationsCollection = db.collection('notifications')

    let updateData: any = {}
    if (action === 'mark_read') {
      updateData.read = true
    } else if (action === 'mark_unread') {
      updateData.read = false
    }

    const result = await notificationsCollection.updateOne(
      { id: notificationId },
      { $set: updateData }
    )

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { success: false, error: "Notification not found" },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      message: "Notification updated successfully",
    })

  } catch (error) {
    console.error('Error updating notification:', error)
    return NextResponse.json(
      { success: false, error: "Failed to update notification" },
      { status: 500 }
    )
  }
}

// DELETE /api/notifications - Delete all notifications for a user
export async function DELETE(request: NextRequest) {
  try {
    // Get user ID from headers
    const userId = request.headers.get('x-user-id')
    
    if (!userId) {
      return NextResponse.json(
        { success: false, error: "User not authenticated" },
        { status: 401 }
      )
    }

    const db = await connectToDatabase()
    const notificationsCollection = db.collection('notifications')

    // Delete all notifications for this user (both user-specific and global)
    const deleteResult = await notificationsCollection.deleteMany({
      $or: [
        { userId: userId },
        { userId: "all" }
      ]
    })

    console.log(`✅ Deleted ${deleteResult.deletedCount} notifications for user ${userId}`)

    return NextResponse.json({
      success: true,
      message: `Successfully deleted ${deleteResult.deletedCount} notifications`,
      deletedCount: deleteResult.deletedCount
    })

  } catch (error) {
    console.error('Error deleting notifications:', error)
    return NextResponse.json(
      { success: false, error: "Failed to delete notifications" },
      { status: 500 }
    )
  }
}
