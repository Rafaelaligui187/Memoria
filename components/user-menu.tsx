"use client"

import { useState } from "react"
import { Settings, MessageSquare, Trash2, UserPlus, ChevronDown, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useAuth } from "@/contexts/auth-context"
import { ProfileManagementDialog } from "./profile-management-dialog"
import { CustomizeDialog } from "./customize-dialog"
import { MessageAdminDialog } from "./message-admin-dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

export function UserMenu() {
  const { user, logout } = useAuth()
  const [showProfileManagement, setShowProfileManagement] = useState(false)
  const [showCustomize, setShowCustomize] = useState(false)
  const [showMessageAdmin, setShowMessageAdmin] = useState(false)

  const handleDeleteProfile = () => {
    console.log("[v0] Delete profile requested for user:", user?.name)
    // TODO: Implement actual delete functionality
  }

  if (!user) return null

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="flex items-center gap-3 rounded-full bg-card px-4 py-2 hover:bg-muted transition-colors shadow-sm border"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-primary to-primary/80 text-sm font-bold text-primary-foreground shadow-sm">
              {user.initials ?? "U"}
            </div>
            <div className="hidden text-left sm:block">
              <p className="text-sm font-semibold text-foreground">{user.name ?? "User"}</p>
              <p className="text-xs text-muted-foreground">
                {user.schoolId ? `ID: ${user.schoolId}` : "Yearbook Member"}
              </p>
            </div>
            <ChevronDown className="h-4 w-4 text-muted-foreground" />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end" className="w-64 p-2">
          <DropdownMenuLabel className="font-normal px-2 py-3">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-primary to-primary/80 text-sm font-bold text-primary-foreground">
                {user.initials ?? "U"}
              </div>
              <div className="flex flex-col">
                <p className="text-sm font-semibold leading-none">{user.name}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {user.schoolId ? `Student ID: ${user.schoolId}` : "Yearbook Member"}
                </p>
              </div>
            </div>
          </DropdownMenuLabel>

          <DropdownMenuSeparator className="my-2" />

          <DropdownMenuItem onClick={() => setShowProfileManagement(true)} className="px-2 py-2.5 cursor-pointer">
            <UserPlus className="mr-3 h-4 w-4 text-accent" />
            <span className="font-medium">Set Up Profile</span>
          </DropdownMenuItem>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <DropdownMenuItem
                onSelect={(e) => e.preventDefault()}
                className="px-2 py-2.5 cursor-pointer text-destructive focus:text-destructive"
              >
                <Trash2 className="mr-3 h-4 w-4" />
                <span className="font-medium">Delete Profile</span>
              </DropdownMenuItem>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete your yearbook profile and remove all your
                  data from our servers.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDeleteProfile}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  Delete Profile
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>

          <DropdownMenuSeparator className="my-2" />

          <DropdownMenuItem onClick={() => setShowCustomize(true)} className="px-2 py-2.5 cursor-pointer">
            <Settings className="mr-3 h-4 w-4 text-muted-foreground" />
            <span className="font-medium">Customize Experience</span>
          </DropdownMenuItem>

          <DropdownMenuItem onClick={() => setShowMessageAdmin(true)} className="px-2 py-2.5 cursor-pointer">
            <MessageSquare className="mr-3 h-4 w-4 text-accent" />
            <span className="font-medium">Message Admin</span>
          </DropdownMenuItem>

          <DropdownMenuSeparator className="my-2" />

          <DropdownMenuItem
            onClick={logout}
            className="px-2 py-2.5 cursor-pointer text-destructive focus:text-destructive"
          >
            <LogOut className="mr-3 h-4 w-4" />
            <span className="font-medium">Sign Out</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <ProfileManagementDialog open={showProfileManagement} onOpenChange={setShowProfileManagement} />
      <CustomizeDialog open={showCustomize} onOpenChange={setShowCustomize} />
      <MessageAdminDialog open={showMessageAdmin} onOpenChange={setShowMessageAdmin} />
    </>
  )
}
