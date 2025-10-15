"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { Upload, Send, AlertCircle, Paperclip, X } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { toast } from "@/hooks/use-toast"
import { useAuth } from "@/contexts/auth-context"
import { UserMessageHistory } from "./user-message-history"

interface MessageAdminDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function MessageAdminDialog({ open, onOpenChange }: MessageAdminDialogProps) {
  const { user } = useAuth()
  const [subject, setSubject] = useState("")
  const [category, setCategory] = useState("")
  const [message, setMessage] = useState("")
  const [attachments, setAttachments] = useState<File[]>([])
  const [loading, setLoading] = useState(false)

  const handleSubmit = async () => {
    if (!subject.trim() || !message.trim() || !category) {
      toast({
        title: "Missing required fields",
        description: "Please fill in all required fields before sending.",
        variant: "destructive",
      })
      return
    }

    if (!user) {
      toast({
        title: "Authentication Error",
        description: "Please log in to send a message.",
        variant: "destructive",
      })
      return
    }

    setLoading(true)
    try {
      // Get current school year ID (you might need to adjust this based on your app's structure)
      const schoolYearId = "current" // This should be dynamically determined
      
      const response = await fetch('/api/reports', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user.id || user.email,
          userName: user.name || 'Anonymous User',
          userEmail: user.email,
          category: category,
          subject: subject,
          description: message,
          priority: 'medium',
          schoolYearId: schoolYearId,
          attachments: [], // For now, we'll handle file uploads separately if needed
        }),
      })

      const data = await response.json()
      
      if (data.success) {
        toast({
          title: "Message sent successfully!",
          description: "Your message has been sent to the administrators. You'll receive a response within 24-48 hours.",
        })

        onOpenChange(false)

        // Reset form
        setSubject("")
        setCategory("")
        setMessage("")
        setAttachments([])
        
        // Refresh the message history
        window.dispatchEvent(new CustomEvent('refreshUserMessages'))
        
        // Dispatch event to update notifications
        window.dispatchEvent(new CustomEvent('userReportSubmitted'))
      } else {
        toast({
          title: "Error",
          description: data.error || "Failed to send message. Please try again.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error('Error sending message:', error)
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const removeAttachment = (index: number) => {
    setAttachments(attachments.filter((_, i) => i !== index))
  }

  const categoryOptions = [
    { value: "technical", label: "🔧 Technical Issue", description: "Problems with the platform or features" },
    { value: "profile", label: "👤 Profile Help", description: "Assistance with profile setup or editing" },
    { value: "content", label: "📝 Content Concern", description: "Issues with inappropriate content" },
    { value: "privacy", label: "🔒 Privacy Issue", description: "Privacy or security concerns" },
    { value: "suggestion", label: "💡 Suggestion", description: "Ideas for improvement" },
    { value: "other", label: "❓ Other", description: "General inquiries or other topics" },
  ]

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="pb-4">
          <DialogTitle className="text-xl font-bold text-primary">Message the Admin</DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Send a message to the yearbook administrators. This is a safe space to raise concerns or request help.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Message History */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Your Recent Messages</h3>
            <UserMessageHistory />
          </div>

          <div className="border-t pt-6">
            <h3 className="text-lg font-semibold mb-4">Send New Message</h3>
            
            <Alert className="border-accent/30 bg-accent/5">
              <AlertCircle className="h-4 w-4 text-accent" />
              <AlertDescription className="text-sm">
                Your message will be sent securely to the yearbook administrators. All communications are confidential and
                will be handled with care. Expect a response within 24-48 hours.
              </AlertDescription>
            </Alert>

            <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="category">Category *</Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger className="h-11">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {categoryOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      <div className="flex flex-col items-start">
                        <span className="font-medium">{option.label}</span>
                        <span className="text-xs text-muted-foreground">{option.description}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="subject">Subject *</Label>
              <Input
                id="subject"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Brief description of your message"
                className="h-11"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="message">Message *</Label>
              <Textarea
                id="message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Describe your concern, question, or suggestion in detail..."
                rows={6}
                className="resize-none"
              />
              <p className="text-xs text-muted-foreground">{message.length}/1000 characters</p>
            </div>

            <div className="space-y-2">
              <Label>Attachments (Optional)</Label>
              <Card className="border-dashed border-2 border-muted">
                <CardContent className="p-6">
                  <div className="text-center">
                    <Upload className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
                    <p className="text-sm text-muted-foreground mb-2">
                      Attach screenshots or files to help explain your issue
                    </p>
                    <Button variant="outline" size="sm" className="mb-2 bg-transparent">
                      <Paperclip className="mr-2 h-4 w-4" />
                      Choose Files
                    </Button>
                    <p className="text-xs text-muted-foreground">PNG, JPG, PDF up to 10MB each (max 5 files)</p>
                  </div>

                  {attachments.length > 0 && (
                    <div className="mt-4 space-y-2">
                      <Label className="text-sm font-medium">Attached Files:</Label>
                      <div className="space-y-2">
                        {attachments.map((file, index) => (
                          <div key={index} className="flex items-center justify-between bg-muted p-3 rounded-lg">
                            <div className="flex items-center gap-2">
                              <Paperclip className="h-4 w-4 text-muted-foreground" />
                              <span className="text-sm font-medium">{file.name}</span>
                              <Badge variant="secondary" className="text-xs">
                                {(file.size / 1024 / 1024).toFixed(1)} MB
                              </Badge>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeAttachment(index)}
                              className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive"
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button variant="outline" onClick={() => onOpenChange(false)} className="px-6">
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={!subject || !message || !category || loading}
              className="px-6 bg-primary hover:bg-primary/90"
            >
              <Send className="mr-2 h-4 w-4" />
              {loading ? "Sending..." : "Send Message"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
