"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Settings, Shield, MessageSquare, Eye, Save, Plus, Trash2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface YearSettingsSystemProps {
  selectedYear: string
  selectedYearLabel?: string
}

interface YearSettings {
  privacy: {
    defaultProfileVisibility: "public" | "private" | "hidden"
    allowPublicGallery: boolean
    requireApprovalForProfiles: boolean
    requireApprovalForAlbums: boolean
  }
  moderation: {
    autoApproveReturningUsers: boolean
    moderationTimeout: number // days
    enableBulkActions: boolean
  }
  notifications: {
    emailOnApproval: boolean
    emailOnRejection: boolean
    inAppNotifications: boolean
  }
  rejectionReasons: string[]
}

const defaultSettings: YearSettings = {
  privacy: {
    defaultProfileVisibility: "public",
    allowPublicGallery: true,
    requireApprovalForProfiles: true,
    requireApprovalForAlbums: false,
  },
  moderation: {
    autoApproveReturningUsers: false,
    moderationTimeout: 7,
    enableBulkActions: true,
  },
  notifications: {
    emailOnApproval: true,
    emailOnRejection: true,
    inAppNotifications: true,
  },
  rejectionReasons: [
    "Inappropriate content",
    "Incomplete information",
    "Image quality issues",
    "Duplicate submission",
    "Policy violation",
    "Requires additional verification",
  ],
}

export function YearSettingsSystem({ selectedYear, selectedYearLabel }: YearSettingsSystemProps) {
  const { toast } = useToast()
  const [settings, setSettings] = useState<YearSettings>(defaultSettings)
  const [newReason, setNewReason] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSaveSettings = async () => {
    setIsLoading(true)
    try {
      // API call to save settings
      await new Promise((resolve) => setTimeout(resolve, 1000)) // Simulate API call

      toast({
        title: "Settings Saved",
        description: `Year settings for ${selectedYear} have been updated successfully.`,
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save settings. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleAddRejectionReason = () => {
    if (newReason.trim() && !settings.rejectionReasons.includes(newReason.trim())) {
      setSettings((prev) => ({
        ...prev,
        rejectionReasons: [...prev.rejectionReasons, newReason.trim()],
      }))
      setNewReason("")
    }
  }

  const handleRemoveRejectionReason = (reason: string) => {
    setSettings((prev) => ({
      ...prev,
      rejectionReasons: prev.rejectionReasons.filter((r) => r !== reason),
    }))
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Year Settings</h2>
          <p className="text-muted-foreground">Configure settings for {selectedYearLabel || selectedYear}</p>
        </div>
        <Button onClick={handleSaveSettings} disabled={isLoading}>
          <Save className="h-4 w-4 mr-2" />
          {isLoading ? "Saving..." : "Save Settings"}
        </Button>
      </div>

      <Tabs defaultValue="privacy" className="space-y-4">
        <TabsList>
          <TabsTrigger value="privacy" className="flex items-center gap-2">
            <Eye className="h-4 w-4" />
            Privacy
          </TabsTrigger>
          <TabsTrigger value="moderation" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Moderation
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4" />
            Notifications
          </TabsTrigger>
          <TabsTrigger value="rejection-reasons" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Rejection Reasons
          </TabsTrigger>
        </TabsList>

        <TabsContent value="privacy" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Privacy Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="defaultVisibility">Default Profile Visibility</Label>
                <Select
                  value={settings.privacy.defaultProfileVisibility}
                  onValueChange={(value: "public" | "private" | "hidden") =>
                    setSettings((prev) => ({
                      ...prev,
                      privacy: { ...prev.privacy, defaultProfileVisibility: value },
                    }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="public">Public</SelectItem>
                    <SelectItem value="private">Private</SelectItem>
                    <SelectItem value="hidden">Hidden</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Allow Public Gallery Access</Label>
                  <p className="text-sm text-muted-foreground">Allow non-authenticated users to view public albums</p>
                </div>
                <Switch
                  checked={settings.privacy.allowPublicGallery}
                  onCheckedChange={(checked) =>
                    setSettings((prev) => ({
                      ...prev,
                      privacy: { ...prev.privacy, allowPublicGallery: checked },
                    }))
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Require Approval for Profiles</Label>
                  <p className="text-sm text-muted-foreground">All profile submissions must be approved by admin</p>
                </div>
                <Switch
                  checked={settings.privacy.requireApprovalForProfiles}
                  onCheckedChange={(checked) =>
                    setSettings((prev) => ({
                      ...prev,
                      privacy: { ...prev.privacy, requireApprovalForProfiles: checked },
                    }))
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Require Approval for Albums</Label>
                  <p className="text-sm text-muted-foreground">All album submissions must be approved by admin</p>
                </div>
                <Switch
                  checked={settings.privacy.requireApprovalForAlbums}
                  onCheckedChange={(checked) =>
                    setSettings((prev) => ({
                      ...prev,
                      privacy: { ...prev.privacy, requireApprovalForAlbums: checked },
                    }))
                  }
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="moderation" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Moderation Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Auto-approve Returning Users</Label>
                  <p className="text-sm text-muted-foreground">
                    Automatically approve submissions from previously approved users
                  </p>
                </div>
                <Switch
                  checked={settings.moderation.autoApproveReturningUsers}
                  onCheckedChange={(checked) =>
                    setSettings((prev) => ({
                      ...prev,
                      moderation: { ...prev.moderation, autoApproveReturningUsers: checked },
                    }))
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="moderationTimeout">Moderation Timeout (days)</Label>
                <Input
                  id="moderationTimeout"
                  type="number"
                  min="1"
                  max="30"
                  value={settings.moderation.moderationTimeout}
                  onChange={(e) =>
                    setSettings((prev) => ({
                      ...prev,
                      moderation: { ...prev.moderation, moderationTimeout: Number.parseInt(e.target.value) || 7 },
                    }))
                  }
                />
                <p className="text-sm text-muted-foreground">
                  Automatically approve submissions after this many days if no action is taken
                </p>
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Enable Bulk Actions</Label>
                  <p className="text-sm text-muted-foreground">Allow bulk approval/rejection of multiple items</p>
                </div>
                <Switch
                  checked={settings.moderation.enableBulkActions}
                  onCheckedChange={(checked) =>
                    setSettings((prev) => ({
                      ...prev,
                      moderation: { ...prev.moderation, enableBulkActions: checked },
                    }))
                  }
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Notification Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Email on Approval</Label>
                  <p className="text-sm text-muted-foreground">Send email notifications when content is approved</p>
                </div>
                <Switch
                  checked={settings.notifications.emailOnApproval}
                  onCheckedChange={(checked) =>
                    setSettings((prev) => ({
                      ...prev,
                      notifications: { ...prev.notifications, emailOnApproval: checked },
                    }))
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Email on Rejection</Label>
                  <p className="text-sm text-muted-foreground">Send email notifications when content is rejected</p>
                </div>
                <Switch
                  checked={settings.notifications.emailOnRejection}
                  onCheckedChange={(checked) =>
                    setSettings((prev) => ({
                      ...prev,
                      notifications: { ...prev.notifications, emailOnRejection: checked },
                    }))
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>In-App Notifications</Label>
                  <p className="text-sm text-muted-foreground">Show notifications within the application</p>
                </div>
                <Switch
                  checked={settings.notifications.inAppNotifications}
                  onCheckedChange={(checked) =>
                    setSettings((prev) => ({
                      ...prev,
                      notifications: { ...prev.notifications, inAppNotifications: checked },
                    }))
                  }
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="rejection-reasons" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Rejection Reasons</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  placeholder="Add new rejection reason..."
                  value={newReason}
                  onChange={(e) => setNewReason(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleAddRejectionReason()}
                />
                <Button onClick={handleAddRejectionReason}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>

              <div className="space-y-2">
                {settings.rejectionReasons.map((reason, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <span>{reason}</span>
                    <Button variant="ghost" size="sm" onClick={() => handleRemoveRejectionReason(reason)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
