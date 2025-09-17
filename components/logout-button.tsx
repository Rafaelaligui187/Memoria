"use client"

import { LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/contexts/auth-context"

interface LogoutButtonProps {
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link"
  size?: "default" | "sm" | "lg" | "icon"
  className?: string
}

export function LogoutButton({
  variant = "outline",
  size = "sm",
  className = "border-red-600 text-red-600 hover:bg-red-50",
}: LogoutButtonProps) {
  const { logout } = useAuth()

  const handleLogout = () => {
    try {
      logout()
    } catch (error) {
      console.error("Logout error:", error instanceof Error ? error.message : "Unknown error")
    }
  }

  return (
    <Button variant={variant} size={size} className={className} onClick={handleLogout}>
      <LogOut className="h-4 w-4 mr-2" />
      Log Out
    </Button>
  )
}
