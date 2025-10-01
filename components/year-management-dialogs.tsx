"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
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

interface SchoolYear {
  id: string
  label: string
  status: "active" | "archived" | "draft"
  startDate: string
  endDate: string
}

interface YearManagementDialogsProps {
  schoolYears: SchoolYear[]
  onYearsUpdate: (years: SchoolYear[]) => void
  addDialogOpen: boolean
  setAddDialogOpen: (open: boolean) => void
  editDialogOpen: boolean
  setEditDialogOpen: (open: boolean) => void
  deleteDialogOpen: boolean
  setDeleteDialogOpen: (open: boolean) => void
  selectedYearForEdit: SchoolYear | null
  selectedYearForDelete: SchoolYear | null
}

export function YearManagementDialogs({
  schoolYears,
  onYearsUpdate,
  addDialogOpen,
  setAddDialogOpen,
  editDialogOpen,
  setEditDialogOpen,
  deleteDialogOpen,
  setDeleteDialogOpen,
  selectedYearForEdit,
  selectedYearForDelete,
}: YearManagementDialogsProps) {
  const { toast } = useToast()
  const [newYear, setNewYear] = useState({
    startYear: "",
    endYear: "",
    status: "draft" as const,
  })
  const [editYear, setEditYear] = useState({
    startYear: "",
    endYear: "",
    status: "draft" as const,
  })

  // Initialize edit form when dialog opens
  useState(() => {
    if (selectedYearForEdit && editDialogOpen) {
      const [start, end] = selectedYearForEdit.label.split("–")
      setEditYear({
        startYear: start.trim(),
        endYear: end.trim(),
        status: selectedYearForEdit.status,
      })
    }
  })

  const handleAddYear = () => {
    if (!newYear.startYear || !newYear.endYear) {
      toast({
        title: "Error",
        description: "Please fill in both start and end years.",
        variant: "destructive",
      })
      return
    }

    const yearId = `${newYear.startYear}-${newYear.endYear}`
    const yearLabel = `${newYear.startYear}–${newYear.endYear}`

    // Check if year already exists
    if (schoolYears.some((year) => year.id === yearId)) {
      toast({
        title: "Error",
        description: "This school year already exists.",
        variant: "destructive",
      })
      return
    }

    const newSchoolYear: SchoolYear = {
      id: yearId,
      label: yearLabel,
      status: newYear.status,
      startDate: `${newYear.startYear}-08-01`,
      endDate: `${newYear.endYear}-07-31`,
    }

    onYearsUpdate([...schoolYears, newSchoolYear])
    setAddDialogOpen(false)
    setNewYear({ startYear: "", endYear: "", status: "draft" })

    toast({
      title: "Success",
      description: `School year ${yearLabel} has been added.`,
    })
  }

  const handleEditYear = () => {
    if (!selectedYearForEdit || !editYear.startYear || !editYear.endYear) return

    const yearId = `${editYear.startYear}-${editYear.endYear}`
    const yearLabel = `${editYear.startYear}–${editYear.endYear}`

    // Check if the new year ID conflicts with existing years (excluding current)
    if (yearId !== selectedYearForEdit.id && schoolYears.some((year) => year.id === yearId)) {
      toast({
        title: "Error",
        description: "This school year already exists.",
        variant: "destructive",
      })
      return
    }

    const updatedYears = schoolYears.map((year) =>
      year.id === selectedYearForEdit.id
        ? {
            ...year,
            id: yearId,
            label: yearLabel,
            status: editYear.status,
            startDate: `${editYear.startYear}-08-01`,
            endDate: `${editYear.endYear}-07-31`,
          }
        : year,
    )

    onYearsUpdate(updatedYears)
    setEditDialogOpen(false)

    toast({
      title: "Success",
      description: `School year has been updated to ${yearLabel}.`,
    })
  }

  const handleDeleteYear = () => {
    if (!selectedYearForDelete) return

    // Prevent deletion of active year
    if (selectedYearForDelete.status === "active") {
      toast({
        title: "Error",
        description: "Cannot delete the active school year. Please set another year as active first.",
        variant: "destructive",
      })
      return
    }

    const updatedYears = schoolYears.filter((year) => year.id !== selectedYearForDelete.id)
    onYearsUpdate(updatedYears)
    setDeleteDialogOpen(false)

    toast({
      title: "Success",
      description: `School year ${selectedYearForDelete.label} has been deleted.`,
    })
  }

  return (
    <>
      {/* Add Year Dialog */}
      <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add New School Year</DialogTitle>
            <DialogDescription>Create a new school year for the yearbook system.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="startYear">Start Year</Label>
                <Input
                  id="startYear"
                  placeholder="2024"
                  value={newYear.startYear}
                  onChange={(e) => setNewYear({ ...newYear, startYear: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="endYear">End Year</Label>
                <Input
                  id="endYear"
                  placeholder="2025"
                  value={newYear.endYear}
                  onChange={(e) => setNewYear({ ...newYear, endYear: e.target.value })}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={newYear.status}
                onValueChange={(value: "active" | "archived" | "draft") => setNewYear({ ...newYear, status: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="archived">Archived</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddYear}>Add Year</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Year Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit School Year</DialogTitle>
            <DialogDescription>Modify the selected school year details.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="editStartYear">Start Year</Label>
                <Input
                  id="editStartYear"
                  placeholder="2024"
                  value={editYear.startYear}
                  onChange={(e) => setEditYear({ ...editYear, startYear: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="editEndYear">End Year</Label>
                <Input
                  id="editEndYear"
                  placeholder="2025"
                  value={editYear.endYear}
                  onChange={(e) => setEditYear({ ...editYear, endYear: e.target.value })}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="editStatus">Status</Label>
              <Select
                value={editYear.status}
                onValueChange={(value: "active" | "archived" | "draft") => setEditYear({ ...editYear, status: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="archived">Archived</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleEditYear}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Year Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete School Year</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete the school year "{selectedYearForDelete?.label}"? This action cannot be
              undone and will permanently remove all associated data including accounts, profiles, and media.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteYear}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete Year
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
