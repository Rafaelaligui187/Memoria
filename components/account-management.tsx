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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import { UnifiedProfileSetupForm } from "@/components/unified-profile-setup-form"
import { Search, Plus, MoreHorizontal, Edit, Trash2, User, Download, CheckCircle, XCircle, Clock, Eye, FileText, Heart, MapPin, Phone, Mail, Calendar, GraduationCap, Briefcase, Award, Users, Share2 } from "lucide-react"

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
  // User ownership
  ownedBy?: string
  // Role-specific fields
  studentId?: string
  grade?: string
  course?: string
  strand?: string
  position?: string
  graduationYear?: string
  employeeId?: string
  // Profile data fields (from the profile object)
  fullName?: string
  nickname?: string
  age?: number
  gender?: string
  birthday?: string
  address?: string
  phone?: string
  profilePicture?: string
  profilePictureUrl?: string
  sayingMotto?: string
  dreamJob?: string
  messageToStudents?: string
  achievements?: string[]
  activities?: string[]
  fatherGuardianName?: string
  motherGuardianName?: string
  yearLevel?: string
  courseProgram?: string
  major?: string
  blockSection?: string
  departmentAssigned?: string
  officeAssigned?: string
  yearsOfService?: number
  currentProfession?: string
  currentCompany?: string
  currentLocation?: string
  socialMediaFacebook?: string
  socialMediaInstagram?: string
  socialMediaTwitter?: string
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
  const [viewDialogOpen, setViewDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [selectedAccount, setSelectedAccount] = useState<Account | null>(null)
  const [profileData, setProfileData] = useState<any>(null)
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

  // View profile data (already available in account object)
  const viewProfileData = (account: Account) => {
    // Check if the account has profile data
    if (!account.fullName && !account.profileStatus) {
      toast({
        title: "No Profile Found",
        description: "This user hasn't submitted a profile for this school year.",
        variant: "destructive",
      })
      return
    }
    
    // The account object already contains all the profile data we need
    // since it's fetched from the admin profiles API
    setProfileData(account)
    setViewDialogOpen(true)
  }

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
                          <DropdownMenuItem
                            onClick={() => {
                              setSelectedAccount(account)
                              viewProfileData(account)
                            }}
                          >
                            <User className="mr-2 h-4 w-4" />
                            View Profile
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

      {/* View Profile Dialog */}
      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className="sm:max-w-[800px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>View Profile</DialogTitle>
            <DialogDescription>View {selectedAccount?.name}'s profile information</DialogDescription>
          </DialogHeader>
          {profileData && (
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage
                    src={profileData.profilePicture || profileData.profilePictureUrl || "/placeholder.svg"}
                  />
                  <AvatarFallback className="text-lg">
                    {(profileData.fullName || selectedAccount?.name)
                      ?.split(" ")
                      .map((n: string) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-lg font-semibold">
                    {profileData.fullName || selectedAccount?.name}
                  </h3>
                  {profileData.nickname && (
                    <p className="text-muted-foreground italic">"{profileData.nickname}"</p>
                  )}
                  <p className="text-muted-foreground">
                    {selectedAccount?.role} • {selectedAccount?.department}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {profileData.email || selectedAccount?.email}
                  </p>
                </div>
              </div>

              <Tabs defaultValue="basic" className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="basic">Basic Info</TabsTrigger>
                  <TabsTrigger value="academic">Academic</TabsTrigger>
                  <TabsTrigger value="personal">Personal</TabsTrigger>
                  <TabsTrigger value="yearbook">Yearbook</TabsTrigger>
                </TabsList>

                <TabsContent value="basic" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Heart className="h-5 w-5 text-pink-600" />
                        Basic Information
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <span className="font-medium">Full Name:</span>
                          <p>{profileData.fullName || "N/A"}</p>
                        </div>
                        {profileData.nickname && (
                          <div>
                            <span className="font-medium">Nickname:</span>
                            <p>{profileData.nickname}</p>
                          </div>
                        )}
                        {profileData.age && (
                          <div>
                            <span className="font-medium">Age:</span>
                            <p>{profileData.age}</p>
                          </div>
                        )}
                        {profileData.gender && (
                          <div>
                            <span className="font-medium">Gender:</span>
                            <p>{profileData.gender}</p>
                          </div>
                        )}
                        {profileData.birthday && (
                          <div>
                            <span className="font-medium">Birthday:</span>
                            <p>{new Date(profileData.birthday).toLocaleDateString()}</p>
                          </div>
                        )}
                        {profileData.phone && (
                          <div>
                            <span className="font-medium">Phone:</span>
                            <p>{profileData.phone}</p>
                          </div>
                        )}
                      </div>
                      {profileData.address && (
                        <div>
                          <span className="font-medium">Address:</span>
                          <p>{profileData.address}</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="academic" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <GraduationCap className="h-5 w-5 text-blue-600" />
                        Academic Information
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {profileData.department && (
                          <div>
                            <span className="font-medium">Department:</span>
                            <p>{profileData.department}</p>
                          </div>
                        )}
                        {profileData.yearLevel && (
                          <div>
                            <span className="font-medium">Year Level:</span>
                            <p>{profileData.yearLevel}</p>
                          </div>
                        )}
                        {profileData.courseProgram && (
                          <div>
                            <span className="font-medium">Course/Program:</span>
                            <p>{profileData.courseProgram}</p>
                          </div>
                        )}
                        {profileData.major && (
                          <div>
                            <span className="font-medium">Major:</span>
                            <p>{profileData.major}</p>
                          </div>
                        )}
                        {profileData.blockSection && (
                          <div>
                            <span className="font-medium">Block/Section:</span>
                            <p>{profileData.blockSection}</p>
                          </div>
                        )}
                        {profileData.graduationYear && (
                          <div>
                            <span className="font-medium">Graduation Year:</span>
                            <p>{profileData.graduationYear}</p>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="personal" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Users className="h-5 w-5 text-green-600" />
                        Personal Information
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {profileData.fatherGuardianName && (
                          <div>
                            <span className="font-medium">Father/Guardian:</span>
                            <p>{profileData.fatherGuardianName}</p>
                          </div>
                        )}
                        {profileData.motherGuardianName && (
                          <div>
                            <span className="font-medium">Mother/Guardian:</span>
                            <p>{profileData.motherGuardianName}</p>
                          </div>
                        )}
                        {profileData.dreamJob && (
                          <div>
                            <span className="font-medium">Dream Job:</span>
                            <p>{profileData.dreamJob}</p>
                          </div>
                        )}
                        {profileData.position && (
                          <div>
                            <span className="font-medium">Position:</span>
                            <p>{profileData.position}</p>
                          </div>
                        )}
                        {profileData.yearsOfService && (
                          <div>
                            <span className="font-medium">Years of Service:</span>
                            <p>{profileData.yearsOfService}</p>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="yearbook" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Award className="h-5 w-5 text-purple-600" />
                        Yearbook Information
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {profileData.sayingMotto && (
                        <div>
                          <span className="font-medium">Saying/Motto:</span>
                          <p className="italic">"{profileData.sayingMotto}"</p>
                        </div>
                      )}
                      {profileData.messageToStudents && (
                        <div>
                          <span className="font-medium">Message to Students:</span>
                          <p>{profileData.messageToStudents}</p>
                        </div>
                      )}
                      {profileData.achievements && profileData.achievements.length > 0 && (
                        <div>
                          <span className="font-medium">Achievements:</span>
                          <ul className="list-disc list-inside mt-1">
                            {profileData.achievements.map((achievement: string, index: number) => (
                              <li key={index}>{achievement}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Account Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="sm:max-w-[900px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Account</DialogTitle>
            <DialogDescription>
              Edit {selectedAccount?.name}'s profile information
            </DialogDescription>
          </DialogHeader>
          {selectedAccount && (
            <UnifiedProfileSetupForm
              schoolYearId={selectedYear}
              userId={selectedAccount.ownedBy || selectedAccount.id}
              isEditing={true}
              isAdminEdit={true}
              onBack={() => setEditDialogOpen(false)}
              onSave={() => {
                setEditDialogOpen(false)
                fetchAccounts() // Refresh the accounts list
                toast({
                  title: "Success",
                  description: "Profile updated successfully.",
                })
              }}
            />
          )}
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
