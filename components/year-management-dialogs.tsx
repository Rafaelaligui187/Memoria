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

  const handleAddYear = async () => {
    if (!newYear.startYear || !newYear.endYear) {
      toast({
        title: "Error",
        description: "Please fill in both start and end years.",
        variant: "destructive",
      })
      return
    }

    const yearLabel = `${newYear.startYear}–${newYear.endYear}`

    try {
      const response = await fetch('/api/admin/years', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          yearLabel,
          startDate: `${newYear.startYear}-08-01`,
          endDate: `${newYear.endYear}-07-31`,
          status: newYear.status,
        }),
      })

      const result = await response.json()

      if (result.success) {
        // Refresh the school years list
        const updatedYears = [...schoolYears, result.data]
        onYearsUpdate(updatedYears)
        setAddDialogOpen(false)
        setNewYear({ startYear: "", endYear: "", status: "draft" })

        // Trigger a global refresh event for user interfaces
        console.log('Dispatching schoolYearsUpdated event with data:', result.data)
        window.dispatchEvent(new CustomEvent('schoolYearsUpdated', { 
          detail: { action: 'added', schoolYear: result.data } 
        }))

        toast({
          title: "Success",
          description: `School year ${yearLabel} has been added.`,
        })
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to add school year.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error('Error adding school year:', error)
      toast({
        title: "Error",
        description: "Failed to add school year. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleEditYear = async () => {
    if (!selectedYearForEdit || !editYear.startYear || !editYear.endYear) return

    const yearLabel = `${editYear.startYear}–${editYear.endYear}`

    try {
      const response = await fetch('/api/admin/years', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: selectedYearForEdit.id,
          yearLabel,
          startDate: `${editYear.startYear}-08-01`,
          endDate: `${editYear.endYear}-07-31`,
          status: editYear.status,
        }),
      })

      const result = await response.json()

      if (result.success) {
        // Update the school years list
        const updatedYears = schoolYears.map((year) =>
          year.id === selectedYearForEdit.id ? result.data : year
        )
        onYearsUpdate(updatedYears)
        setEditDialogOpen(false)

        // Trigger a global refresh event for user interfaces
        window.dispatchEvent(new CustomEvent('schoolYearsUpdated', { 
          detail: { action: 'updated', schoolYear: result.data } 
        }))

        toast({
          title: "Success",
          description: `School year has been updated to ${yearLabel}.`,
        })
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to update school year.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error('Error updating school year:', error)
      toast({
        title: "Error",
        description: "Failed to update school year. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleDeleteYear = async () => {
    if (!selectedYearForDelete) return

    try {
      const response = await fetch(`/api/admin/years?id=${selectedYearForDelete.id}`, {
        method: 'DELETE',
      })

      const result = await response.json()

      if (result.success) {
        // Remove the deleted year from the list
        const updatedYears = schoolYears.filter((year) => year.id !== selectedYearForDelete.id)
        onYearsUpdate(updatedYears)
        setDeleteDialogOpen(false)

        // Trigger a global refresh event for user interfaces
        window.dispatchEvent(new CustomEvent('schoolYearsUpdated', { 
          detail: { action: 'deleted', schoolYear: selectedYearForDelete } 
        }))

        toast({
          title: "Success",
          description: `School year ${selectedYearForDelete.label} has been deleted.`,
        })
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to delete school year.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error('Error deleting school year:', error)
      toast({
        title: "Error",
        description: "Failed to delete school year. Please try again.",
        variant: "destructive",
      })
    }
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
                  placeholder="Start Year"
                  value={newYear.startYear}
                  onChange={(e) => setNewYear({ ...newYear, startYear: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="endYear">End Year</Label>
                <Input
                  id="endYear"
                  placeholder="End Year"
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
                  placeholder="Start Year"
                  value={editYear.startYear}
                  onChange={(e) => setEditYear({ ...editYear, startYear: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="editEndYear">End Year</Label>
                <Input
                  id="editEndYear"
                  placeholder="End Year"
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
