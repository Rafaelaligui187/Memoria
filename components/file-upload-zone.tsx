"use client"

import { useState, useCallback } from "react"
import { useDropzone } from "react-dropzone"
import { Upload, X, ImageIcon, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { cn } from "@/lib/utils"

interface FileUploadZoneProps {
  onUpload: (files: File[]) => Promise<void>
  albumId: string
  accept?: Record<string, string[]>
  maxSize?: number
  multiple?: boolean
  className?: string
}

interface UploadingFile {
  file: File
  progress: number
  status: "uploading" | "success" | "error"
  error?: string
}

export function FileUploadZone({
  onUpload,
  albumId,
  accept = {
    "image/*": [".jpeg", ".jpg", ".png", ".gif", ".webp"],
  },
  maxSize = 10 * 1024 * 1024, // 10MB
  multiple = true,
  className,
}: FileUploadZoneProps) {
  const [uploadingFiles, setUploadingFiles] = useState<UploadingFile[]>([])
  const [isUploading, setIsUploading] = useState(false)

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      if (acceptedFiles.length === 0) return

      setIsUploading(true)
      const newUploadingFiles: UploadingFile[] = acceptedFiles.map((file) => ({
        file,
        progress: 0,
        status: "uploading",
      }))

      setUploadingFiles(newUploadingFiles)

      try {
        // Upload files one by one with progress tracking
        for (let i = 0; i < acceptedFiles.length; i++) {
          const file = acceptedFiles[i]
          const formData = new FormData()
          formData.append("file", file)
          formData.append("albumId", albumId)

          try {
            // Simulate progress updates
            const progressInterval = setInterval(() => {
              setUploadingFiles((prev) =>
                prev.map((uf, index) => (index === i ? { ...uf, progress: Math.min(uf.progress + 10, 90) } : uf)),
              )
            }, 200)

            const response = await fetch(`/api/admin/current/media/upload`, {
              method: "POST",
              body: formData,
            })

            clearInterval(progressInterval)

            if (response.ok) {
              setUploadingFiles((prev) =>
                prev.map((uf, index) => (index === i ? { ...uf, progress: 100, status: "success" } : uf)),
              )
            } else {
              const error = await response.json()
              setUploadingFiles((prev) =>
                prev.map((uf, index) => (index === i ? { ...uf, status: "error", error: error.error } : uf)),
              )
            }
          } catch (error) {
            setUploadingFiles((prev) =>
              prev.map((uf, index) => (index === i ? { ...uf, status: "error", error: "Upload failed" } : uf)),
            )
          }
        }

        await onUpload(acceptedFiles)
      } finally {
        setIsUploading(false)
        // Clear completed uploads after 3 seconds
        setTimeout(() => {
          setUploadingFiles([])
        }, 3000)
      }
    },
    [albumId, onUpload],
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept,
    maxSize,
    multiple,
  })

  const removeUploadingFile = (index: number) => {
    setUploadingFiles((prev) => prev.filter((_, i) => i !== index))
  }

  return (
    <div className={cn("space-y-4", className)}>
      <div
        {...getRootProps()}
        className={cn(
          "border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors",
          isDragActive ? "border-primary bg-primary/5" : "border-muted-foreground/25 hover:border-primary/50",
          isUploading && "pointer-events-none opacity-50",
        )}
      >
        <input {...getInputProps()} />
        <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
        {isDragActive ? (
          <p className="text-lg font-medium">Drop files here...</p>
        ) : (
          <div>
            <p className="text-lg font-medium mb-2">Drag & drop files here, or click to select</p>
            <p className="text-sm text-muted-foreground">
              Supports: JPEG, PNG, GIF, WebP (max {Math.round(maxSize / 1024 / 1024)}MB each)
            </p>
          </div>
        )}
      </div>

      {uploadingFiles.length > 0 && (
        <div className="space-y-2">
          <h4 className="font-medium">Uploading Files</h4>
          {uploadingFiles.map((uploadingFile, index) => (
            <div key={index} className="flex items-center gap-3 p-3 border rounded-lg">
              {uploadingFile.file.type.startsWith("image/") ? (
                <ImageIcon className="h-5 w-5 text-muted-foreground" />
              ) : (
                <FileText className="h-5 w-5 text-muted-foreground" />
              )}

              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{uploadingFile.file.name}</p>
                <div className="flex items-center gap-2 mt-1">
                  <Progress value={uploadingFile.progress} className="flex-1" />
                  <span className="text-xs text-muted-foreground">{uploadingFile.progress}%</span>
                </div>
                {uploadingFile.status === "error" && uploadingFile.error && (
                  <p className="text-xs text-destructive mt-1">{uploadingFile.error}</p>
                )}
              </div>

              <Button variant="ghost" size="sm" onClick={() => removeUploadingFile(index)} className="h-8 w-8 p-0">
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
