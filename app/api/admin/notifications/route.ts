import { NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb/connection"

// GET /api/admin/notifications - Get notifications for admin
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '50')
    const unreadOnly = searchParams.get('unreadOnly') === 'true'
    const urgentOnly = searchParams.get('urgentOnly') === 'true'

    const db = await connectToDatabase()
    const notificationsCollection = db.collection('notifications')

    // Initialize collection with sample data if empty
    const count = await notificationsCollection.countDocuments()
    if (count === 0) {
      const sampleNotification = {
        id: `notif_${Date.now()}_sample`,
        type: 'info',
        title: 'Welcome to Memoria Admin',
        message: 'Your notification system is now active! You will receive notifications for profile submissions, album likes, and user reports.',
        timestamp: new Date(),
        read: false,
        priority: 'medium',
        category: 'system',
        actionUrl: '/admin',
        actionLabel: 'Go to Admin Dashboard',
        metadata: { isWelcome: true }
      }
      await notificationsCollection.insertOne(sampleNotification)
    }

    let query = {}
    if (unreadOnly) {
      query = { read: false }
    }
    if (urgentOnly) {
      query = { read: false, priority: 'urgent' }
    }

    const notifications = await notificationsCollection
      .find(query)
      .sort({ timestamp: -1 })
      .limit(limit)
      .toArray()

    const unreadCount = await notificationsCollection.countDocuments({ read: false })
    const urgentCount = await notificationsCollection.countDocuments({ 
      read: false, 
      priority: 'urgent' 
    })

    return NextResponse.json({
      success: true,
      data: notifications,
      unreadCount,
      urgentCount,
      totalCount: notifications.length
    })

  } catch (error) {
    console.error('Error fetching notifications:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch notifications'
    }, { status: 500 })
  }
}

// POST /api/admin/notifications - Create a new notification
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { type, title, message, priority, category, actionUrl, actionLabel, metadata } = body

    if (!type || !title || !message || !priority || !category) {
      return NextResponse.json({
        success: false,
        error: 'Missing required fields: type, title, message, priority, category'
      }, { status: 400 })
    }

    const db = await connectToDatabase()
    const notificationsCollection = db.collection('notifications')

    const newNotification = {
      id: `notif_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type,
      title,
      message,
      timestamp: new Date(),
      read: false,
      priority,
      category,
      actionUrl,
      actionLabel,
      metadata
    }

    const result = await notificationsCollection.insertOne(newNotification)

    return NextResponse.json({
      success: true,
      data: { ...newNotification, _id: result.insertedId },
      message: 'Notification created successfully'
    })

  } catch (error) {
    console.error('Error creating notification:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to create notification'
    }, { status: 500 })
  }
}

// PATCH /api/admin/notifications - Update notification status
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json()
    const { notificationId, action } = body

    if (!action) {
      return NextResponse.json({
        success: false,
        error: 'Action is required'
      }, { status: 400 })
    }

    const db = await connectToDatabase()
    const notificationsCollection = db.collection('notifications')

    if (action === 'mark_all_read') {
      const result = await notificationsCollection.updateMany(
        { read: false },
        { $set: { read: true } }
      )
      return NextResponse.json({
        success: true,
        message: 'All notifications marked as read',
        modifiedCount: result.modifiedCount
      })
    }

    if (!notificationId) {
      return NextResponse.json({
        success: false,
        error: 'Notification ID is required for individual actions'
      }, { status: 400 })
    }

    let updateOperation = {}
    switch (action) {
      case 'mark_read':
        updateOperation = { $set: { read: true } }
        break
      case 'mark_unread':
        updateOperation = { $set: { read: false } }
        break
      case 'delete':
        const deleteResult = await notificationsCollection.deleteOne({ id: notificationId })
        if (deleteResult.deletedCount === 0) {
          return NextResponse.json({
            success: false,
            error: 'Notification not found'
          }, { status: 404 })
        }
        return NextResponse.json({
          success: true,
          message: 'Notification deleted'
        })
      default:
        return NextResponse.json({
          success: false,
          error: 'Invalid action'
        }, { status: 400 })
    }

    const result = await notificationsCollection.updateOne(
      { id: notificationId },
      updateOperation
    )

    if (result.matchedCount === 0) {
      return NextResponse.json({
        success: false,
        error: 'Notification not found'
      }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      message: `Notification ${action.replace('_', ' ')} successfully`
    })

  } catch (error) {
    console.error('Error updating notification:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to update notification'
    }, { status: 500 })
  }
}