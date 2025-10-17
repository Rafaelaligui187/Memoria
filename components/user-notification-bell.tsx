"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
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
  Eye,
  Trash2,
} from "lucide-react"

interface UserNotification {
  id: string
  userId: string
  type: "info" | "success" | "warning" | "error" | "approval" | "system"
  title: string
  message: string
  timestamp: Date | string
  read: boolean
  actionUrl?: string
  actionLabel?: string
  metadata?: Record<string, any>
}

export function UserNotificationBell() {
  const [isOpen, setIsOpen] = useState(false)
  const [notifications, setNotifications] = useState<UserNotification[]>([])
  const [loading, setLoading] = useState(true)
  const [unreadCount, setUnreadCount] = useState(0)
  const { toast } = useToast()
  const { user } = useAuth()

  // Fetch notifications from API
  const fetchNotifications = async () => {
    const userId = user?.schoolId || user?.id || user?.email
    if (!userId) return

    try {
      setLoading(true)
      const response = await fetch('/api/notifications?limit=20', {
        headers: {
          'x-user-id': userId,
        },
      })
      const result = await response.json()
      
      if (result.success) {
        setNotifications(result.data || [])
        setUnreadCount(result.unreadCount || 0)
      } else {
        console.error('Failed to fetch notifications:', result.error)
      }
    } catch (error) {
      console.error('Error fetching notifications:', error)
    } finally {
      setLoading(false)
    }
  }

  // Mark notification as read
  const markAsRead = async (notificationId: string) => {
    const userId = user?.schoolId || user?.id || user?.email
    if (!userId) return
    
    try {
      const response = await fetch('/api/notifications', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': userId,
        },
        body: JSON.stringify({
          notificationId,
          action: 'mark_read'
        }),
      })

      if (response.ok) {
        setNotifications(prev => 
          prev.map(notif => 
            notif.id === notificationId ? { ...notif, read: true } : notif
          )
        )
        setUnreadCount(prev => Math.max(0, prev - 1))
      }
    } catch (error) {
      console.error('Error marking notification as read:', error)
    }
  }

  // Delete all notifications
  const deleteAllNotifications = async () => {
    const userId = user?.schoolId || user?.id || user?.email
    if (!userId) return
    
    try {
      const response = await fetch('/api/notifications', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': userId,
        },
      })

      const result = await response.json()

      if (response.ok && result.success) {
        setNotifications([])
        setUnreadCount(0)
        toast({
          title: "Success",
          description: "All notifications have been deleted",
        })
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to delete notifications",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error('Error deleting notifications:', error)
      toast({
        title: "Error",
        description: "Failed to delete notifications",
        variant: "destructive",
      })
    }
  }

  // Load notifications on component mount
  useEffect(() => {
    fetchNotifications()
    
    // Set up polling for new notifications every 30 seconds
    const interval = setInterval(fetchNotifications, 30000)
    
    // Listen for custom events that might trigger notification updates
    const handleNotificationUpdate = () => {
      fetchNotifications()
    }
    
    window.addEventListener('userReportSubmitted', handleNotificationUpdate)
    window.addEventListener('messageStatusChanged', handleNotificationUpdate)
    
    return () => {
      clearInterval(interval)
      window.removeEventListener('userReportSubmitted', handleNotificationUpdate)
      window.removeEventListener('messageStatusChanged', handleNotificationUpdate)
    }
  }, [user])

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-yellow-600" />
      case 'error':
        return <XCircle className="h-4 w-4 text-red-600" />
      case 'approval':
        return <Check className="h-4 w-4 text-blue-600" />
      default:
        return <Info className="h-4 w-4 text-blue-600" />
    }
  }

  const formatTimestamp = (timestamp: Date | string) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))
    
    if (diffInMinutes < 1) return 'Just now'
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`
    return date.toLocaleDateString()
  }

  if (!user) return null

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="relative p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          {unreadCount > 0 ? (
            <BellRing className="h-5 w-5 text-blue-600 animate-pulse" />
          ) : (
            <Bell className="h-5 w-5 text-gray-600" />
          )}
          {unreadCount > 0 && (
            <Badge 
              variant="destructive" 
              className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs font-bold bg-red-500 text-white border-2 border-white shadow-lg animate-bounce"
              style={{
                animation: 'bounce 1s infinite, pulse 2s infinite'
              }}
            >
              {unreadCount > 99 ? '99+' : unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-80 p-0">
        <div className="p-4 border-b bg-gradient-to-r from-blue-50 to-white">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-lg text-gray-900">Notifications</h3>
            {unreadCount > 0 && (
              <Badge 
                variant="destructive" 
                className="bg-red-500 text-white font-bold px-2 py-1 text-sm"
              >
                {unreadCount} unread
              </Badge>
            )}
          </div>
          {unreadCount > 0 && (
            <p className="text-sm text-gray-600 mt-1">
              {unreadCount} unread notification{unreadCount !== 1 ? 's' : ''}
            </p>
          )}
        </div>

        <ScrollArea className="h-96">
          {loading ? (
            <div className="p-4 text-center text-gray-500">
              Loading notifications...
            </div>
          ) : notifications.length === 0 ? (
            <div className="p-4 text-center text-gray-500">
              <Bell className="h-8 w-8 mx-auto mb-2 text-gray-400" />
              <p className="text-sm">No notifications yet</p>
              <p className="text-xs text-gray-400 mt-1">
                You'll see notifications here when admins make updates
              </p>
            </div>
          ) : (
            <div className="p-2">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-3 border-b last:border-b-0 hover:bg-gray-50 cursor-pointer transition-colors relative ${
                    !notification.read ? 'bg-blue-50 border-l-4 border-l-blue-500' : ''
                  }`}
                  onClick={() => {
                    if (!notification.read) {
                      markAsRead(notification.id)
                    }
                    if (notification.actionUrl) {
                      window.location.href = notification.actionUrl
                    }
                  }}
                >
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5">
                      {getNotificationIcon(notification.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-medium text-gray-900 truncate">
                          {notification.title}
                        </h4>
                        {!notification.read && (
                          <div className="w-3 h-3 bg-blue-600 rounded-full flex-shrink-0 ml-2 animate-pulse" />
                        )}
                      </div>
                      <p className="text-sm text-gray-600 mt-1 line-clamp-3 break-words">
                        {notification.message}
                      </p>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-xs text-gray-500">
                          {formatTimestamp(notification.timestamp)}
                        </span>
                        {notification.actionLabel && (
                          <span className="text-xs text-blue-600 font-medium">
                            {notification.actionLabel}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>

        {notifications.length > 0 && (
          <div className="p-3 border-t bg-gray-50">
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="sm"
                className="flex-1 text-sm"
                onClick={() => {
                  // Mark all as read
                  notifications.forEach(notif => {
                    if (!notif.read) {
                      markAsRead(notif.id)
                    }
                  })
                }}
              >
                <Eye className="h-4 w-4 mr-2" />
                Mark all as read
              </Button>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-sm text-red-600 border-red-200 hover:bg-red-50 hover:border-red-300"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete all
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete All Notifications</AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to delete all notifications? This action cannot be undone and will permanently remove all your notifications.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={deleteAllNotifications}
                      className="bg-red-600 text-white hover:bg-red-700"
                    >
                      Delete All
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
