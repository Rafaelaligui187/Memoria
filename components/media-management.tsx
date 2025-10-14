"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { useToast } from "@/hooks/use-toast"
import { ImageIcon, MoreHorizontal, Edit, Trash2, FolderPlus, Grid, List, Search, Star, Calendar, MapPin, User, Clock } from "lucide-react"
import { CreateAlbumForm } from "@/components/create-album-form"
import { 
  getAlbums, 
  getMediaItems, 
  deleteAlbum, 
  updateMediaStatus,
  type AlbumData,
  type MediaItem 
} from "@/lib/gallery-service"


interface MediaManagementProps {
  selectedYear: string
  selectedYearLabel?: string
}

export function MediaManagement({ selectedYear, selectedYearLabel }: MediaManagementProps) {
  const [albums, setAlbums] = useState<AlbumData[]>([])
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([])
  const [selectedAlbum, setSelectedAlbum] = useState<AlbumData | null>(null)
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [loading, setLoading] = useState(true)

  const [createAlbumOpen, setCreateAlbumOpen] = useState(false)
  const [deleteAlbumOpen, setDeleteAlbumOpen] = useState(false)
  const [albumToDelete, setAlbumToDelete] = useState<AlbumData | null>(null)

  const { toast } = useToast()

  // Load data on component mount and when selectedYear changes
  useEffect(() => {
    loadData()
  }, [selectedYear])

  const loadData = async () => {
    setLoading(true)
    try {
      const [albumsData, mediaData] = await Promise.all([
        getAlbums(),
        getMediaItems()
      ])
      
      // Filter by selected year
      const filteredAlbums = albumsData.filter(album => album.yearId === selectedYear)
      const filteredMedia = mediaData.filter(media => media.yearId === selectedYear)
      
      setAlbums(filteredAlbums)
      setMediaItems(filteredMedia)
    } catch (error) {
      console.error("Error loading data:", error)
      toast({
        title: "Error",
        description: "Failed to load gallery data.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleAlbumCreated = (newAlbum: AlbumData) => {
    setAlbums(prev => [...prev, newAlbum])
    loadData() // Refresh to get updated media count
  }

  const filteredMediaItems = mediaItems.filter((item) => {
    const matchesSearch = searchQuery === "" || item.filename.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === "all" || item.status === statusFilter
    const matchesAlbum = !selectedAlbum || item.albumId === selectedAlbum.id
    return matchesSearch && matchesStatus && matchesAlbum
  })

  const handleDeleteAlbum = async () => {
    if (!albumToDelete) return

    try {
      await deleteAlbum(albumToDelete.id)
      setAlbums(albums.filter((album) => album.id !== albumToDelete.id))
      setMediaItems(mediaItems.filter((item) => item.albumId !== albumToDelete.id))
      setDeleteAlbumOpen(false)
      setAlbumToDelete(null)

      toast({
        title: "Success",
        description: "Album and all its media have been deleted.",
      })
    } catch (error) {
      console.error("Error deleting album:", error)
      toast({
        title: "Error",
        description: "Failed to delete album.",
        variant: "destructive",
      })
    }
  }

  const handleMediaStatusChange = async (mediaId: string, status: 'approved' | 'pending' | 'rejected') => {
    try {
      await updateMediaStatus(mediaId, status)
      setMediaItems(prev => 
        prev.map(item => 
          item.id === mediaId ? { ...item, status } : item
        )
      )
      
      toast({
        title: "Success",
        description: `Media ${status} successfully.`,
      })
    } catch (error) {
      console.error("Error updating media status:", error)
      toast({
        title: "Error",
        description: "Failed to update media status.",
        variant: "destructive",
      })
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return (
          <Badge variant="default" className="bg-green-100 text-green-800">
            Approved
          </Badge>
        )
      case "pending":
        return (
          <Badge variant="secondary" className="bg-amber-100 text-amber-800">
            Pending
          </Badge>
        )
      case "rejected":
        return <Badge variant="destructive">Rejected</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Gallery Management</h2>
          <p className="text-muted-foreground">Create albums and manage media for {selectedYearLabel || selectedYear}</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => setCreateAlbumOpen(true)}>
            <FolderPlus className="h-4 w-4 mr-2" />
            Create Album
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Albums</CardTitle>
            <FolderPlus className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{albums.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Media</CardTitle>
            <ImageIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mediaItems.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Approval</CardTitle>
            <ImageIcon className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mediaItems.filter((item) => item.status === "pending").length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Storage Used</CardTitle>
            <ImageIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatFileSize(mediaItems.reduce((total, item) => total + item.size, 0))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="albums" className="space-y-4">
        <TabsList>
          <TabsTrigger value="albums">Albums</TabsTrigger>
          <TabsTrigger value="media">All Media</TabsTrigger>
          <TabsTrigger value="pending">Pending Approval</TabsTrigger>
        </TabsList>

        <TabsContent value="albums" className="space-y-4">
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="text-muted-foreground mt-2">Loading albums...</p>
            </div>
          ) : albums.length === 0 ? (
            <div className="text-center py-12">
              <ImageIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No albums yet</h3>
              <p className="text-muted-foreground mb-4">Create your first album to start organizing your media</p>
              <Button onClick={() => setCreateAlbumOpen(true)}>
                <FolderPlus className="h-4 w-4 mr-2" />
                Create Album
              </Button>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {albums.map((album) => (
                <Card key={album.id} className="cursor-pointer hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="aspect-video bg-muted rounded-lg mb-4 flex items-center justify-center">
                      {album.coverImage ? (
                        <img
                          src={album.coverImage || "/placeholder.svg"}
                          alt={album.title}
                          className="w-full h-full object-cover rounded-lg"
                        />
                      ) : (
                        <ImageIcon className="h-12 w-12 text-muted-foreground" />
                      )}
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold line-clamp-1">{album.title}</h3>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => setSelectedAlbum(album)}>
                              <ImageIcon className="mr-2 h-4 w-4" />
                              View Media
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Edit className="mr-2 h-4 w-4" />
                              Edit Album
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => {
                                setAlbumToDelete(album)
                                setDeleteAlbumOpen(true)
                              }}
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete Album
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                      
                      {/* Category and Featured badges */}
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-blue-600 border-blue-200">
                          {album.category}
                        </Badge>
                        {album.isFeatured && (
                          <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-black">
                            <Star className="h-3 w-3 mr-1" />
                            Featured
                          </Badge>
                        )}
                      </div>
                      
                      <p className="text-sm text-muted-foreground line-clamp-2">{album.description}</p>
                      
                      {/* Album details */}
                      <div className="space-y-2 text-xs text-muted-foreground">
                        {album.date && (
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {new Date(album.date).toLocaleDateString()}
                          </div>
                        )}
                        {album.location && (
                          <div className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {album.location}
                          </div>
                        )}
                        {album.photographer && (
                          <div className="flex items-center gap-1">
                            <User className="h-3 w-3" />
                            {album.photographer}
                          </div>
                        )}
                        {album.duration && (
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {album.duration}
                          </div>
                        )}
                      </div>
                      
                      {/* Tags */}
                      {album.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {album.tags.slice(0, 3).map((tag, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              #{tag}
                            </Badge>
                          ))}
                          {album.tags.length > 3 && (
                            <Badge variant="secondary" className="text-xs">
                              +{album.tags.length - 3} more
                            </Badge>
                          )}
                        </div>
                      )}
                      
                      <div className="flex items-center justify-between text-sm">
                        <span>{album.mediaCount} items</span>
                        <Badge variant={album.isPublic ? "default" : "secondary"}>
                          {album.isPublic ? "Public" : "Private"}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="media" className="space-y-4">
          {/* Filters and View Controls */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-4 flex-1">
                  <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search media..."
                      className="pl-10"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-[150px]">
                      <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="approved">Approved</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="rejected">Rejected</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant={viewMode === "grid" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setViewMode("grid")}
                  >
                    <Grid className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={viewMode === "list" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setViewMode("list")}
                  >
                    <List className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Media Grid/List */}
          {viewMode === "grid" ? (
            <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-4">
              {filteredMediaItems.map((item) => (
                <Card key={item.id} className="overflow-hidden">
                  <div className="aspect-square bg-muted flex items-center justify-center">
                    <img
                      src={item.thumbnailUrl || "/placeholder.svg"}
                      alt={item.filename}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <CardContent className="p-3">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium truncate">{item.filename}</p>
                        {getStatusBadge(item.status)}
                      </div>
                      <p className="text-xs text-muted-foreground">{formatFileSize(item.fileSize)}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-muted/50">
                      <tr className="border-b">
                        <th className="px-4 py-3 text-left text-sm font-medium">Name</th>
                        <th className="px-4 py-3 text-left text-sm font-medium">Type</th>
                        <th className="px-4 py-3 text-left text-sm font-medium">Size</th>
                        <th className="px-4 py-3 text-left text-sm font-medium">Status</th>
                        <th className="px-4 py-3 text-left text-sm font-medium">Uploaded</th>
                        <th className="px-4 py-3 text-right text-sm font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {filteredMediaItems.map((item) => (
                        <tr key={item.id} className="hover:bg-muted/50">
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-3">
                              <img
                                src={item.thumbnailUrl || "/placeholder.svg"}
                                alt={item.filename}
                                className="w-10 h-10 object-cover rounded"
                              />
                              <span className="font-medium">{item.filename}</span>
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <Badge variant="outline">
                              {item.mimeType.startsWith('image/') ? 'Image' : 'Video'}
                            </Badge>
                          </td>
                          <td className="px-4 py-3 text-sm">{formatFileSize(item.fileSize)}</td>
                          <td className="px-4 py-3">{getStatusBadge(item.status)}</td>
                          <td className="px-4 py-3 text-sm text-muted-foreground">
                            {new Date(item.uploadedAt).toLocaleDateString()}
                          </td>
                          <td className="px-4 py-3 text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem>View</DropdownMenuItem>
                                <DropdownMenuItem>Edit</DropdownMenuItem>
                                <DropdownMenuItem>Delete</DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="pending" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Pending Media Approval</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {mediaItems
                .filter((item) => item.status === "pending")
                .map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <img
                        src={item.thumbnailUrl || "/placeholder.svg"}
                        alt={item.filename}
                        className="w-16 h-16 object-cover rounded"
                      />
                      <div>
                        <h4 className="font-medium">{item.filename}</h4>
                        <p className="text-sm text-muted-foreground">
                          Uploaded by {item.uploadedBy} • {formatFileSize(item.fileSize)}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(item.uploadedAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="text-red-600 border-red-600 bg-transparent"
                        onClick={() => handleMediaStatusChange(item.id, 'rejected')}
                      >
                        Reject
                      </Button>
                      <Button 
                        size="sm" 
                        className="bg-green-600 hover:bg-green-700"
                        onClick={() => handleMediaStatusChange(item.id, 'approved')}
                      >
                        Approve
                      </Button>
                    </div>
                  </div>
                ))}
              {mediaItems.filter((item) => item.status === "pending").length === 0 && (
                <div className="text-center py-8">
                  <ImageIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No media pending approval</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Create Album Form */}
      <CreateAlbumForm
        open={createAlbumOpen}
        onOpenChange={setCreateAlbumOpen}
        selectedYear={selectedYear}
        onAlbumCreated={handleAlbumCreated}
      />

      {/* Delete Album Dialog */}
      <AlertDialog open={deleteAlbumOpen} onOpenChange={setDeleteAlbumOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Album</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{albumToDelete?.title}"? This will also delete all media in this album.
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteAlbum}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete Album
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
