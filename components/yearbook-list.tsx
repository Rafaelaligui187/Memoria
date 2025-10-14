'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Loader2, Search, Edit, Trash2, Eye, Filter } from 'lucide-react'
import { Department, YearbookEntry } from '@/lib/yearbook-schemas'

interface YearbookListProps {
  department: Department
  schoolYearId: string
  onEdit?: (entry: YearbookEntry) => void
  onDelete?: (entry: YearbookEntry) => void
  onView?: (entry: YearbookEntry) => void
}

interface FilterOptions {
  status: string
  yearLevel: string
  courseProgram: string
  blockSection: string
  search: string
}

export function YearbookList({ 
  department, 
  schoolYearId, 
  onEdit, 
  onDelete, 
  onView 
}: YearbookListProps) {
  const [entries, setEntries] = useState<YearbookEntry[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filters, setFilters] = useState<FilterOptions>({
    status: '',
    yearLevel: '',
    courseProgram: '',
    blockSection: '',
    search: ''
  })

  const fetchEntries = async () => {
    setIsLoading(true)
    setError(null)

    try {
      const params = new URLSearchParams({
        department,
        schoolYearId,
        ...(filters.status && { status: filters.status }),
        ...(filters.yearLevel && { yearLevel: filters.yearLevel }),
        ...(filters.courseProgram && { courseProgram: filters.courseProgram }),
        ...(filters.blockSection && { blockSection: filters.blockSection }),
        ...(filters.search && { search: filters.search })
      })

      const response = await fetch(`/api/yearbook?${params}`)
      const result = await response.json()

      if (!result.success) {
        throw new Error(result.error || 'Failed to fetch entries')
      }

      setEntries(result.data || [])

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An error occurred'
      setError(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchEntries()
  }, [department, schoolYearId, filters])

  const handleFilterChange = (key: keyof FilterOptions, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }))
  }

  const clearFilters = () => {
    setFilters({
      status: '',
      yearLevel: '',
      courseProgram: '',
      blockSection: '',
      search: ''
    })
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <Badge className="bg-green-100 text-green-800">Approved</Badge>
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>
      case 'rejected':
        return <Badge className="bg-red-100 text-red-800">Rejected</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleDateString()
  }

  const handleDelete = async (entry: YearbookEntry) => {
    if (!confirm(`Are you sure you want to delete ${entry.fullName}'s entry?`)) {
      return
    }

    try {
      const response = await fetch(`/api/yearbook/${entry._id}?department=${encodeURIComponent(department)}`, {
        method: 'DELETE'
      })

      const result = await response.json()

      if (!result.success) {
        throw new Error(result.error || 'Failed to delete entry')
      }

      // Refresh the list
      fetchEntries()
      onDelete?.(entry)

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An error occurred'
      setError(errorMessage)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading entries...</span>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filters
          </CardTitle>
          <CardDescription>
            Filter and search yearbook entries
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="search">Search</Label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="search"
                  placeholder="Search by name, email, or course..."
                  value={filters.search}
                  onChange={(e) => handleFilterChange('search', e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="status">Status</Label>
              <Select value={filters.status} onValueChange={(value) => handleFilterChange('status', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="All statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All statuses</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="yearLevel">Year Level</Label>
              <Input
                id="yearLevel"
                placeholder="e.g., 3rd Year, Grade 12"
                value={filters.yearLevel}
                onChange={(e) => handleFilterChange('yearLevel', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="courseProgram">Course/Program</Label>
              <Input
                id="courseProgram"
                placeholder="e.g., BSIT, STEM"
                value={filters.courseProgram}
                onChange={(e) => handleFilterChange('courseProgram', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="blockSection">Block/Section</Label>
              <Input
                id="blockSection"
                placeholder="e.g., Block A, 12-A"
                value={filters.blockSection}
                onChange={(e) => handleFilterChange('blockSection', e.target.value)}
              />
            </div>
            <div className="flex items-end">
              <Button variant="outline" onClick={clearFilters} className="w-full">
                Clear Filters
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Error Alert */}
      {error && (
        <Alert className="border-red-500">
          <AlertDescription className="text-red-700">
            {error}
          </AlertDescription>
        </Alert>
      )}

      {/* Results Summary */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-600">
          Found {entries.length} entries in {department}
        </p>
      </div>

      {/* Entries List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {entries.map((entry) => (
          <Card key={entry._id?.toString()} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg">{entry.fullName}</CardTitle>
                  {entry.nickname && (
                    <CardDescription>"{entry.nickname}"</CardDescription>
                  )}
                </div>
                {getStatusBadge(entry.status)}
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2 text-sm">
                <div>
                  <span className="font-medium">Email:</span> {entry.email}
                </div>
                {entry.yearLevel && (
                  <div>
                    <span className="font-medium">Year Level:</span> {entry.yearLevel}
                  </div>
                )}
                {entry.courseProgram && (
                  <div>
                    <span className="font-medium">Course/Program:</span> {entry.courseProgram}
                  </div>
                )}
                {entry.blockSection && (
                  <div>
                    <span className="font-medium">Block/Section:</span> {entry.blockSection}
                  </div>
                )}
                {entry.dreamJob && (
                  <div>
                    <span className="font-medium">Dream Job:</span> {entry.dreamJob}
                  </div>
                )}
                {entry.officerRole && (
                  <div>
                    <span className="font-medium">Officer Role:</span> {entry.officerRole}
                  </div>
                )}
                <div>
                  <span className="font-medium">Created:</span> {formatDate(entry.createdAt)}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 pt-3">
                {onView && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onView(entry)}
                    className="flex-1"
                  >
                    <Eye className="h-4 w-4 mr-1" />
                    View
                  </Button>
                )}
                {onEdit && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onEdit(entry)}
                    className="flex-1"
                  >
                    <Edit className="h-4 w-4 mr-1" />
                    Edit
                  </Button>
                )}
                {onDelete && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(entry)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {entries.length === 0 && !isLoading && (
        <Card>
          <CardContent className="text-center py-8">
            <p className="text-gray-500">No entries found matching your criteria.</p>
            <Button variant="outline" onClick={clearFilters} className="mt-4">
              Clear Filters
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
