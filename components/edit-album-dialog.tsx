"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { useToast } from "@/hooks/use-toast"
import { 
  Calendar, 
  MapPin, 
  User, 
  Clock, 
  Tag, 
  Star,
  ImageIcon,
  Loader2,
  AlertTriangle
} from "lucide-react"
import { 
  updateAlbum,
  getAlbumReports,
  type AlbumData
} from "@/lib/gallery-service"

interface EditAlbumDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  album: AlbumData | null
  onAlbumUpdated: (album: AlbumData) => void
  schoolYearId?: string
}

const ALBUM_CATEGORIES = [
  "Events",
  "Academic", 
  "Sports",
  "Cultural",
  "Faculty",
  "Student Life",
  "Graduation",
  "Other"
]

const DURATION_OPTIONS = [
  "Half Day Event",
  "Full Day Event", 
  "Multi-Day Event",
  "Single Session",
  "Multiple Sessions"
]

export function EditAlbumDialog({ open, onOpenChange, album, onAlbumUpdated, schoolYearId }: EditAlbumDialogProps) {
  const [isUpdating, setIsUpdating] = useState(false)
  const [newTag, setNewTag] = useState("")
  const [reports, setReports] = useState<any[]>([])
  const [loadingReports, setLoadingReports] = useState(false)
  
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    tags: [] as string[],
    date: "",
    location: "",
    photographer: "",
    duration: "",
    isFeatured: false,
    isPublic: true,
  })
  
  const { toast } = useToast()

  // Update form data when album changes
  useEffect(() => {
    if (album) {
      setFormData({
        title: album.title || "",
        description: album.description || "",
        category: album.category || "",
        tags: album.tags || [],
        date: album.date || "",
        location: album.location || "",
        photographer: album.photographer || "",
        duration: album.duration || "",
        isFeatured: album.isFeatured || false,
        isPublic: album.isPublic !== false, // Default to true if undefined
      })
      
      // Load reports for this album
      loadAlbumReports()
    }
  }, [album])

  const loadAlbumReports = async () => {
    if (!album) return
    
    setLoadingReports(true)
    try {
      const albumReports = await getAlbumReports(album.id, schoolYearId)
      setReports(albumReports)
    } catch (error) {
      console.error('Error loading album reports:', error)
    } finally {
      setLoadingReports(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!album) return
    
    // Validate required fields
    if (!formData.title.trim() || !formData.category) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields (Title and Category).",
        variant: "destructive",
      })
      return
    }

    setIsUpdating(true)
    
    try {
      const updatedAlbum = await updateAlbum(album.id, {
        title: formData.title.trim(),
        description: formData.description.trim(),
        category: formData.category,
        tags: formData.tags,
        date: formData.date || undefined,
        location: formData.location.trim() || undefined,
        photographer: formData.photographer.trim() || undefined,
        duration: formData.duration || undefined,
        isFeatured: formData.isFeatured,
        isPublic: formData.isPublic,
      })

      if (updatedAlbum) {
        onAlbumUpdated(updatedAlbum)
        onOpenChange(false)
        
        toast({
          title: "Success",
          description: "Album updated successfully.",
        })
      } else {
        throw new Error("Failed to update album")
      }
    } catch (error) {
      console.error("Error updating album:", error)
      toast({
        title: "Error",
        description: "Failed to update album. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsUpdating(false)
    }
  }

  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }))
      setNewTag("")
    }
  }

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }))
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      addTag()
    }
  }

  if (!album) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ImageIcon className="h-5 w-5" />
            Edit Album
          </DialogTitle>
          <DialogDescription>
            Update the details for "{album.title}"
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Album Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Album Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Album Title *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Enter album title"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="category">Category *</Label>
                  <Select value={formData.category} onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {ALBUM_CATEGORIES.map(category => (
                        <SelectItem key={category} value={category}>{category}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Enter album description"
                  rows={3}
                />
              </div>

              {/* Tags */}
              <div className="space-y-2">
                <Label>Tags</Label>
                <div className="flex gap-2">
                  <Input
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    placeholder="Add a tag"
                    onKeyPress={handleKeyPress}
                  />
                  <Button type="button" onClick={addTag} variant="outline">
                    <Tag className="h-4 w-4" />
                  </Button>
                </div>
                {formData.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {formData.tags.map((tag, index) => (
                      <Badge key={index} variant="secondary" className="flex items-center gap-1">
                        #{tag}
                        <button
                          type="button"
                          onClick={() => removeTag(tag)}
                          className="ml-1 hover:text-red-500"
                        >
                          ×
                        </button>
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Event Details */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Event Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="date" className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Date
                  </Label>
                  <Input
                    id="date"
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="location" className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    Location
                  </Label>
                  <Input
                    id="location"
                    value={formData.location}
                    onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                    placeholder="Event location"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="photographer" className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    Photographer
                  </Label>
                  <Input
                    id="photographer"
                    value={formData.photographer}
                    onChange={(e) => setFormData(prev => ({ ...prev, photographer: e.target.value }))}
                    placeholder="Photographer name"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="duration" className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    Duration
                  </Label>
                  <Select value={formData.duration} onValueChange={(value) => setFormData(prev => ({ ...prev, duration: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select duration" />
                    </SelectTrigger>
                    <SelectContent>
                      {DURATION_OPTIONS.map(duration => (
                        <SelectItem key={duration} value={duration}>{duration}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Reports Section */}
          {reports.length > 0 && (
            <Card className="border-orange-200 bg-orange-50">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2 text-orange-800">
                  <AlertTriangle className="h-5 w-5" />
                  Reports ({reports.length})
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-orange-700">
                  This album has {reports.length} report{reports.length !== 1 ? 's' : ''}. Please review and address any issues before making changes.
                </p>
                <div className="space-y-2 max-h-32 overflow-y-auto">
                  {reports.map((report, index) => (
                    <div key={index} className="p-2 bg-white rounded border border-orange-200">
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-sm">{report.subject}</span>
                        <Badge variant={report.priority === 'urgent' ? 'destructive' : 'secondary'}>
                          {report.priority}
                        </Badge>
                      </div>
                      <p className="text-xs text-gray-600 mt-1 line-clamp-2">{report.description}</p>
                      <div className="flex items-center justify-between mt-1">
                        <span className="text-xs text-gray-500">By: {report.userName}</span>
                        <span className="text-xs text-gray-500">
                          {new Date(report.submittedAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Album Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="isFeatured"
                  checked={formData.isFeatured}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isFeatured: !!checked }))}
                />
                <Label htmlFor="isFeatured" className="flex items-center gap-2">
                  <Star className="h-4 w-4" />
                  Featured Album
                </Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="isPublic"
                  checked={formData.isPublic}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isPublic: !!checked }))}
                />
                <Label htmlFor="isPublic">
                  Public Album (visible to all users)
                </Label>
              </div>
            </CardContent>
          </Card>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isUpdating}>
              {isUpdating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Updating...
                </>
              ) : (
                "Update Album"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
