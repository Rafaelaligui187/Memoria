"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useAuth } from "@/contexts/auth-context"
import { useToast } from "@/hooks/use-toast"

export function AdminLogin() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const { loginAdmin } = useAuth()
  const { toast } = useToast()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    console.log("[v0] Login attempt:", {
      identifier: email,
      isAdminCredentials: true,
    })

    try {
      let loginEmail = email

      if (!email.includes("@")) {
        console.log("[v0] Converting username to email:", email)
        if (email === "admin2045") {
          loginEmail = "admin2045@cctc.edu.ph"
        } else if (email === "admin") {
          loginEmail = "admin@cctc.edu.ph"
        }
        console.log("[v0] Converted to email:", loginEmail)
      } else {
        // If user entered full email, use it directly
        console.log("[v0] Using full email as entered:", email)
        loginEmail = email
      }

      console.log("[v0] Attempting admin login with:", { email: loginEmail, passwordLength: password.length })
      const success = await loginAdmin(loginEmail, password)
      console.log("[v0] Admin login result:", success)

      if (success) {
        console.log("[v0] Admin login successful, redirecting to /admin...")
        toast({
          title: "Login Successful",
          description: "Welcome to the admin dashboard.",
        })

        router.push("/admin")
      } else {
        console.log("[v0] Admin login failed")
        setError("Invalid admin credentials. Please check your email and password.")
      }
    } catch (error) {
      console.error("Admin login error:", error)
      setError("An error occurred during login. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-slate-900">Admin Login</CardTitle>
          <CardDescription className="text-slate-600">Access the yearbook management dashboard</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm">
              <p className="font-medium text-blue-900 mb-1">Development Credentials:</p>
              <p className="text-blue-700">
                Email: <code className="bg-blue-100 px-1 rounded">admin2045@cctc.edu.ph</code> or{" "}
                <code className="bg-blue-100 px-1 rounded">admin2045</code>
              </p>
              <p className="text-blue-700">
                Password: <code className="bg-blue-100 px-1 rounded">admin123</code>
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email or Username</Label>
              <Input
                id="email"
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin2045@cctc.edu.ph or admin2045"
                required
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                required
                disabled={isLoading}
              />
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Signing in..." : "Sign In"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
