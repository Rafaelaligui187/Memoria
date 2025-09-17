"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Upload, Palette, Bell, Shield, User, Trash2, Save, Eye, EyeOff } from "lucide-react"
import { toast } from "@/hooks/use-toast"

interface CustomizeDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CustomizeDialog({ open, onOpenChange }: CustomizeDialogProps) {
  const [theme, setTheme] = useState("system")
  const [emailNotifications, setEmailNotifications] = useState(true)
  const [profileVisibility, setProfileVisibility] = useState(true)
  const [showAchievements, setShowAchievements] = useState(true)
  const [showActivities, setShowActivities] = useState(true)
  const [showGallery, setShowGallery] = useState(true)
  const [passwords, setPasswords] = useState({
    current: "",
    new: "",
    confirm: "",
  })
  const [newEmail, setNewEmail] = useState("")

  const handleSave = () => {
    console.log("[v0] Saving customization settings:", {
      theme,
      emailNotifications,
      profileVisibility,
      showAchievements,
      showActivities,
      showGallery,
      newEmail,
    })

    if (passwords.new && passwords.new !== passwords.confirm) {
      toast({
        title: "Password mismatch",
        description: "New password and confirmation don't match.",
        variant: "destructive",
      })
      return
    }

    toast({
      title: "Settings saved successfully!",
      description: "Your preferences have been updated.",
    })

    onOpenChange(false)
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
                <div className="flex items-center gap-3 p-4 border-2 border-dashed border-muted rounded-lg">
                  <Upload className="h-5 w-5 text-muted-foreground" />
                  <div className="flex-1">
                    <Button variant="outline" size="sm" className="mb-1 bg-transparent">
                      Upload New Photo
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

          <Card className="border-accent/20">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <Palette className="h-5 w-5 text-accent" />
                Theme Preferences
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="theme">Theme</Label>
                <Select value={theme} onValueChange={setTheme}>
                  <SelectTrigger className="h-11">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">☀️ Light</SelectItem>
                    <SelectItem value="dark">🌙 Dark</SelectItem>
                    <SelectItem value="system">💻 System</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="p-3 bg-muted rounded-lg">
                <p className="text-sm text-muted-foreground">
                  Theme changes will be applied immediately across your yearbook experience.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-accent/20">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <Bell className="h-5 w-5 text-accent" />
                Notification Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <div className="space-y-0.5">
                  <Label htmlFor="emailNotifications" className="font-medium">
                    Email Notifications
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Receive updates about yearbook activities and messages
                  </p>
                </div>
                <Switch id="emailNotifications" checked={emailNotifications} onCheckedChange={setEmailNotifications} />
              </div>
            </CardContent>
          </Card>

          <Card className="border-accent/20">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <Shield className="h-5 w-5 text-accent" />
                Privacy Options
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                {
                  id: "profileVisibility",
                  label: "Profile Visibility",
                  description: "Make your profile visible in the public yearbook",
                  checked: profileVisibility,
                  onChange: setProfileVisibility,
                  icon: profileVisibility ? Eye : EyeOff,
                },
                {
                  id: "showAchievements",
                  label: "Show Achievements",
                  description: "Display your achievements in your profile",
                  checked: showAchievements,
                  onChange: setShowAchievements,
                  icon: Eye,
                },
                {
                  id: "showActivities",
                  label: "Show Activities",
                  description: "Display your activities in your profile",
                  checked: showActivities,
                  onChange: setShowActivities,
                  icon: Eye,
                },
                {
                  id: "showGallery",
                  label: "Show Gallery",
                  description: "Display your gallery images in your profile",
                  checked: showGallery,
                  onChange: setShowGallery,
                  icon: Eye,
                },
              ].map((setting) => (
                <div key={setting.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <div className="flex items-center gap-3">
                    <setting.icon className="h-4 w-4 text-muted-foreground" />
                    <div className="space-y-0.5">
                      <Label htmlFor={setting.id} className="font-medium">
                        {setting.label}
                      </Label>
                      <p className="text-sm text-muted-foreground">{setting.description}</p>
                    </div>
                  </div>
                  <Switch id={setting.id} checked={setting.checked} onCheckedChange={setting.onChange} />
                </div>
              ))}
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
                <Button variant="destructive" size="sm">
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete Account
                </Button>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button variant="outline" onClick={() => onOpenChange(false)} className="px-6">
              Cancel
            </Button>
            <Button onClick={handleSave} className="px-6 bg-primary hover:bg-primary/90">
              <Save className="mr-2 h-4 w-4" />
              Save Changes
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
