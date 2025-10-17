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
import { History, Search, Download, User, Eye, RefreshCw, Trash2 } from "lucide-react"

interface AuditLogSystemProps {
  selectedYear: string
  selectedYearLabel?: string
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
  schoolYearId?: string
  userAgent?: string
  status: "success" | "failed" | "warning"
}


export function AuditLogsSystem({ selectedYear, selectedYearLabel }: AuditLogSystemProps) {
  const { toast } = useToast()
  const [logs, setLogs] = useState<AuditLog[]>([])
  const [filteredLogs, setFilteredLogs] = useState<AuditLog[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [actionFilter, setActionFilter] = useState("all")
  const [userFilter, setUserFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [dateRange, setDateRange] = useState({ from: "", to: "" })
  const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null)
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null)
  const [deleteAllConfirm, setDeleteAllConfirm] = useState(false)

  const actionTypes = [
    "profile_approved",
    "profile_rejected",
    "profile_created",
    "profile_updated",
    "profile_deleted",
    "manual_profile_created",
    "user_created",
    "user_updated",
    "user_deleted",
    "user_activated",
    "user_deactivated",
    "bulk_profile_approved",
    "bulk_profile_rejected",
    "bulk_user_deleted",
    // Gallery & Albums actions
    "album_created",
    "album_updated",
    "album_deleted",
    "media_uploaded",
    "media_deleted",
    // School Years management actions
    "school_year_created",
    "school_year_updated",
    "school_year_deleted",
    "school_year_activated",
    "school_year_deactivated",
    // Reports & Messages actions
    "report_created",
    "report_updated",
    "report_deleted",
    "report_resolved",
    "message_replied",
    "message_deleted"
  ]

  const uniqueUsers = Array.from(new Set(logs.map((log) => log.userName)))

  // Delete audit log function
  const handleDeleteAuditLog = async (logId: string) => {
    try {
      const response = await fetch(`/api/admin/audit-logs/delete?id=${logId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      const result = await response.json()

      if (result.success) {
        // Remove the deleted log from the local state
        setLogs(logs.filter(log => log.id !== logId))
        setFilteredLogs(filteredLogs.filter(log => log.id !== logId))
        setDeleteConfirmId(null)
        
        toast({
          title: "Success",
          description: "Audit log deleted successfully.",
        })
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to delete audit log",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error('Error deleting audit log:', error)
      toast({
        title: "Error",
        description: "Failed to delete audit log. Please try again.",
        variant: "destructive",
      })
    }
  }

  // Delete all audit logs function
  const handleDeleteAllAuditLogs = async () => {
    try {
      console.log('[Audit Logs] Deleting all audit logs...')
      
      const response = await fetch('/api/admin/audit-logs/delete-all', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      const result = await response.json()

      if (result.success) {
        // Clear all logs from local state
        setLogs([])
        setFilteredLogs([])
        setDeleteAllConfirm(false)
        
        toast({
          title: "Success",
          description: `All ${result.deletedCount} audit logs have been deleted successfully.`,
        })
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to delete all audit logs",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error('Error deleting all audit logs:', error)
      toast({
        title: "Error",
        description: "Failed to delete all audit logs. Please try again.",
        variant: "destructive",
      })
    }
  }

  // Fetch audit logs from API
  useEffect(() => {
    const fetchAuditLogs = async () => {
      try {
        setLoading(true)
        const queryParams = new URLSearchParams({
          limit: '100'
        })
        
        // Only add selectedYear filter if it exists and is not empty
        if (selectedYear && selectedYear.trim() !== '') {
          queryParams.set('selectedYear', selectedYear)
        }

        const response = await fetch(`/api/admin/audit-logs?${queryParams.toString()}`, {
          cache: 'no-store',
          headers: {
            'Cache-Control': 'no-cache',
          },
        })

        if (response.ok) {
          const result = await response.json()
          if (result.success && result.data) {
            console.log("[Audit Logs] Fetched audit logs:", result.data.length)
            setLogs(result.data)
          } else {
            console.log("[Audit Logs] No audit logs found")
            setLogs([])
          }
        } else {
          console.error("[Audit Logs] Failed to fetch audit logs")
          setLogs([])
        }
      } catch (error) {
        console.error("[Audit Logs] Error fetching audit logs:", error)
        setLogs([])
      } finally {
        setLoading(false)
      }
    }

    fetchAuditLogs()
  }, [selectedYear])

  useEffect(() => {
    let filtered = logs

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (log) =>
          log.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
          log.targetName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          log.schoolYearId?.includes(searchTerm),
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

  const refreshLogs = async () => {
    try {
      setLoading(true)
      const queryParams = new URLSearchParams({
        limit: '100'
      })
      
      // Only add selectedYear filter if it exists and is not empty
      if (selectedYear && selectedYear.trim() !== '') {
        queryParams.set('selectedYear', selectedYear)
      }

      const response = await fetch(`/api/admin/audit-logs?${queryParams.toString()}`, {
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache',
        },
      })

      if (response.ok) {
        const result = await response.json()
        if (result.success && result.data) {
          console.log("[Audit Logs] Refreshed audit logs:", result.data.length)
          setLogs(result.data)
          toast({
            title: "Logs Refreshed",
            description: `Updated with ${result.data.length} audit logs.`,
          })
        } else {
          setLogs([])
          toast({
            title: "No Data",
            description: "No audit logs found.",
          })
        }
      } else {
        toast({
          title: "Error",
          description: "Failed to refresh audit logs.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("[Audit Logs] Error refreshing logs:", error)
      toast({
        title: "Error",
        description: "Failed to refresh audit logs.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const exportLogs = () => {
    const csvHeaders = ["Timestamp", "User", "Action", "Target Type", "Target Name", "Status", "School Year", "Details"]

    const csvData = filteredLogs.map((log) => [
      new Date(log.timestamp).toISOString(),
      log.userName,
      log.action,
      log.targetType || "",
      log.targetName || "",
      log.status,
      log.schoolYearId || "",
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
            Audit Logs - {selectedYearLabel || selectedYear}
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
              <Button 
                variant="destructive" 
                onClick={() => setDeleteAllConfirm(true)}
                disabled={logs.length === 0}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete All
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
                  <TableHead>School Year</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8">
                      <div className="flex items-center justify-center gap-2">
                        <RefreshCw className="h-4 w-4 animate-spin" />
                        <span>Loading audit logs...</span>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : filteredLogs.length > 0 ? (
                  filteredLogs.map((log) => (
                    <TableRow key={log.id}>
                      <TableCell className="font-mono text-sm">{new Date(log.timestamp).toLocaleString()}</TableCell>
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
                      <TableCell className="font-mono text-sm">
                        {log.schoolYearId || "—"}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button variant="ghost" size="sm" onClick={() => setSelectedLog(log)}>
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => setDeleteConfirmId(log.id)}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                      No audit logs found matching the current filters.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
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
                <p className="font-mono">{new Date(selectedLog.timestamp).toLocaleString()}</p>
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
                <Label className="text-sm font-medium">School Year</Label>
                <p className="font-mono">{selectedLog.schoolYearId || "—"}</p>
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

      {/* Delete Confirmation Dialog */}
      {deleteConfirmId && (
        <Card className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="w-96">
            <CardHeader>
              <CardTitle className="text-red-600">Delete Audit Log</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>Are you sure you want to delete this audit log? This action cannot be undone.</p>
              <div className="flex justify-end gap-2">
                <Button 
                  variant="outline" 
                  onClick={() => setDeleteConfirmId(null)}
                >
                  Cancel
                </Button>
                <Button 
                  variant="destructive" 
                  onClick={() => handleDeleteAuditLog(deleteConfirmId)}
                >
                  Delete
                </Button>
              </div>
            </CardContent>
          </Card>
        </Card>
      )}

      {/* Delete All Confirmation Dialog */}
      {deleteAllConfirm && (
        <Card className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="w-96">
            <CardHeader>
              <CardTitle className="text-red-600">Delete All Audit Logs</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Are you sure you want to delete ALL audit logs? This will permanently remove {logs.length} audit logs and cannot be undone.
              </p>
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <p className="text-sm text-red-800 font-medium">⚠️ Warning: This action cannot be undone!</p>
              </div>
              <div className="flex justify-end gap-2">
                <Button 
                  variant="outline" 
                  onClick={() => setDeleteAllConfirm(false)}
                >
                  Cancel
                </Button>
                <Button 
                  variant="destructive" 
                  onClick={handleDeleteAllAuditLogs}
                >
                  Delete All ({logs.length})
                </Button>
              </div>
            </CardContent>
          </Card>
        </Card>
      )}
    </div>
  )
}
