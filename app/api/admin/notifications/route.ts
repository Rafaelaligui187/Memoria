import { NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb/connection"
import { NotificationSchema, CreateNotificationData, createNotification, NOTIFICATION_COLLECTION } from "@/lib/notification-schemas"
import { ObjectId } from "mongodb"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId")
    const schoolYearId = searchParams.get("schoolYearId")
    const limit = parseInt(searchParams.get("limit") || "50")
    const unreadOnly = searchParams.get("unreadOnly") === "true"

    const db = await connectToDatabase()
    const notificationsCollection = db.collection(NOTIFICATION_COLLECTION)

    let query: any = {}
    
    if (userId) {
      query.$or = [
        { userId: userId },
        { schoolYearId: schoolYearId },
        { category: { $in: ["system", "general"] } }
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

    // Remove MongoDB _id and convert ObjectId to string for client
    const formattedNotifications = notifications.map(notification => ({
      ...notification,
      _id: notification._id?.toString(),
    }))

    return NextResponse.json({
      success: true,
      data: formattedNotifications,
      count: formattedNotifications.length
    })

  } catch (error) {
    console.error("Error fetching notifications:", error)
    return NextResponse.json(
      { success: false, error: "Failed to fetch notifications" },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body: CreateNotificationData = await request.json()
    
    const db = await connectToDatabase()
    const notificationsCollection = db.collection(NOTIFICATION_COLLECTION)

    const notificationData = createNotification(body)
    
    const result = await notificationsCollection.insertOne({
      ...notificationData,
      read: false,
      updatedAt: new Date()
    })

    // Dispatch event for real-time updates
    global.notificationUpdates?.forEach(callback => {
      callback({
        ...notificationData,
        _id: result.insertedId,
        read: false,
        updatedAt: new Date()
      })
    })

    return NextResponse.json({
      success: true,
      message: "Notification created successfully",
      notificationId: result.insertedId.toString()
    })

  } catch (error) {
    console.error("Error creating notification:", error)
    return NextResponse.json(
      { success: false, error: "Failed to create notification" },
      { status: 500 }
    )
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json()
    const { notificationId, action } = body // action: "mark_read" | "mark_unread" | "delete"

    if (!notificationId || !action) {
      return NextResponse.json(
        { success: false, error: "Notification ID and action are required" },
        { status: 400 }
      )
    }

    const db = await connectToDatabase()
    const notificationsCollection = db.collection(NOTIFICATION_COLLECTION)

    let result
    switch (action) {
      case "mark_read":
        result = await notificationsCollection.updateOne(
          { _id: new ObjectId(notificationId) },
          { $set: { read: true, updatedAt: new Date() } }
        )
        break
      case "mark_unread":
        result = await notificationsCollection.updateOne(
          { _id: new ObjectId(notificationId) },
          { $set: { read: false, updatedAt: new Date() } }
        )
        break
      case "delete":
        result = await notificationsCollection.deleteOne({
          _id: new ObjectId(notificationId)
        })
        break
      default:
        return NextResponse.json(
          { success: false, error: "Invalid action" },
          { status: 400 }
        )
    }

    return NextResponse.json({
      success: true,
      message: `Notification ${action} completed successfully`
    })

  } catch (error) {
    console.error("Error updating notification:", error)
    return NextResponse.json(
      { success: false, error: "Failed to update notification" },
      { status: 500 }
    )
  }
}
