"use client"

import { useState, useRef } from "react"  
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { Upload, User, Trash2, Save, X } from "lucide-react"
import { toast } from "@/hooks/use-toast"
import { useAuth } from "@/contexts/auth-context"
import Image from "next/image"
import { uploadProfileImage, validateImageFile, getImagePreviewUrl } from "@/lib/image-upload-utils"

interface CustomizeDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CustomizeDialog({ open, onOpenChange }: CustomizeDialogProps) {
  const { user, updateUser } = useAuth()
  const [passwords, setPasswords] = useState({
    current: "",
    new: "",
    confirm: "",
  })
  const [newEmail, setNewEmail] = useState("")
  const [isChangingPassword, setIsChangingPassword] = useState(false)
  const [profilePhoto, setProfilePhoto] = useState<string | null>(null)
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false)
  const [isRemovingPhoto, setIsRemovingPhoto] = useState(false)
  const [isDeletingAccount, setIsDeletingAccount] = useState(false)
  const [deletePassword, setDeletePassword] = useState("")
  const fileInputRef = useRef<HTMLInputElement>(null)

  const getUserId = () => {
    if (!user) return ""
    return (user as any).id || (user as any).schoolId || ""
  }

  const handlePhotoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Validate file
    const validationError = validateImageFile(file)
    if (validationError) {
      toast({
        title: "Invalid file",
        description: validationError,
        variant: "destructive",
      })
      return
    }

    setIsUploadingPhoto(true)
    try {
      // Show preview immediately
      const previewUrl = await getImagePreviewUrl(file)
      setProfilePhoto(previewUrl)

      // Upload to IMGBB
      const uploadResult = await uploadProfileImage(file)
      
      if (uploadResult.success) {
        // Update user profile photo in database
        const userId = getUserId()
        if (userId) {
          const response = await fetch('/api/auth', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              action: 'update-profile-photo',
              userId: userId,
              profilePhoto: uploadResult.url,
            }),
          })

          const data = await response.json()
          
          if (data.success) {
            // Update user context with new profile photo
            if (updateUser) {
              updateUser({ ...user, profilePhoto: uploadResult.url })
            }
            
            toast({
              title: "Profile photo updated successfully!",
              description: "Your profile photo has been updated.",
            })
          } else {
            toast({
              title: "Update failed",
              description: data.message || "Failed to update profile photo",
              variant: "destructive",
            })
            setProfilePhoto(null)
          }
        }
      } else {
        toast({
          title: "Upload failed",
          description: uploadResult.error || "Failed to upload image",
          variant: "destructive",
        })
        setProfilePhoto(null)
      }
    } catch (error) {
      console.error("Photo upload error:", error)
      toast({
        title: "Upload failed",
        description: "An error occurred while uploading the image",
        variant: "destructive",
      })
      setProfilePhoto(null)
    } finally {
      setIsUploadingPhoto(false)
    }
  }

  const handleRemovePhoto = async () => {
    setIsRemovingPhoto(true)
    try {
      const userId = getUserId()
      if (userId) {
        // Call API to remove profile photo from database
        const response = await fetch('/api/auth', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            action: 'remove-profile-photo',
            userId: userId,
          }),
        })

        const data = await response.json()
        
        if (data.success) {
          // Update user context to remove profile photo
          if (updateUser) {
            updateUser({ ...user, profilePhoto: null })
          }
          
          // Clear local state
          setProfilePhoto(null)
          
          // Clear file input
          if (fileInputRef.current) {
            fileInputRef.current.value = ""
          }
          
          toast({
            title: "Profile photo removed successfully!",
            description: "Your profile photo has been removed.",
          })
        } else {
          toast({
            title: "Remove failed",
            description: data.message || "Failed to remove profile photo",
            variant: "destructive",
          })
        }
      }
    } catch (error) {
      console.error("Photo removal error:", error)
      toast({
        title: "Remove failed",
        description: "An error occurred while removing the profile photo",
        variant: "destructive",
      })
    } finally {
      setIsRemovingPhoto(false)
    }
  }

  const handlePasswordChange = async () => {
    if (!passwords.current || !passwords.new || !passwords.confirm) {
      toast({
        title: "Missing fields",
        description: "Please fill in all password fields.",
        variant: "destructive",
      })
      return
    }

    if (passwords.new !== passwords.confirm) {
      toast({
        title: "Password mismatch",
        description: "New password and confirmation don't match.",
        variant: "destructive",
      })
      return
    }

    if (passwords.new.length < 8) {
      toast({
        title: "Password too short",
        description: "New password must be at least 8 characters long.",
        variant: "destructive",
      })
      return
    }

    if (passwords.current === passwords.new) {
      toast({
        title: "Same password",
        description: "New password must be different from your current password.",
        variant: "destructive",
      })
      return
    }

    const userId = getUserId()
    if (!userId) {
      toast({
        title: "Authentication error",
        description: "Unable to identify user. Please log in again.",
        variant: "destructive",
      })
      return
    }

    setIsChangingPassword(true)
    try {
      const response = await fetch('/api/auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'change-password',
          currentPassword: passwords.current,
          newPassword: passwords.new,
          userId: userId,
        }),
      })

      const data = await response.json()

      if (data.success) {
        toast({
          title: "Password changed successfully!",
          description: "Your password has been updated. You can now use your new password to log in.",
        })
        
        // Clear password fields
        setPasswords({
          current: "",
          new: "",
          confirm: "",
        })
        
        // Close dialog after successful password change
        setTimeout(() => {
          onOpenChange(false)
        }, 2000)
      } else {
        toast({
          title: "Password change failed",
          description: data.message || "Failed to change password. Please try again.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error('Error changing password:', error)
      toast({
        title: "Error",
        description: "Failed to change password. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsChangingPassword(false)
    }
  }

  const handleDeleteAccount = async () => {
    if (!deletePassword) {
      toast({
        title: "Password required",
        description: "Please enter your current password to confirm account deletion.",
        variant: "destructive",
      })
      return
    }

    const userId = getUserId()
    if (!userId) {
      toast({
        title: "Authentication error",
        description: "Unable to identify user. Please log in again.",
        variant: "destructive",
      })
      return
    }

    setIsDeletingAccount(true)
    try {
      const response = await fetch('/api/auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'delete-account',
          userId: userId,
          password: deletePassword,
        }),
      })

      const data = await response.json()

      if (data.success) {
        toast({
          title: "Account deleted successfully!",
          description: `Your account and all associated data have been permanently deleted.`,
        })
        
        // Clear the password field
        setDeletePassword("")
        
        // Close the dialog
        onOpenChange(false)
        
        // Redirect to login page after a short delay
        setTimeout(() => {
          window.location.href = '/login'
        }, 2000)
      } else {
        toast({
          title: "Account deletion failed",
          description: data.message || "Failed to delete account. Please try again.",
          variant: "destructive",
        })
        setDeletePassword("")
      }
    } catch (error) {
      console.error('Error deleting account:', error)
      toast({
        title: "Error",
        description: "Failed to delete account. Please try again.",
        variant: "destructive",
      })
      setDeletePassword("")
    } finally {
      setIsDeletingAccount(false)
    }
  }

  const handleSave = async () => {
    console.log("[v0] Saving customization settings:", {
      newEmail,
    })

    // Handle password change if passwords are provided
    if (passwords.current || passwords.new || passwords.confirm) {
      handlePasswordChange()
      return
    }

    // Handle other settings updates
    const userId = getUserId()
    if (userId) {
      try {
        const response = await fetch('/api/auth', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            action: 'update-user-settings',
            userId: userId,
            email: newEmail || undefined,
          }),
        })

        const data = await response.json()
        
        if (data.success) {
          // Update user context with new settings
          if (updateUser) {
            updateUser({ 
              ...user, 
              email: newEmail || user?.email 
            })
          }
          
          toast({
            title: "Settings saved successfully!",
            description: "Your preferences have been updated.",
          })
          
          onOpenChange(false)
        } else {
          toast({
            title: "Save failed",
            description: data.message || "Failed to save settings",
            variant: "destructive",
          })
        }
      } catch (error) {
        console.error("Settings save error:", error)
        toast({
          title: "Save failed",
          description: "An error occurred while saving settings",
          variant: "destructive",
        })
      }
    } else {
      toast({
        title: "Settings saved successfully!",
        description: "Your preferences have been updated.",
      })
      onOpenChange(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="pb-4">
          <DialogTitle className="text-xl font-bold text-primary">Customize Your Experience</DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Personalize your yearbook experience with themes, notifications, and privacy settings.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <Card className="border-primary/20">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <User className="h-5 w-5 text-primary" />
                Profile Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="profilePhoto">Change Profile Photo</Label>
                
                {/* Current Profile Photo Display */}
                {(user?.profilePhoto || profilePhoto) && (
                  <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                    <div className="relative">
                      <Image
                        src={profilePhoto || user?.profilePhoto || ""}
                        alt="Profile preview"
                        width={60}
                        height={60}
                        className="rounded-full object-cover"
                      />
                      <Button
                        variant="destructive"
                        size="sm"
                        className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0"
                        onClick={handleRemovePhoto}
                        disabled={isRemovingPhoto}
                      >
                        {isRemovingPhoto ? (
                          <div className="h-3 w-3 animate-spin rounded-full border-2 border-white border-t-transparent" />
                        ) : (
                          <X className="h-3 w-3" />
                        )}
                      </Button>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">Current Profile Photo</p>
                      <p className="text-xs text-muted-foreground">Click remove to delete</p>
                    </div>
                  </div>
                )}

                {/* Upload Section */}
                <div className="flex items-center gap-3 p-4 border-2 border-dashed border-muted rounded-lg">
                  <Upload className="h-5 w-5 text-muted-foreground" />
                  <div className="flex-1">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/jpeg,image/png,image/gif,image/webp"
                      onChange={handlePhotoUpload}
                      className="hidden"
                      disabled={isUploadingPhoto}
                    />
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="mb-1 bg-transparent"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={isUploadingPhoto}
                    >
                      {isUploadingPhoto ? "Uploading..." : "Upload New Photo"}
                    </Button>
                    <p className="text-xs text-muted-foreground">JPG, PNG up to 5MB</p>
                  </div>
                </div>
              </div>

              <Separator className="my-4" />

              <div className="space-y-4">
                <h4 className="font-medium text-sm text-foreground">Change Password</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="currentPassword">Current Password</Label>
                    <Input
                      id="currentPassword"
                      type="password"
                      placeholder="Enter current password"
                      value={passwords.current}
                      onChange={(e) => setPasswords((prev) => ({ ...prev, current: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="newPassword">New Password</Label>
                    <Input
                      id="newPassword"
                      type="password"
                      placeholder="Enter new password"
                      value={passwords.new}
                      onChange={(e) => setPasswords((prev) => ({ ...prev, new: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm New Password</Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      placeholder="Confirm new password"
                      value={passwords.confirm}
                      onChange={(e) => setPasswords((prev) => ({ ...prev, confirm: e.target.value }))}
                    />
                  </div>
                </div>
              </div>

              <Separator className="my-4" />

              <div className="space-y-2">
                <Label htmlFor="email">Update Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter new email address"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                />
              </div>
            </CardContent>
          </Card>


          <Card className="border-destructive/30 bg-destructive/5">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base text-destructive">
                <Trash2 className="h-5 w-5" />
                Danger Zone
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-destructive/10 rounded-lg border border-destructive/20">
                <Label className="text-destructive font-medium">Delete Account</Label>
                <p className="text-sm text-muted-foreground mt-1 mb-3">
                  Permanently delete your account and all associated data. This action cannot be undone.
                </p>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" size="sm" disabled={isDeletingAccount}>
                      <Trash2 className="mr-2 h-4 w-4" />
                      {isDeletingAccount ? "Deleting Account..." : "Delete Account"}
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent className="max-w-md">
                    <AlertDialogHeader>
                      <AlertDialogTitle className="text-destructive">Delete Account</AlertDialogTitle>
                      <AlertDialogDescription className="text-sm">
                        This action will permanently delete your account and all associated data including:
                        <ul className="list-disc list-inside mt-2 space-y-1">
                          <li>All profiles you created</li>
                          <li>Your account information</li>
                          <li>All notifications</li>
                          <li>Audit logs</li>
                        </ul>
                        <strong className="text-destructive">This action cannot be undone.</strong>
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <div className="py-4">
                      <Label htmlFor="deletePassword" className="text-sm font-medium">
                        Enter your current password to confirm:
                      </Label>
                      <Input
                        id="deletePassword"
                        type="password"
                        placeholder="Enter your password"
                        value={deletePassword}
                        onChange={(e) => setDeletePassword(e.target.value)}
                        className="mt-2"
                        disabled={isDeletingAccount}
                      />
                    </div>
                    <AlertDialogFooter>
                      <AlertDialogCancel disabled={isDeletingAccount}>
                        Cancel
                      </AlertDialogCancel>
                      <AlertDialogAction
                        onClick={handleDeleteAccount}
                        className="bg-destructive hover:bg-destructive/90"
                        disabled={isDeletingAccount || !deletePassword}
                      >
                        {isDeletingAccount ? "Deleting..." : "Delete Account"}
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button variant="outline" onClick={() => onOpenChange(false)} className="px-6">
              Cancel
            </Button>
            <Button 
              onClick={handleSave} 
              className="px-6 bg-primary hover:bg-primary/90"
              disabled={isChangingPassword}
            >
              <Save className="mr-2 h-4 w-4" />
              {isChangingPassword ? "Changing Password..." : "Save Changes"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
