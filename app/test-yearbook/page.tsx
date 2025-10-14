'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Loader2, Plus, Database, Users, CheckCircle } from 'lucide-react'
import { YearbookForm } from '@/components/yearbook-form'
import { YearbookList } from '@/components/yearbook-list'
import { Department } from '@/lib/yearbook-schemas'

interface SchoolYear {
  _id: string
  yearLabel: string
  startDate: Date
  endDate: Date
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

export default function TestYearbookPage() {
  const [schoolYears, setSchoolYears] = useState<SchoolYear[]>([])
  const [selectedSchoolYear, setSelectedSchoolYear] = useState<string>('')
  const [selectedDepartment, setSelectedDepartment] = useState<Department>('College')
  const [activeTab, setActiveTab] = useState<'list' | 'create'>('list')
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [editingEntry, setEditingEntry] = useState<any>(null)

  const departments: Department[] = ['College', 'Senior High', 'Junior High', 'Elementary', 'Alumni', 'Faculty & Staff']

  useEffect(() => {
    fetchSchoolYears()
  }, [])

  const fetchSchoolYears = async () => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/school-years')
      const result = await response.json()

      if (!result.success) {
        throw new Error(result.error || 'Failed to fetch school years')
      }

      setSchoolYears(result.data || [])
      
      // Set the active school year as default
      const activeYear = result.data?.find((year: SchoolYear) => year.isActive)
      if (activeYear) {
        setSelectedSchoolYear(activeYear._id)
      }

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An error occurred'
      setError(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreateSuccess = () => {
    setActiveTab('list')
    setEditingEntry(null)
  }

  const handleEdit = (entry: any) => {
    setEditingEntry(entry)
    setActiveTab('create')
  }

  const handleDelete = (entry: any) => {
    console.log('Deleted entry:', entry)
  }

  const handleView = (entry: any) => {
    console.log('View entry:', entry)
  }

  if (isLoading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center p-8">
          <Loader2 className="h-8 w-8 animate-spin" />
          <span className="ml-2">Loading yearbook system...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Yearbook System Test</h1>
          <p className="text-gray-600">Test the complete yearbook collection system</p>
        </div>
        <div className="flex items-center gap-2">
          <Database className="h-6 w-6 text-blue-500" />
          <span className="text-sm text-gray-500">MongoDB Collections</span>
        </div>
      </div>

      {error && (
        <Alert className="border-red-500">
          <AlertDescription className="text-red-700">
            {error}
          </AlertDescription>
        </Alert>
      )}

      {/* School Year Selection */}
      <Card>
        <CardHeader>
          <CardTitle>School Year Selection</CardTitle>
          <CardDescription>
            Select the school year for yearbook entries
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 items-end">
            <div className="flex-1">
              <label className="block text-sm font-medium mb-2">School Year</label>
              <Select value={selectedSchoolYear} onValueChange={setSelectedSchoolYear}>
                <SelectTrigger>
                  <SelectValue placeholder="Select school year" />
                </SelectTrigger>
                <SelectContent>
                  {schoolYears.map((year) => (
                    <SelectItem key={year._id} value={year._id}>
                      {year.yearLabel} {year.isActive && '(Active)'}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium mb-2">Department</label>
              <Select value={selectedDepartment} onValueChange={(value) => setSelectedDepartment(value as Department)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {departments.map((dept) => (
                    <SelectItem key={dept} value={dept}>
                      {dept}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {!selectedSchoolYear && (
        <Alert>
          <AlertDescription>
            Please select a school year to continue.
          </AlertDescription>
        </Alert>
      )}

      {selectedSchoolYear && (
        <>
          {/* Navigation Tabs */}
          <div className="flex gap-4">
            <Button
              variant={activeTab === 'list' ? 'default' : 'outline'}
              onClick={() => {
                setActiveTab('list')
                setEditingEntry(null)
              }}
              className="flex items-center gap-2"
            >
              <Users className="h-4 w-4" />
              View Entries
            </Button>
            <Button
              variant={activeTab === 'create' ? 'default' : 'outline'}
              onClick={() => {
                setActiveTab('create')
                setEditingEntry(null)
              }}
              className="flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              {editingEntry ? 'Edit Entry' : 'Create Entry'}
            </Button>
          </div>

          {/* Content */}
          {activeTab === 'list' && (
            <YearbookList
              department={selectedDepartment}
              schoolYearId={selectedSchoolYear}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onView={handleView}
            />
          )}

          {activeTab === 'create' && (
            <YearbookForm
              department={selectedDepartment}
              schoolYearId={selectedSchoolYear}
              onSuccess={handleCreateSuccess}
              onError={setError}
              initialData={editingEntry}
              isEditing={!!editingEntry}
            />
          )}
        </>
      )}

      {/* System Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-500" />
            System Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="space-y-2">
              <h4 className="font-semibold">Collections Created</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>✓ SchoolYears</li>
                <li>✓ College_yearbook</li>
                <li>✓ SeniorHigh_yearbook</li>
                <li>✓ JuniorHigh_yearbook</li>
                <li>✓ Elementary_yearbook</li>
                <li>✓ Alumni_yearbook</li>
                <li>✓ FacultyStaff_yearbook</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold">Features</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>✓ Schema Validation</li>
                <li>✓ Department-specific Fields</li>
                <li>✓ School Year Reference</li>
                <li>✓ Status Management</li>
                <li>✓ Search & Filter</li>
                <li>✓ Bulk Operations</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold">API Endpoints</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>✓ GET /api/yearbook</li>
                <li>✓ POST /api/yearbook</li>
                <li>✓ PUT /api/yearbook/[id]</li>
                <li>✓ DELETE /api/yearbook/[id]</li>
                <li>✓ GET /api/yearbook/statistics</li>
                <li>✓ POST /api/yearbook/bulk</li>
                <li>✓ GET /api/school-years</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
