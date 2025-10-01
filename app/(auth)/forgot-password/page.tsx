"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, BookOpen, Mail } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { forgotPassword } from "@/lib/auth"

export default function ForgotPasswordPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [identifier, setIdentifier] = useState("")
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState("")
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      const result = await forgotPassword(identifier)

      if (result.success) {
        setSubmitted(true)
        toast({
          title: "Reset link sent",
          description: "If your email or school ID is registered, you will receive a password reset link.",
        })
      } else {
        setError(result.message || "Failed to send reset link")
        toast({
          title: "Request failed",
          description: result.message || "Failed to send reset link",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Forgot password error:", error)
      setError("An error occurred. Please try again.")
      toast({
        title: "Request error",
        description: "An error occurred. Please try again.",
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
          <h1 className="text-4xl font-bold">Reset your password</h1>
          <p className="text-xl opacity-90">Don't worry, we'll help you regain access to your account.</p>

          <div className="bg-white/10 p-6 rounded-lg backdrop-blur-sm mt-8">
            <div className="flex items-start gap-4">
              <Mail className="h-10 w-10 text-white mt-1" />
              <div>
                <h3 className="font-medium text-xl">Check your email</h3>
                <p className="opacity-90 mt-2">
                  After submitting your request, we'll send you an email with instructions to reset your password. Be
                  sure to check your spam folder if you don't see it in your inbox.
                </p>
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
          <Link href="/login" className="flex items-center text-sm text-gray-600 hover:text-blue-600 transition-colors">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Login
          </Link>
        </div>

        <div className="flex-1 flex flex-col items-center justify-center px-6 py-8 md:px-12">
          <div className="w-full max-w-md">
            <div className="bg-white shadow-xl rounded-xl p-8 border border-gray-100">
              <div className="text-center mb-8">
                <h1 className="text-2xl font-bold text-gray-900">Reset your password</h1>
                <p className="text-gray-600 mt-2">
                  Enter your school ID or email address and we'll send you a link to reset your password
                </p>
              </div>

              {error && (
                <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-md text-red-600 text-sm animate-in fade-in duration-300">
                  {error}
                </div>
              )}

              {submitted ? (
                <div className="text-center space-y-6">
                  <div className="p-6 bg-green-50 border-l-4 border-green-500 rounded-md text-green-700 text-sm">
                    <div className="flex flex-col items-center gap-4">
                      <Mail className="h-12 w-12 text-green-600" />
                      <div>
                        <h3 className="font-medium text-lg text-green-800">Check your inbox</h3>
                        <p className="mt-2">
                          If your email or school ID is registered, you will receive a password reset link shortly.
                        </p>
                      </div>
                    </div>
                  </div>
                  <p className="text-gray-600">
                    Didn't receive an email? Check your spam folder or{" "}
                    <button
                      type="button"
                      onClick={() => setSubmitted(false)}
                      className="text-blue-600 hover:text-blue-800 hover:underline font-medium transition-colors"
                    >
                      try again
                    </button>
                  </p>
                  <Link href="/login">
                    <Button variant="outline" className="w-full h-12 bg-transparent">
                      Return to login
                    </Button>
                  </Link>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="identifier" className="text-gray-700">
                      School ID or Email
                    </Label>
                    <Input
                      id="identifier"
                      type="text"
                      placeholder="2023-12345 or your.email@example.com"
                      required
                      className="w-full h-12 border-gray-300 focus:border-blue-500 focus:ring-blue-500 transition-all duration-200"
                      value={identifier}
                      onChange={(e) => setIdentifier(e.target.value)}
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Enter either your school ID number or the email address associated with your account
                    </p>
                  </div>

                  <Button
                    type="submit"
                    className="w-full h-12 text-base bg-blue-600 hover:bg-blue-700 transition-colors duration-200 shadow-md hover:shadow-lg"
                    disabled={isLoading}
                  >
                    {isLoading ? "Sending reset link..." : "Send reset link"}
                  </Button>
                </form>
              )}

              <div className="mt-8 text-center">
                <p className="text-sm text-gray-600">
                  Remember your password?{" "}
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
