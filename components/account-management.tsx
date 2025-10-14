"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { useToast } from "@/hooks/use-toast"
import { Search, Plus, MoreHorizontal, Edit, Trash2, User, Download, CheckCircle, XCircle, Clock, Eye, FileText } from "lucide-react"

interface Account {
  id: string
  name: string
  email: string
  role: "Student" | "Faculty" | "Alumni" | "Staff" | "Utility"
  department: string
  status: "Active" | "Inactive" | "Pending"
  yearId: string
  schoolYear?: string
  createdAt: string
  updatedAt?: string
  lastLogin?: string
  // Profile submission fields
  profileStatus?: "pending" | "approved" | "rejected"
  profileId?: string
  collection?: string
  collectionDisplayName?: string
  rejectionReason?: string
  reviewedAt?: string
  reviewedBy?: string
  // Role-specific fields
  studentId?: string
  grade?: string
  course?: string
  strand?: string
  position?: string
  graduationYear?: string
  employeeId?: string
}

const mockAccounts: Account[] = [
  {
    id: "1",
    name: "John Doe",
    email: "john.doe@example.com",
    role: "Student",
    department: "College",
    course: "BSIT",
    studentId: "2024-001",
    status: "Active",
    yearId: "", // Will be populated from active school year
    createdAt: "2024-08-15",
    lastLogin: "2024-08-15 10:30 AM",
  },
  {
    id: "2",
    name: "Dr. Maria Santos",
    email: "maria.santos@example.com",
    role: "Faculty",
    department: "College",
    position: "Professor",
    employeeId: "FAC-001",
    status: "Active",
    yearId: "", // Will be populated from active school year
    createdAt: "2024-08-10",
    lastLogin: "2024-08-15 09:45 AM",
  },
  {
    id: "3",
    name: "Jane Smith",
    email: "jane.smith@example.com",
    role: "Alumni",
    department: "College",
    course: "BSIT",
    graduationYear: "2020",
    status: "Active",
    yearId: "", // Will be populated from active school year
    createdAt: "2024-08-12",
  },
]

interface AccountManagementProps {
  selectedYear: string
  selectedYearLabel?: string
}

export function AccountManagement({ selectedYear, selectedYearLabel }: AccountManagementProps) {
  const [accounts, setAccounts] = useState<Account[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedRole, setSelectedRole] = useState<string>("all")
  const [selectedStatus, setSelectedStatus] = useState<string>("all")
  const [addDialogOpen, setAddDialogOpen] = useState(false)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [selectedAccount, setSelectedAccount] = useState<Account | null>(null)
  const { toast } = useToast()

  const [newAccount, setNewAccount] = useState<Partial<Account>>({
    name: "",
    email: "",
    role: "Student",
    department: "",
    status: "Active",
  })

  // Fetch accounts from API
  const fetchAccounts = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/admin/profiles?schoolYearId=${selectedYear}`)
      const result = await response.json()
      
      if (result.success) {
        setAccounts(result.accounts)
      } else {
        toast({
          title: "Error",
          description: result.message || "Failed to fetch accounts",
          variant: "destructive",
        })
        setAccounts([])
      }
    } catch (error) {
      console.error('Error fetching accounts:', error)
      toast({
        title: "Error",
        description: "Failed to fetch accounts. Please try again.",
        variant: "destructive",
      })
      setAccounts([])
    } finally {
      setLoading(false)
    }
  }

  // Fetch data when selectedYear changes
  useEffect(() => {
    if (selectedYear) {
      fetchAccounts()
    }
  }, [selectedYear])

  // Filter accounts - show approved and pending accounts, hide rejected accounts
  const filteredAccounts = accounts.filter((account) => {
    const matchesSearch =
      searchQuery === "" ||
      account.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      account.email.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesRole = selectedRole === "all" || account.role === selectedRole
    const matchesStatus = selectedStatus === "all" || account.status === selectedStatus
    // Show approved and pending accounts, hide rejected accounts
    const isNotRejected = account.status !== "Inactive"
    return matchesSearch && matchesRole && matchesStatus && isNotRejected
  })

  const handleAddAccount = () => {
    if (!newAccount.name || !newAccount.email || !newAccount.role) {
      toast({
        title: "Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      })
      return
    }

    const account: Account = {
      id: Date.now().toString(),
      name: newAccount.name!,
      email: newAccount.email!,
      role: newAccount.role as Account["role"],
      department: newAccount.department || "",
      status: (newAccount.status as Account["status"]) || "Active",
      yearId: selectedYear,
      createdAt: new Date().toISOString().split("T")[0],
      ...newAccount,
    }

    setAccounts([...accounts, account])
    setAddDialogOpen(false)
    setNewAccount({ name: "", email: "", role: "Student", department: "", status: "Active" })

    toast({
      title: "Success",
      description: "Account created successfully.",
    })
  }

  const handleEditAccount = () => {
    if (!selectedAccount) return

    const updatedAccounts = accounts.map((acc) => (acc.id === selectedAccount.id ? selectedAccount : acc))
    setAccounts(updatedAccounts)
    setEditDialogOpen(false)
    setSelectedAccount(null)

    toast({
      title: "Success",
      description: "Account updated successfully.",
    })
  }

  const handleDeleteAccount = async () => {
    if (!selectedAccount) return

    try {
      // Delete from database
      const response = await fetch(`/api/profiles?profileId=${selectedAccount.id}&schoolYearId=${selectedYear}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      const result = await response.json()

      if (result.success) {
        // Remove from local state
        setAccounts(accounts.filter((acc) => acc.id !== selectedAccount.id))
        setDeleteDialogOpen(false)
        setSelectedAccount(null)

        toast({
          title: "Success",
          description: "Account deleted successfully.",
        })
      } else {
        toast({
          title: "Error",
          description: result.message || "Failed to delete account",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error('Error deleting account:', error)
      toast({
        title: "Error",
        description: "Failed to delete account. Please try again.",
        variant: "destructive",
      })
    }
  }

  const getRoleSpecificFields = (role: string) => {
    switch (role) {
      case "Student":
        return (
          <>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="studentId">Student ID</Label>
                <Input
                  id="studentId"
                  value={newAccount.studentId || ""}
                  onChange={(e) => setNewAccount({ ...newAccount, studentId: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="grade">Grade/Year</Label>
                <Input
                  id="grade"
                  value={newAccount.grade || ""}
                  onChange={(e) => setNewAccount({ ...newAccount, grade: e.target.value })}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="course">Course/Strand</Label>
              <Input
                id="course"
                value={newAccount.course || ""}
                onChange={(e) => setNewAccount({ ...newAccount, course: e.target.value })}
              />
            </div>
          </>
        )
      case "Faculty":
        return (
          <>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="employeeId">Employee ID</Label>
                <Input
                  id="employeeId"
                  value={newAccount.employeeId || ""}
                  onChange={(e) => setNewAccount({ ...newAccount, employeeId: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="position">Position</Label>
                <Input
                  id="position"
                  value={newAccount.position || ""}
                  onChange={(e) => setNewAccount({ ...newAccount, position: e.target.value })}
                />
              </div>
            </div>
          </>
        )
      case "Alumni":
        return (
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="graduationYear">Graduation Year</Label>
              <Input
                id="graduationYear"
                value={newAccount.graduationYear || ""}
                onChange={(e) => setNewAccount({ ...newAccount, graduationYear: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="course">Course</Label>
              <Input
                id="course"
                value={newAccount.course || ""}
                onChange={(e) => setNewAccount({ ...newAccount, course: e.target.value })}
              />
            </div>
          </div>
        )
      case "Staff":
      case "Utility":
        return (
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="employeeId">Employee ID</Label>
              <Input
                id="employeeId"
                value={newAccount.employeeId || ""}
                onChange={(e) => setNewAccount({ ...newAccount, employeeId: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="position">Position</Label>
              <Input
                id="position"
                value={newAccount.position || ""}
                onChange={(e) => setNewAccount({ ...newAccount, position: e.target.value })}
              />
            </div>
          </div>
        )
      default:
        return null
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Account Management</h2>
          <p className="text-muted-foreground">Manage user accounts for {selectedYearLabel || selectedYear}</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => setAddDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Account
          </Button>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search accounts..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            <Select value={selectedRole} onValueChange={setSelectedRole}>
              <SelectTrigger>
                <SelectValue placeholder="All Roles" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                <SelectItem value="Student">Student</SelectItem>
                <SelectItem value="Faculty">Faculty</SelectItem>
                <SelectItem value="Alumni">Alumni</SelectItem>
                <SelectItem value="Staff">Staff</SelectItem>
                <SelectItem value="Utility">Utility</SelectItem>
              </SelectContent>
            </Select>
            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger>
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="Active">Active</SelectItem>
                <SelectItem value="Inactive">Inactive</SelectItem>
                <SelectItem value="Pending">Pending</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Accounts Table */}
      <Card>
        <CardHeader>
          <CardTitle>Accounts ({filteredAccounts.length})</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="flex items-center gap-2 text-muted-foreground">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                Loading profiles...
              </div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
              <thead className="bg-muted/50">
                <tr className="border-b">
                  <th className="px-4 py-3 text-left text-sm font-medium">Name</th>
                  <th className="px-4 py-3 text-left text-sm font-medium">Role</th>
                  <th className="px-4 py-3 text-left text-sm font-medium">Department</th>
                  <th className="px-4 py-3 text-left text-sm font-medium">Status</th>
                  <th className="px-4 py-3 text-left text-sm font-medium">School Year</th>
                  <th className="px-4 py-3 text-left text-sm font-medium">Created</th>
                  <th className="px-4 py-3 text-right text-sm font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {filteredAccounts.map((account) => (
                  <tr key={account.id} className="hover:bg-muted/50">
                    <td className="px-4 py-3">
                      <div>
                        <p className="font-medium">{account.name}</p>
                        <p className="text-sm text-muted-foreground">{account.email}</p>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant="secondary">{account.role}</Badge>
                    </td>
                    <td className="px-4 py-3">
                      <div>
                        <p>{account.department}</p>
                        {account.course && <p className="text-sm text-muted-foreground">{account.course}</p>}
                        {account.position && <p className="text-sm text-muted-foreground">{account.position}</p>}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        {/* Status Display - Only show approval decision*/}
                        {account.profileStatus ? (
                          <Badge
                            variant={
                              account.profileStatus === "approved"
                                ? "default"
                                : account.profileStatus === "pending"
                                  ? "secondary"
                                  : "destructive"
                            }
                          >
                            {account.profileStatus === "pending" && <Clock className="h-3 w-3 mr-1" />}
                            {account.profileStatus === "approved" && <CheckCircle className="h-3 w-3 mr-1" />}
                            {account.profileStatus === "rejected" && <XCircle className="h-3 w-3 mr-1" />}
                            {account.profileStatus === "pending" 
                              ? "Pending"
                              : account.profileStatus === "approved"
                                ? "Approved"
                                : "Rejected"
                            }
                          </Badge>
                        ) : (
                          <Badge variant="secondary">
                            No Profile
                          </Badge>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      {/* School Year Display */}
                      {account.schoolYear ? (
                        <div className="text-sm font-medium text-blue-600">
                          {account.schoolYear}
                        </div>
                      ) : (
                        <div className="text-sm text-muted-foreground">
                          N/A
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3 text-sm text-muted-foreground">
                      {new Date(account.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <User className="mr-2 h-4 w-4" />
                            View Profile
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => {
                              toast({
                                title: "Profile Actions",
                                description: "Use the Profile Approval Management section for approvals.",
                              })
                            }}
                          >
                            <FileText className="mr-2 h-4 w-4" />
                            Manage in Profile Approval
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => {
                              setSelectedAccount(account)
                              setEditDialogOpen(true)
                            }}
                          >
                            <Edit className="mr-2 h-4 w-4" />
                            Edit Account
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => {
                              setSelectedAccount(account)
                              setDeleteDialogOpen(true)
                            }}
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete Account
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))}
              </tbody>
              </table>
              {filteredAccounts.length === 0 && (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">No profile submissions found for this school year.</p>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add Account Dialog */}
      <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Add New Account</DialogTitle>
            <DialogDescription>Create a new user account for {selectedYear}</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name *</Label>
                <Input
                  id="name"
                  value={newAccount.name || ""}
                  onChange={(e) => setNewAccount({ ...newAccount, name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={newAccount.email || ""}
                  onChange={(e) => setNewAccount({ ...newAccount, email: e.target.value })}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="role">Role *</Label>
                <Select
                  value={newAccount.role}
                  onValueChange={(value: Account["role"]) => setNewAccount({ ...newAccount, role: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Student">Student</SelectItem>
                    <SelectItem value="Faculty">Faculty</SelectItem>
                    <SelectItem value="Alumni">Alumni</SelectItem>
                    <SelectItem value="Staff">Staff</SelectItem>
                    <SelectItem value="Utility">Utility</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="department">Department</Label>
                <Input
                  id="department"
                  value={newAccount.department || ""}
                  onChange={(e) => setNewAccount({ ...newAccount, department: e.target.value })}
                />
              </div>
            </div>
            {getRoleSpecificFields(newAccount.role || "")}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddAccount}>Create Account</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Account</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete {selectedAccount?.name}'s account? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteAccount}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete Account
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

    </div>
  )
}
