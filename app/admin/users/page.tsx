"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import {
  BookOpen,
  ChevronDown,
  Download,
  Edit,
  Grid,
  Home,
  ImageIcon,
  LogOut,
  MessageSquare,
  MoreHorizontal,
  Plus,
  Search,
  Settings,
  Trash2,
  User,
  Users,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarTrigger,
  SidebarInset,
} from "@/components/ui/sidebar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useToast } from "@/hooks/use-toast"

// Mock user data
const mockUsers = [
  {
    id: 1,
    name: "John Doe",
    email: "john.doe@example.com",
    role: "Student",
    department: "College",
    course: "BSIT",
    status: "Active",
    lastLogin: "2023-08-15 10:30 AM",
    avatar: "/placeholder.svg?height=100&width=100&text=JD",
  },
  {
    id: 2,
    name: "Maria Santos",
    email: "maria.santos@example.com",
    role: "Student",
    department: "College",
    course: "BSIT",
    status: "Active",
    lastLogin: "2023-08-14 02:15 PM",
    avatar: "/placeholder.svg?height=100&width=100&text=MS",
  },
  {
    id: 3,
    name: "Dr. Elena Rodriguez",
    email: "elena.rodriguez@example.com",
    role: "Faculty",
    department: "College",
    position: "College Dean",
    status: "Active",
    lastLogin: "2023-08-15 09:45 AM",
    avatar: "/placeholder.svg?height=100&width=100&text=ER",
  },
  {
    id: 4,
    name: "Admin User",
    email: "admin@example.com",
    role: "Admin",
    department: "Administration",
    status: "Active",
    lastLogin: "2023-08-15 08:30 AM",
    avatar: "/placeholder.svg?height=100&width=100&text=AU",
  },
  {
    id: 5,
    name: "Emma Garcia",
    email: "emma.garcia@example.com",
    role: "Student",
    department: "Elementary",
    grade: "Grade 5",
    status: "Active",
    lastLogin: "2023-08-13 01:20 PM",
    avatar: "/placeholder.svg?height=100&width=100&text=EG",
  },
  {
    id: 6,
    name: "Noah Santos",
    email: "noah.santos@example.com",
    role: "Student",
    department: "Elementary",
    grade: "Grade 6",
    status: "Inactive",
    lastLogin: "2023-07-25 11:10 AM",
    avatar: "/placeholder.svg?height=100&width=100&text=NS",
  },
  {
    id: 7,
    name: "Sophia Cruz",
    email: "sophia.cruz@example.com",
    role: "Student",
    department: "Senior High",
    strand: "STEM",
    status: "Active",
    lastLogin: "2023-08-14 03:45 PM",
    avatar: "/placeholder.svg?height=100&width=100&text=SC",
  },
  {
    id: 8,
    name: "Ms. Maria Santos",
    email: "m.santos@example.com",
    role: "Faculty",
    department: "Elementary",
    position: "Grade 1 Adviser",
    status: "Active",
    lastLogin: "2023-08-15 07:50 AM",
    avatar: "/placeholder.svg?height=100&width=100&text=MS",
  },
]

export default function AdminUsersPage() {
  const [users, setUsers] = useState(mockUsers)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedRole, setSelectedRole] = useState<string | null>(null)
  const [selectedDepartment, setSelectedDepartment] = useState<string | null>(null)
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [userToDelete, setUserToDelete] = useState<number | null>(null)
  const { toast } = useToast()

  // Filter users based on search and filters
  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      searchQuery === "" ||
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesRole = selectedRole === null || user.role === selectedRole
    const matchesDepartment = selectedDepartment === null || user.department === selectedDepartment
    const matchesStatus = selectedStatus === null || user.status === selectedStatus

    return matchesSearch && matchesRole && matchesDepartment && matchesStatus
  })

  // Extract unique values for filters
  const roles = Array.from(new Set(users.map((user) => user.role)))
  const departments = Array.from(new Set(users.map((user) => user.department)))
  const statuses = Array.from(new Set(users.map((user) => user.status)))

  const handleDeleteUser = (userId: number) => {
    setUserToDelete(userId)
    setIsDeleteDialogOpen(true)
  }

  const confirmDeleteUser = () => {
    if (userToDelete) {
      setUsers(users.filter((user) => user.id !== userToDelete))
      setIsDeleteDialogOpen(false)
      setUserToDelete(null)
      toast({
        title: "User Deleted",
        description: "The user has been successfully deleted.",
      })
    }
  }

  const clearFilters = () => {
    setSearchQuery("")
    setSelectedRole(null)
    setSelectedDepartment(null)
    setSelectedStatus(null)
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen flex">
        {/* Sidebar */}
        <Sidebar>
          <SidebarHeader>
            <div className="flex items-center gap-2 px-4 py-3">
              <BookOpen className="h-6 w-6 text-blue-600" />
              <span className="text-xl font-bold text-blue-600">Memoria</span>
            </div>
          </SidebarHeader>
          <SidebarContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild className="hover:bg-blue-100 hover:text-blue-800 active:bg-blue-100 active:text-blue-800 transition-all duration-200">
                  <Link href="/admin">
                    <Home className="h-5 w-5" />
                    <span>Dashboard</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive className="hover:bg-blue-100 hover:text-blue-800 active:bg-blue-100 active:text-blue-800 transition-all duration-200">
                  <Link href="/admin/users">
                    <Users className="h-5 w-5" />
                    <span>User Management</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild className="hover:bg-blue-100 hover:text-blue-800 active:bg-blue-100 active:text-blue-800 transition-all duration-200">
                  <Link href="/admin/gallery">
                    <ImageIcon className="h-5 w-5" />
                    <span>Gallery Management</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild className="hover:bg-blue-100 hover:text-blue-800 active:bg-blue-100 active:text-blue-800 transition-all duration-200">
                  <Link href="/admin/memories">
                    <MessageSquare className="h-5 w-5" />
                    <span>Memory Wall</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild className="hover:bg-blue-100 hover:text-blue-800 active:bg-blue-100 active:text-blue-800 transition-all duration-200">
                  <Link href="/admin/departments">
                    <Grid className="h-5 w-5" />
                    <span>Departments</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild className="hover:bg-blue-100 hover:text-blue-800 active:bg-blue-100 active:text-blue-800 transition-all duration-200">
                  <Link href="/admin/settings">
                    <Settings className="h-5 w-5" />
                    <span>Settings</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarContent>
          <SidebarFooter>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild className="hover:bg-blue-100 hover:text-blue-800 active:bg-blue-100 active:text-blue-800 transition-all duration-200">
                  <Link href="/dashboard">
                    <ChevronDown className="h-5 w-5 mr-2" />
                    <span>Exit Admin Mode</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarFooter>
        </Sidebar>

        {/* Main Content */}
        <SidebarInset>
          <div className="flex flex-col min-h-screen">
            {/* Header */}
            <header className="sticky top-0 z-50 w-full border-b bg-white">
              <div className="container flex h-16 items-center justify-between">
                <div className="flex items-center gap-4">
                  <SidebarTrigger />
                  <h1 className="text-xl font-bold">User Management</h1>
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <div className="bg-blue-100 rounded-full w-8 h-8 flex items-center justify-center text-blue-600 font-bold">
                      A
                    </div>
                    <span className="text-sm font-medium hidden md:inline">Admin User</span>
                  </div>
                  <Button variant="outline" size="sm" className="border-red-600 text-red-600 hover:bg-red-50">
                    <LogOut className="h-4 w-4 mr-2" />
                    <span className="hidden md:inline">Log Out</span>
                  </Button>
                </div>
              </div>
            </header>

            {/* Main Content */}
            <main className="flex-1 py-10 bg-gray-50">
              <div className="container">
                <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900">Users</h1>
                    <p className="text-gray-600">Manage user accounts and permissions</p>
                  </div>
                  <div className="flex gap-2">
                    <Button className="bg-blue-600 hover:bg-blue-700">
                      <Plus className="h-4 w-4 mr-2" />
                      Add User
                    </Button>
                    <Button variant="outline">
                      <Download className="h-4 w-4 mr-2" />
                      Export
                    </Button>
                  </div>
                </div>

                {/* Filters */}
                <Card className="mb-6">
                  <CardContent className="p-4">
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                      <div className="md:col-span-2">
                        <div className="relative">
                          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                          <Input
                            type="text"
                            placeholder="Search users..."
                            className="pl-10"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                          />
                        </div>
                      </div>
                      <div>
                        <select
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                          value={selectedRole || ""}
                          onChange={(e) => setSelectedRole(e.target.value || null)}
                        >
                          <option value="">All Roles</option>
                          {roles.map((role) => (
                            <option key={role} value={role}>
                              {role}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <select
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                          value={selectedDepartment || ""}
                          onChange={(e) => setSelectedDepartment(e.target.value || null)}
                        >
                          <option value="">All Departments</option>
                          {departments.map((department) => (
                            <option key={department} value={department}>
                              {department}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <select
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                          value={selectedStatus || ""}
                          onChange={(e) => setSelectedStatus(e.target.value || null)}
                        >
                          <option value="">All Status</option>
                          {statuses.map((status) => (
                            <option key={status} value={status}>
                              {status}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                    {(searchQuery || selectedRole || selectedDepartment || selectedStatus) && (
                      <div className="mt-4 flex justify-end">
                        <Button
                          variant="ghost"
                          onClick={clearFilters}
                          className="text-blue-600 hover:text-blue-800 hover:bg-blue-50"
                        >
                          Clear Filters
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Users Table */}
                <Card>
                  <CardHeader className="p-4 border-b">
                    <CardTitle>Users ({filteredUsers.length})</CardTitle>
                  </CardHeader>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50 text-xs uppercase text-gray-500">
                        <tr>
                          <th className="px-4 py-3 text-left">User</th>
                          <th className="px-4 py-3 text-left">Role</th>
                          <th className="px-4 py-3 text-left">Department</th>
                          <th className="px-4 py-3 text-left">Status</th>
                          <th className="px-4 py-3 text-left">Last Login</th>
                          <th className="px-4 py-3 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y">
                        {filteredUsers.map((user) => (
                          <tr key={user.id} className="hover:bg-gray-50">
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-3">
                                <div className="relative w-10 h-10 rounded-full overflow-hidden">
                                  <Image
                                    src={user.avatar || "/placeholder.svg"}
                                    alt={user.name}
                                    fill
                                    className="object-cover"
                                  />
                                </div>
                                <div>
                                  <p className="font-medium">{user.name}</p>
                                  <p className="text-xs text-gray-500">{user.email}</p>
                                </div>
                              </div>
                            </td>
                            <td className="px-4 py-3">
                              <span
                                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                  user.role === "Admin"
                                    ? "bg-purple-100 text-purple-800"
                                    : user.role === "Faculty"
                                      ? "bg-blue-100 text-blue-800"
                                      : "bg-green-100 text-green-800"
                                }`}
                              >
                                {user.role}
                              </span>
                            </td>
                            <td className="px-4 py-3">
                              <p>{user.department}</p>
                              {user.course && <p className="text-xs text-gray-500">{user.course}</p>}
                              {user.grade && <p className="text-xs text-gray-500">{user.grade}</p>}
                              {user.strand && <p className="text-xs text-gray-500">{user.strand}</p>}
                              {user.position && <p className="text-xs text-gray-500">{user.position}</p>}
                            </td>
                            <td className="px-4 py-3">
                              <span
                                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                  user.status === "Active" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
                                }`}
                              >
                                {user.status}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-500">{user.lastLogin}</td>
                            <td className="px-4 py-3 text-right">
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                    <span className="sr-only">Open menu</span>
                                    <MoreHorizontal className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem>
                                    <User className="mr-2 h-4 w-4" />
                                    <span>View Profile</span>
                                  </DropdownMenuItem>
                                  <DropdownMenuItem>
                                    <Edit className="mr-2 h-4 w-4" />
                                    <span>Edit User</span>
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => handleDeleteUser(user.id)}>
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    <span>Delete User</span>
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  {filteredUsers.length === 0 && (
                    <div className="text-center py-8">
                      <p className="text-gray-500">No users found matching your criteria.</p>
                    </div>
                  )}
                </Card>
              </div>
            </main>

            {/* Footer */}
            <footer className="bg-white border-t py-6">
              <div className="container">
                <div className="flex flex-col md:flex-row justify-between items-center">
                  <div className="flex items-center gap-2 mb-4 md:mb-0">
                    <BookOpen className="h-5 w-5 text-blue-600" />
                    <span className="text-sm font-bold text-blue-600">Memoria Admin</span>
                  </div>
                  <p className="text-sm text-gray-600">
                    &copy; {new Date().getFullYear()} Consolatrix College of Toledo City, Inc. All rights reserved.
                  </p>
                </div>
              </div>
            </footer>
          </div>
        </SidebarInset>
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete User</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this user? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDeleteUser}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </SidebarProvider>
  )
}
