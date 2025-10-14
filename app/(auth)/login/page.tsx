"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowLeft, BookOpen, Eye, EyeOff } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { login } from "@/lib/auth"
import { useAuth } from "@/contexts/auth-context"

const ADMIN_CREDENTIALS = [
  { email: "admin2045@cctc.edu.ph", password: "admin123" },
  { email: "admin@cctc.edu.ph", password: "admin123" },
]

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [identifier, setIdentifier] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const { toast } = useToast()
  const router = useRouter()
  const { login: authLogin, loginAdmin } = useAuth()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      console.log("[v0] Login attempt:", { identifier })

      // Attempt login through the API (handles both admin and regular users)
      const result = await login(identifier, password)

      if (result.success) {
        // Check if it's an admin user
        if (result.user?.userType === "admin") {
          console.log("[v0] Admin login successful, redirecting to /admin")
          await loginAdmin(result.user.email, password)
          
          toast({
            title: "Admin login successful",
            description: "Welcome to the admin dashboard!",
          })

          setTimeout(() => {
            router.push("/admin")
          }, 100)
        } else {
          console.log("[v0] Regular user login successful")
          authLogin(result.user)

          toast({
            title: "Login successful",
            description: "Welcome back to Memoria!",
          })

          setTimeout(() => {
            router.push("/dashboard")
          }, 100)
        }
      } else {
        setError(result.message || "Invalid credentials")
        toast({
          title: "Login failed",
          description: result.message || "Invalid credentials",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("[v0] Login error:", error)
      setError("An error occurred during login. Please try again.")
      toast({
        title: "Login error",
        description: "An error occurred during login. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      <div className="hidden md:flex md:w-1/2 bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 text-white p-8 flex-col justify-between relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fillRule='evenodd'%3E%3Cg fill='%23ffffff' fillOpacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
          }}
        ></div>

        <div className="relative z-10">
          <Link href="/" className="flex items-center gap-3">
            <div className="p-2 bg-white/10 rounded-xl backdrop-blur-sm">
              <BookOpen className="h-8 w-8 text-white" />
            </div>
            <span className="text-2xl font-bold">Memoria</span>
          </Link>
        </div>

        <div className="space-y-8 relative z-10">
          <div className="space-y-4">
            <h1 className="text-4xl font-bold leading-tight">
              Welcome back to your
              <span className="block text-blue-200">digital yearbook</span>
            </h1>
            <p className="text-xl text-blue-100 leading-relaxed">
              Relive your school memories and stay connected with your classmates and teachers.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 pt-6">
            <div className="bg-white/10 p-6 rounded-xl backdrop-blur-sm border border-white/20">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-blue-400/30 rounded-lg flex items-center justify-center">
                  <BookOpen className="h-5 w-5" />
                </div>
                <h3 className="font-semibold text-lg">Digital Memories</h3>
              </div>
              <p className="text-blue-100 text-sm leading-relaxed">
                Access your school's digital yearbook anytime, anywhere with beautiful layouts and interactive features.
              </p>
            </div>
            <div className="bg-white/10 p-6 rounded-xl backdrop-blur-sm border border-white/20">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-blue-400/30 rounded-lg flex items-center justify-center">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <h3 className="font-semibold text-lg">Stay Connected</h3>
              </div>
              <p className="text-blue-100 text-sm leading-relaxed">
                Connect with classmates, teachers, and alumni through our interactive community platform.
              </p>
            </div>
          </div>
        </div>

        <div className="text-sm text-blue-200 relative z-10">
          &copy; {new Date().getFullYear()} Memoria - Consolatrix College of Toledo City, Inc.
        </div>
      </div>

      <div className="flex-1 flex flex-col bg-gradient-to-br from-gray-50 to-white">
        <div className="flex justify-between items-center p-6 md:p-8">
          <div className="md:hidden flex items-center gap-2">
            <BookOpen className="h-6 w-6 text-blue-600" />
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-blue-600 bg-clip-text text-transparent">
              Memoria
            </span>
          </div>
          <Link
            href="/"
            className="flex items-center text-sm text-gray-600 hover:text-blue-600 transition-colors group"
          >
            <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" />
            Back to Home
          </Link>
        </div>

        <div className="flex-1 flex flex-col items-center justify-center px-6 py-8 md:px-12">
          <div className="w-full max-w-md">
            <div className="bg-white shadow-2xl rounded-2xl p-8 border border-gray-100 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-50 to-blue-50 rounded-full -translate-y-16 translate-x-16 opacity-50"></div>

              <div className="text-center mb-8 relative z-10">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h1>
                <p className="text-gray-600">Sign in to access your digital yearbook</p>
              </div>

              {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm animate-in fade-in duration-300">
                  <div className="flex items-center gap-2">
                    <svg className="h-4 w-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                        clipRule="evenodd"
                      />
                    </svg>
                    {error}
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
                <div className="space-y-2">
                  <Label htmlFor="identifier" className="text-gray-700 font-medium">
                    Email or Student ID
                  </Label>
                  <Input
                    id="identifier"
                    type="text"
                    placeholder="Enter your email or student ID"
                    required
                    className="w-full h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500 transition-all duration-200 rounded-xl"
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    You can use either your school ID number or email address
                  </p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password" className="text-gray-700 font-medium">
                      Password
                    </Label>
                    <Link
                      href="/forgot-password"
                      className="text-sm text-blue-600 hover:text-blue-700 hover:underline transition-colors font-medium"
                    >
                      Forgot password?
                    </Link>
                  </div>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      required
                      className="w-full h-12 pr-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500 transition-all duration-200 rounded-xl"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full h-12 text-base bg-gradient-to-r from-blue-600 to-blue-600 hover:from-blue-700 hover:to-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl rounded-xl font-medium"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      Signing in...
                    </div>
                  ) : (
                    "Sign In"
                  )}
                </Button>
              </form>

              <div className="mt-8 text-center relative z-10">
                <p className="text-sm text-gray-600">
                  Don't have an account?{" "}
                  <Link
                    href="/signup"
                    className="text-blue-600 hover:text-blue-700 hover:underline font-medium transition-colors"
                  >
                    Sign up here
                  </Link>
                </p>
              </div>
            </div>

            <div className="mt-8 text-center text-sm text-gray-500 md:hidden">
              &copy; {new Date().getFullYear()} Memoria - Consolatrix College of Toledo City, Inc.
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
