"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MessageSquare, Clock, CheckCircle, AlertTriangle } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"

interface UserMessage {
  _id?: string
  id?: string
  userId: string
  userName: string
  userEmail: string
  category: "technical" | "profile" | "content" | "privacy" | "suggestion" | "other"
  subject: string
  description: string
  status: "new" | "in_progress" | "resolved" | "archived"
  priority: "low" | "medium" | "high" | "urgent"
  submittedAt: string
  resolvedAt?: string
  assignedTo?: string
  adminReply?: string
  schoolYearId: string
  attachments?: string[]
}

const categoryLabels = {
  technical: "Technical Issue",
  profile: "Profile Help", 
  content: "Content Concern",
  privacy: "Privacy Issue",
  suggestion: "Suggestion",
  other: "Other",
}

const priorityColors = {
  low: "bg-gray-100 text-gray-800",
  medium: "bg-blue-100 text-blue-800", 
  high: "bg-orange-100 text-orange-800",
  urgent: "bg-red-100 text-red-800",
}

export function UserMessageHistory() {
  const { user } = useAuth()
  const [messages, setMessages] = useState<UserMessage[]>([])
  const [loading, setLoading] = useState(false)

  const fetchMessages = async () => {
    if (!user) return
    
    setLoading(true)
    try {
      const userId = user.id || user.email
      const response = await fetch(`/api/user-messages?userId=${userId}`)
      const data = await response.json()
      
      if (data.success) {
        setMessages(data.data || [])
      }
    } catch (error) {
      console.error('Error fetching user messages:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchMessages()
    
    // Listen for refresh events from the message dialog
    const handleRefresh = () => {
      fetchMessages()
    }
    
    window.addEventListener('refreshUserMessages', handleRefresh)
    
    // Set up polling to check for updates every 30 seconds
    const interval = setInterval(fetchMessages, 30000)
    
    return () => {
      window.removeEventListener('refreshUserMessages', handleRefresh)
      clearInterval(interval)
    }
  }, [user])

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "new":
        return (
          <Badge variant="destructive" className="flex items-center gap-1">
            <AlertTriangle className="h-3 w-3" />
            New
          </Badge>
        )
      case "in_progress":
        return (
          <Badge variant="secondary" className="bg-blue-100 text-blue-800 flex items-center gap-1">
            <Clock className="h-3 w-3" />
            In Progress
          </Badge>
        )
      case "resolved":
        return (
          <Badge variant="default" className="bg-green-100 text-green-800 flex items-center gap-1">
            <CheckCircle className="h-3 w-3" />
            Resolved
          </Badge>
        )
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const getPriorityBadge = (priority: string) => {
    return (
      <Badge variant="outline" className={priorityColors[priority as keyof typeof priorityColors]}>
        {priority.charAt(0).toUpperCase() + priority.slice(1)}
      </Badge>
    )
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short", 
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading your messages...</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (messages.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Your Messages to Admin
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No pending messages</p>
            <p className="text-sm text-muted-foreground mt-2">
              Messages disappear once the admin responds or resolves them
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5" />
          Your Messages to Admin ({messages.length})
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {messages.map((message) => (
          <div key={message._id || message.id} className="border rounded-lg p-4 space-y-3">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h4 className="font-medium">{message.subject}</h4>
                  {getPriorityBadge(message.priority)}
                </div>
                <p className="text-sm text-muted-foreground mb-2">
                  {categoryLabels[message.category]} • Submitted {formatDate(message.submittedAt)}
                </p>
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {message.description}
                </p>
              </div>
              <div className="ml-4">
                {getStatusBadge(message.status)}
              </div>
            </div>
            
            {message.status === "in_progress" && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <div className="flex items-center gap-2 text-blue-800">
                  <Clock className="h-4 w-4" />
                  <span className="text-sm font-medium">Admin is reviewing your message</span>
                </div>
                <p className="text-xs text-blue-600 mt-1">
                  Your message will disappear once the admin responds
                </p>
              </div>
            )}
          </div>
        ))}
        
        <div className="text-center pt-4 border-t">
          <p className="text-xs text-muted-foreground">
            Messages disappear once the admin responds or resolves them
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
