"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import { Upload, CheckCircle, AlertTriangle, Download, Users, GraduationCap, Briefcase } from "lucide-react"

interface BulkImportSystemProps {
  selectedYear: string
}

interface ImportMapping {
  csvColumn: string
  profileField: string
  required: boolean
}

interface ValidationError {
  row: number
  field: string
  message: string
  value: string
}

export function BulkImportSystem({ selectedYear }: BulkImportSystemProps) {
  const { toast } = useToast()
  const [importType, setImportType] = useState<"student" | "faculty" | "alumni">("student")
  const [csvFile, setCsvFile] = useState<File | null>(null)
  const [csvData, setCsvData] = useState<string>("")
  const [csvHeaders, setCsvHeaders] = useState<string[]>([])
  const [mappings, setMappings] = useState<ImportMapping[]>([])
  const [validationErrors, setValidationErrors] = useState<ValidationError[]>([])
  const [importProgress, setImportProgress] = useState(0)
  const [isImporting, setIsImporting] = useState(false)
  const [importResults, setImportResults] = useState<{
    successful: number
    failed: number
    total: number
  } | null>(null)

  const profileFields = {
    student: [
      { key: "schoolId", label: "School ID", required: true },
      { key: "firstName", label: "First Name", required: true },
      { key: "middleName", label: "Middle Name", required: false },
      { key: "lastName", label: "Last Name", required: true },
      { key: "email", label: "Email", required: true },
      { key: "phone", label: "Phone", required: false },
      { key: "department", label: "Department", required: true },
      { key: "year", label: "Year Level", required: true },
      { key: "block", label: "Block", required: true },
      { key: "quote", label: "Quote", required: false },
      { key: "ambition", label: "Ambition", required: false },
    ],
    faculty: [
      { key: "firstName", label: "First Name", required: true },
      { key: "middleName", label: "Middle Name", required: false },
      { key: "lastName", label: "Last Name", required: true },
      { key: "email", label: "Email", required: true },
      { key: "phone", label: "Phone", required: false },
      { key: "position", label: "Position", required: true },
      { key: "department", label: "Department", required: true },
      { key: "office", label: "Office", required: false },
      { key: "yearsOfService", label: "Years of Service", required: false },
      { key: "bio", label: "Bio", required: true },
    ],
    alumni: [
      { key: "schoolId", label: "School ID", required: true },
      { key: "firstName", label: "First Name", required: true },
      { key: "middleName", label: "Middle Name", required: false },
      { key: "lastName", label: "Last Name", required: true },
      { key: "email", label: "Email", required: true },
      { key: "phone", label: "Phone", required: false },
      { key: "department", label: "Department", required: true },
      { key: "graduationYear", label: "Graduation Year", required: true },
      { key: "currentJobTitle", label: "Current Job Title", required: false },
      { key: "currentEmployer", label: "Current Employer", required: false },
    ],
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    if (!file.name.endsWith(".csv")) {
      toast({
        title: "Invalid File Type",
        description: "Please upload a CSV file.",
        variant: "destructive",
      })
      return
    }

    setCsvFile(file)
    const reader = new FileReader()
    reader.onload = (e) => {
      const content = e.target?.result as string
      setCsvData(content)

      // Parse headers
      const lines = content.split("\n")
      const headers = lines[0].split(",").map((h) => h.trim().replace(/"/g, ""))
      setCsvHeaders(headers)

      // Initialize mappings
      const initialMappings = profileFields[importType].map((field) => ({
        csvColumn: "",
        profileField: field.key,
        required: field.required,
      }))
      setMappings(initialMappings)
    }
    reader.readAsText(file)
  }

  const updateMapping = (profileField: string, csvColumn: string) => {
    setMappings((prev) =>
      prev.map((mapping) => (mapping.profileField === profileField ? { ...mapping, csvColumn } : mapping)),
    )
  }

  const validateData = () => {
    if (!csvData) return

    const lines = csvData.split("\n").slice(1) // Skip header
    const errors: ValidationError[] = []

    lines.forEach((line, index) => {
      if (!line.trim()) return

      const values = line.split(",").map((v) => v.trim().replace(/"/g, ""))

      mappings.forEach((mapping) => {
        if (!mapping.csvColumn) return

        const columnIndex = csvHeaders.indexOf(mapping.csvColumn)
        const value = values[columnIndex] || ""

        // Check required fields
        if (mapping.required && !value) {
          errors.push({
            row: index + 2, // +2 because we skip header and arrays are 0-indexed
            field: mapping.profileField,
            message: "Required field is empty",
            value: value,
          })
        }

        // Validate email format
        if (mapping.profileField === "email" && value && !value.includes("@")) {
          errors.push({
            row: index + 2,
            field: mapping.profileField,
            message: "Invalid email format",
            value: value,
          })
        }

        // Validate school ID format (if applicable)
        if (mapping.profileField === "schoolId" && value && value.length < 4) {
          errors.push({
            row: index + 2,
            field: mapping.profileField,
            message: "School ID too short",
            value: value,
          })
        }
      })
    })

    setValidationErrors(errors)

    if (errors.length === 0) {
      toast({
        title: "Validation Successful",
        description: "All data is valid and ready for import.",
      })
    } else {
      toast({
        title: "Validation Errors Found",
        description: `Found ${errors.length} errors that need to be fixed.`,
        variant: "destructive",
      })
    }
  }

  const performImport = async () => {
    if (validationErrors.length > 0) {
      toast({
        title: "Cannot Import",
        description: "Please fix validation errors first.",
        variant: "destructive",
      })
      return
    }

    setIsImporting(true)
    setImportProgress(0)

    try {
      const lines = csvData
        .split("\n")
        .slice(1)
        .filter((line) => line.trim())
      let successful = 0
      let failed = 0

      for (let i = 0; i < lines.length; i++) {
        const values = lines[i].split(",").map((v) => v.trim().replace(/"/g, ""))

        // Create profile object from mappings
        const profileData: any = {}
        mappings.forEach((mapping) => {
          if (mapping.csvColumn) {
            const columnIndex = csvHeaders.indexOf(mapping.csvColumn)
            profileData[mapping.profileField] = values[columnIndex] || ""
          }
        })

        // Add required fields
        profileData.schoolYearId = selectedYear
        profileData.status = "approved" // Auto-approve bulk imports
        profileData.createdBy = "admin_bulk_import"

        try {
          // Simulate API call
          await new Promise((resolve) => setTimeout(resolve, 100))
          successful++
        } catch (error) {
          failed++
        }

        setImportProgress(((i + 1) / lines.length) * 100)
      }

      setImportResults({
        successful,
        failed,
        total: lines.length,
      })

      toast({
        title: "Import Complete",
        description: `Successfully imported ${successful} of ${lines.length} records.`,
      })
    } catch (error) {
      toast({
        title: "Import Failed",
        description: "An error occurred during import.",
        variant: "destructive",
      })
    } finally {
      setIsImporting(false)
    }
  }

  const downloadTemplate = () => {
    const fields = profileFields[importType]
    const headers = fields.map((f) => f.label).join(",")
    const sampleRow = fields
      .map((f) => {
        switch (f.key) {
          case "schoolId":
            return "STUDENT-00001"
          case "firstName":
            return "John"
          case "lastName":
            return "Doe"
          case "email":
            return "john.doe@example.com"
          case "department":
            return "Computer Science"
          case "year":
            return "1st Year"
          case "block":
            return "A"
          case "position":
            return "Professor"
          case "graduationYear":
            return "2024"
          default:
            return ""
        }
      })
      .join(",")

    const csvContent = `${headers}\n${sampleRow}`
    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${importType}_template.csv`
    a.click()
    window.URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Bulk Import System
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Import Type Selection */}
          <div className="space-y-2">
            <Label>Import Type</Label>
            <Select value={importType} onValueChange={(value: any) => setImportType(value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="student">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    Student Profiles
                  </div>
                </SelectItem>
                <SelectItem value="faculty">
                  <div className="flex items-center gap-2">
                    <GraduationCap className="h-4 w-4" />
                    Faculty Profiles
                  </div>
                </SelectItem>
                <SelectItem value="alumni">
                  <div className="flex items-center gap-2">
                    <Briefcase className="h-4 w-4" />
                    Alumni Profiles
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Template Download */}
          <div className="flex items-center gap-4">
            <Button variant="outline" onClick={downloadTemplate}>
              <Download className="h-4 w-4 mr-2" />
              Download Template
            </Button>
            <span className="text-sm text-muted-foreground">Download a CSV template with the correct format</span>
          </div>

          {/* File Upload */}
          <div className="space-y-2">
            <Label htmlFor="csv-file">Upload CSV File</Label>
            <Input id="csv-file" type="file" accept=".csv" onChange={handleFileUpload} />
          </div>

          {/* CSV Preview and Mapping */}
          {csvHeaders.length > 0 && (
            <Tabs defaultValue="mapping" className="w-full">
              <TabsList>
                <TabsTrigger value="mapping">Field Mapping</TabsTrigger>
                <TabsTrigger value="preview">Data Preview</TabsTrigger>
                <TabsTrigger value="validation">Validation</TabsTrigger>
              </TabsList>

              <TabsContent value="mapping" className="space-y-4">
                <div className="grid gap-4">
                  <h3 className="font-medium">Map CSV columns to profile fields:</h3>
                  {mappings.map((mapping) => {
                    const field = profileFields[importType].find((f) => f.key === mapping.profileField)
                    return (
                      <div key={mapping.profileField} className="grid grid-cols-2 gap-4 items-center">
                        <div className="flex items-center gap-2">
                          <Label>{field?.label}</Label>
                          {field?.required && (
                            <Badge variant="destructive" className="text-xs">
                              Required
                            </Badge>
                          )}
                        </div>
                        <Select
                          value={mapping.csvColumn}
                          onValueChange={(value) => updateMapping(mapping.profileField, value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select CSV column" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="">-- Not mapped --</SelectItem>
                            {csvHeaders.map((header) => (
                              <SelectItem key={header} value={header}>
                                {header}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    )
                  })}
                </div>
              </TabsContent>

              <TabsContent value="preview" className="space-y-4">
                <div className="border rounded-lg p-4 bg-muted/50">
                  <h3 className="font-medium mb-2">CSV Data Preview (first 5 rows):</h3>
                  <pre className="text-sm overflow-x-auto">{csvData.split("\n").slice(0, 6).join("\n")}</pre>
                </div>
              </TabsContent>

              <TabsContent value="validation" className="space-y-4">
                <div className="flex gap-2">
                  <Button onClick={validateData} disabled={mappings.every((m) => !m.csvColumn)}>
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Validate Data
                  </Button>
                </div>

                {validationErrors.length > 0 && (
                  <Alert variant="destructive">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription>Found {validationErrors.length} validation errors:</AlertDescription>
                  </Alert>
                )}

                {validationErrors.length > 0 && (
                  <div className="space-y-2 max-h-60 overflow-y-auto">
                    {validationErrors.map((error, index) => (
                      <div key={index} className="text-sm p-2 border border-red-200 rounded bg-red-50">
                        <strong>Row {error.row}:</strong> {error.message} in field "{error.field}"
                        {error.value && <span className="text-muted-foreground"> (value: "{error.value}")</span>}
                      </div>
                    ))}
                  </div>
                )}

                {validationErrors.length === 0 && csvData && (
                  <Alert>
                    <CheckCircle className="h-4 w-4" />
                    <AlertDescription>All data is valid and ready for import!</AlertDescription>
                  </Alert>
                )}
              </TabsContent>
            </Tabs>
          )}

          {/* Import Progress */}
          {isImporting && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Importing profiles...</span>
                <span>{Math.round(importProgress)}%</span>
              </div>
              <Progress value={importProgress} />
            </div>
          )}

          {/* Import Results */}
          {importResults && (
            <Alert>
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>
                Import completed: {importResults.successful} successful, {importResults.failed} failed out of{" "}
                {importResults.total} total records.
              </AlertDescription>
            </Alert>
          )}

          {/* Import Button */}
          <div className="flex justify-end">
            <Button
              onClick={performImport}
              disabled={!csvData || validationErrors.length > 0 || isImporting}
              className="min-w-32"
            >
              {isImporting ? "Importing..." : "Start Import"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
