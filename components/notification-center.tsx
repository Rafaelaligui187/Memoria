"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/contexts/auth-context"
import {
  Bell,
  BellRing,
  Check,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Info,
  Settings,
  Trash2,
  Eye,
} from "lucide-react"

interface Notification {
  id: string
  type: "info" | "success" | "warning" | "error" | "approval" | "system"
  title: string
  message: string
  timestamp: Date | string
  read: boolean
  actionUrl?: string
  actionLabel?: string
  metadata?: Record<string, any>
  priority: "low" | "medium" | "high" | "urgent"
  category: "profile" | "album" | "system" | "moderation" | "user" | "general"
}

export function NotificationCenter() {
  const [isOpen, setIsOpen] = useState(false)
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(true)
  const [unreadCount, setUnreadCount] = useState(0)
  const [urgentCount, setUrgentCount] = useState(0)
  const { toast } = useToast()
  const { user } = useAuth()

  // Fetch notifications from API
  const fetchNotifications = async () => {
    try {
      setLoading(true)
      const adminEmail = user?.email ? encodeURIComponent(user.email) : ''
      const response = await fetch(`/api/admin/notifications?limit=50&adminEmail=${adminEmail}`)
      const result = await response.json()
      
      if (result.success) {
        setNotifications(result.data || [])
        setUnreadCount(result.unreadCount || 0)
        setUrgentCount(result.urgentCount || 0)
      } else {
        console.error('Failed to fetch notifications:', result.error)
        toast({
          title: "Error",
          description: "Failed to load notifications",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error('Error fetching notifications:', error)
      toast({
        title: "Error",
        description: "Failed to load notifications",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  // Load notifications on component mount
  useEffect(() => {
    fetchNotifications()
    
    // Set up polling for new notifications every 30 seconds
    const interval = setInterval(fetchNotifications, 30000)
    
    return () => clearInterval(interval)
  }, [])

  // Listen for custom events that might trigger notification updates
  useEffect(() => {
    const handleNotificationUpdate = () => {
      fetchNotifications()
    }

    // Listen for events that might create new notifications
    window.addEventListener('profileApproved', handleNotificationUpdate)
    window.addEventListener('profileRejected', handleNotificationUpdate)
    window.addEventListener('newProfileCreated', handleNotificationUpdate)
    window.addEventListener('albumLiked', handleNotificationUpdate)
    window.addEventListener('userReportSubmitted', handleNotificationUpdate)

    return () => {
      window.removeEventListener('profileApproved', handleNotificationUpdate)
      window.removeEventListener('profileRejected', handleNotificationUpdate)
      window.removeEventListener('newProfileCreated', handleNotificationUpdate)
      window.removeEventListener('albumLiked', handleNotificationUpdate)
      window.removeEventListener('userReportSubmitted', handleNotificationUpdate)
    }
  }, [])

  const handleMarkAsRead = async (notificationId: string) => {
    try {
      const response = await fetch('/api/admin/notifications', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ notificationId, action: 'mark_read' })
      })
      
      if (response.ok) {
        setNotifications(prev => 
          prev.map(n => n.id === notificationId ? { ...n, read: true } : n)
        )
        setUnreadCount(prev => Math.max(0, prev - 1))
      }
    } catch (error) {
      console.error('Error marking notification as read:', error)
    }
  }

  const handleMarkAllAsRead = async () => {
    try {
      const response = await fetch('/api/admin/notifications', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ action: 'mark_all_read' })
      })
      
      if (response.ok) {
        setNotifications(prev => prev.map(n => ({ ...n, read: true })))
        setUnreadCount(0)
        toast({
          title: "Success",
          description: "All notifications marked as read",
        })
      }
    } catch (error) {
      console.error('Error marking all notifications as read:', error)
      toast({
        title: "Error",
        description: "Failed to mark all notifications as read",
        variant: "destructive",
      })
    }
  }

  const handleDeleteNotification = async (notificationId: string) => {
    try {
      const response = await fetch('/api/admin/notifications', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ notificationId, action: 'delete' })
      })
      
      if (response.ok) {
        setNotifications(prev => prev.filter(n => n.id !== notificationId))
        setUnreadCount(prev => Math.max(0, prev - 1))
      }
    } catch (error) {
      console.error('Error deleting notification:', error)
    }
  }

  const getNotificationIcon = (type: string, priority: string) => {
    if (priority === "urgent") {
      return <AlertTriangle className="h-4 w-4 text-red-500" />
    }
    
    switch (type) {
      case "success":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "error":
        return <XCircle className="h-4 w-4 text-red-500" />
      case "warning":
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />
      case "approval":
        return <CheckCircle className="h-4 w-4 text-blue-500" />
      default:
        return <Info className="h-4 w-4 text-blue-500" />
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "urgent":
        return "text-red-600 bg-red-50"
      case "high":
        return "text-orange-600 bg-orange-50"
      case "medium":
        return "text-blue-600 bg-blue-50"
      default:
        return "text-gray-600 bg-gray-50"
    }
  }

  const formatTimeAgo = (timestamp: Date | string) => {
    const now = new Date()
    const time = new Date(timestamp)
    const diffInSeconds = Math.floor((now.getTime() - time.getTime()) / 1000)

    if (diffInSeconds < 60) return "Just now"
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`
    
    const days = Math.floor(diffInSeconds / 86400)
    return `${days}d ago`
  }

  const allNotifications = notifications
  const unreadNotifications = notifications.filter(n => !n.read)
  const urgentNotifications = notifications.filter(n => n.priority === "urgent" && !n.read)

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="relative">
          {urgentCount > 0 ? <BellRing className="h-5 w-5 text-red-500" /> : <Bell className="h-5 w-5" />}
          {unreadCount > 0 && (
            <Badge
              variant="destructive"
              className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
            >
              {unreadCount > 99 ? "99+" : unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-96">
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="font-semibold">Notifications</h3>
          <div className="flex items-center gap-2">
            {unreadCount > 0 && (
              <Button variant="ghost" size="sm" onClick={handleMarkAllAsRead}>
                <Check className="h-4 w-4 mr-1" />
                Mark all read
              </Button>
            )}
            <Button variant="ghost" size="sm" onClick={fetchNotifications}>
              <Settings className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="all" className="text-xs">
              All ({allNotifications.length})
            </TabsTrigger>
            <TabsTrigger value="unread" className="text-xs">
              Unread ({unreadNotifications.length})
            </TabsTrigger>
            <TabsTrigger value="urgent" className="text-xs">
              Urgent ({urgentNotifications.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="mt-0">
            <ScrollArea className="h-96">
              {loading ? (
                <div className="p-4 text-center text-sm text-gray-500">
                  Loading notifications...
                </div>
              ) : allNotifications.length === 0 ? (
                <div className="p-4 text-center text-sm text-gray-500">
                  No notifications yet
                </div>
              ) : (
                <div className="p-2">
                  {allNotifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`p-3 border-b border-gray-100 hover:bg-gray-50 transition-colors ${
                        !notification.read ? "bg-blue-50" : ""
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        {getNotificationIcon(notification.type, notification.priority)}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <h4 className="text-sm font-medium text-gray-900 truncate">
                              {notification.title}
                            </h4>
                            <div className="flex items-center gap-1">
                              <span className={`text-xs px-2 py-1 rounded-full ${getPriorityColor(notification.priority)}`}>
                                {notification.priority}
                              </span>
                              {!notification.read && (
                                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                              )}
                            </div>
                          </div>
                          <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                            {notification.message}
                          </p>
                          <div className="flex items-center justify-between mt-2">
                            <span className="text-xs text-gray-500">
                              {formatTimeAgo(notification.timestamp)}
                            </span>
                            <div className="flex items-center gap-1">
                              {!notification.read && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="text-xs h-6 px-2"
                                  onClick={() => handleMarkAsRead(notification.id)}
                                >
                                  <Eye className="h-3 w-3" />
                                </Button>
                              )}
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-xs h-6 px-2 text-red-600 hover:text-red-800"
                                onClick={() => handleDeleteNotification(notification.id)}
                              >
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>
          </TabsContent>

          <TabsContent value="unread" className="mt-0">
            <ScrollArea className="h-96">
              {unreadNotifications.length === 0 ? (
                <div className="p-4 text-center text-sm text-gray-500">
                  No unread notifications
                </div>
              ) : (
                <div className="p-2">
                  {unreadNotifications.map((notification) => (
                    <div
                      key={notification.id}
                      className="p-3 border-b border-gray-100 hover:bg-gray-50 transition-colors bg-blue-50"
                    >
                      <div className="flex items-start gap-3">
                        {getNotificationIcon(notification.type, notification.priority)}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <h4 className="text-sm font-medium text-gray-900 truncate">
                              {notification.title}
                            </h4>
                            <div className="flex items-center gap-1">
                              <span className={`text-xs px-2 py-1 rounded-full ${getPriorityColor(notification.priority)}`}>
                                {notification.priority}
                              </span>
                              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                            </div>
                          </div>
                          <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                            {notification.message}
                          </p>
                          <div className="flex items-center justify-between mt-2">
                            <span className="text-xs text-gray-500">
                              {formatTimeAgo(notification.timestamp)}
                            </span>
                            <div className="flex items-center gap-1">
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-xs h-6 px-2"
                                onClick={() => handleMarkAsRead(notification.id)}
                              >
                                <Eye className="h-3 w-3" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-xs h-6 px-2 text-red-600 hover:text-red-800"
                                onClick={() => handleDeleteNotification(notification.id)}
                              >
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>
          </TabsContent>

          <TabsContent value="urgent" className="mt-0">
            <ScrollArea className="h-96">
              {urgentNotifications.length === 0 ? (
                <div className="p-4 text-center text-sm text-gray-500">
                  No urgent notifications
                </div>
              ) : (
                <div className="p-2">
                  {urgentNotifications.map((notification) => (
                    <div
                      key={notification.id}
                      className="p-3 border-b border-gray-100 hover:bg-gray-50 transition-colors bg-red-50"
                    >
                      <div className="flex items-start gap-3">
                        {getNotificationIcon(notification.type, notification.priority)}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <h4 className="text-sm font-medium text-gray-900 truncate">
                              {notification.title}
                            </h4>
                            <div className="flex items-center gap-1">
                              <span className="text-xs px-2 py-1 rounded-full text-red-600 bg-red-50">
                                urgent
                              </span>
                              <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                            </div>
                          </div>
                          <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                            {notification.message}
                          </p>
                          <div className="flex items-center justify-between mt-2">
                            <span className="text-xs text-gray-500">
                              {formatTimeAgo(notification.timestamp)}
                            </span>
                            <div className="flex items-center gap-1">
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-xs h-6 px-2"
                                onClick={() => handleMarkAsRead(notification.id)}
                              >
                                <Eye className="h-3 w-3" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-xs h-6 px-2 text-red-600 hover:text-red-800"
                                onClick={() => handleDeleteNotification(notification.id)}
                              >
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}