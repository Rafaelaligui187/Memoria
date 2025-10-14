"use client"

import { useState } from "react"
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
import { ImageIcon, Upload, MoreHorizontal, Edit, Trash2, FolderPlus, Grid, List, Search } from "lucide-react"

interface MediaItem {
  id: string
  name: string
  type: "image" | "video"
  url: string
  thumbnail: string
  albumId: string
  uploadedBy: string
  uploadedAt: string
  size: number
  status: "approved" | "pending" | "rejected"
  yearId: string
}

interface Album {
  id: string
  name: string
  description: string
  coverImage?: string
  itemCount: number
  createdAt: string
  yearId: string
  isPublic: boolean
}

const mockAlbums: Album[] = [
  {
    id: "1",
    name: "Sports Day 2024",
    description: "Annual sports day activities and competitions",
    coverImage: "/placeholder.svg?height=200&width=300&text=Sports",
    itemCount: 45,
    createdAt: "2024-08-15",
    yearId: "", // Will be populated from active school year
    isPublic: true,
  },
  {
    id: "2",
    name: "Graduation Ceremony",
    description: "Class of 2024 graduation ceremony",
    coverImage: "/placeholder.svg?height=200&width=300&text=Graduation",
    itemCount: 78,
    createdAt: "2024-08-10",
    yearId: "", // Will be populated from active school year
    isPublic: true,
  },
  {
    id: "3",
    name: "Science Fair",
    description: "Student science projects and presentations",
    coverImage: "/placeholder.svg?height=200&width=300&text=Science",
    itemCount: 32,
    createdAt: "2024-08-05",
    yearId: "", // Will be populated from active school year
    isPublic: false,
  },
]

const mockMediaItems: MediaItem[] = [
  {
    id: "1",
    name: "sports_day_001.jpg",
    type: "image",
    url: "/placeholder.svg?height=400&width=600&text=Sports1",
    thumbnail: "/placeholder.svg?height=150&width=150&text=Sports1",
    albumId: "1",
    uploadedBy: "Admin User",
    uploadedAt: "2024-08-15T10:30:00Z",
    size: 2048000,
    status: "approved",
    yearId: "", // Will be populated from active school year
  },
  {
    id: "2",
    name: "graduation_speech.mp4",
    type: "video",
    url: "/placeholder.svg?height=400&width=600&text=Video",
    thumbnail: "/placeholder.svg?height=150&width=150&text=Video",
    albumId: "2",
    uploadedBy: "Faculty User",
    uploadedAt: "2024-08-14T14:20:00Z",
    size: 15728640,
    status: "pending",
    yearId: "", // Will be populated from active school year
  },
]

interface MediaManagementProps {
  selectedYear: string
  selectedYearLabel?: string
}

export function MediaManagement({ selectedYear, selectedYearLabel }: MediaManagementProps) {
  const [albums, setAlbums] = useState<Album[]>(mockAlbums.filter((album) => album.yearId === selectedYear))
  const [mediaItems, setMediaItems] = useState<MediaItem[]>(
    mockMediaItems.filter((item) => item.yearId === selectedYear),
  )
  const [selectedAlbum, setSelectedAlbum] = useState<Album | null>(null)
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")

  const [createAlbumOpen, setCreateAlbumOpen] = useState(false)
  const [uploadMediaOpen, setUploadMediaOpen] = useState(false)
  const [deleteAlbumOpen, setDeleteAlbumOpen] = useState(false)
  const [albumToDelete, setAlbumToDelete] = useState<Album | null>(null)

  const [newAlbum, setNewAlbum] = useState({
    name: "",
    description: "",
    isPublic: true,
  })

  const { toast } = useToast()

  const filteredMediaItems = mediaItems.filter((item) => {
    const matchesSearch = searchQuery === "" || item.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === "all" || item.status === statusFilter
    const matchesAlbum = !selectedAlbum || item.albumId === selectedAlbum.id
    return matchesSearch && matchesStatus && matchesAlbum
  })

  const handleCreateAlbum = () => {
    if (!newAlbum.name) {
      toast({
        title: "Error",
        description: "Please enter an album name.",
        variant: "destructive",
      })
      return
    }

    const album: Album = {
      id: Date.now().toString(),
      name: newAlbum.name,
      description: newAlbum.description,
      itemCount: 0,
      createdAt: new Date().toISOString().split("T")[0],
      yearId: selectedYear,
      isPublic: newAlbum.isPublic,
    }

    setAlbums([...albums, album])
    setCreateAlbumOpen(false)
    setNewAlbum({ name: "", description: "", isPublic: true })

    toast({
      title: "Success",
      description: "Album created successfully.",
    })
  }

  const handleDeleteAlbum = () => {
    if (!albumToDelete) return

    setAlbums(albums.filter((album) => album.id !== albumToDelete.id))
    setMediaItems(mediaItems.filter((item) => item.albumId !== albumToDelete.id))
    setDeleteAlbumOpen(false)
    setAlbumToDelete(null)

    toast({
      title: "Success",
      description: "Album and all its media have been deleted.",
    })
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
          <h2 className="text-2xl font-bold tracking-tight">Media Management</h2>
          <p className="text-muted-foreground">Manage albums, photos, and videos for {selectedYearLabel || selectedYear}</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => setCreateAlbumOpen(true)}>
            <FolderPlus className="h-4 w-4 mr-2" />
            Create Album
          </Button>
          <Button onClick={() => setUploadMediaOpen(true)}>
            <Upload className="h-4 w-4 mr-2" />
            Upload Media
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
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {albums.map((album) => (
              <Card key={album.id} className="cursor-pointer hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="aspect-video bg-muted rounded-lg mb-4 flex items-center justify-center">
                    {album.coverImage ? (
                      <img
                        src={album.coverImage || "/placeholder.svg"}
                        alt={album.name}
                        className="w-full h-full object-cover rounded-lg"
                      />
                    ) : (
                      <ImageIcon className="h-12 w-12 text-muted-foreground" />
                    )}
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold">{album.name}</h3>
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
                    <p className="text-sm text-muted-foreground">{album.description}</p>
                    <div className="flex items-center justify-between text-sm">
                      <span>{album.itemCount} items</span>
                      <Badge variant={album.isPublic ? "default" : "secondary"}>
                        {album.isPublic ? "Public" : "Private"}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
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
                      src={item.thumbnail || "/placeholder.svg"}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <CardContent className="p-3">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium truncate">{item.name}</p>
                        {getStatusBadge(item.status)}
                      </div>
                      <p className="text-xs text-muted-foreground">{formatFileSize(item.size)}</p>
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
                                src={item.thumbnail || "/placeholder.svg"}
                                alt={item.name}
                                className="w-10 h-10 object-cover rounded"
                              />
                              <span className="font-medium">{item.name}</span>
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <Badge variant="outline">{item.type}</Badge>
                          </td>
                          <td className="px-4 py-3 text-sm">{formatFileSize(item.size)}</td>
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
                        src={item.thumbnail || "/placeholder.svg"}
                        alt={item.name}
                        className="w-16 h-16 object-cover rounded"
                      />
                      <div>
                        <h4 className="font-medium">{item.name}</h4>
                        <p className="text-sm text-muted-foreground">
                          Uploaded by {item.uploadedBy} • {formatFileSize(item.size)}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(item.uploadedAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button size="sm" variant="outline" className="text-red-600 border-red-600 bg-transparent">
                        Reject
                      </Button>
                      <Button size="sm" className="bg-green-600 hover:bg-green-700">
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

      {/* Create Album Dialog */}
      <Dialog open={createAlbumOpen} onOpenChange={setCreateAlbumOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Album</DialogTitle>
            <DialogDescription>Create a new album to organize your media</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="albumName">Album Name</Label>
              <Input
                id="albumName"
                value={newAlbum.name}
                onChange={(e) => setNewAlbum({ ...newAlbum, name: e.target.value })}
                placeholder="Enter album name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="albumDescription">Description</Label>
              <Textarea
                id="albumDescription"
                value={newAlbum.description}
                onChange={(e) => setNewAlbum({ ...newAlbum, description: e.target.value })}
                placeholder="Enter album description"
              />
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="isPublic"
                checked={newAlbum.isPublic}
                onChange={(e) => setNewAlbum({ ...newAlbum, isPublic: e.target.checked })}
              />
              <Label htmlFor="isPublic">Make album public</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCreateAlbumOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateAlbum}>Create Album</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Upload Media Dialog */}
      <Dialog open={uploadMediaOpen} onOpenChange={setUploadMediaOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Upload Media</DialogTitle>
            <DialogDescription>Upload photos and videos to your albums</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center">
              <Upload className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">Drag and drop files here, or click to browse</p>
              <Button variant="outline" className="mt-4 bg-transparent">
                Choose Files
              </Button>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setUploadMediaOpen(false)}>
              Cancel
            </Button>
            <Button>Upload</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Album Dialog */}
      <AlertDialog open={deleteAlbumOpen} onOpenChange={setDeleteAlbumOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Album</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{albumToDelete?.name}"? This will also delete all media in this album.
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
