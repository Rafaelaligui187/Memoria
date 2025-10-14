"use client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuth } from "@/contexts/auth-context"
import { Header } from "@/components/header"
import { toast } from "@/hooks/use-toast"

export default function TestMenuPage() {
  const { user, login, logout, isAuthenticated } = useAuth()

  const handleLogin = () => {
    const testUser = {
      name: "John Doe",
      initials: "JD",
      schoolId: "2024-001",
    }
    login(testUser)
    toast({
      title: "Login successful!",
      description: "You can now test the user menu functionality.",
    })
  }

  const handleLogout = () => {
    logout()
    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
    })
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container mx-auto py-8">
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-primary">User Menu Test Page</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="p-4 bg-muted rounded-lg">
              <h3 className="font-semibold mb-2">Current Status:</h3>
              <p className="text-sm text-muted-foreground">
                {isAuthenticated ? (
                  <>
                    Logged in as: <span className="font-medium text-foreground">{user?.name}</span>
                  </>
                ) : (
                  "Not logged in"
                )}
              </p>
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold">Test Actions:</h3>

              {!isAuthenticated ? (
                <Button onClick={handleLogin} className="w-full">
                  Login as Test User
                </Button>
              ) : (
                <div className="space-y-3">
                  <p className="text-sm text-muted-foreground">
                    Now you can test the user menu in the header! Try clicking on your profile to access:
                  </p>
                  <ul className="text-sm space-y-1 ml-4">
                    <li>• Profile setup with role-based forms</li>
                    <li>• Customization settings</li>
                    <li>• Admin messaging</li>
                    <li>• Account management</li>
                  </ul>
                  <Button onClick={handleLogout} variant="outline" className="w-full bg-transparent">
                    Logout
                  </Button>
                </div>
              )}
            </div>

            <div className="p-4 bg-card border rounded-lg">
              <h4 className="font-medium mb-2">Features Implemented:</h4>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>✅ Enhanced user menu with modern design</li>
                <li>✅ Role-based profile forms (Student, Faculty, Alumni, Staff)</li>
                <li>✅ Comprehensive customization settings</li>
                <li>✅ Secure admin messaging system</li>
                <li>✅ Toast notifications for user feedback</li>
                <li>✅ Confirmation dialogs for destructive actions</li>
                <li>✅ Form validation and error handling</li>
                <li>✅ Responsive design with semantic color tokens</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
