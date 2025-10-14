"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowLeft, BookOpen, Eye, EyeOff, CheckCircle } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { signup } from "@/lib/auth"
import { useAuth } from "@/contexts/auth-context"

export default function SignupPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const { toast } = useToast()
  const router = useRouter()
  const { login: authLogin } = useAuth()

  const [formData, setFormData] = useState({
    schoolId: "",
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    role: "student",
    agreeToTerms: false,
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type, checked } = e.target as HTMLInputElement
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    // Validate form
    if (
      !formData.schoolId ||
      !formData.firstName ||
      !formData.lastName ||
      !formData.email ||
      !formData.password ||
      !formData.role
    ) {
      setError("All fields are required")
      setIsLoading(false)
      return
    }

    if (!formData.agreeToTerms) {
      setError("You must agree to the Terms of Service and Privacy Policy.")
      setIsLoading(false)
      return
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.email)) {
      setError("Please enter a valid email address")
      setIsLoading(false)
      return
    }

    // Basic password validation (server will handle detailed validation)
    if (formData.password.length < 8) {
      setError("Password must be at least 8 characters long")
      setIsLoading(false)
      return
    }

    try {
      const result = await signup({
        ...formData,
        userType: formData.role,
      })

      if (result.success) {
        authLogin(result.user)

        toast({
          title: "Account created",
          description: "Welcome to Memoria! Your account has been created successfully.",
        })

        setTimeout(() => {
          router.push("/dashboard")
        }, 100)
      } else {
        setError(result.message || "Failed to create account")
        toast({
          title: "Signup failed",
          description: result.message || "Failed to create account",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Signup error:", error)
      setError("An error occurred during signup. Please try again.")
      toast({
        title: "Signup error",
        description: "An error occurred during signup. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Left side - Decorative */}
      <div className="hidden md:flex md:w-1/2 bg-gradient-to-br from-blue-600 to-blue-800 text-white p-8 flex-col justify-between relative overflow-hidden">
        {/* Background Pattern */}
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fillRule='evenodd'%3E%3Cg fill='%23ffffff' fillOpacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            backgroundSize: "60px 60px",
          }}
        />

        {/* Content */}
        <div className="relative z-10">
          <Link href="/" className="flex items-center gap-2">
            <BookOpen className="h-8 w-8 text-white" />
            <span className="text-2xl font-bold">Memoria</span>
          </Link>
        </div>

        <div className="space-y-6 relative z-10">
          <h1 className="text-4xl font-bold">Join the Memoria community</h1>
          <p className="text-xl opacity-90">
            Create your account to access your school's digital yearbook and connect with classmates.
          </p>

          <div className="space-y-4 pt-6">
            <div className="flex items-start gap-3">
              <CheckCircle className="h-6 w-6 text-white mt-0.5" />
              <div>
                <h3 className="font-medium text-lg">Preserve your memories</h3>
                <p className="opacity-80">Access your yearbook photos and memories anytime, anywhere.</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle className="h-6 w-6 text-white mt-0.5" />
              <div>
                <h3 className="font-medium text-lg">Connect with classmates</h3>
                <p className="opacity-80">Stay in touch with your school community.</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle className="h-6 w-6 text-white mt-0.5" />
              <div>
                <h3 className="font-medium text-lg">Celebrate achievements</h3>
                <p className="opacity-80">View awards, honors, and special recognitions.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="text-sm opacity-70 relative z-10">
          &copy; {new Date().getFullYear()} Memoria - Consolatrix College of Toledo City, Inc.
        </div>
      </div>

      {/* Right side - Form */}
      <div className="flex-1 flex flex-col bg-gray-50">
        <div className="flex justify-between items-center p-6 md:p-8">
          <div className="md:hidden flex items-center gap-2">
            <BookOpen className="h-6 w-6 text-blue-600" />
            <span className="text-xl font-bold text-blue-600">Memoria</span>
          </div>
          <Link href="/" className="flex items-center text-sm text-gray-600 hover:text-blue-600 transition-colors">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Link>
        </div>

        <div className="flex-1 flex flex-col items-center justify-center px-6 py-8 md:px-12 overflow-y-auto">
          <div className="w-full max-w-md">
            <div className="bg-white shadow-xl rounded-xl p-8 border border-gray-100">
              <div className="text-center mb-8">
                <h1 className="text-2xl font-bold text-gray-900">Create your account</h1>
                <p className="text-gray-600 mt-2">Sign up to access the Memoria yearbook</p>
              </div>

              {error && (
                <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-md text-red-600 text-sm animate-in fade-in duration-300">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="schoolId" className="text-gray-700">
                    School ID Number
                  </Label>
                  <Input
                    id="schoolId"
                    name="schoolId"
                    type="text"
                    placeholder="e.g., 2023-12345"
                    required
                    className="w-full h-12 border-gray-300 focus:border-blue-500 focus:ring-blue-500 transition-all duration-200"
                    value={formData.schoolId}
                    onChange={handleChange}
                  />
                  <p className="text-xs text-gray-500 mt-1">Enter your official school-issued ID number</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName" className="text-gray-700">
                      First Name
                    </Label>
                    <Input
                      id="firstName"
                      name="firstName"
                      type="text"
                      placeholder="John"
                      required
                      className="w-full h-12 border-gray-300 focus:border-blue-500 focus:ring-blue-500 transition-all duration-200"
                      value={formData.firstName}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName" className="text-gray-700">
                      Last Name
                    </Label>
                    <Input
                      id="lastName"
                      name="lastName"
                      type="text"
                      placeholder="Doe"
                      required
                      className="w-full h-12 border-gray-300 focus:border-blue-500 focus:ring-blue-500 transition-all duration-200"
                      value={formData.lastName}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-gray-700">
                    Email
                  </Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="your.email@example.com"
                    required
                    className="w-full h-12 border-gray-300 focus:border-blue-500 focus:ring-blue-500 transition-all duration-200"
                    value={formData.email}
                    onChange={handleChange}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-gray-700">
                    Password
                  </Label>
                  <div className="relative">
                    <Input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      required
                      className="w-full h-12 pr-10 border-gray-300 focus:border-blue-500 focus:ring-blue-500 transition-all duration-200"
                      value={formData.password}
                      onChange={handleChange}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                    >
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Password must be at least 8 characters long and include a mix of letters, numbers, and symbols.
                  </p>
                </div>

                <div className="space-y-3">
                  <Label className="text-gray-700">I am signing up as:</Label>
                  <div className="flex gap-6">
                    <div className="flex items-center">
                      <input
                        id="role-student"
                        name="role"
                        type="radio"
                        value="student"
                        checked={formData.role === "student"}
                        onChange={handleChange}
                        className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500 focus:ring-2"
                      />
                      <label
                        htmlFor="role-student"
                        className="ml-2 text-sm text-gray-700 cursor-pointer hover:text-blue-600 transition-colors"
                      >
                        Student
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input
                        id="role-teacher"
                        name="role"
                        type="radio"
                        value="teacher"
                        checked={formData.role === "teacher"}
                        onChange={handleChange}
                        className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500 focus:ring-2"
                      />
                      <label
                        htmlFor="role-teacher"
                        className="ml-2 text-sm text-gray-700 cursor-pointer hover:text-blue-600 transition-colors"
                      >
                        Teacher
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input
                        id="role-alumni"
                        name="role"
                        type="radio"
                        value="alumni"
                        checked={formData.role === "alumni"}
                        onChange={handleChange}
                        className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500 focus:ring-2"
                      />
                      <label
                        htmlFor="role-alumni"
                        className="ml-2 text-sm text-gray-700 cursor-pointer hover:text-blue-600 transition-colors"
                      >
                        Alumni
                      </label>
                    </div>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      id="terms"
                      name="agreeToTerms"
                      type="checkbox"
                      className="h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      checked={formData.agreeToTerms}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label htmlFor="terms" className="text-gray-600">
                      I agree to the{" "}
                      <Link
                        href="/terms"
                        className="text-blue-600 hover:text-blue-800 hover:underline transition-colors"
                      >
                        Terms of Service
                      </Link>{" "}
                      and{" "}
                      <Link
                        href="/privacy"
                        className="text-blue-600 hover:text-blue-800 hover:underline transition-colors"
                      >
                        Privacy Policy
                      </Link>
                    </label>
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full h-12 text-base bg-blue-600 hover:bg-blue-700 transition-colors duration-200 shadow-md hover:shadow-lg"
                  disabled={isLoading}
                >
                  {isLoading ? "Creating account..." : "Sign up"}
                </Button>
              </form>

              <div className="mt-8 text-center">
                <p className="text-sm text-gray-600">
                  Already have an account?{" "}
                  <Link
                    href="/login"
                    className="text-blue-600 hover:text-blue-800 hover:underline font-medium transition-colors"
                  >
                    Log in
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
