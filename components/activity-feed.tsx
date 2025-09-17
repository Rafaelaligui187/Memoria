"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { User, FileText, ImageIcon, CheckCircle, XCircle, Settings, Clock, Activity } from "lucide-react"

interface ActivityItem {
  id: string
  type:
    | "profile_created"
    | "profile_updated"
    | "profile_approved"
    | "profile_rejected"
    | "album_created"
    | "photo_uploaded"
    | "user_login"
    | "settings_changed"
    | "bulk_action"
  actor: {
    id: string
    name: string
    avatar?: string
    role: string
  }
  target?: {
    id: string
    name: string
    type: string
  }
  description: string
  timestamp: Date
  metadata?: Record<string, any>
}

const mockActivities: ActivityItem[] = [
  {
    id: "1",
    type: "profile_approved",
    actor: {
      id: "admin1",
      name: "Admin User",
      avatar: "/placeholder.svg?height=32&width=32&text=AU",
      role: "Administrator",
    },
    target: {
      id: "profile123",
      name: "John Doe's Profile",
      type: "student_profile",
    },
    description: "approved a student profile",
    timestamp: new Date(Date.now() - 5 * 60 * 1000),
    metadata: { previousStatus: "pending", department: "College" },
  },
  {
    id: "2",
    type: "album_created",
    actor: {
      id: "admin1",
      name: "Admin User",
      avatar: "/placeholder.svg?height=32&width=32&text=AU",
      role: "Administrator",
    },
    target: {
      id: "album456",
      name: "Sports Day 2024",
      type: "album",
    },
    description: "created a new album",
    timestamp: new Date(Date.now() - 15 * 60 * 1000),
    metadata: { privacy: "public", initialPhotoCount: 0 },
  },
  {
    id: "3",
    type: "bulk_action",
    actor: {
      id: "admin2",
      name: "Secondary Admin",
      avatar: "/placeholder.svg?height=32&width=32&text=SA",
      role: "Administrator",
    },
    description: "performed bulk approval on 25 profiles",
    timestamp: new Date(Date.now() - 30 * 60 * 1000),
    metadata: { action: "approve", count: 25, type: "student_profiles" },
  },
  {
    id: "4",
    type: "photo_uploaded",
    actor: {
      id: "user123",
      name: "John Doe",
      avatar: "/placeholder.svg?height=32&width=32&text=JD",
      role: "Student",
    },
    target: {
      id: "photo789",
      name: "graduation_photo.jpg",
      type: "photo",
    },
    description: "uploaded a new photo",
    timestamp: new Date(Date.now() - 45 * 60 * 1000),
    metadata: { fileSize: "2.4MB", album: "Graduation Ceremony" },
  },
  {
    id: "5",
    type: "profile_rejected",
    actor: {
      id: "admin1",
      name: "Admin User",
      avatar: "/placeholder.svg?height=32&width=32&text=AU",
      role: "Administrator",
    },
    target: {
      id: "profile456",
      name: "Jane Smith's Profile",
      type: "faculty_profile",
    },
    description: "rejected a faculty profile",
    timestamp: new Date(Date.now() - 60 * 60 * 1000),
    metadata: { reason: "Incomplete information", department: "Faculty" },
  },
]

interface ActivityFeedProps {
  selectedYear: string
  showUserActions?: boolean
}

export function ActivityFeed({ selectedYear, showUserActions = true }: ActivityFeedProps) {
  const [activities] = useState<ActivityItem[]>(mockActivities)
  const [filter, setFilter] = useState<string>("all")
  const [timeFilter, setTimeFilter] = useState<string>("today")

  const filteredActivities = activities.filter((activity) => {
    const matchesType = filter === "all" || activity.type.includes(filter)

    // Time filtering
    const now = new Date()
    const activityDate = activity.timestamp
    let matchesTime = true

    switch (timeFilter) {
      case "today":
        matchesTime = activityDate.toDateString() === now.toDateString()
        break
      case "week":
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
        matchesTime = activityDate >= weekAgo
        break
      case "month":
        const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
        matchesTime = activityDate >= monthAgo
        break
      default:
        matchesTime = true
    }

    return matchesType && matchesTime
  })

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "profile_created":
      case "profile_updated":
        return <User className="h-4 w-4 text-blue-500" />
      case "profile_approved":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "profile_rejected":
        return <XCircle className="h-4 w-4 text-red-500" />
      case "album_created":
        return <FileText className="h-4 w-4 text-purple-500" />
      case "photo_uploaded":
        return <ImageIcon className="h-4 w-4 text-orange-500" />
      case "settings_changed":
        return <Settings className="h-4 w-4 text-gray-500" />
      case "bulk_action":
        return <Activity className="h-4 w-4 text-indigo-500" />
      default:
        return <Clock className="h-4 w-4 text-gray-500" />
    }
  }

  const formatTimeAgo = (timestamp: Date) => {
    const now = new Date()
    const diff = now.getTime() - timestamp.getTime()
    const minutes = Math.floor(diff / (1000 * 60))
    const hours = Math.floor(diff / (1000 * 60 * 60))
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))

    if (minutes < 1) return "Just now"
    if (minutes < 60) return `${minutes}m ago`
    if (hours < 24) return `${hours}h ago`
    return `${days}d ago`
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Activity Feed - {selectedYear}
          </CardTitle>
          <div className="flex items-center gap-2">
            <Select value={filter} onValueChange={setFilter}>
              <SelectTrigger className="w-[140px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Activities</SelectItem>
                <SelectItem value="profile">Profiles</SelectItem>
                <SelectItem value="album">Albums</SelectItem>
                <SelectItem value="photo">Photos</SelectItem>
                <SelectItem value="bulk">Bulk Actions</SelectItem>
              </SelectContent>
            </Select>
            <Select value={timeFilter} onValueChange={setTimeFilter}>
              <SelectTrigger className="w-[120px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="today">Today</SelectItem>
                <SelectItem value="week">This Week</SelectItem>
                <SelectItem value="month">This Month</SelectItem>
                <SelectItem value="all">All Time</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-96">
          <div className="space-y-4">
            {filteredActivities.map((activity, index) => (
              <div key={activity.id} className="flex items-start gap-4 pb-4">
                <div className="flex-shrink-0">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={activity.actor.avatar || "/placeholder.svg"} />
                    <AvatarFallback>
                      {activity.actor.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    {getActivityIcon(activity.type)}
                    <span className="text-sm font-medium">{activity.actor.name}</span>
                    <Badge variant="outline" className="text-xs">
                      {activity.actor.role}
                    </Badge>
                  </div>

                  <p className="text-sm text-muted-foreground">
                    {activity.description}
                    {activity.target && <span className="font-medium text-foreground"> {activity.target.name}</span>}
                  </p>

                  {activity.metadata && (
                    <div className="mt-2 text-xs text-muted-foreground">
                      {activity.type === "bulk_action" && (
                        <span>
                          Action: {activity.metadata.action}, Count: {activity.metadata.count}
                        </span>
                      )}
                      {activity.type === "profile_rejected" && activity.metadata.reason && (
                        <span>Reason: {activity.metadata.reason}</span>
                      )}
                      {activity.type === "photo_uploaded" && activity.metadata.fileSize && (
                        <span>Size: {activity.metadata.fileSize}</span>
                      )}
                    </div>
                  )}

                  <div className="flex items-center justify-between mt-2">
                    <span className="text-xs text-muted-foreground">{formatTimeAgo(activity.timestamp)}</span>
                    {activity.target && (
                      <Button variant="ghost" size="sm" className="h-6 text-xs">
                        View Details
                      </Button>
                    )}
                  </div>
                </div>

                {index < filteredActivities.length - 1 && <div className="absolute left-8 mt-10 w-px h-4 bg-border" />}
              </div>
            ))}
          </div>
        </ScrollArea>

        {filteredActivities.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <Activity className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No activities found for the selected filters</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
