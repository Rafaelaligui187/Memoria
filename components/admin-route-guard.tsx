"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { useToast } from "@/hooks/use-toast"

interface AdminRouteGuardProps {
  children: React.ReactNode
}

export function AdminRouteGuard({ children }: AdminRouteGuardProps) {
  const { isAuthenticated, isAdmin, isLoading } = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  const [hasChecked, setHasChecked] = useState(false)

  useEffect(() => {
    if (!isLoading && !hasChecked) {
      setHasChecked(true)

      if (!isAuthenticated || !isAdmin) {
        toast({
          title: "Unauthorized",
          description: "You don't have permission to access the admin dashboard.",
          variant: "destructive",
        })

        router.push("/")
        return
      }
    }
  }, [isLoading, hasChecked, isAuthenticated, isAdmin, router, toast])

  if (isLoading || !hasChecked) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!isAuthenticated || !isAdmin) {
    return null
  }

  return <>{children}</>
}
