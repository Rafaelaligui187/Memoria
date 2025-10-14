"use client"

import { useState, useCallback } from "react"
import { useDropzone } from "react-dropzone"
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
  Upload, 
  X, 
  Calendar, 
  MapPin, 
  User, 
  Clock, 
  Tag, 
  Star,
  ImageIcon,
  CheckCircle,
  AlertCircle,
  Loader2
} from "lucide-react"
import { cn } from "@/lib/utils"
import { 
  uploadImageToGallery, 
  uploadMultipleImagesToGallery,
  createAlbum,
  addMediaToAlbum,
  type AlbumData,
  type MediaItem,
  type GalleryUploadResult
} from "@/lib/gallery-service"

interface UploadingFile {
  file: File
  progress: number
  status: "uploading" | "success" | "error"
  error?: string
  result?: GalleryUploadResult
}

interface CreateAlbumFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  selectedYear: string
  onAlbumCreated: (album: AlbumData) => void
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

export function CreateAlbumForm({ open, onOpenChange, selectedYear, onAlbumCreated }: CreateAlbumFormProps) {
  console.log('[CreateAlbumForm] Component initialized with selectedYear:', selectedYear)
  
  const [isCreating, setIsCreating] = useState(false)
  const [uploadingFiles, setUploadingFiles] = useState<UploadingFile[]>([])
  const [isUploading, setIsUploading] = useState(false)
  
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
  
  const [newTag, setNewTag] = useState("")
  
  const { toast } = useToast()

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return

    setIsUploading(true)
    const newUploadingFiles: UploadingFile[] = acceptedFiles.map((file) => ({
      file,
      progress: 0,
      status: "uploading",
    }))

    setUploadingFiles(newUploadingFiles)

    try {
      // Upload files with progress tracking
      const uploadPromises = acceptedFiles.map(async (file, index) => {
        try {
          // Simulate progress updates
          const progressInterval = setInterval(() => {
            setUploadingFiles((prev) =>
              prev.map((uf, i) => 
                i === index ? { ...uf, progress: Math.min(uf.progress + 10, 90) } : uf
              )
            )
          }, 200)

          const result = await uploadImageToGallery(file, `album_${Date.now()}_${file.name}`)
          
          clearInterval(progressInterval)

          setUploadingFiles((prev) =>
            prev.map((uf, i) => 
              i === index ? { 
                ...uf, 
                progress: 100, 
                status: result.success ? "success" : "error",
                error: result.error,
                result
              } : uf
            )
          )

          // Show warning if using fallback storage
          if (result.success && result.fallback) {
            toast({
              title: "Upload Successful (Local Storage)",
              description: "Image uploaded using local storage due to external service unavailability.",
              variant: "default",
            })
          }

          return result
        } catch (error) {
          setUploadingFiles((prev) =>
            prev.map((uf, i) => 
              i === index ? { 
                ...uf, 
                status: "error", 
                error: "Upload failed" 
              } : uf
            )
          )
          return { success: false, error: "Upload failed" }
        }
      })

      await Promise.all(uploadPromises)
    } finally {
      setIsUploading(false)
    }
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".jpeg", ".jpg", ".png", ".gif", ".webp"],
    },
    maxSize: 10 * 1024 * 1024, // 10MB
    multiple: true,
  })

  const removeUploadingFile = (index: number) => {
    setUploadingFiles((prev) => prev.filter((_, i) => i !== index))
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

  const handleCreateAlbum = async () => {
    console.log('[CreateAlbumForm] === STARTING ALBUM CREATION ===')
    console.log('[CreateAlbumForm] Form validation starting...')
    
    if (!formData.title.trim()) {
      console.error('[CreateAlbumForm] Validation failed: No title')
      toast({
        title: "Error",
        description: "Please enter an album title.",
        variant: "destructive",
      })
      return
    }

    if (!formData.category) {
      console.error('[CreateAlbumForm] Validation failed: No category')
      toast({
        title: "Error", 
        description: "Please select a category.",
        variant: "destructive",
      })
      return
    }

    if (!formData.date) {
      console.error('[CreateAlbumForm] Validation failed: No date')
      toast({
        title: "Error",
        description: "Please select a date.",
        variant: "destructive",
      })
      return
    }

    console.log('[CreateAlbumForm] ✅ All validations passed')
    console.log('[CreateAlbumForm] Setting isCreating to true...')
    setIsCreating(true)

    try {
      console.log('[CreateAlbumForm] Attempting to create album...')
      console.log('[CreateAlbumForm] Form Data:', formData)
      console.log('[CreateAlbumForm] Selected Year:', selectedYear)

      // Albums are global and not tied to specific school years
      const yearId = selectedYear || "global" // Use "global" if no year selected
      
      console.log('[CreateAlbumForm] Using yearId:', yearId)
      
      console.log('[CreateAlbumForm] Calling createAlbum function...')
      console.log('[CreateAlbumForm] Album data to send:', {
        title: formData.title,
        description: formData.description,
        category: formData.category,
        tags: formData.tags,
        date: formData.date,
        location: formData.location,
        photographer: formData.photographer,
        duration: formData.duration,
        isFeatured: formData.isFeatured,
        isPublic: formData.isPublic,
        yearId: yearId,
      })
      
      // Create album
      const albumData = await createAlbum({
        title: formData.title,
        description: formData.description,
        category: formData.category,
        tags: formData.tags,
        date: formData.date,
        location: formData.location,
        photographer: formData.photographer,
        duration: formData.duration,
        isFeatured: formData.isFeatured,
        isPublic: formData.isPublic,
        yearId: yearId,
      })
      console.log('[CreateAlbumForm] ✅ Album created successfully:', albumData)

      // Add uploaded media to album
      const successfulUploads = uploadingFiles.filter(uf => uf.status === "success" && uf.result?.success)
      
      if (successfulUploads.length > 0) {
        const mediaItems: MediaItem[] = successfulUploads.map((uf, index) => ({
          id: `media_${Date.now()}_${index}`,
          albumId: albumData.id,
          filename: uf.file.name,
          url: uf.result!.url!,
          thumbnailUrl: uf.result!.thumbnailUrl!,
          caption: "",
          fileSize: uf.file.size,
          mimeType: uf.file.type,
          uploadedAt: new Date().toISOString(),
          uploadedBy: "admin", // TODO: Get from auth context
          status: "approved",
          yearId: yearId,
        }))

        await addMediaToAlbum(albumData.id, mediaItems)
        albumData.mediaCount = mediaItems.length
      }

      onAlbumCreated(albumData)
      
      toast({
        title: "Success",
        description: `Album "${albumData.title}" created successfully with ${successfulUploads.length} media items.`,
      })

      // Reset form
      setFormData({
        title: "",
        description: "",
        category: "",
        tags: [],
        date: "",
        location: "",
        photographer: "",
        duration: "",
        isFeatured: false,
        isPublic: true,
      })
      setUploadingFiles([])
      onOpenChange(false)
    } catch (error) {
      console.error('[CreateAlbumForm] ❌ ERROR in album creation:', error)
      console.error('[CreateAlbumForm] Error type:', typeof error)
      console.error('[CreateAlbumForm] Error message:', error instanceof Error ? error.message : 'Unknown error')
      console.error('[CreateAlbumForm] Error stack:', error instanceof Error ? error.stack : 'No stack trace')
      
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create album. Please try again.",
        variant: "destructive",
      })
    } finally {
      console.log('[CreateAlbumForm] Setting isCreating to false...')
      setIsCreating(false)
    }
  }

  const successfulUploads = uploadingFiles.filter(uf => uf.status === "success")
  const failedUploads = uploadingFiles.filter(uf => uf.status === "error")

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Create New Album</DialogTitle>
          <DialogDescription>
            Create a new album and upload media files. All uploaded media will be automatically added to this album.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Album Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ImageIcon className="h-5 w-5" />
                Album Information
              </CardTitle>
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
                    onKeyPress={(e) => e.key === 'Enter' && addTag()}
                  />
                  <Button type="button" onClick={addTag} variant="outline">
                    <Tag className="h-4 w-4" />
                  </Button>
                </div>
                {formData.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {formData.tags.map((tag, index) => (
                      <Badge key={index} variant="secondary" className="flex items-center gap-1">
                        #{tag}
                        <button
                          type="button"
                          onClick={() => removeTag(tag)}
                          className="ml-1 hover:text-red-500"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Photo Details */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Photo Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="date">Date *</Label>
                  <Input
                    id="date"
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="location"
                      value={formData.location}
                      onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                      placeholder="Enter location"
                      className="pl-10"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="photographer">Photographer</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="photographer"
                      value={formData.photographer}
                      onChange={(e) => setFormData(prev => ({ ...prev, photographer: e.target.value }))}
                      placeholder="Enter photographer name"
                      className="pl-10"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="duration">Duration</Label>
                  <div className="relative">
                    <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Select value={formData.duration} onValueChange={(value) => setFormData(prev => ({ ...prev, duration: value }))}>
                      <SelectTrigger className="pl-10">
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
              </div>
            </CardContent>
          </Card>

          {/* Album Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Star className="h-5 w-5" />
                Album Settings
              </CardTitle>
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
                  Mark as Featured
                </Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="isPublic"
                  checked={formData.isPublic}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isPublic: !!checked }))}
                />
                <Label htmlFor="isPublic">Make album public</Label>
              </div>
            </CardContent>
          </Card>

          {/* Media Upload */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="h-5 w-5" />
                Upload Media
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div
                {...getRootProps()}
                className={cn(
                  "border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors",
                  isDragActive ? "border-blue-500 bg-blue-50" : "border-muted-foreground/25 hover:border-muted-foreground/50"
                )}
              >
                <input {...getInputProps()} />
                <Upload className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground mb-2">
                  {isDragActive ? "Drop files here" : "Drag and drop files here, or click to browse"}
                </p>
                <p className="text-sm text-muted-foreground">
                  Supports: JPG, PNG, GIF, WebP (max 10MB each)
                </p>
                <Button type="button" variant="outline" className="mt-4">
                  Choose Files
                </Button>
              </div>

              {/* Upload Progress */}
              {uploadingFiles.length > 0 && (
                <div className="space-y-2">
                  <h4 className="font-medium">Upload Progress</h4>
                  {uploadingFiles.map((file, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 border rounded-lg">
                      <div className="flex-shrink-0">
                        {file.status === "uploading" && <Loader2 className="h-4 w-4 animate-spin text-blue-500" />}
                        {file.status === "success" && <CheckCircle className="h-4 w-4 text-green-500" />}
                        {file.status === "error" && <AlertCircle className="h-4 w-4 text-red-500" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{file.file.name}</p>
                        {file.status === "uploading" && (
                          <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                            <div 
                              className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                              style={{ width: `${file.progress}%` }}
                            />
                          </div>
                        )}
                        {file.status === "error" && (
                          <p className="text-sm text-red-500">{file.error}</p>
                        )}
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeUploadingFile(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}

              {/* Upload Summary */}
              {uploadingFiles.length > 0 && (
                <div className="flex gap-4 text-sm">
                  <div className="flex items-center gap-1 text-green-600">
                    <CheckCircle className="h-4 w-4" />
                    {successfulUploads.length} successful
                  </div>
                  {failedUploads.length > 0 && (
                    <div className="flex items-center gap-1 text-red-600">
                      <AlertCircle className="h-4 w-4" />
                      {failedUploads.length} failed
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isCreating}>
            Cancel
          </Button>
          <Button 
            onClick={handleCreateAlbum} 
            disabled={isCreating || isUploading}
            className="min-w-[120px]"
          >
            {isCreating ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Creating...
              </>
            ) : (
              "Create Album"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
