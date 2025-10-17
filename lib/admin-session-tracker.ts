import { connectToDatabase } from './mongodb/connection'

export interface AdminSession {
  id: string
  adminEmail: string
  loginTime: Date
  logoutTime?: Date
  sessionId: string
  isActive: boolean
  welcomeNotificationShown: boolean
  welcomeNotificationDeleted: boolean
}

class AdminSessionTracker {
  private static instance: AdminSessionTracker

  static getInstance(): AdminSessionTracker {
    if (!AdminSessionTracker.instance) {
      AdminSessionTracker.instance = new AdminSessionTracker()
    }
    return AdminSessionTracker.instance
  }

  // Track admin login
  async trackAdminLogin(adminEmail: string): Promise<string> {
    try {
      const db = await connectToDatabase()
      const sessionsCollection = db.collection('admin_sessions')
      
      const sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      
      // Mark any existing active sessions as inactive
      await sessionsCollection.updateMany(
        { adminEmail, isActive: true },
        { $set: { isActive: false, logoutTime: new Date() } }
      )
      
      // Create new session
      const session: AdminSession = {
        id: `admin_session_${Date.now()}`,
        adminEmail,
        loginTime: new Date(),
        sessionId,
        isActive: true,
        welcomeNotificationShown: false,
        welcomeNotificationDeleted: false
      }
      
      await sessionsCollection.insertOne(session)
      console.log('✅ Admin session tracked:', sessionId)
      
      return sessionId
    } catch (error) {
      console.error('❌ Error tracking admin login:', error)
      throw error
    }
  }

  // Track admin logout
  async trackAdminLogout(adminEmail: string): Promise<void> {
    try {
      const db = await connectToDatabase()
      const sessionsCollection = db.collection('admin_sessions')
      
      await sessionsCollection.updateMany(
        { adminEmail, isActive: true },
        { $set: { isActive: false, logoutTime: new Date() } }
      )
      
      console.log('✅ Admin logout tracked for:', adminEmail)
    } catch (error) {
      console.error('❌ Error tracking admin logout:', error)
      throw error
    }
  }

  // Check if welcome notification should be shown
  async shouldShowWelcomeNotification(adminEmail: string): Promise<boolean> {
    try {
      const db = await connectToDatabase()
      const sessionsCollection = db.collection('admin_sessions')
      
      // Get the most recent session for this admin
      const recentSession = await sessionsCollection.findOne(
        { adminEmail },
        { sort: { loginTime: -1 } }
      )
      
      if (!recentSession) {
        // No previous session, should show welcome
        return true
      }
      
      // If the notification was already shown and deleted in this session, don't show again
      if (recentSession.welcomeNotificationShown && recentSession.welcomeNotificationDeleted) {
        return false
      }
      
      // If this is a new session (after logout), show welcome notification
      if (!recentSession.isActive) {
        return true
      }
      
      // If notification hasn't been shown in current session, show it
      return !recentSession.welcomeNotificationShown
    } catch (error) {
      console.error('❌ Error checking welcome notification status:', error)
      return false
    }
  }

  // Mark welcome notification as shown
  async markWelcomeNotificationShown(adminEmail: string): Promise<void> {
    try {
      const db = await connectToDatabase()
      const sessionsCollection = db.collection('admin_sessions')
      
      await sessionsCollection.updateOne(
        { adminEmail, isActive: true },
        { $set: { welcomeNotificationShown: true } }
      )
      
      console.log('✅ Welcome notification marked as shown for:', adminEmail)
    } catch (error) {
      console.error('❌ Error marking welcome notification as shown:', error)
      throw error
    }
  }

  // Mark welcome notification as deleted
  async markWelcomeNotificationDeleted(adminEmail: string): Promise<void> {
    try {
      const db = await connectToDatabase()
      const sessionsCollection = db.collection('admin_sessions')
      
      await sessionsCollection.updateOne(
        { adminEmail, isActive: true },
        { $set: { welcomeNotificationDeleted: true } }
      )
      
      console.log('✅ Welcome notification marked as deleted for:', adminEmail)
    } catch (error) {
      console.error('❌ Error marking welcome notification as deleted:', error)
      throw error
    }
  }

  // Get current active session
  async getCurrentSession(adminEmail: string): Promise<AdminSession | null> {
    try {
      const db = await connectToDatabase()
      const sessionsCollection = db.collection('admin_sessions')
      
      const session = await sessionsCollection.findOne(
        { adminEmail, isActive: true }
      )
      
      return session
    } catch (error) {
      console.error('❌ Error getting current session:', error)
      return null
    }
  }
}

export const adminSessionTracker = AdminSessionTracker.getInstance()
