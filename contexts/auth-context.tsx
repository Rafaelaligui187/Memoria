"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"

interface User {
  name: string
  initials: string
  schoolId?: string
  isAdmin?: boolean
  email?: string
  profilePhoto?: string
  firstName?: string
  lastName?: string
}

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  isAdmin: boolean
  loginAdmin: (email: string, password: string) => Promise<boolean>
  login: (user: User) => void
  logout: () => void
  updateUser: (updatedUser: User) => void
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

const ADMIN_CREDENTIALS = [
  { email: "admin2045@cctc.edu.ph", password: "admin123", name: "Admin 2045", initials: "A1" },
  { email: "admin@cctc.edu.ph", password: "admin123", name: "Main Admin", initials: "MA" },
]

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem("auth_token")
    const rawUser = localStorage.getItem("memoria_user")

    if (token && rawUser) {
      try {
        const userData = JSON.parse(rawUser) as User
        setUser(userData)
      } catch (error) {
        console.error("Failed to parse user data:", error)
        localStorage.removeItem("auth_token")
        localStorage.removeItem("memoria_user")
      }
    }

    setIsLoading(false)
  }, [])

  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "auth_token" || e.key === "memoria_user") {
        const token = localStorage.getItem("auth_token")
        const rawUser = localStorage.getItem("memoria_user")

        if (token && rawUser) {
          try {
            const userData = JSON.parse(rawUser) as User
            setUser(userData)
          } catch (error) {
            setUser(null)
          }
        } else {
          setUser(null)
        }
      }
    }

    window.addEventListener("storage", handleStorageChange)
    return () => window.removeEventListener("storage", handleStorageChange)
  }, [])

  const loginAdmin = async (email: string, password: string): Promise<boolean> => {
    console.log("[v0] loginAdmin called with:", { email, passwordLength: password.length })
    console.log(
      "[v0] Available admin credentials:",
      ADMIN_CREDENTIALS.map((admin) => ({ email: admin.email, passwordLength: admin.password.length })),
    )

    const adminUser = ADMIN_CREDENTIALS.find((admin) => admin.email === email && admin.password === password)
    console.log("[v0] Admin user found:", !!adminUser)

    if (adminUser) {
      console.log("[v0] Admin authentication successful for:", adminUser.name)
      const userData: User = {
        name: adminUser.name,
        initials: adminUser.initials,
        email: adminUser.email,
        isAdmin: true,
      }

      document.cookie = `auth_token=admin_token; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Lax`

      localStorage.setItem("auth_token", "admin_token")
      localStorage.setItem("memoria_user", JSON.stringify(userData))

      // Track admin login session
      try {
        const response = await fetch('/api/admin/track-login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ adminEmail: email }),
        })
        
        if (response.ok) {
          console.log('✅ Admin login session tracked')
        }
      } catch (error) {
        console.error('❌ Error tracking admin login:', error)
        // Don't fail login if session tracking fails
      }

      setUser(userData)
      return true
    }

    console.log("[v0] Admin authentication failed - no matching credentials")
    return false
  }

  const login = (userData: User) => {
    localStorage.setItem("auth_token", "test_token")
    localStorage.setItem("memoria_user", JSON.stringify(userData))
    setUser(userData)
  }

  const logout = () => {
    // Track admin logout before clearing session
    if (user?.isAdmin && user?.email) {
      fetch('/api/admin/track-logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ adminEmail: user.email }),
      }).catch(error => {
        console.error('❌ Error tracking admin logout:', error)
        // Don't fail logout if session tracking fails
      })
    }

    localStorage.removeItem("auth_token")
    localStorage.removeItem("memoria_user")
    document.cookie = "auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT"
    setUser(null)
    window.location.href = "/"
  }

  const updateUser = (updatedUser: User) => {
    localStorage.setItem("memoria_user", JSON.stringify(updatedUser))
    setUser(updatedUser)
  }

  const value = {
    user,
    isAuthenticated: !!user,
    isAdmin: !!user?.isAdmin,
    loginAdmin,
    login,
    logout,
    updateUser,
    isLoading,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
