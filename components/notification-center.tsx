"use client"

import { useState, useEffect } from "react"
import { useNotifications } from "@/hooks/use-notifications"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useToast } from "@/hooks/use-toast"
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
  MoreHorizontal,
  Eye,
  EyeOff,
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

const mockNotifications: Notification[] = [
  {
    id: "1",
    type: "approval",
    title: "Profile Approved",
    message: "John Doe's student profile has been approved and is now live.",
    timestamp: new Date(Date.now() - 5 * 60 * 1000), // 5 minutes ago
    read: false,
    actionUrl: "/admin/profiles/123",
    actionLabel: "View Profile",
    priority: "medium",
    category: "profile",
    metadata: { profileId: "123", userName: "John Doe" },
  },
  {
    id: "2",
    type: "warning",
    title: "High Priority Content",
    message: "A profile submission has been flagged for urgent review.",
    timestamp: new Date(Date.now() - 15 * 60 * 1000), // 15 minutes ago
    read: false,
    actionUrl: "/admin/moderation/456",
    actionLabel: "Review Now",
    priority: "urgent",
    category: "moderation",
    metadata: { itemId: "456", riskScore: 85 },
  },
  {
    id: "3",
    type: "success",
    title: "Bulk Import Complete",
    message: "Successfully imported 148 student profiles. 2 failed imports require attention.",
    timestamp: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
    read: true,
    actionUrl: "/admin/import/results",
    actionLabel: "View Results",
    priority: "medium",
    category: "system",
    metadata: { successful: 148, failed: 2 },
  },
  {
    id: "4",
    type: "info",
    title: "New Album Created",
    message: "Sports Day 2024 album has been created with 45 photos.",
    timestamp: new Date(Date.now() - 60 * 60 * 1000), // 1 hour ago
    read: true,
    actionUrl: "/admin/albums/789",
    actionLabel: "View Album",
    priority: "low",
    category: "album",
    metadata: { albumId: "789", photoCount: 45 },
  },
  {
    id: "5",
    type: "error",
    title: "System Alert",
    message: "Database connection timeout detected. System performance may be affected.",
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    read: false,
    priority: "high",
    category: "system",
    metadata: { errorCode: "DB_TIMEOUT", severity: "high" },
  },
]

export function NotificationCenter() {
  const {
    notifications,
    unreadCount,
    urgentCount,
    loading,
    error,
    refreshNotifications,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    clearAllNotifications
  } = useNotifications({
    userId: "admin", // You can get this from auth context
    limit: 50,
    autoRefresh: true,
    refreshInterval: 10000 // Refresh every 10 seconds
  })

  const [isOpen, setIsOpen] = useState(false)
  const [selectedNotification, setSelectedNotification] = useState<Notification | null>(null)
  const [filter, setFilter] = useState<string>("all")
  const { toast } = useToast()

  const filteredNotifications = notifications.filter((notification) => {
    if (filter === "all") return true
    if (filter === "unread") return !notification.read
    if (filter === "urgent") return notification.priority === "urgent"
    return notification.category === filter
  })

  // Handle notification actions with toast feedback
  const handleMarkAsRead = async (notificationId: string) => {
    await markAsRead(notificationId)
    toast({
      title: "Notification marked as read",
      description: "The notification has been marked as read.",
    })
  }

  const handleMarkAllAsRead = async () => {
    await markAllAsRead()
    toast({
      title: "All notifications marked as read",
      description: `${unreadCount} notifications updated.`,
    })
  }

  const handleDeleteNotification = async (notificationId: string) => {
    await deleteNotification(notificationId)
    toast({
      title: "Notification deleted",
      description: "The notification has been removed.",
    })
  }

  const handleClearAllNotifications = async () => {
    await clearAllNotifications()
    toast({
      title: "All notifications cleared",
      description: "Your notification center has been cleared.",
    })
  }

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "success":
      case "approval":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "error":
        return <XCircle className="h-4 w-4 text-red-500" />
      case "warning":
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />
      case "info":
      case "system":
      default:
        return <Info className="h-4 w-4 text-blue-500" />
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "urgent":
        return "text-red-600 bg-red-50 border-red-200"
      case "high":
        return "text-orange-600 bg-orange-50 border-orange-200"
      case "medium":
        return "text-yellow-600 bg-yellow-50 border-yellow-200"
      case "low":
        return "text-green-600 bg-green-50 border-green-200"
      default:
        return "text-gray-600 bg-gray-50 border-gray-200"
    }
  }

  const formatTimeAgo = (timestamp: Date | string) => {
    const now = new Date()
    const timestampDate = timestamp instanceof Date ? timestamp : new Date(timestamp)
    const diff = now.getTime() - timestampDate.getTime()
    const minutes = Math.floor(diff / (1000 * 60))
    const hours = Math.floor(diff / (1000 * 60 * 60))
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))

    if (minutes < 1) return "Just now"
    if (minutes < 60) return `${minutes}m ago`
    if (hours < 24) return `${hours}h ago`
    return `${days}d ago`
  }


  return (
    <>
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
        <DropdownMenuContent align="end" className="w-80">
          <div className="flex items-center justify-between p-4 border-b">
            <h3 className="font-semibold">Notifications</h3>
            <div className="flex items-center gap-2">
              {unreadCount > 0 && (
                <Button variant="ghost" size="sm" onClick={handleMarkAllAsRead}>
                  <Check className="h-4 w-4 mr-1" />
                  Mark all read
                </Button>
              )}
              <Button variant="ghost" size="sm">
                <Settings className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <Tabs defaultValue="all" className="w-full">
            <TabsList className="grid w-full grid-cols-4 p-1 m-1">
              <TabsTrigger value="all" className="text-xs">
                All
              </TabsTrigger>
              <TabsTrigger value="unread" className="text-xs">
                Unread ({unreadCount})
              </TabsTrigger>
              <TabsTrigger value="urgent" className="text-xs">
                Urgent
              </TabsTrigger>
              <TabsTrigger value="system" className="text-xs">
                System
              </TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="mt-0">
              <ScrollArea className="h-96">
                <div className="space-y-1 p-1">
                  {filteredNotifications.slice(0, 10).map((notification) => (
                    <div
                      key={notification.id}
                      className={`p-3 rounded-lg border cursor-pointer hover:bg-muted/50 transition-colors ${
                        !notification.read ? "bg-blue-50/50 border-blue-200" : "bg-background"
                      }`}
                      onClick={() => {
                        markAsRead(notification.id)
                        setSelectedNotification(notification)
                      }}
                    >
                      <div className="flex items-start gap-3">
                        {getNotificationIcon(notification.type)}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <p className="text-sm font-medium truncate">{notification.title}</p>
                            <div className="flex items-center gap-1">
                              <Badge className={`text-xs ${getPriorityColor(notification.priority)}`}>
                                {notification.priority}
                              </Badge>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                                    <MoreHorizontal className="h-3 w-3" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      handleMarkAsRead(notification.id)
                                    }}
                                  >
                                    {notification.read ? (
                                      <>
                                        <EyeOff className="h-4 w-4 mr-2" />
                                        Mark unread
                                      </>
                                    ) : (
                                      <>
                                        <Eye className="h-4 w-4 mr-2" />
                                        Mark read
                                      </>
                                    )}
                                  </DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      handleDeleteNotification(notification.id)
                                    }}
                                    className="text-red-600"
                                  >
                                    <Trash2 className="h-4 w-4 mr-2" />
                                    Delete
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                          </div>
                          <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{notification.message}</p>
                          <div className="flex items-center justify-between mt-2">
                            <span className="text-xs text-muted-foreground">
                              {formatTimeAgo(notification.timestamp)}
                            </span>
                            {notification.actionLabel && (
                              <Button variant="ghost" size="sm" className="h-6 text-xs">
                                {notification.actionLabel}
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </TabsContent>

            <TabsContent value="unread" className="mt-0">
              <ScrollArea className="h-96">
                <div className="space-y-1 p-1">
                  {notifications
                    .filter((n) => !n.read)
                    .slice(0, 10)
                    .map((notification) => (
                      <div
                        key={notification.id}
                        className="p-3 rounded-lg border bg-blue-50/50 border-blue-200 cursor-pointer hover:bg-muted/50 transition-colors"
                        onClick={() => {
                          handleMarkAsRead(notification.id)
                          setSelectedNotification(notification)
                        }}
                      >
                        <div className="flex items-start gap-3">
                          {getNotificationIcon(notification.type)}
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">{notification.title}</p>
                            <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{notification.message}</p>
                            <span className="text-xs text-muted-foreground">
                              {formatTimeAgo(notification.timestamp)}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </ScrollArea>
            </TabsContent>

            <TabsContent value="urgent" className="mt-0">
              <ScrollArea className="h-96">
                <div className="space-y-1 p-1">
                  {notifications
                    .filter((n) => n.priority === "urgent")
                    .slice(0, 10)
                    .map((notification) => (
                      <div
                        key={notification.id}
                        className="p-3 rounded-lg border bg-red-50/50 border-red-200 cursor-pointer hover:bg-muted/50 transition-colors"
                        onClick={() => {
                          handleMarkAsRead(notification.id)
                          setSelectedNotification(notification)
                        }}
                      >
                        <div className="flex items-start gap-3">
                          {getNotificationIcon(notification.type)}
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">{notification.title}</p>
                            <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{notification.message}</p>
                            <span className="text-xs text-muted-foreground">
                              {formatTimeAgo(notification.timestamp)}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </ScrollArea>
            </TabsContent>

            <TabsContent value="system" className="mt-0">
              <ScrollArea className="h-96">
                <div className="space-y-1 p-1">
                  {notifications
                    .filter((n) => n.category === "system")
                    .slice(0, 10)
                    .map((notification) => (
                      <div
                        key={notification.id}
                        className={`p-3 rounded-lg border cursor-pointer hover:bg-muted/50 transition-colors ${
                          !notification.read ? "bg-blue-50/50 border-blue-200" : "bg-background"
                        }`}
                        onClick={() => {
                          handleMarkAsRead(notification.id)
                          setSelectedNotification(notification)
                        }}
                      >
                        <div className="flex items-start gap-3">
                          {getNotificationIcon(notification.type)}
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">{notification.title}</p>
                            <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{notification.message}</p>
                            <span className="text-xs text-muted-foreground">
                              {formatTimeAgo(notification.timestamp)}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </ScrollArea>
            </TabsContent>
          </Tabs>

          {notifications.length > 0 && (
            <div className="p-2 border-t">
              <Button variant="ghost" size="sm" className="w-full text-red-600" onClick={handleClearAllNotifications}>
                <Trash2 className="h-4 w-4 mr-2" />
                Clear All Notifications
              </Button>
            </div>
          )}

          {notifications.length === 0 && (
            <div className="p-8 text-center text-muted-foreground">
              <Bell className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No notifications</p>
            </div>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Notification Detail Dialog */}
      <Dialog open={!!selectedNotification} onOpenChange={() => setSelectedNotification(null)}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {selectedNotification && getNotificationIcon(selectedNotification.type)}
              {selectedNotification?.title}
            </DialogTitle>
            <DialogDescription>
              {selectedNotification && formatTimeAgo(selectedNotification.timestamp)}
            </DialogDescription>
          </DialogHeader>
          {selectedNotification && (
            <div className="space-y-4">
              <p className="text-sm">{selectedNotification.message}</p>

              {selectedNotification.metadata && (
                <div className="space-y-2">
                  <h4 className="text-sm font-medium">Details</h4>
                  <div className="bg-muted p-3 rounded-lg">
                    <pre className="text-xs overflow-x-auto">
                      {JSON.stringify(selectedNotification.metadata, null, 2)}
                    </pre>
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between">
                <Badge className={getPriorityColor(selectedNotification.priority)}>
                  {selectedNotification.priority} priority
                </Badge>
                {selectedNotification.actionLabel && selectedNotification.actionUrl && (
                  <Button size="sm">{selectedNotification.actionLabel}</Button>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}
