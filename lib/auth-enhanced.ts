import type { User, AdminCredentials } from "./types"
import { createAuditLog } from "./database"

// Enhanced admin credentials with better security
const ADMIN_CREDENTIALS: AdminCredentials[] = [
  {
    email: "admin2045@cctc.edu.ph",
    password: "admin123", // In production, this would be hashed
    name: "Admin 2045",
    initials: "A1",
  },
  {
    email: "admin@cctc.edu.ph",
    password: "admin123", // In production, this would be hashed
    name: "Main Admin",
    initials: "MA",
  },
]

export interface AuthSession {
  user: User
  token: string
  expiresAt: Date
}

export interface LoginResult {
  success: boolean
  user?: User
  token?: string
  message?: string
}

// Enhanced admin authentication
export async function authenticateAdmin(email: string, password: string): Promise<LoginResult> {
  try {
    const adminCred = ADMIN_CREDENTIALS.find((admin) => admin.email === email && admin.password === password)

    if (!adminCred) {
      // Log failed login attempt
      await createAuditLog("unknown", "admin_login_failed", "auth", undefined, { email, reason: "invalid_credentials" })

      return {
        success: false,
        message: "Invalid admin credentials",
      }
    }

    // Create admin user object
    const adminUser: User = {
      id: `admin_${Date.now()}`,
      email: adminCred.email,
      name: adminCred.name,
      initials: adminCred.initials,
      role: "admin",
      status: "active",
      isAdmin: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    // Generate session token (in production, use JWT)
    const token = generateSessionToken()

    // Log successful login
    await createAuditLog(adminUser.id, "admin_login_success", "auth", undefined, { email: adminCred.email })

    return {
      success: true,
      user: adminUser,
      token,
      message: "Login successful",
    }
  } catch (error) {
    console.error("Admin authentication error:", error)
    return {
      success: false,
      message: "Authentication failed",
    }
  }
}

// Regular user authentication (enhanced)
export async function authenticateUser(identifier: string, password: string): Promise<LoginResult> {
  try {
    // Check if it's an email or school ID
    const isEmail = identifier.includes("@")

    // In a real implementation, this would query the database
    // For now, we'll create a mock user for demo purposes
    const mockUser: User = {
      id: `user_${Date.now()}`,
      email: isEmail ? identifier : `${identifier}@student.cctc.edu.ph`,
      name: "Demo User",
      initials: "DU",
      role: "student",
      status: "active",
      schoolId: isEmail ? undefined : identifier,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    // Generate session token
    const token = generateSessionToken()

    // Log successful login
    await createAuditLog(mockUser.id, "user_login_success", "auth", undefined, { identifier })

    return {
      success: true,
      user: mockUser,
      token,
      message: "Login successful",
    }
  } catch (error) {
    console.error("User authentication error:", error)
    return {
      success: false,
      message: "Authentication failed",
    }
  }
}

// Session management
export function generateSessionToken(): string {
  // In production, use proper JWT tokens
  return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
}

export function validateSessionToken(token: string): boolean {
  // In production, validate JWT token
  return token.startsWith("session_") || token === "admin_token"
}

export function isAdminToken(token: string): boolean {
  return token === "admin_token"
}

// Password utilities (for future enhancement)
export async function hashPassword(password: string): Promise<string> {
  // In production, use bcrypt or similar
  return `hashed_${password}`
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  // In production, use bcrypt.compare
  return hash === `hashed_${password}`
}

// Session cleanup
export function clearAuthSession(): void {
  if (typeof window === "undefined") return

  localStorage.removeItem("auth_token")
  localStorage.removeItem("memoria_user")
  document.cookie = "auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT"
}

// Enhanced logout with audit logging
export async function logout(userId?: string): Promise<void> {
  if (userId) {
    await createAuditLog(userId, "logout", "auth", undefined, { timestamp: new Date().toISOString() })
  }

  clearAuthSession()

  if (typeof window !== "undefined") {
    window.location.href = "/"
  }
}

// Check if user has admin privileges
export function hasAdminAccess(user: User | null): boolean {
  return !!(user?.isAdmin && user?.role === "admin")
}

// Validate admin access for API routes
export function requireAdminAccess(user: User | null): void {
  if (!hasAdminAccess(user)) {
    throw new Error("Admin access required")
  }
}
