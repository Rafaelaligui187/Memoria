"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
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
import { UserCheck, LogOut, Shield } from "lucide-react"

interface User {
  id: string
  name: string
  email: string
  role: string
}

interface UserImpersonationProps {
  user: User
  onImpersonate: (user: User) => void
  onExitImpersonation: () => void
  isImpersonating: boolean
  impersonatedUser?: User
}

export function UserImpersonation({
  user,
  onImpersonate,
  onExitImpersonation,
  isImpersonating,
  impersonatedUser,
}: UserImpersonationProps) {
  const [showConfirmDialog, setShowConfirmDialog] = useState(false)
  const { toast } = useToast()

  const handleImpersonate = () => {
    onImpersonate(user)
    setShowConfirmDialog(false)
    toast({
      title: "Impersonation Started",
      description: `You are now viewing as ${user.name}`,
    })
  }

  const handleExitImpersonation = () => {
    onExitImpersonation()
    toast({
      title: "Impersonation Ended",
      description: "You are back to your admin account",
    })
  }

  if (isImpersonating && impersonatedUser) {
    return (
      <Card className="border-amber-200 bg-amber-50">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-amber-800">
            <Shield className="h-5 w-5" />
            Impersonating User
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">{impersonatedUser.name}</p>
              <p className="text-sm text-muted-foreground">{impersonatedUser.email}</p>
              <Badge variant="secondary" className="mt-1">
                {impersonatedUser.role}
              </Badge>
            </div>
            <Button onClick={handleExitImpersonation} variant="outline" size="sm">
              <LogOut className="h-4 w-4 mr-2" />
              Exit Impersonation
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        onClick={() => setShowConfirmDialog(true)}
        className="text-blue-600 border-blue-600 hover:bg-blue-50"
      >
        <UserCheck className="h-4 w-4 mr-2" />
        Impersonate
      </Button>

      <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Impersonate User</AlertDialogTitle>
            <AlertDialogDescription>
              You are about to impersonate <strong>{user.name}</strong> ({user.email}). This will allow you to see the
              application from their perspective for testing purposes.
              <br />
              <br />
              <strong>Warning:</strong> All actions performed while impersonating will be logged and attributed to your
              admin account.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleImpersonate}>Start Impersonation</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
