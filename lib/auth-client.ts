// Client-side authentication utilities
"use client"

export function getCurrentUserClient(): any | null {
  if (typeof window === "undefined") return null
  
  try {
    const user = localStorage.getItem("memoria_user")
    return user ? JSON.parse(user) : null
  } catch (error) {
    console.error('Error getting current user:', error)
    return null
  }
}

export function isAuthenticatedClient(): boolean {
  if (typeof window === "undefined") return false
  
  try {
    const token = localStorage.getItem("auth_token")
    return token === "authenticated"
  } catch (error) {
    console.error('Error checking authentication:', error)
    return false
  }
}

export function getAuthTokenClient(): string | null {
  if (typeof window === "undefined") return null
  
  try {
    return localStorage.getItem("auth_token")
  } catch (error) {
    console.error('Error getting auth token:', error)
    return null
  }
}
