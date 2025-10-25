"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
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
import { useToast } from "@/hooks/use-toast"
import { UserImpersonation } from "./user-impersonation"
import {
  Search,
  Plus,
  MoreHorizontal,
  Edit,
  Trash2,
  User,
  Download,
  Users,
  UserCheck,
  UserX,
  RefreshCw,
  Eye,
} from "lucide-react"

interface Account {
  id: string
  name: string
  email: string
  role: "Student" | "Faculty" | "Alumni" | "Staff" | "Utility" | "Advisory"
  department: string
  status: "Active" | "Inactive" | "Pending"
  yearId: string
  createdAt: string
  lastLogin?: string
}

interface EnhancedAccountManagementProps {
  selectedYear: string
}

export function EnhancedAccountManagement({ selectedYear }: EnhancedAccountManagementProps) {
  const { toast } = useToast()
  const [accounts, setAccounts] = useState<Account[]>([])
  const [selectedAccounts, setSelectedAccounts] = useState<string[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedRole, setSelectedRole] = useState<string>("all")
  const [selectedStatus, setSelectedStatus] = useState<string>("all")
  const [bulkActionOpen, setBulkActionOpen] = useState(false)
  const [bulkAction, setBulkAction] = useState<string>("")
  const [impersonationOpen, setImpersonationOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  // Filter accounts
  const filteredAccounts = accounts.filter((account) => {
    const matchesSearch =
      searchQuery === "" ||
      account.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      account.email.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesRole = selectedRole === "all" || account.role === selectedRole
    const matchesStatus = selectedStatus === "all" || account.status === selectedStatus
    return matchesSearch && matchesRole && matchesStatus
  })

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedAccounts(filteredAccounts.map((acc) => acc.id))
    } else {
      setSelectedAccounts([])
    }
  }

  const handleSelectAccount = (accountId: string, checked: boolean) => {
    if (checked) {
      setSelectedAccounts([...selectedAccounts, accountId])
    } else {
      setSelectedAccounts(selectedAccounts.filter((id) => id !== accountId))
    }
  }

  const handleBulkAction = async () => {
    if (!bulkAction || selectedAccounts.length === 0) return

    setIsLoading(true)
    try {
      const response = await fetch(`/api/admin/${selectedYear}/users/bulk`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-admin-user-id": "current-admin-id", // Would get from auth context
        },
        body: JSON.stringify({
          action: bulkAction,
          userIds: selectedAccounts,
          data: bulkAction === "change_role" ? { role: "Student" } : undefined,
        }),
      })

      const result = await response.json()

      if (result.success) {
        toast({
          title: "Bulk Action Complete",
          description: `${result.data.successCount} accounts updated successfully.`,
        })

        // Refresh accounts list
        // In real implementation, would refetch from API
        setSelectedAccounts([])
        setBulkActionOpen(false)
        setBulkAction("")
      } else {
        throw new Error(result.error)
      }
    } catch (error) {
      toast({
        title: "Bulk Action Failed",
        description: error.message,
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const exportAccounts = () => {
    const csvHeaders = ["Name", "Email", "Role", "Department", "Status", "Created", "Last Login"]
    const csvData = filteredAccounts.map((acc) => [
      acc.name,
      acc.email,
      acc.role,
      acc.department,
      acc.status,
      acc.createdAt,
      acc.lastLogin || "Never",
    ])

    const csvContent = [csvHeaders.join(","), ...csvData.map((row) => row.map((cell) => `"${cell}"`).join(","))].join(
      "\n",
    )

    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `accounts_${selectedYear}_${new Date().toISOString().split("T")[0]}.csv`
    a.click()
    window.URL.revokeObjectURL(url)

    toast({
      title: "Export Complete",
      description: "Account data has been exported to CSV.",
    })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Account Management</h2>
          <p className="text-muted-foreground">Manage user accounts for {selectedYear}</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => setImpersonationOpen(true)} variant="outline">
            <Eye className="h-4 w-4 mr-2" />
            Impersonate User
          </Button>
          <Button onClick={exportAccounts} variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Account
          </Button>
        </div>
      </div>

      {/* Filters and Bulk Actions */}
      <Card>
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
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
                <SelectItem value="Advisory">Advisory</SelectItem>
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

          {/* Bulk Actions */}
          {selectedAccounts.length > 0 && (
            <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
              <span className="text-sm font-medium">{selectedAccounts.length} account(s) selected</span>
              <div className="flex gap-2 ml-auto">
                <Button size="sm" variant="outline" onClick={() => setBulkActionOpen(true)}>
                  <Users className="h-4 w-4 mr-2" />
                  Bulk Actions
                </Button>
                <Button size="sm" variant="outline" onClick={() => setSelectedAccounts([])}>
                  Clear Selection
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Accounts Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Accounts ({filteredAccounts.length})</span>
            <Button variant="ghost" size="sm">
              <RefreshCw className="h-4 w-4" />
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted/50">
                <tr className="border-b">
                  <th className="px-4 py-3 text-left">
                    <Checkbox
                      checked={selectedAccounts.length === filteredAccounts.length && filteredAccounts.length > 0}
                      onCheckedChange={handleSelectAll}
                    />
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium">Name</th>
                  <th className="px-4 py-3 text-left text-sm font-medium">Role</th>
                  <th className="px-4 py-3 text-left text-sm font-medium">Department</th>
                  <th className="px-4 py-3 text-left text-sm font-medium">Status</th>
                  <th className="px-4 py-3 text-left text-sm font-medium">Last Login</th>
                  <th className="px-4 py-3 text-right text-sm font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {filteredAccounts.map((account) => (
                  <tr key={account.id} className="hover:bg-muted/50">
                    <td className="px-4 py-3">
                      <Checkbox
                        checked={selectedAccounts.includes(account.id)}
                        onCheckedChange={(checked) => handleSelectAccount(account.id, checked)}
                      />
                    </td>
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
                      <p>{account.department}</p>
                    </td>
                    <td className="px-4 py-3">
                      <Badge
                        variant={
                          account.status === "Active"
                            ? "default"
                            : account.status === "Pending"
                              ? "secondary"
                              : "outline"
                        }
                      >
                        {account.status}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-sm text-muted-foreground">{account.lastLogin || "Never"}</td>
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
                          <DropdownMenuItem>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit Account
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Eye className="mr-2 h-4 w-4" />
                            Impersonate
                          </DropdownMenuItem>
                          <DropdownMenuItem>
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
          </div>
          {filteredAccounts.length === 0 && (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No accounts found matching your criteria.</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Bulk Actions Dialog */}
      <Dialog open={bulkActionOpen} onOpenChange={setBulkActionOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Bulk Actions</DialogTitle>
            <DialogDescription>Perform actions on {selectedAccounts.length} selected account(s).</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Select Action</Label>
              <Select value={bulkAction} onValueChange={setBulkAction}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose an action" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="activate">
                    <div className="flex items-center gap-2">
                      <UserCheck className="h-4 w-4" />
                      Activate Accounts
                    </div>
                  </SelectItem>
                  <SelectItem value="deactivate">
                    <div className="flex items-center gap-2">
                      <UserX className="h-4 w-4" />
                      Deactivate Accounts
                    </div>
                  </SelectItem>
                  <SelectItem value="change_role">
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      Change Role
                    </div>
                  </SelectItem>
                  <SelectItem value="delete">
                    <div className="flex items-center gap-2">
                      <Trash2 className="h-4 w-4" />
                      Delete Accounts
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setBulkActionOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleBulkAction} disabled={!bulkAction || isLoading}>
              {isLoading ? "Processing..." : "Apply Action"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* User Impersonation Dialog */}
      <UserImpersonation open={impersonationOpen} onOpenChange={setImpersonationOpen} />
    </div>
  )
}
