"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/contexts/auth-context"
import { CheckCircle, XCircle, Shield, User, Lock } from "lucide-react"
import Link from "next/link"

export default function AdminTestPage() {
  const { user, isAuthenticated, isAdmin, loginAdmin, logout } = useAuth()
  const [testEmail, setTestEmail] = useState("")
  const [testPassword, setTestPassword] = useState("")
  const [testResult, setTestResult] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const testCredentials = [
    { email: "admin2045", password: "admin123", name: "Admin 2045", shouldWork: true },
    { email: "admin2025", password: "123admin", name: "Admin 2025", shouldWork: true },
    { email: "admin2024", password: "wrongpass", name: "Invalid Admin", shouldWork: false },
    { email: "user123", password: "password", name: "Regular User", shouldWork: false },
  ]

  const handleTestLogin = async (email: string, password: string, shouldWork: boolean) => {
    setIsLoading(true)
    setTestResult(null)

    try {
      const success = await loginAdmin(email, password)

      if (success && shouldWork) {
        setTestResult(`✅ SUCCESS: ${email} logged in successfully`)
      } else if (!success && !shouldWork) {
        setTestResult(`✅ SUCCESS: ${email} correctly rejected`)
      } else if (success && !shouldWork) {
        setTestResult(`❌ FAILURE: ${email} should have been rejected but was accepted`)
      } else {
        setTestResult(`❌ FAILURE: ${email} should have been accepted but was rejected`)
      }
    } catch (error) {
      setTestResult(`❌ ERROR: ${error}`)
    } finally {
      setIsLoading(false)
    }
  }

  const handleManualTest = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!testEmail || !testPassword) return

    setIsLoading(true)
    setTestResult(null)

    try {
      const success = await loginAdmin(testEmail, testPassword)
      setTestResult(success ? `✅ Login successful for ${testEmail}` : `❌ Login failed for ${testEmail}`)
    } catch (error) {
      setTestResult(`❌ ERROR: ${error}`)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4">
      <div className="container max-w-4xl mx-auto py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Admin Access Control Test</h1>
          <p className="text-slate-600">Test the authentication system and route protection</p>
        </div>

        {/* Current Status */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Current Authentication Status
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center gap-2">
                <span className="font-medium">Authenticated:</span>
                {isAuthenticated ? (
                  <Badge variant="secondary" className="bg-green-100 text-green-800">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Yes
                  </Badge>
                ) : (
                  <Badge variant="outline" className="bg-red-100 text-red-800">
                    <XCircle className="h-3 w-3 mr-1" />
                    No
                  </Badge>
                )}
              </div>

              <div className="flex items-center gap-2">
                <span className="font-medium">Admin Status:</span>
                {isAdmin ? (
                  <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                    <Shield className="h-3 w-3 mr-1" />
                    Admin
                  </Badge>
                ) : (
                  <Badge variant="outline">
                    <User className="h-3 w-3 mr-1" />
                    Regular User
                  </Badge>
                )}
              </div>

              <div className="flex items-center gap-2">
                <span className="font-medium">User:</span>
                <span className="text-slate-600">{user ? `${user.name} (${user.initials})` : "Not logged in"}</span>
              </div>
            </div>

            {user && (
              <div className="pt-4 border-t">
                <Button onClick={logout} variant="outline" size="sm">
                  Logout
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Route Protection Test */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lock className="h-5 w-5" />
              Route Protection Test
            </CardTitle>
            <CardDescription>Test access to protected admin routes</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Link href="/admin">
                <Button className="w-full bg-transparent" variant="outline">
                  Try Admin Dashboard
                </Button>
              </Link>
              <Link href="/admin/login">
                <Button className="w-full bg-transparent" variant="outline">
                  Admin Login Page
                </Button>
              </Link>
            </div>
            <Alert>
              <AlertDescription>
                <strong>Expected behavior:</strong> If you're not an admin, you should be redirected to the homepage
                with an "Unauthorized" message.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>

        {/* Automated Tests */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Automated Credential Tests</CardTitle>
            <CardDescription>Test all credential combinations automatically</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {testCredentials.map((cred, index) => (
                <div key={index} className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <p className="font-medium">{cred.name}</p>
                      <p className="text-sm text-slate-600">{cred.email}</p>
                    </div>
                    <Badge variant={cred.shouldWork ? "secondary" : "outline"}>
                      {cred.shouldWork ? "Should Work" : "Should Fail"}
                    </Badge>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    className="w-full bg-transparent"
                    onClick={() => handleTestLogin(cred.email, cred.password, cred.shouldWork)}
                    disabled={isLoading}
                  >
                    Test Login
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Manual Test */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Manual Login Test</CardTitle>
            <CardDescription>Test custom credentials manually</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleManualTest} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="test-email">Email</Label>
                  <Input
                    id="test-email"
                    type="text"
                    value={testEmail}
                    onChange={(e) => setTestEmail(e.target.value)}
                    placeholder="Enter email to test"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="test-password">Password</Label>
                  <Input
                    id="test-password"
                    type="password"
                    value={testPassword}
                    onChange={(e) => setTestPassword(e.target.value)}
                    placeholder="Enter password to test"
                  />
                </div>
              </div>
              <Button type="submit" disabled={isLoading || !testEmail || !testPassword}>
                {isLoading ? "Testing..." : "Test Login"}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Test Results */}
        {testResult && (
          <Card>
            <CardHeader>
              <CardTitle>Test Result</CardTitle>
            </CardHeader>
            <CardContent>
              <Alert>
                <AlertDescription className="font-mono text-sm">{testResult}</AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        )}

        {/* Valid Credentials Reference */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Valid Admin Credentials</CardTitle>
            <CardDescription>Reference for testing (these are the only accounts that should work)</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <p className="font-medium text-green-800">Admin Account 1</p>
                <p className="text-sm text-green-600">Email: admin2045</p>
                <p className="text-sm text-green-600">Password: admin123</p>
              </div>
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <p className="font-medium text-green-800">Admin Account 2</p>
                <p className="text-sm text-green-600">Email: admin2025</p>
                <p className="text-sm text-green-600">Password: 123admin</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
