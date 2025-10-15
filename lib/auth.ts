"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/contexts/auth-context"

export async function login(
  identifier: string,
  password: string,
): Promise<{ success: boolean; message?: string; user?: any }> {
  try {
    const response = await fetch("/api/auth", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ action: "login", identifier, password }),
    })

    const data = await response.json()
    
    if (data.success) {
      // Store user data in localStorage for persistence
      if (typeof window !== "undefined") {
        localStorage.setItem("memoria_user", JSON.stringify(data.user))
        localStorage.setItem("auth_token", "authenticated")
        localStorage.setItem("intentional_login", "true")
      }
      
      return { success: true, user: data.user }
    } else {
      return { success: false, message: data.message }
    }
  } catch (error: any) {
    console.error("Login failed:", error)
    return { success: false, message: error.message || "Login failed" }
  }
}

export async function signup(formData: any): Promise<{ success: boolean; message?: string; user?: any }> {
  try {
    const response = await fetch("/api/auth", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ action: "signup", ...formData }),
    })

    const data = await response.json()
    
    if (data.success) {
      // Store user data in localStorage for persistence
      if (typeof window !== "undefined") {
        localStorage.setItem("memoria_user", JSON.stringify(data.user))
        localStorage.setItem("auth_token", "authenticated")
        localStorage.setItem("intentional_login", "true")
      }
      
      return { success: true, user: data.user }
    } else {
      return { success: false, message: data.message }
    }
  } catch (error: any) {
    console.error("Signup failed:", error)
    return { success: false, message: error.message || "Signup failed" }
  }
}

export async function forgotPassword(identifier: string): Promise<{ success: boolean; message?: string }> {
  try {
    const response = await fetch("/api/auth", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ action: "forgot-password", identifier }),
    })

    const data = await response.json()
    if (data.success) {
      return { success: true, message: data.message }
    } else {
      return { success: false, message: data.message }
    }
  } catch (error: any) {
    console.error("Forgot password request failed:", error)
    return { success: false, message: error.message || "Request failed" }
  }
}

// Function to clear all authentication data
export function clearAuthData(): void {
  if (typeof window === "undefined") return

  localStorage.removeItem("auth_token")
  localStorage.removeItem("user")
  localStorage.removeItem("intentional_login")
  localStorage.removeItem("memoria_user")
}

// Update the logout function to use clearAuthData
export function logout(): void {
  if (typeof window === "undefined") return

  try {
    clearAuthData()
    // Redirect to home page
    window.location.href = "/"
  } catch (error) {
    console.error("Logout error:", error)
  }
}

export function isAuthenticated(): boolean {
  if (typeof window === "undefined") return false
  const token = localStorage.getItem("auth_token")
  return token === "authenticated"
}

export function getCurrentUser(): any | null {
  if (typeof window === "undefined") return null
  const user = localStorage.getItem("memoria_user")
  return user ? JSON.parse(user) : null
}

export function clearUnintendedAuth(): void {
  if (typeof window === "undefined") return
  
  // Check if user has valid auth data
  const token = localStorage.getItem("auth_token")
  const user = localStorage.getItem("memoria_user")
  
  // Only clear auth data if there's no valid authentication
  // This prevents clearing auth data on page refresh for authenticated users
  if (!token || !user) {
    clearAuthData()
  }
  
  // Remove the intentional_login flag after first check to prevent repeated clearing
  const intentionalLogin = localStorage.getItem("intentional_login")
  if (intentionalLogin) {
    localStorage.removeItem("intentional_login")
  }
}

export function useRequireAuth(): { isAuthenticated: boolean; user: any | null } {
  const { isAuthenticated, user, isLoading } = useAuth()
  const [auth, setAuth] = useState<{ isAuthenticated: boolean; user: any | null }>({ isAuthenticated: false, user: null })

  useEffect(() => {
    if (!isLoading) {
      setAuth({ isAuthenticated, user: user as any })
    }
  }, [isAuthenticated, user, isLoading])

  return auth
}
