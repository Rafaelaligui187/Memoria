"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useToast } from "@/hooks/use-toast"
import { History, Search, Download, User, Eye, RefreshCw } from "lucide-react"

interface AuditLogSystemProps {
  selectedYear: string
}

interface AuditLog {
  id: string
  timestamp: Date
  userId: string
  userName: string
  action: string
  targetType?: string
  targetId?: string
  targetName?: string
  details?: Record<string, any>
  ipAddress?: string
  userAgent?: string
  status: "success" | "failed" | "warning"
}

const mockAuditLogs: AuditLog[] = [
  {
    id: "1",
    timestamp: new Date("2024-01-15T10:30:00"),
    userId: "admin_1",
    userName: "Admin User",
    action: "profile_approved",
    targetType: "student_profile",
    targetId: "profile_123",
    targetName: "John Doe",
    details: { previousStatus: "pending", newStatus: "approved" },
    ipAddress: "192.168.1.100",
    status: "success",
  },
  {
    id: "2",
    timestamp: new Date("2024-01-15T10:25:00"),
    userId: "admin_1",
    userName: "Admin User",
    action: "album_created",
    targetType: "album",
    targetId: "album_456",
    targetName: "Sports Day 2024",
    details: { privacy: "public", photoCount: 0 },
    ipAddress: "192.168.1.100",
    status: "success",
  },
  {
    id: "3",
    timestamp: new Date("2024-01-15T10:20:00"),
    userId: "admin_2",
    userName: "Secondary Admin",
    action: "user_login",
    details: { loginMethod: "email" },
    ipAddress: "192.168.1.101",
    status: "success",
  },
  {
    id: "4",
    timestamp: new Date("2024-01-15T10:15:00"),
    userId: "admin_1",
    userName: "Admin User",
    action: "profile_rejected",
    targetType: "faculty_profile",
    targetId: "profile_789",
    targetName: "Jane Smith",
    details: {
      reasons: ["Incomplete information", "Poor image quality"],
      customReason: "Please provide a clearer profile photo",
    },
    ipAddress: "192.168.1.100",
    status: "success",
  },
  {
    id: "5",
    timestamp: new Date("2024-01-15T10:10:00"),
    userId: "admin_1",
    userName: "Admin User",
    action: "bulk_import",
    targetType: "student_profiles",
    details: {
      totalRecords: 150,
      successfulImports: 148,
      failedImports: 2,
      importType: "student",
    },
    ipAddress: "192.168.1.100",
    status: "warning",
  },
]

export function AuditLogsSystem({ selectedYear }: AuditLogSystemProps) {
  const { toast } = useToast()
  const [logs, setLogs] = useState<AuditLog[]>(mockAuditLogs)
  const [filteredLogs, setFilteredLogs] = useState<AuditLog[]>(mockAuditLogs)
  const [searchTerm, setSearchTerm] = useState("")
  const [actionFilter, setActionFilter] = useState("all")
  const [userFilter, setUserFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [dateRange, setDateRange] = useState({ from: "", to: "" })
  const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null)

  const actionTypes = [
    "profile_approved",
    "profile_rejected",
    "profile_created",
    "profile_updated",
    "profile_deleted",
    "album_created",
    "album_updated",
    "album_deleted",
    "photo_uploaded",
    "photo_deleted",
    "user_created",
    "user_updated",
    "user_deleted",
    "user_login",
    "user_logout",
    "bulk_import",
    "settings_updated",
    "year_created",
    "year_updated",
    "year_deleted",
  ]

  const uniqueUsers = Array.from(new Set(logs.map((log) => log.userName)))

  useEffect(() => {
    let filtered = logs

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (log) =>
          log.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
          log.targetName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          log.ipAddress?.includes(searchTerm),
      )
    }

    // Action filter
    if (actionFilter !== "all") {
      filtered = filtered.filter((log) => log.action === actionFilter)
    }

    // User filter
    if (userFilter !== "all") {
      filtered = filtered.filter((log) => log.userName === userFilter)
    }

    // Status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter((log) => log.status === statusFilter)
    }

    // Date range filter
    if (dateRange.from) {
      filtered = filtered.filter((log) => log.timestamp >= new Date(dateRange.from))
    }
    if (dateRange.to) {
      filtered = filtered.filter((log) => log.timestamp <= new Date(dateRange.to))
    }

    setFilteredLogs(filtered)
  }, [logs, searchTerm, actionFilter, userFilter, statusFilter, dateRange])

  const refreshLogs = () => {
    // In a real implementation, this would fetch fresh data from the API
    toast({
      title: "Logs Refreshed",
      description: "Audit logs have been updated with the latest data.",
    })
  }

  const exportLogs = () => {
    const csvHeaders = ["Timestamp", "User", "Action", "Target Type", "Target Name", "Status", "IP Address", "Details"]

    const csvData = filteredLogs.map((log) => [
      log.timestamp.toISOString(),
      log.userName,
      log.action,
      log.targetType || "",
      log.targetName || "",
      log.status,
      log.ipAddress || "",
      JSON.stringify(log.details || {}),
    ])

    const csvContent = [csvHeaders.join(","), ...csvData.map((row) => row.map((cell) => `"${cell}"`).join(","))].join(
      "\n",
    )

    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `audit_logs_${selectedYear}_${new Date().toISOString().split("T")[0]}.csv`
    a.click()
    window.URL.revokeObjectURL(url)

    toast({
      title: "Export Complete",
      description: "Audit logs have been exported to CSV.",
    })
  }

  const getActionBadgeColor = (action: string) => {
    if (action.includes("approved") || action.includes("created")) return "default"
    if (action.includes("rejected") || action.includes("deleted")) return "destructive"
    if (action.includes("updated") || action.includes("login")) return "secondary"
    return "outline"
  }

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case "success":
        return "default"
      case "failed":
        return "destructive"
      case "warning":
        return "secondary"
      default:
        return "outline"
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <History className="h-5 w-5" />
            Audit Logs - {selectedYear}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Filters */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label>Search</Label>
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search logs..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Action</Label>
              <Select value={actionFilter} onValueChange={setActionFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Actions</SelectItem>
                  {actionTypes.map((action) => (
                    <SelectItem key={action} value={action}>
                      {action.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>User</Label>
              <Select value={userFilter} onValueChange={setUserFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Users</SelectItem>
                  {uniqueUsers.map((user) => (
                    <SelectItem key={user} value={user}>
                      {user}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Status</Label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="success">Success</SelectItem>
                  <SelectItem value="failed">Failed</SelectItem>
                  <SelectItem value="warning">Warning</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Date Range */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>From Date</Label>
              <Input
                type="date"
                value={dateRange.from}
                onChange={(e) => setDateRange((prev) => ({ ...prev, from: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label>To Date</Label>
              <Input
                type="date"
                value={dateRange.to}
                onChange={(e) => setDateRange((prev) => ({ ...prev, to: e.target.value }))}
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-between items-center">
            <div className="flex gap-2">
              <Button variant="outline" onClick={refreshLogs}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
              <Button variant="outline" onClick={exportLogs}>
                <Download className="h-4 w-4 mr-2" />
                Export CSV
              </Button>
            </div>
            <Badge variant="secondary">
              {filteredLogs.length} of {logs.length} logs
            </Badge>
          </div>

          {/* Logs Table */}
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Timestamp</TableHead>
                  <TableHead>User</TableHead>
                  <TableHead>Action</TableHead>
                  <TableHead>Target</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>IP Address</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredLogs.map((log) => (
                  <TableRow key={log.id}>
                    <TableCell className="font-mono text-sm">{log.timestamp.toLocaleString()}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4" />
                        {log.userName}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={getActionBadgeColor(log.action)}>{log.action.replace(/_/g, " ")}</Badge>
                    </TableCell>
                    <TableCell>
                      {log.targetName ? (
                        <div>
                          <div className="font-medium">{log.targetName}</div>
                          <div className="text-sm text-muted-foreground">{log.targetType}</div>
                        </div>
                      ) : (
                        <span className="text-muted-foreground">—</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge variant={getStatusBadgeColor(log.status)}>{log.status}</Badge>
                    </TableCell>
                    <TableCell className="font-mono text-sm">{log.ipAddress || "—"}</TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm" onClick={() => setSelectedLog(log)}>
                        <Eye className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {filteredLogs.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              No audit logs found matching the current filters.
            </div>
          )}
        </CardContent>
      </Card>

      {/* Log Details Modal */}
      {selectedLog && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Log Details</span>
              <Button variant="ghost" size="sm" onClick={() => setSelectedLog(null)}>
                ×
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-medium">Timestamp</Label>
                <p className="font-mono">{selectedLog.timestamp.toLocaleString()}</p>
              </div>
              <div>
                <Label className="text-sm font-medium">User</Label>
                <p>
                  {selectedLog.userName} ({selectedLog.userId})
                </p>
              </div>
              <div>
                <Label className="text-sm font-medium">Action</Label>
                <Badge variant={getActionBadgeColor(selectedLog.action)}>{selectedLog.action.replace(/_/g, " ")}</Badge>
              </div>
              <div>
                <Label className="text-sm font-medium">Status</Label>
                <Badge variant={getStatusBadgeColor(selectedLog.status)}>{selectedLog.status}</Badge>
              </div>
              {selectedLog.targetName && (
                <>
                  <div>
                    <Label className="text-sm font-medium">Target</Label>
                    <p>{selectedLog.targetName}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Target Type</Label>
                    <p>{selectedLog.targetType}</p>
                  </div>
                </>
              )}
              <div>
                <Label className="text-sm font-medium">IP Address</Label>
                <p className="font-mono">{selectedLog.ipAddress || "—"}</p>
              </div>
            </div>

            {selectedLog.details && Object.keys(selectedLog.details).length > 0 && (
              <div>
                <Label className="text-sm font-medium">Details</Label>
                <pre className="mt-2 p-3 bg-muted rounded-lg text-sm overflow-x-auto">
                  {JSON.stringify(selectedLog.details, null, 2)}
                </pre>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
