"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { useToast } from "@/hooks/use-toast"
import { BookOpen, Plus, Edit, Trash2, Users, GraduationCap, Building, Eye } from "lucide-react"

interface YearbookManagementProps {
  selectedYear: string
}

interface Department {
  id: string
  name: string
  courses: Course[]
}

interface Course {
  id: string
  name: string
  yearLevels: YearLevel[]
}

interface YearLevel {
  id: string
  level: string
  blocks: Block[]
}

interface Block {
  id: string
  name: string
  students: Student[]
  officers: Officer[]
}

interface Student {
  id: string
  name: string
  profileId?: string
  isOfficer: boolean
  officerPosition?: string
}

interface Officer {
  id: string
  studentId: string
  position: string
  name: string
}

const mockDepartments: Department[] = [
  {
    id: "1",
    name: "Elementary",
    courses: [
      {
        id: "1-1",
        name: "Elementary Education",
        yearLevels: [
          {
            id: "1-1-1",
            level: "Grade 1",
            blocks: [
              {
                id: "1-1-1-a",
                name: "Block A",
                students: [
                  { id: "1", name: "Alice Johnson", isOfficer: true, officerPosition: "Class President" },
                  { id: "2", name: "Bob Smith", isOfficer: false },
                  { id: "3", name: "Carol Davis", isOfficer: true, officerPosition: "Vice President" },
                ],
                officers: [
                  { id: "1", studentId: "1", position: "Class President", name: "Alice Johnson" },
                  { id: "2", studentId: "3", position: "Vice President", name: "Carol Davis" },
                ],
              },
            ],
          },
        ],
      },
    ],
  },
  {
    id: "2",
    name: "College",
    courses: [
      {
        id: "2-1",
        name: "Bachelor of Science in Information Technology",
        yearLevels: [
          {
            id: "2-1-1",
            level: "1st Year",
            blocks: [
              {
                id: "2-1-1-a",
                name: "Block A",
                students: [
                  { id: "4", name: "David Wilson", isOfficer: true, officerPosition: "Mayor" },
                  { id: "5", name: "Emma Brown", isOfficer: false },
                  { id: "6", name: "Frank Miller", isOfficer: true, officerPosition: "Vice Mayor" },
                ],
                officers: [
                  { id: "3", studentId: "4", position: "Mayor", name: "David Wilson" },
                  { id: "4", studentId: "6", position: "Vice Mayor", name: "Frank Miller" },
                ],
              },
            ],
          },
        ],
      },
    ],
  },
]

export function YearbookManagement({ selectedYear }: YearbookManagementProps) {
  const { toast } = useToast()
  const [departments, setDepartments] = useState<Department[]>(mockDepartments)
  const [selectedDepartment, setSelectedDepartment] = useState<string>("")
  const [selectedCourse, setSelectedCourse] = useState<string>("")
  const [selectedYearLevel, setSelectedYearLevel] = useState<string>("")
  const [selectedBlock, setSelectedBlock] = useState<string>("")
  const [searchTerm, setSearchTerm] = useState("")
  const [activeTab, setActiveTab] = useState("structure")

  // Dialog states
  const [addDepartmentOpen, setAddDepartmentOpen] = useState(false)
  const [addCourseOpen, setAddCourseOpen] = useState(false)
  const [addYearLevelOpen, setAddYearLevelOpen] = useState(false)
  const [addBlockOpen, setAddBlockOpen] = useState(false)
  const [assignOfficerOpen, setAssignOfficerOpen] = useState(false)

  // Form states
  const [newDepartmentName, setNewDepartmentName] = useState("")
  const [newCourseName, setNewCourseName] = useState("")
  const [newYearLevelName, setNewYearLevelName] = useState("")
  const [newBlockName, setNewBlockName] = useState("")

  const getCurrentDepartment = () => departments.find((d) => d.id === selectedDepartment)
  const getCurrentCourse = () => getCurrentDepartment()?.courses.find((c) => c.id === selectedCourse)
  const getCurrentYearLevel = () => getCurrentCourse()?.yearLevels.find((y) => y.id === selectedYearLevel)
  const getCurrentBlock = () => getCurrentYearLevel()?.blocks.find((b) => b.id === selectedBlock)

  const addDepartment = () => {
    if (!newDepartmentName.trim()) return

    const newDept: Department = {
      id: Date.now().toString(),
      name: newDepartmentName,
      courses: [],
    }

    setDepartments([...departments, newDept])
    setNewDepartmentName("")
    setAddDepartmentOpen(false)

    toast({
      title: "Department Added",
      description: `${newDepartmentName} has been added successfully.`,
    })
  }

  const addCourse = () => {
    if (!newCourseName.trim() || !selectedDepartment) return

    const newCourse: Course = {
      id: Date.now().toString(),
      name: newCourseName,
      yearLevels: [],
    }

    setDepartments(
      departments.map((dept) =>
        dept.id === selectedDepartment ? { ...dept, courses: [...dept.courses, newCourse] } : dept,
      ),
    )

    setNewCourseName("")
    setAddCourseOpen(false)

    toast({
      title: "Course Added",
      description: `${newCourseName} has been added successfully.`,
    })
  }

  const addYearLevel = () => {
    if (!newYearLevelName.trim() || !selectedCourse) return

    const newYearLevel: YearLevel = {
      id: Date.now().toString(),
      level: newYearLevelName,
      blocks: [],
    }

    setDepartments(
      departments.map((dept) => ({
        ...dept,
        courses: dept.courses.map((course) =>
          course.id === selectedCourse ? { ...course, yearLevels: [...course.yearLevels, newYearLevel] } : course,
        ),
      })),
    )

    setNewYearLevelName("")
    setAddYearLevelOpen(false)

    toast({
      title: "Year Level Added",
      description: `${newYearLevelName} has been added successfully.`,
    })
  }

  const addBlock = () => {
    if (!newBlockName.trim() || !selectedYearLevel) return

    const newBlock: Block = {
      id: Date.now().toString(),
      name: newBlockName,
      students: [],
      officers: [],
    }

    setDepartments(
      departments.map((dept) => ({
        ...dept,
        courses: dept.courses.map((course) => ({
          ...course,
          yearLevels: course.yearLevels.map((yearLevel) =>
            yearLevel.id === selectedYearLevel ? { ...yearLevel, blocks: [...yearLevel.blocks, newBlock] } : yearLevel,
          ),
        })),
      })),
    )

    setNewBlockName("")
    setAddBlockOpen(false)

    toast({
      title: "Block Added",
      description: `${newBlockName} has been added successfully.`,
    })
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            Yearbook Management - {selectedYear}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
            <TabsList>
              <TabsTrigger value="structure">Structure</TabsTrigger>
              <TabsTrigger value="students">Students</TabsTrigger>
              <TabsTrigger value="officers">Officers</TabsTrigger>
              <TabsTrigger value="pages">Pages</TabsTrigger>
            </TabsList>

            <TabsContent value="structure" className="space-y-4">
              {/* Navigation Breadcrumb */}
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Select Department" />
                  </SelectTrigger>
                  <SelectContent>
                    {departments.map((dept) => (
                      <SelectItem key={dept.id} value={dept.id}>
                        {dept.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {selectedDepartment && (
                  <>
                    <span>→</span>
                    <Select value={selectedCourse} onValueChange={setSelectedCourse}>
                      <SelectTrigger className="w-64">
                        <SelectValue placeholder="Select Course" />
                      </SelectTrigger>
                      <SelectContent>
                        {getCurrentDepartment()?.courses.map((course) => (
                          <SelectItem key={course.id} value={course.id}>
                            {course.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </>
                )}

                {selectedCourse && (
                  <>
                    <span>→</span>
                    <Select value={selectedYearLevel} onValueChange={setSelectedYearLevel}>
                      <SelectTrigger className="w-32">
                        <SelectValue placeholder="Year Level" />
                      </SelectTrigger>
                      <SelectContent>
                        {getCurrentCourse()?.yearLevels.map((year) => (
                          <SelectItem key={year.id} value={year.id}>
                            {year.level}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </>
                )}

                {selectedYearLevel && (
                  <>
                    <span>→</span>
                    <Select value={selectedBlock} onValueChange={setSelectedBlock}>
                      <SelectTrigger className="w-32">
                        <SelectValue placeholder="Block" />
                      </SelectTrigger>
                      <SelectContent>
                        {getCurrentYearLevel()?.blocks.map((block) => (
                          <SelectItem key={block.id} value={block.id}>
                            {block.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2">
                <Dialog open={addDepartmentOpen} onOpenChange={setAddDepartmentOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Department
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Add New Department</DialogTitle>
                      <DialogDescription>Create a new department for the yearbook structure.</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="dept-name">Department Name</Label>
                        <Input
                          id="dept-name"
                          value={newDepartmentName}
                          onChange={(e) => setNewDepartmentName(e.target.value)}
                          placeholder="e.g., College of Engineering"
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setAddDepartmentOpen(false)}>
                        Cancel
                      </Button>
                      <Button onClick={addDepartment}>Add Department</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>

                {selectedDepartment && (
                  <Dialog open={addCourseOpen} onOpenChange={setAddCourseOpen}>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm">
                        <Plus className="h-4 w-4 mr-2" />
                        Add Course
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Add New Course</DialogTitle>
                        <DialogDescription>Add a course to {getCurrentDepartment()?.name}.</DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="course-name">Course Name</Label>
                          <Input
                            id="course-name"
                            value={newCourseName}
                            onChange={(e) => setNewCourseName(e.target.value)}
                            placeholder="e.g., Bachelor of Science in Information Technology"
                          />
                        </div>
                      </div>
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setAddCourseOpen(false)}>
                          Cancel
                        </Button>
                        <Button onClick={addCourse}>Add Course</Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                )}

                {selectedCourse && (
                  <Dialog open={addYearLevelOpen} onOpenChange={setAddYearLevelOpen}>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm">
                        <Plus className="h-4 w-4 mr-2" />
                        Add Year Level
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Add New Year Level</DialogTitle>
                        <DialogDescription>Add a year level to {getCurrentCourse()?.name}.</DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="year-name">Year Level</Label>
                          <Input
                            id="year-name"
                            value={newYearLevelName}
                            onChange={(e) => setNewYearLevelName(e.target.value)}
                            placeholder="e.g., 1st Year, Grade 7"
                          />
                        </div>
                      </div>
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setAddYearLevelOpen(false)}>
                          Cancel
                        </Button>
                        <Button onClick={addYearLevel}>Add Year Level</Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                )}

                {selectedYearLevel && (
                  <Dialog open={addBlockOpen} onOpenChange={setAddBlockOpen}>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm">
                        <Plus className="h-4 w-4 mr-2" />
                        Add Block
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Add New Block</DialogTitle>
                        <DialogDescription>Add a block to {getCurrentYearLevel()?.level}.</DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="block-name">Block Name</Label>
                          <Input
                            id="block-name"
                            value={newBlockName}
                            onChange={(e) => setNewBlockName(e.target.value)}
                            placeholder="e.g., Block A, Section 1"
                          />
                        </div>
                      </div>
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setAddBlockOpen(false)}>
                          Cancel
                        </Button>
                        <Button onClick={addBlock}>Add Block</Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                )}
              </div>

              {/* Structure Display */}
              <div className="space-y-4">
                {departments.map((dept) => (
                  <Card key={dept.id}>
                    <CardHeader className="pb-3">
                      <CardTitle className="flex items-center gap-2 text-lg">
                        <Building className="h-5 w-5" />
                        {dept.name}
                        <Badge variant="secondary">{dept.courses.length} courses</Badge>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {dept.courses.map((course) => (
                        <div key={course.id} className="ml-4 mb-3">
                          <div className="flex items-center gap-2 mb-2">
                            <GraduationCap className="h-4 w-4" />
                            <span className="font-medium">{course.name}</span>
                            <Badge variant="outline">{course.yearLevels.length} year levels</Badge>
                          </div>
                          {course.yearLevels.map((year) => (
                            <div key={year.id} className="ml-6 mb-2">
                              <div className="flex items-center gap-2 mb-1">
                                <Users className="h-4 w-4" />
                                <span>{year.level}</span>
                                <Badge variant="outline">{year.blocks.length} blocks</Badge>
                              </div>
                              {year.blocks.map((block) => (
                                <div key={block.id} className="ml-8 text-sm text-muted-foreground">
                                  {block.name} ({block.students.length} students, {block.officers.length} officers)
                                </div>
                              ))}
                            </div>
                          ))}
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="students" className="space-y-4">
              {selectedBlock ? (
                <Card>
                  <CardHeader>
                    <CardTitle>Students in {getCurrentBlock()?.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Name</TableHead>
                          <TableHead>Officer Position</TableHead>
                          <TableHead>Profile Status</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {getCurrentBlock()?.students.map((student) => (
                          <TableRow key={student.id}>
                            <TableCell className="font-medium">{student.name}</TableCell>
                            <TableCell>
                              {student.isOfficer ? (
                                <Badge variant="secondary">{student.officerPosition}</Badge>
                              ) : (
                                <span className="text-muted-foreground">—</span>
                              )}
                            </TableCell>
                            <TableCell>
                              <Badge variant={student.profileId ? "default" : "outline"}>
                                {student.profileId ? "Has Profile" : "No Profile"}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <div className="flex gap-2">
                                <Button variant="ghost" size="sm">
                                  <Eye className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="sm">
                                  <Edit className="h-4 w-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              ) : (
                <div className="text-center py-8 text-muted-foreground">Select a block to view students</div>
              )}
            </TabsContent>

            <TabsContent value="officers" className="space-y-4">
              {selectedBlock ? (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      Officers in {getCurrentBlock()?.name}
                      <Button size="sm">
                        <Plus className="h-4 w-4 mr-2" />
                        Assign Officer
                      </Button>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Position</TableHead>
                          <TableHead>Student Name</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {getCurrentBlock()?.officers.map((officer) => (
                          <TableRow key={officer.id}>
                            <TableCell>
                              <Badge variant="secondary">{officer.position}</Badge>
                            </TableCell>
                            <TableCell className="font-medium">{officer.name}</TableCell>
                            <TableCell>
                              <div className="flex gap-2">
                                <Button variant="ghost" size="sm">
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="sm">
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              ) : (
                <div className="text-center py-8 text-muted-foreground">Select a block to manage officers</div>
              )}
            </TabsContent>

            <TabsContent value="pages" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Yearbook Pages</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8 text-muted-foreground">Yearbook page management coming soon...</div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
